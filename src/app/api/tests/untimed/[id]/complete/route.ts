import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id

    // Get authenticated user
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_001' },
        { status: 401 }
      )
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Student access required', code: 'AUTH_004' },
        { status: 403 }
      )
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found', code: 'STUDENT_001' },
        { status: 404 }
      )
    }

    // Get test attempt with questions
    const testAttempt = await prisma.untimedTestAttempt.findUnique({
      where: { id: testId },
      include: {
        testQuestions: {
          include: {
            question: {
              select: {
                correctAnswer: true,
                explanation: true,
                category: true,
              },
            },
          },
        },
      },
    })

    if (!testAttempt) {
      return NextResponse.json(
        { error: 'Test not found', code: 'TEST_004' },
        { status: 404 }
      )
    }

    // Check ownership
    if (testAttempt.studentId !== student.id) {
      return NextResponse.json(
        { error: 'Access denied to this test', code: 'TEST_005' },
        { status: 403 }
      )
    }

    // Check if already completed
    if (testAttempt.state === 'COMPLETED') {
      return NextResponse.json(
        {
          error: 'Test is already completed',
          code: 'TEST_011',
          completedAt: testAttempt.completedAt,
        },
        { status: 400 }
      )
    }

    // Check if all questions are answered
    const unansweredQuestions = testAttempt.testQuestions.filter(
      (q) => q.selectedAnswer === null
    )

    if (unansweredQuestions.length > 0) {
      return NextResponse.json(
        {
          error: 'All questions must be answered before completing the test',
          code: 'TEST_014',
          unansweredCount: unansweredQuestions.length,
          unansweredQuestions: unansweredQuestions.map((q) => ({
            questionOrder: q.questionOrder,
            testQuestionId: q.id,
          })),
        },
        { status: 400 }
      )
    }

    // Calculate final score
    const totalQuestions = testAttempt.testQuestions.length
    const correctAnswers = testAttempt.testQuestions.filter(
      (q) => q.isCorrect
    ).length
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

    // Complete the test
    const completedTest = await prisma.untimedTestAttempt.update({
      where: { id: testId },
      data: {
        state: 'COMPLETED',
        completedAt: new Date(),
        score: scorePercentage,
        correctAnswers: correctAnswers,
        totalAnswered: totalQuestions,
      },
      include: {
        testQuestions: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                options: true,
                correctAnswer: true,
                explanation: true,
                category: true,
              },
            },
          },
          orderBy: {
            questionOrder: 'asc',
          },
        },
      },
    })

    // Check achievements (non-blocking)
    const { checkAchievements } = await import('@/lib/achievements')
    checkAchievements(student.id, {
      action: 'test_completed',
      data: {
        testId: testId,
        score: scorePercentage
      }
    }).catch(err => {
      console.log('[Achievements] Achievement check failed:', err.message)
    })

    // Calculate category breakdown
    const categoryBreakdown: Record<
      string,
      { total: number; correct: number; percentage: number }
    > = {}

    completedTest.testQuestions.forEach((tq) => {
      const category = tq.question.category || 'UNCATEGORIZED'
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { total: 0, correct: 0, percentage: 0 }
      }
      categoryBreakdown[category].total++
      if (tq.isCorrect) {
        categoryBreakdown[category].correct++
      }
    })

    // Calculate percentages
    Object.keys(categoryBreakdown).forEach((category) => {
      const data = categoryBreakdown[category]
      data.percentage = Math.round((data.correct / data.total) * 100)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Test completed successfully',
        result: {
          id: completedTest.id,
          category: completedTest.category,
          questionCount: completedTest.questionCount,
          state: completedTest.state,
          score: completedTest.score,
          correctAnswers: completedTest.correctAnswers,
          totalAnswered: completedTest.totalAnswered,
          createdAt: completedTest.createdAt,
          startedAt: completedTest.startedAt,
          completedAt: completedTest.completedAt,
          categoryBreakdown: categoryBreakdown,
          questions: completedTest.testQuestions.map((tq) => ({
            id: tq.id,
            questionOrder: tq.questionOrder,
            questionText: tq.question.questionText,
            options: tq.question.options,
            selectedAnswer: tq.selectedAnswer,
            correctAnswer: tq.question.correctAnswer,
            isCorrect: tq.isCorrect,
            explanation: tq.question.explanation,
            answeredAt: tq.answeredAt,
          })),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error completing test:', error)
    return NextResponse.json(
      {
        error: 'Failed to complete test',
        code: 'SERVER_001',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
