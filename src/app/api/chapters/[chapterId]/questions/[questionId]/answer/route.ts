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

    // Check if already answered
    const existingAnswer = await prisma.answer.findUnique({
      where: {
        studentId_questionId: {
          studentId: student.id,
          questionId: question.id
        }
      }
    })

    if (existingAnswer) {
      return NextResponse.json(
        { error: 'Question already answered' },
        { status: 400 }
      )
    }

    // Check if answer is correct
    const isCorrect = selectedAnswer.toUpperCase() === question.correctAnswer.toUpperCase()
    const pointsEarned = isCorrect ? question.points : 0

    // Create answer in transaction with progress update
    const result = await prisma.$transaction(async (tx) => {
      // Create answer
      const answer = await tx.answer.create({
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
        // Update progress
        const newCorrectAnswers = progress.correctAnswers + (isCorrect ? 1 : 0)
        const score = Math.round((newCorrectAnswers / totalQuestions) * 100)
        
        progress = await tx.chapterProgress.update({
          where: { id: progress.id },
          data: {
            correctAnswers: newCorrectAnswers,
            score,
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
