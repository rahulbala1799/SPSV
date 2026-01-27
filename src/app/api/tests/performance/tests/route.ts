import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const categoryFilter = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      studentId: student.id,
      state: 'COMPLETED',
    }

    if (categoryFilter && categoryFilter !== 'all') {
      where.category = categoryFilter
    }

    // Get tests with questions
    const [tests, totalCount] = await Promise.all([
      prisma.untimedTestAttempt.findMany({
        where,
        include: {
          testQuestions: {
            include: {
              question: {
                select: {
                  difficulty: true,
                  category: true,
                },
              },
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: (() => {
          switch (sortBy) {
            case 'score':
              return { score: sortOrder === 'asc' ? 'asc' : 'desc' }
            case 'questions':
              return { questionCount: sortOrder === 'asc' ? 'asc' : 'desc' }
            case 'date':
            default:
              return { completedAt: sortOrder === 'asc' ? 'asc' : 'desc' }
          }
        })(),
      }),
      prisma.untimedTestAttempt.count({ where }),
    ])

    // Get all completed tests for comparison calculations
    const allCompletedTests = await prisma.untimedTestAttempt.findMany({
      where: {
        studentId: student.id,
        state: 'COMPLETED',
        score: { not: null },
      },
      select: {
        id: true,
        score: true,
        completedAt: true,
      },
      orderBy: { completedAt: 'asc' },
    })

    const averageScore = allCompletedTests.length > 0
      ? Math.round(
          allCompletedTests.reduce((sum, t) => sum + (t.score || 0), 0) /
            allCompletedTests.length
        )
      : null

    // Format test data with analytics
    const formattedTests = tests.map((test, index) => {
      // Calculate duration
      const duration =
        test.startedAt && test.completedAt
          ? Math.round(
              (new Date(test.completedAt).getTime() -
                new Date(test.startedAt).getTime()) /
                60000
            )
          : null

      // Category breakdown
      const categoryBreakdown: Record<string, any> = {}
      test.testQuestions.forEach(tq => {
        const cat = tq.question.category || 'UNCATEGORIZED'
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { total: 0, correct: 0, percentage: 0 }
        }
        categoryBreakdown[cat].total++
        if (tq.isCorrect) {
          categoryBreakdown[cat].correct++
        }
      })

      Object.keys(categoryBreakdown).forEach(cat => {
        const data = categoryBreakdown[cat]
        data.percentage = Math.round((data.correct / data.total) * 100)
      })

      // Difficulty breakdown
      const difficultyBreakdown = {
        easy: { total: 0, correct: 0 },
        medium: { total: 0, correct: 0 },
        hard: { total: 0, correct: 0 },
      }

      test.testQuestions.forEach(tq => {
        const diff = tq.question.difficulty || 'medium'
        if (difficultyBreakdown[diff as keyof typeof difficultyBreakdown]) {
          difficultyBreakdown[diff as keyof typeof difficultyBreakdown].total++
          if (tq.isCorrect) {
            difficultyBreakdown[diff as keyof typeof difficultyBreakdown].correct++
          }
        }
      })

      // Improvement metrics
      const testIndex = allCompletedTests.findIndex(t => t.id === test.id)
      const previousTest =
        testIndex > 0 ? allCompletedTests[testIndex - 1] : null
      const vsPrevious =
        previousTest && test.score !== null
          ? test.score - (previousTest.score || 0)
          : null

      const vsAverage =
        test.score !== null && averageScore !== null
          ? test.score - averageScore
          : null

      // Determine trend
      let trend: 'improving' | 'declining' | 'stable' | null = null
      if (vsPrevious !== null) {
        if (vsPrevious > 5) trend = 'improving'
        else if (vsPrevious < -5) trend = 'declining'
        else trend = 'stable'
      }

      return {
        id: test.id,
        category: test.category,
        questionCount: test.questionCount,
        score: test.score,
        correctAnswers: test.correctAnswers,
        totalAnswered: test.totalAnswered,
        createdAt: test.createdAt.toISOString(),
        startedAt: test.startedAt?.toISOString() || null,
        completedAt: test.completedAt?.toISOString() || null,
        duration,
        categoryBreakdown,
        difficultyBreakdown,
        improvement: {
          vsPrevious,
          vsAverage,
          trend,
        },
      }
    })

    return NextResponse.json({
      success: true,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      tests: formattedTests,
    })
  } catch (error) {
    console.error('Error fetching test performance tests:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch test performance tests',
        code: 'PERF_003',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
