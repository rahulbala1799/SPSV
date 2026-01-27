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
    const period = searchParams.get('period') || 'all'
    const categoryFilter = searchParams.get('category')

    // Calculate date range
    const now = new Date()
    let startDate: Date | null = null

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'all':
      default:
        startDate = null
    }

    // Build where clause
    const where: any = {
      studentId: student.id,
      state: 'COMPLETED',
      completedAt: { not: null },
      score: { not: null },
    }

    if (startDate) {
      where.completedAt = { gte: startDate }
    }

    if (categoryFilter && categoryFilter !== 'all') {
      where.category = categoryFilter
    }

    // Get tests
    const tests = await prisma.untimedTestAttempt.findMany({
      where,
      orderBy: { completedAt: 'asc' },
    })

    // Score trend
    const scoreTrend = tests.map(test => ({
      date: test.completedAt!.toISOString(),
      score: test.score!,
      testId: test.id,
      category: test.category,
    }))

    // Completion trend (grouped by date)
    const completionByDate = new Map<string, number>()
    tests.forEach(test => {
      const date = test.completedAt!.toISOString().split('T')[0]
      completionByDate.set(date, (completionByDate.get(date) || 0) + 1)
    })

    const completionTrend = Array.from(completionByDate.entries())
      .map(([date, count]) => ({ date, testsCompleted: count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Category comparison
    const categoryComparison = new Map<string, { date: string; score: number }[]>()

    tests.forEach(test => {
      const date = test.completedAt!.toISOString().split('T')[0]
      const cat = test.category

      if (!categoryComparison.has(cat)) {
        categoryComparison.set(cat, [])
      }

      categoryComparison.get(cat)!.push({
        date,
        score: test.score!,
      })
    })

    // Merge category data by date
    const allDates = new Set<string>()
    categoryComparison.forEach(scores => {
      scores.forEach(s => allDates.add(s.date))
    })

    const categoryComparisonArray = Array.from(allDates)
      .sort()
      .map(date => {
        const industry = categoryComparison
          .get('INDUSTRY_KNOWLEDGE')
          ?.find(s => s.date === date)
        const area = categoryComparison
          .get('AREA_KNOWLEDGE')
          ?.find(s => s.date === date)

        return {
          date,
          industryScore: industry?.score || null,
          areaScore: area?.score || null,
        }
      })

    // Question count trend
    const questionCountByDate = new Map<string, number[]>()
    tests.forEach(test => {
      const date = test.completedAt!.toISOString().split('T')[0]
      if (!questionCountByDate.has(date)) {
        questionCountByDate.set(date, [])
      }
      questionCountByDate.get(date)!.push(test.questionCount)
    })

    const questionCountTrend = Array.from(questionCountByDate.entries())
      .map(([date, counts]) => ({
        date,
        averageQuestions: Math.round(
          counts.reduce((sum, c) => sum + c, 0) / counts.length
        ),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      success: true,
      trends: {
        scoreTrend,
        completionTrend,
        categoryComparison: categoryComparisonArray,
        questionCountTrend,
      },
    })
  } catch (error) {
    console.error('Error fetching test trends:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch test trends',
        code: 'PERF_005',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
