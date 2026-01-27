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

    // Parse request body
    const body = await request.json()
    const { testQuestionId, selectedAnswer, idempotencyKey } = body

    // Validate idempotency key (UUID v4 format)
    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return NextResponse.json(
        {
          error: 'Idempotency key is required and must be a valid UUID v4',
          code: 'TEST_006',
        },
        { status: 400 }
      )
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(idempotencyKey)) {
      return NextResponse.json(
        {
          error: 'Invalid UUID v4 format for idempotency key',
          code: 'TEST_007',
        },
        { status: 400 }
      )
    }

    // Check for existing submission with same idempotency key
    const existingSubmission = await prisma.testQuestion.findFirst({
      where: {
        idempotencyKey: idempotencyKey,
      },
      include: {
        testAttempt: true,
        question: {
          select: {
            correctAnswer: true,
          },
        },
      },
    })

    if (existingSubmission) {
      // Return the existing submission (idempotent response)
      return NextResponse.json(
        {
          success: true,
          message: 'Answer already submitted (idempotent)',
          answer: {
            testQuestionId: existingSubmission.id,
            selectedAnswer: existingSubmission.selectedAnswer,
            isCorrect: existingSubmission.isCorrect,
            answeredAt: existingSubmission.answeredAt,
          },
          testState: existingSubmission.testAttempt.state,
        },
        { status: 200 }
      )
    }

    // Get test question
    const testQuestion = await prisma.testQuestion.findUnique({
      where: { id: testQuestionId },
      include: {
        testAttempt: true,
        question: {
          select: {
            correctAnswer: true,
            options: true,
          },
        },
      },
    })

    if (!testQuestion) {
      return NextResponse.json(
        { error: 'Test question not found', code: 'TEST_008' },
        { status: 404 }
      )
    }

    // Check ownership
    if (testQuestion.testAttempt.studentId !== student.id) {
      return NextResponse.json(
        { error: 'Access denied to this test', code: 'TEST_005' },
        { status: 403 }
      )
    }

    // Check if test is in valid state for answering
    if (testQuestion.testAttempt.state === 'COMPLETED') {
      return NextResponse.json(
        {
          error: 'Cannot modify answers on a completed test',
          code: 'TEST_009',
        },
        { status: 400 }
      )
    }

    // Check if CREATED test has expired
    if (
      testQuestion.testAttempt.state === 'CREATED' &&
      testQuestion.testAttempt.expiresAt &&
      testQuestion.testAttempt.expiresAt < new Date()
    ) {
      return NextResponse.json(
        {
          error: 'Test has expired',
          code: 'TEST_013',
        },
        { status: 410 }
      )
    }

    // Validate selected answer
    const validOptions = ['A', 'B', 'C', 'D']
    if (!selectedAnswer || !validOptions.includes(selectedAnswer)) {
      return NextResponse.json(
        {
          error: 'Selected answer must be one of: A, B, C, D',
          code: 'TEST_010',
        },
        { status: 400 }
      )
    }

    // Check if this is a modification (answer already exists)
    const isModification = testQuestion.selectedAnswer !== null

    // Calculate correctness
    const isCorrect = selectedAnswer === testQuestion.question.correctAnswer

    // Update answer with transaction
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()

      // Update test question
      const updatedTestQuestion = await tx.testQuestion.update({
        where: { id: testQuestionId },
        data: {
          selectedAnswer: selectedAnswer,
          isCorrect: isCorrect,
          answeredAt: now,
          idempotencyKey: idempotencyKey,
        },
      })

      // Update test attempt state and counters
      const testAttempt = await tx.untimedTestAttempt.findUnique({
        where: { id: testQuestion.testAttempt.id },
        include: {
          testQuestions: true,
        },
      })

      if (!testAttempt) {
        throw new Error('Test attempt not found')
      }

      // Calculate new totals
      const answeredQuestions = testAttempt.testQuestions.filter(
        (q) => q.selectedAnswer !== null
      )
      const totalAnswered = answeredQuestions.length
      const correctAnswers = answeredQuestions.filter((q) => q.isCorrect).length

      // Determine new state
      let newState = testAttempt.state
      if (testAttempt.state === 'CREATED') {
        newState = 'IN_PROGRESS'
      }

      // Update test attempt
      await tx.untimedTestAttempt.update({
        where: { id: testQuestion.testAttempt.id },
        data: {
          state: newState,
          startedAt: testAttempt.startedAt || now,
          lastQuestionAt: now,
          totalAnswered: totalAnswered,
          correctAnswers: correctAnswers,
        },
      })

      return {
        updatedTestQuestion,
        newState,
        totalAnswered,
        correctAnswers,
        isModification,
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: result.isModification
          ? 'Answer updated successfully'
          : 'Answer submitted successfully',
        answer: {
          testQuestionId: result.updatedTestQuestion.id,
          selectedAnswer: result.updatedTestQuestion.selectedAnswer,
          isCorrect: result.updatedTestQuestion.isCorrect,
          answeredAt: result.updatedTestQuestion.answeredAt,
        },
        testState: result.newState,
        progress: {
          totalAnswered: result.totalAnswered,
          correctAnswers: result.correctAnswers,
          questionCount: testQuestion.testAttempt.questionCount,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      {
        error: 'Failed to submit answer',
        code: 'SERVER_001',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
