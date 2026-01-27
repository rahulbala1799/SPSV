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

    // Get all completed test sessions for this user
    const completedSessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      },
      orderBy: { completedAt: 'desc' }
    })

    // Get in-progress sessions
    const inProgressSessions = await prisma.testSession.count({
      where: {
        userId: user.id,
        status: 'IN_PROGRESS'
      }
    })

    const totalTests = completedSessions.length + inProgressSessions
    const completedTests = completedSessions.length

    // Calculate statistics
    let overallAverageScore = 0
    let bestScore = 0
    let worstScore = 100
    let totalQuestionsAnswered = 0
    let totalCorrectAnswers = 0
    let scoreDistribution = {
      excellent: 0,  // 90-100%
      good: 0,       // 80-89%
      average: 0,    // 70-79%
      needsWork: 0   // <70%
    }

    // Calculate test frequency
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    let testFrequency = {
      last7Days: 0,
      last30Days: 0,
      last90Days: 0
    }

    if (completedTests > 0) {
      const scores = completedSessions.map(s => Number(s.scorePercentage || 0))
      const totalScore = scores.reduce((sum, score) => sum + score, 0)
      overallAverageScore = Math.round(totalScore / completedTests)
      bestScore = Math.max(...scores)
      worstScore = Math.min(...scores)

      // Calculate score distribution
      scores.forEach(score => {
        if (score >= 90) scoreDistribution.excellent++
        else if (score >= 80) scoreDistribution.good++
        else if (score >= 70) scoreDistribution.average++
        else scoreDistribution.needsWork++
      })

      // Calculate totals
      totalQuestionsAnswered = completedSessions.reduce((sum, s) => sum + s.totalQuestions, 0)
      totalCorrectAnswers = completedSessions.reduce((sum, s) => sum + (s.score || 0), 0)

      // Calculate test frequency
      completedSessions.forEach(session => {
        const completedAt = session.completedAt
        if (!completedAt) return
        
        if (completedAt >= last7Days) testFrequency.last7Days++
        if (completedAt >= last30Days) testFrequency.last30Days++
        if (completedAt >= last90Days) testFrequency.last90Days++
      })
    }

    const completionRate = totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0
    const overallSuccessRate = totalQuestionsAnswered > 0 
      ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) 
      : 0
    const averageQuestionsPerTest = completedTests > 0 
      ? Math.round(totalQuestionsAnswered / completedTests) 
      : 0

    // Get score trend data (last 20 tests)
    const scoreTrend = completedSessions.slice(0, 20).reverse().map(session => ({
      date: session.completedAt?.toISOString() || '',
      score: Number(session.scorePercentage || 0),
      testId: session.id,
      testType: session.testType
    }))

    const overview = {
      totalTests,
      completedTests,
      inProgressTests: inProgressSessions,
      completionRate,
      overallAverageScore,
      bestScore,
      worstScore,
      scoreDistribution,
      averageQuestionsPerTest,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      overallSuccessRate,
      testFrequency
    }

    const trends = {
      scoreTrend,
      completionTrend: [] // Can be calculated if needed
    }

    return NextResponse.json({
      overview,
      trends
    })
  } catch (error: any) {
    console.error('Error fetching timed tests overview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
