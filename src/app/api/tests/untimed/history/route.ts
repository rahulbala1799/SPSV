import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const state = searchParams.get('state') // Filter by state
    const category = searchParams.get('category') // Filter by category
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      studentId: student.id,
    }

    if (state && ['CREATED', 'IN_PROGRESS', 'COMPLETED'].includes(state)) {
      where.state = state
    }

    if (
      category &&
      ['INDUSTRY_KNOWLEDGE', 'AREA_KNOWLEDGE'].includes(category)
    ) {
      where.category = category
    }

    // Get test attempts
    const [testAttempts, totalCount] = await Promise.all([
      prisma.untimedTestAttempt.findMany({
        where: where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
        include: {
          testQuestions: {
            select: {
              id: true,
              selectedAnswer: true,
              isCorrect: true,
            },
          },
        },
      }),
      prisma.untimedTestAttempt.count({
        where: where,
      }),
    ])

    // Get overall statistics
    const overallStats = await prisma.untimedTestAttempt.aggregate({
      where: {
        studentId: student.id,
        state: 'COMPLETED',
      },
      _avg: {
        score: true,
      },
      _count: {
        id: true,
      },
    })

    // Category-specific statistics
    const categoryStats = await prisma.untimedTestAttempt.groupBy({
      by: ['category'],
      where: {
        studentId: student.id,
        state: 'COMPLETED',
      },
      _avg: {
        score: true,
      },
      _count: {
        id: true,
      },
    })

    return NextResponse.json({
      success: true,
      pagination: {
        total: totalCount,
        limit: limit,
        offset: offset,
        hasMore: offset + limit < totalCount,
      },
      statistics: {
        overall: {
          completedTests: overallStats._count.id,
          averageScore: overallStats._avg.score
            ? Math.round(overallStats._avg.score)
            : null,
        },
        byCategory: categoryStats.reduce(
          (acc, stat) => {
            acc[stat.category] = {
              completedTests: stat._count.id,
              averageScore: stat._avg.score
                ? Math.round(stat._avg.score)
                : null,
            }
            return acc
          },
          {} as Record<
            string,
            { completedTests: number; averageScore: number | null }
          >
        ),
      },
      tests: testAttempts.map((test) => ({
        id: test.id,
        category: test.category,
        questionCount: test.questionCount,
        state: test.state,
        score: test.score,
        correctAnswers: test.correctAnswers,
        totalAnswered: test.totalAnswered,
        createdAt: test.createdAt,
        startedAt: test.startedAt,
        completedAt: test.completedAt,
        lastQuestionAt: test.lastQuestionAt,
        expiresAt: test.expiresAt,
        progress: {
          answered: test.testQuestions.filter((q) => q.selectedAnswer !== null)
            .length,
          total: test.testQuestions.length,
          percentage: Math.round(
            (test.testQuestions.filter((q) => q.selectedAnswer !== null)
              .length /
              test.testQuestions.length) *
              100
          ),
        },
      })),
    })
  } catch (error) {
    console.error('Error fetching test history:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch test history',
        code: 'SERVER_001',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
