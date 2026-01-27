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

    // Get all completed tests
    const completedTests = await prisma.untimedTestAttempt.findMany({
      where: {
        studentId: student.id,
        state: 'COMPLETED',
        completedAt: { not: null },
        score: { not: null },
      },
      orderBy: { completedAt: 'asc' },
    })

    if (completedTests.length === 0) {
      return NextResponse.json({
        success: true,
        analytics: {
          streaks: {
            current: 0,
            longest: 0,
            averagePerWeek: 0,
            averagePerMonth: 0,
          },
          improvement: {
            scoreImprovement: 0,
            consistencyScore: 0,
            learningCurve: [],
          },
          weakAreas: [],
          strengths: [],
          recommendations: [],
        },
      })
    }

    // Calculate streaks
    const testDates = completedTests
      .map(t => new Date(t.completedAt!).toDateString())
      .sort()
      .reverse()

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate current streak
    let checkDate = new Date(today)
    for (let i = 0; i < testDates.length; i++) {
      const testDate = new Date(testDates[i])
      testDate.setHours(0, 0, 0, 0)

      if (testDate.getTime() === checkDate.getTime()) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (testDate.getTime() < checkDate.getTime()) {
        break
      }
    }

    // Calculate longest streak
    for (let i = 1; i < testDates.length; i++) {
      const prevDate = new Date(testDates[i - 1])
      const currDate = new Date(testDates[i])
      const daysDiff = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    // Calculate average per week/month
    const firstTestDate = new Date(completedTests[0].completedAt!)
    const lastTestDate = new Date(
      completedTests[completedTests.length - 1].completedAt!
    )
    const daysDiff = Math.ceil(
      (lastTestDate.getTime() - firstTestDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const weeksDiff = daysDiff / 7
    const monthsDiff = daysDiff / 30

    const averagePerWeek = weeksDiff > 0 ? Math.round(completedTests.length / weeksDiff) : 0
    const averagePerMonth = monthsDiff > 0 ? Math.round(completedTests.length / monthsDiff) : 0

    // Calculate improvement
    const scores = completedTests.map(t => t.score!)
    const firstScore = scores[0]
    const lastScore = scores[scores.length - 1]
    const scoreImprovement =
      firstScore > 0 ? Math.round(((lastScore - firstScore) / firstScore) * 100) : 0

    // Consistency score (standard deviation)
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
    const consistencyScore = Math.round(Math.sqrt(variance) * 10) / 10

    // Learning curve
    const learningCurve = completedTests.map((test, index) => ({
      testNumber: index + 1,
      score: test.score!,
      date: test.completedAt!.toISOString(),
    }))

    // Category performance for weak areas and strengths
    const categoryStats = new Map<
      string,
      { total: number; sum: number; count: number }
    >()

    completedTests.forEach(test => {
      const cat = test.category
      const existing = categoryStats.get(cat)
      if (existing) {
        existing.total++
        existing.sum += test.score || 0
        existing.count += test.score !== null ? 1 : 0
      } else {
        categoryStats.set(cat, {
          total: 1,
          sum: test.score || 0,
          count: test.score !== null ? 1 : 0,
        })
      }
    })

    const categoryPerformance = Array.from(categoryStats.entries()).map(
      ([category, stats]) => ({
        category,
        averageScore:
          stats.count > 0 ? Math.round(stats.sum / stats.count) : 0,
        testCount: stats.total,
      })
    )

    // Weak areas (below 70%)
    const weakAreas = categoryPerformance
      .filter(cp => cp.averageScore < 70)
      .sort((a, b) => a.averageScore - b.averageScore)
      .map(cp => ({
        category: cp.category,
        averageScore: cp.averageScore,
        testCount: cp.testCount,
        recommendation: `Focus on ${cp.category.replace('_', ' ')} - your average score is ${cp.averageScore}%`,
      }))

    // Strengths (above 80%)
    const strengths = categoryPerformance
      .filter(cp => cp.averageScore >= 80)
      .sort((a, b) => b.averageScore - a.averageScore)
      .map(cp => ({
        category: cp.category,
        averageScore: cp.averageScore,
        testCount: cp.testCount,
      }))

    // Generate recommendations
    const recommendations: Array<{
      type: string
      category: string | null
      message: string
      priority: string
    }> = []

    // Weak area recommendations
    weakAreas.forEach(area => {
      recommendations.push({
        type: 'focus_area',
        category: area.category,
        message: area.recommendation,
        priority: area.averageScore < 60 ? 'high' : 'medium',
      })
    })

    // Practice more recommendation
    if (completedTests.length < 5) {
      recommendations.push({
        type: 'practice_more',
        category: null,
        message: 'Take more tests to build confidence and improve scores',
        priority: 'medium',
      })
    }

    // Maintain strengths
    if (strengths.length > 0) {
      recommendations.push({
        type: 'maintain',
        category: strengths[0].category,
        message: `Keep practicing ${strengths[0].category.replace('_', ' ')} to maintain your strong performance`,
        priority: 'low',
      })
    }

    return NextResponse.json({
      success: true,
      analytics: {
        streaks: {
          current: currentStreak,
          longest: longestStreak,
          averagePerWeek,
          averagePerMonth,
        },
        improvement: {
          scoreImprovement,
          consistencyScore,
          learningCurve,
        },
        weakAreas,
        strengths,
        recommendations,
      },
    })
  } catch (error) {
    console.error('Error fetching test analytics:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch test analytics',
        code: 'PERF_004',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
