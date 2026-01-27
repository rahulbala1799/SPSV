import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id

    // Get authenticated user
    const meResponse = await fetch(
      new URL('/api/auth/me', request.url).toString(),
      {
        headers: { cookie: request.headers.get('cookie') || '' },
      }
    )

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_001' },
        { status: 401 }
      )
    }

    const { user } = await meResponse.json()

    if (!user || user.role !== 'STUDENT') {
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

    // Get test attempt
    const testAttempt = await prisma.untimedTestAttempt.findUnique({
      where: { id: testId },
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
              },
            },
          },
          orderBy: {
            questionOrder: 'asc',
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

    // Check if CREATED test has expired
    if (
      testAttempt.state === 'CREATED' &&
      testAttempt.expiresAt &&
      testAttempt.expiresAt < new Date()
    ) {
      return NextResponse.json(
        {
          error: 'Test has expired. Tests in CREATED state must be started within 24 hours.',
          code: 'TEST_013',
          testId: testAttempt.id,
        },
        { status: 410 }
      )
    }

    // Format response based on test state
    const isCompleted = testAttempt.state === 'COMPLETED'

    return NextResponse.json({
      success: true,
      testAttempt: {
        id: testAttempt.id,
        category: testAttempt.category,
        questionCount: testAttempt.questionCount,
        state: testAttempt.state,
        score: testAttempt.score,
        correctAnswers: testAttempt.correctAnswers,
        totalAnswered: testAttempt.totalAnswered,
        createdAt: testAttempt.createdAt,
        startedAt: testAttempt.startedAt,
        completedAt: testAttempt.completedAt,
        lastQuestionAt: testAttempt.lastQuestionAt,
        expiresAt: testAttempt.expiresAt,
        questions: testAttempt.testQuestions.map((tq) => ({
          id: tq.id,
          questionOrder: tq.questionOrder,
          questionText: tq.question.questionText,
          options: tq.question.options,
          selectedAnswer: tq.selectedAnswer,
          isCorrect: tq.isCorrect,
          answeredAt: tq.answeredAt,
          // Only show correct answer and explanation if test is completed
          ...(isCompleted && {
            correctAnswer: tq.question.correctAnswer,
            explanation: tq.question.explanation,
          }),
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch test',
        code: 'SERVER_001',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
