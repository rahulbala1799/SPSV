import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Valid question counts: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 54
const VALID_QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 54]

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function POST(request: NextRequest) {
  try {
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
    const { category, questionCount } = body

    // Validation
    if (!category || !['INDUSTRY_KNOWLEDGE', 'AREA_KNOWLEDGE'].includes(category)) {
      return NextResponse.json(
        {
          error: 'Invalid category. Must be INDUSTRY_KNOWLEDGE or AREA_KNOWLEDGE',
          code: 'TEST_001',
        },
        { status: 400 }
      )
    }

    if (!questionCount || !VALID_QUESTION_COUNTS.includes(questionCount)) {
      return NextResponse.json(
        {
          error: `Invalid question count. Must be one of: ${VALID_QUESTION_COUNTS.join(', ')}`,
          code: 'TEST_002',
        },
        { status: 400 }
      )
    }

    // Get available questions for this category
    const availableQuestions = await prisma.question.findMany({
      where: {
        category: category,
        chapter: {
          isActive: true,
        },
      },
      select: {
        id: true,
        questionText: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        category: true,
        chapterId: true,
      },
    })

    if (availableQuestions.length < questionCount) {
      return NextResponse.json(
        {
          error: `Not enough questions available. Requested: ${questionCount}, Available: ${availableQuestions.length}`,
          code: 'TEST_003',
          details: {
            requested: questionCount,
            available: availableQuestions.length,
            category,
          },
        },
        { status: 400 }
      )
    }

    // Randomly select and shuffle questions
    const shuffledQuestions = shuffleArray(availableQuestions)
    const selectedQuestions = shuffledQuestions.slice(0, questionCount)

    // Create test attempt with questions
    const testAttempt = await prisma.untimedTestAttempt.create({
      data: {
        studentId: student.id,
        category: category,
        questionCount: questionCount,
        state: 'CREATED',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        testQuestions: {
          create: selectedQuestions.map((question, index) => ({
            questionId: question.id,
            questionOrder: index + 1,
          })),
        },
      },
      include: {
        testQuestions: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                options: true,
                // Don't include correctAnswer or explanation
              },
            },
          },
          orderBy: {
            questionOrder: 'asc',
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        testAttempt: {
          id: testAttempt.id,
          category: testAttempt.category,
          questionCount: testAttempt.questionCount,
          state: testAttempt.state,
          createdAt: testAttempt.createdAt,
          expiresAt: testAttempt.expiresAt,
          questions: testAttempt.testQuestions.map((tq) => ({
            id: tq.id,
            questionOrder: tq.questionOrder,
            questionText: tq.question.questionText,
            options: tq.question.options,
          })),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json(
      {
        error: 'Failed to create test',
        code: 'SERVER_001',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
