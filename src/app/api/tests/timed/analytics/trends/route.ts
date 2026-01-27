import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can access test analytics' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // 7d, 30d, 90d, all

    // Calculate date filter
    const now = new Date()
    let dateFilter: Date | undefined
    
    switch (period) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        dateFilter = undefined
    }

    // Get all completed sessions within period
    const sessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        ...(dateFilter && { completedAt: { gte: dateFilter } })
      },
      orderBy: { completedAt: 'asc' }
    })

    // Calculate score trend
    const scoreTrend = sessions.map(session => ({
      date: session.completedAt?.toISOString() || '',
      score: Number(session.scorePercentage || 0),
      testId: session.id,
      testType: session.testType
    }))

    // Calculate category trends
    const industryTrend = sessions
      .filter(s => s.industryQuestions > 0)
      .map(session => ({
        date: session.completedAt?.toISOString() || '',
        score: Number(session.industryPercentage || 0),
        testId: session.id
      }))

    const areaTrend = sessions
      .filter(s => s.areaQuestions > 0)
      .map(session => ({
        date: session.completedAt?.toISOString() || '',
        score: Number(session.areaPercentage || 0),
        testId: session.id
      }))

    // Calculate time management trends
    const timeEfficiency = sessions.map(session => {
      const timeUsed = session.timeAllotted - session.timeRemaining
      const timePerQuestion = session.totalQuestions > 0 
        ? timeUsed / session.totalQuestions 
        : 0
      
      return {
        date: session.completedAt?.toISOString() || '',
        timeUsedSeconds: timeUsed,
        timeUsedMinutes: Math.round(timeUsed / 60),
        timePerQuestion: Math.round(timePerQuestion),
        questionsCount: session.totalQuestions,
        testId: session.id
      }
    })

    // Calculate test type breakdown
    const testTypeBreakdown = {
      FULL_TIMED: sessions.filter(s => s.testType === 'FULL_TIMED').length,
      MOCK: sessions.filter(s => s.testType === 'MOCK').length
    }

    // Calculate improvement metrics
    const improvement = {
      scoreImprovement: 0,
      consistencyScore: 0,
      averageImprovement: 0
    }

    if (sessions.length >= 2) {
      const firstScore = Number(sessions[0].scorePercentage || 0)
      const lastScore = Number(sessions[sessions.length - 1].scorePercentage || 0)
      improvement.scoreImprovement = Math.round(lastScore - firstScore)

      // Calculate consistency (standard deviation)
      const scores = sessions.map(s => Number(s.scorePercentage || 0))
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
      improvement.consistencyScore = Math.round(Math.sqrt(variance))

      // Calculate average improvement between consecutive tests
      let totalImprovement = 0
      for (let i = 1; i < sessions.length; i++) {
        totalImprovement += Number(sessions[i].scorePercentage || 0) - Number(sessions[i-1].scorePercentage || 0)
      }
      improvement.averageImprovement = Math.round(totalImprovement / (sessions.length - 1))
    }

    // Calculate weekly/monthly activity
    const activityByWeek: Record<string, number> = {}
    const activityByMonth: Record<string, number> = {}

    sessions.forEach(session => {
      if (!session.completedAt) return

      // Week key (ISO week)
      const weekKey = getWeekKey(session.completedAt)
      activityByWeek[weekKey] = (activityByWeek[weekKey] || 0) + 1

      // Month key
      const monthKey = session.completedAt.toISOString().substring(0, 7) // YYYY-MM
      activityByMonth[monthKey] = (activityByMonth[monthKey] || 0) + 1
    })

    const weeklyActivity = Object.entries(activityByWeek).map(([week, count]) => ({
      week,
      testsCompleted: count
    }))

    const monthlyActivity = Object.entries(activityByMonth).map(([month, count]) => ({
      month,
      testsCompleted: count
    }))

    return NextResponse.json({
      trends: {
        scoreTrend,
        industryTrend,
        areaTrend,
        timeEfficiency,
        testTypeBreakdown,
        improvement,
        weeklyActivity,
        monthlyActivity
      }
    })
  } catch (error: any) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}

function getWeekKey(date: Date): string {
  // Get ISO week number
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
}
