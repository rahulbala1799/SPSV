import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
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
        progress = await tx.chapterProgress.create({
          data: {
            studentId: student.id,
            chapterId: params.chapterId,
            totalQuestions,
            correctAnswers: isCorrect ? 1 : 0,
            startedAt: new Date()
          }
        })
      } else {
        // Recalculate progress based on latest answers for each question
        // Get all questions for this chapter
        const allQuestions = await tx.question.findMany({
          where: { chapterId: params.chapterId },
          select: { id: true }
        })
        
        // Get latest answer for each question
        const latestAnswers = await Promise.all(
          allQuestions.map(async (q) => {
            const answers = await tx.answer.findMany({
              where: {
                studentId: student.id,
                questionId: q.id
              },
              orderBy: { answeredAt: 'desc' },
              take: 1
            })
            return answers[0]
          })
        )
        
        // Count correct answers (using latest answer for each question)
        const uniqueCorrectCount = latestAnswers.filter(a => a?.isCorrect).length
        const answeredCount = latestAnswers.filter(a => a !== undefined).length
        
        // Calculate score based on answered questions
        const score = answeredCount > 0
          ? Math.round((uniqueCorrectCount / answeredCount) * 100)
          : 0
        
        progress = await tx.chapterProgress.update({
          where: { id: progress.id },
          data: {
            correctAnswers: uniqueCorrectCount,
            score,
            totalQuestions: totalQuestions,
            lastAccessed: new Date()
          }
        })
      }

      return { answer, progress }
    })

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
