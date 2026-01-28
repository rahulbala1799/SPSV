import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * GET /api/student/assigned-tests/[id]/results
 * Get test results after completion
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and student profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    })

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const studentId = user.studentProfile.id

    // Get completed attempt
    const attempt = await prisma.assignedTestAttempt.findFirst({
      where: {
        testId: params.id,
        studentId
      },
      include: {
        test: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Test attempt not found' },
        { status: 404 }
      )
    }

    if (!attempt.completedAt) {
      return NextResponse.json(
        { error: 'Test not completed yet' },
        { status: 400 }
      )
    }

    // Format answers with full details
    const answers = attempt.answers.map(answer => ({
      questionId: answer.question.id,
      questionText: answer.question.questionText,
      options: answer.question.options,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: answer.question.correctAnswer,
      isCorrect: answer.isCorrect,
      explanation: answer.question.explanation,
      answeredAt: answer.answeredAt
    }))

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        testTitle: attempt.test.title,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        percentageScore: Number(attempt.percentageScore),
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        timeSpentSeconds: attempt.timeSpentSeconds
      },
      answers
    })
  } catch (error: any) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch results' },
      { status: 500 }
    )
  }
}
