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
    const categoryFilter = searchParams.get('category')

    // Get all completed tests
    const allTests = await prisma.untimedTestAttempt.findMany({
      where: {
        studentId: student.id,
        state: 'COMPLETED',
        ...(categoryFilter && categoryFilter !== 'all' && {
          category: categoryFilter as 'INDUSTRY_KNOWLEDGE' | 'AREA_KNOWLEDGE',
        }),
      },
      include: {
        testQuestions: {
          where: { selectedAnswer: { not: null } },
          select: {
            isCorrect: true,
          },
        },
      },
      orderBy: { completedAt: 'asc' },
    })

    // Separate by category
    const industryTests = allTests.filter(t => t.category === 'INDUSTRY_KNOWLEDGE')
    const areaTests = allTests.filter(t => t.category === 'AREA_KNOWLEDGE')

    // Calculate category performance
    const calculateCategoryStats = (tests: typeof allTests) => {
      const completed = tests.filter(t => t.completedAt && t.score !== null)
      const scores = completed.map(t => t.score!)
      const totalQuestions = completed.reduce((sum, t) => sum + t.totalAnswered, 0)
      const correctAnswers = completed.reduce((sum, t) => sum + t.correctAnswers, 0)

      // Improvement trend
      const improvementTrend = completed
        .filter(t => t.completedAt)
        .map(t => ({
          date: t.completedAt!.toISOString(),
          score: t.score!,
        }))

      return {
        totalTests: tests.length,
        completedTests: completed.length,
        averageScore: scores.length > 0
          ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
          : null,
        bestScore: scores.length > 0 ? Math.max(...scores) : null,
        worstScore: scores.length > 0 ? Math.min(...scores) : null,
        improvementTrend,
        totalQuestions,
        correctAnswers,
        successRate: totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0,
      }
    }

    const industryStats = calculateCategoryStats(industryTests)
    const areaStats = calculateCategoryStats(areaTests)

    // Comparison
    const industryAverage = industryStats.averageScore
    const areaAverage = areaStats.averageScore
    const strongerCategory = 
      industryAverage !== null && areaAverage !== null
        ? industryAverage > areaAverage
          ? 'INDUSTRY_KNOWLEDGE'
          : areaAverage > industryAverage
            ? 'AREA_KNOWLEDGE'
            : null
        : industryAverage !== null
          ? 'INDUSTRY_KNOWLEDGE'
          : areaAverage !== null
            ? 'AREA_KNOWLEDGE'
            : null

    return NextResponse.json({
      success: true,
      categoryPerformance: {
        INDUSTRY_KNOWLEDGE: industryStats,
        AREA_KNOWLEDGE: areaStats,
      },
      comparison: {
        industryAverage,
        areaAverage,
        strongerCategory,
      },
    })
  } catch (error) {
    console.error('Error fetching category performance:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch category performance',
        code: 'PERF_002',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
