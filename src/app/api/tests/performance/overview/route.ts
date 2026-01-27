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

    // Get all test attempts
    const allTests = await prisma.untimedTestAttempt.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
    })

    const totalTests = allTests.length
    const completedTests = allTests.filter(t => t.state === 'COMPLETED')
    const inProgressTests = allTests.filter(t => t.state === 'IN_PROGRESS')
    const completionRate = totalTests > 0
      ? Math.round((completedTests.length / totalTests) * 100)
      : 0

    // Calculate overall statistics
    const testsWithScores = completedTests.filter(t => t.score !== null)
    const overallAverageScore = testsWithScores.length > 0
      ? Math.round(testsWithScores.reduce((sum, t) => sum + (t.score || 0), 0) / testsWithScores.length)
      : 0

    const scores = testsWithScores.map(t => t.score!)
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0
    const worstScore = scores.length > 0 ? Math.min(...scores) : 0

    // Score distribution
    const scoreDistribution = {
      excellent: completedTests.filter(t => t.score !== null && t.score >= 90).length,
      good: completedTests.filter(t => t.score !== null && t.score >= 80 && t.score < 90).length,
      average: completedTests.filter(t => t.score !== null && t.score >= 70 && t.score < 80).length,
      needsWork: completedTests.filter(t => t.score !== null && t.score < 70).length,
    }

    // Calculate average questions per test
    const totalQuestions = completedTests.reduce((sum, t) => sum + t.totalAnswered, 0)
    const averageQuestionsPerTest = completedTests.length > 0
      ? Math.round(totalQuestions / completedTests.length)
      : 0

    const totalCorrectAnswers = completedTests.reduce((sum, t) => sum + t.correctAnswers, 0)
    const overallSuccessRate = totalQuestions > 0
      ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
      : 0

    // Test frequency
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    const testFrequency = {
      last7Days: completedTests.filter(t => 
        t.completedAt && new Date(t.completedAt) >= sevenDaysAgo
      ).length,
      last30Days: completedTests.filter(t => 
        t.completedAt && new Date(t.completedAt) >= thirtyDaysAgo
      ).length,
      last90Days: completedTests.filter(t => 
        t.completedAt && new Date(t.completedAt) >= ninetyDaysAgo
      ).length,
    }

    // Score trend (last 20 tests, sorted by completion date)
    const scoreTrend = completedTests
      .filter(t => t.completedAt && t.score !== null)
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
      .slice(-20)
      .map(t => ({
        date: t.completedAt!.toISOString(),
        score: t.score!,
        testId: t.id,
      }))

    // Completion trend (grouped by date)
    const completionByDate = new Map<string, number>()
    completedTests
      .filter(t => t.completedAt)
      .forEach(t => {
        const date = new Date(t.completedAt!).toISOString().split('T')[0]
        completionByDate.set(date, (completionByDate.get(date) || 0) + 1)
      })

    const completionTrend = Array.from(completionByDate.entries())
      .map(([date, count]) => ({ date, testsCompleted: count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30) // Last 30 days

    return NextResponse.json({
      success: true,
      overview: {
        totalTests,
        completedTests: completedTests.length,
        inProgressTests: inProgressTests.length,
        completionRate,
        overallAverageScore,
        bestScore,
        worstScore,
        scoreDistribution,
        averageQuestionsPerTest,
        totalQuestionsAnswered: totalQuestions,
        totalCorrectAnswers,
        overallSuccessRate,
        testFrequency,
      },
      trends: {
        scoreTrend,
        completionTrend,
      },
    })
  } catch (error) {
    console.error('Error fetching test performance overview:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch test performance overview',
        code: 'PERF_001',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
