import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { trackQuestionAttempt, calculateChapterTimeFromAnswers, TIME_PER_QUESTION_SECONDS } from '@/lib/analytics'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const answerSchema = z.object({
  selectedAnswer: z.string().length(1, 'Answer must be a single letter (A, B, C, or D)')
})

// POST submit answer to a question
export async function POST(
  request: NextRequest,
  { params }: { params: { chapterId: string; questionId: string } }
) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can submit answers' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { selectedAnswer } = answerSchema.parse(body)

    // Get student
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Get question
    const question = await prisma.question.findUnique({
      where: { id: params.questionId }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    if (question.chapterId !== params.chapterId) {
      return NextResponse.json(
        { error: 'Question does not belong to this chapter' },
        { status: 400 }
      )
    }

    // Check if answer is correct
    const isCorrect = selectedAnswer.toUpperCase() === question.correctAnswer.toUpperCase()
    const pointsEarned = isCorrect ? question.points : 0

    // Check if already answered (allow re-answering for practice)
    const existingAnswer = await prisma.answer.findUnique({
      where: {
        studentId_questionId: {
          studentId: student.id,
          questionId: question.id
        }
      }
    })

    // Create or update answer in transaction with progress update
    const result = await prisma.$transaction(async (tx) => {
      // Create or update answer (allow re-answering for practice)
      const answer = existingAnswer
        ? await tx.answer.update({
            where: {
              studentId_questionId: {
                studentId: student.id,
                questionId: question.id
              }
            },
            data: {
              selectedAnswer: selectedAnswer.toUpperCase(),
              isCorrect,
              pointsEarned,
              answeredAt: new Date()
            }
          })
        : await tx.answer.create({
            data: {
              studentId: student.id,
              questionId: question.id,
              selectedAnswer: selectedAnswer.toUpperCase(),
              isCorrect,
              pointsEarned
            }
          })

      // Get or create chapter progress
      let progress = await tx.chapterProgress.findUnique({
        where: {
          studentId_chapterId: {
            studentId: student.id,
            chapterId: params.chapterId
          }
        }
      })

      const totalQuestions = await tx.question.count({
        where: { chapterId: params.chapterId }
      })

      if (!progress) {
        // First answer for this chapter
        const score = isCorrect ? 100 : 0
        progress = await tx.chapterProgress.create({
          data: {
            studentId: student.id,
            chapterId: params.chapterId,
            totalQuestions: 1, // First question answered
            correctAnswers: isCorrect ? 1 : 0,
            score,
            startedAt: new Date()
          }
        })
      } else {
        // Recalculate progress based on ALL answers for this chapter
        // Get all unique questions that have been answered
        const allAnswersForChapter = await tx.answer.findMany({
          where: {
            studentId: student.id,
            question: {
              chapterId: params.chapterId
            }
          },
          include: {
            question: true
          },
          orderBy: {
            answeredAt: 'desc'
          }
        })
        
        // Group by question and get latest answer for each
        const latestAnswersByQuestion = new Map()
        allAnswersForChapter.forEach(answer => {
          if (!latestAnswersByQuestion.has(answer.questionId)) {
            latestAnswersByQuestion.set(answer.questionId, answer)
          }
        })
        
        // Count unique questions answered and correct answers
        const uniqueQuestionsAnswered = latestAnswersByQuestion.size
        const correctAnswersCount = Array.from(latestAnswersByQuestion.values())
          .filter(a => a.isCorrect).length
        
        // Calculate score: (correct answers / unique questions answered) * 100
        const score = uniqueQuestionsAnswered > 0
          ? Math.round((correctAnswersCount / uniqueQuestionsAnswered) * 100)
          : 0
        
        // Check if ALL questions in chapter have been attempted
        const isCompleted = uniqueQuestionsAnswered >= totalQuestions
        
        progress = await tx.chapterProgress.update({
          where: { id: progress.id },
          data: {
            correctAnswers: correctAnswersCount,
            totalQuestions: uniqueQuestionsAnswered, // Total unique questions answered so far
            score,
            isCompleted,
            completedAt: isCompleted && !progress.isCompleted ? new Date() : progress.completedAt,
            lastAccessed: new Date()
          }
        })
      }

      return { answer, progress }
    })

    // Track question attempt with calculated time (40 seconds per question)
    // Student is already fetched above, so we can use it directly
    if (student) {
      // Track the question attempt
      await trackQuestionAttempt(
        student.id,
        question.id,
        selectedAnswer.toUpperCase(),
        isCorrect,
        TIME_PER_QUESTION_SECONDS, // 40 seconds per question
        params.chapterId,
        'chapter'
      ).catch(err => {
        // Don't fail the request if tracking fails
        console.log('[Analytics] Question tracking failed:', err.message)
      })

      // Update chapter time based on all questions answered
      await calculateChapterTimeFromAnswers(student.id, params.chapterId).catch(err => {
        console.log('[Analytics] Time calculation failed:', err.message)
      })

      // Check achievements (non-blocking)
      const { checkAchievements } = await import('@/lib/achievements')
      checkAchievements(student.id, {
        action: 'question_answered',
        data: {
          questionId: question.id,
          chapterId: params.chapterId,
          isCorrect
        }
      }).catch(err => {
        console.log('[Achievements] Achievement check failed:', err.message)
      })
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      pointsEarned,
      chapterProgress: {
        correctAnswers: result.progress.correctAnswers,
        totalQuestions: result.progress.totalQuestions,
        score: result.progress.score
      }
    }, { status: 200 })
  } catch (error: any) {
    console.error('Submit answer error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}
