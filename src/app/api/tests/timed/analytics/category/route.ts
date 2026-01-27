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

    // Get all completed test sessions
    const completedSessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      },
      orderBy: { completedAt: 'desc' }
    })

    // Calculate category performance
    const categoryPerformance = {
      INDUSTRY: {
        totalTests: 0,
        averageScore: null as number | null,
        bestScore: 0,
        worstScore: 100,
        totalQuestions: 0,
        correctAnswers: 0,
        successRate: 0,
        recentTrend: [] as Array<{
          date: string
          score: number
          testId: string
        }>
      },
      AREA_KNOWLEDGE: {
        totalTests: 0,
        averageScore: null as number | null,
        bestScore: 0,
        worstScore: 100,
        totalQuestions: 0,
        correctAnswers: 0,
        successRate: 0,
        recentTrend: [] as Array<{
          date: string
          score: number
          testId: string
        }>
      }
    }

    if (completedSessions.length > 0) {
      // Process industry scores
      const industryScores: number[] = []
      const areaScores: number[] = []

      completedSessions.forEach(session => {
        // Industry Knowledge
        if (session.industryQuestions > 0) {
          const industryScore = Number(session.industryPercentage || 0)
          industryScores.push(industryScore)
          categoryPerformance.INDUSTRY.totalTests++
          categoryPerformance.INDUSTRY.totalQuestions += session.industryQuestions
          categoryPerformance.INDUSTRY.correctAnswers += session.industryScore
          
          if (industryScore > categoryPerformance.INDUSTRY.bestScore) {
            categoryPerformance.INDUSTRY.bestScore = industryScore
          }
          if (industryScore < categoryPerformance.INDUSTRY.worstScore) {
            categoryPerformance.INDUSTRY.worstScore = industryScore
          }

          // Add to recent trend (last 10 tests)
          if (categoryPerformance.INDUSTRY.recentTrend.length < 10) {
            categoryPerformance.INDUSTRY.recentTrend.push({
              date: session.completedAt?.toISOString() || '',
              score: industryScore,
              testId: session.id
            })
          }
        }

        // Area Knowledge
        if (session.areaQuestions > 0) {
          const areaScore = Number(session.areaPercentage || 0)
          areaScores.push(areaScore)
          categoryPerformance.AREA_KNOWLEDGE.totalTests++
          categoryPerformance.AREA_KNOWLEDGE.totalQuestions += session.areaQuestions
          categoryPerformance.AREA_KNOWLEDGE.correctAnswers += session.areaScore
          
          if (areaScore > categoryPerformance.AREA_KNOWLEDGE.bestScore) {
            categoryPerformance.AREA_KNOWLEDGE.bestScore = areaScore
          }
          if (areaScore < categoryPerformance.AREA_KNOWLEDGE.worstScore) {
            categoryPerformance.AREA_KNOWLEDGE.worstScore = areaScore
          }

          // Add to recent trend (last 10 tests)
          if (categoryPerformance.AREA_KNOWLEDGE.recentTrend.length < 10) {
            categoryPerformance.AREA_KNOWLEDGE.recentTrend.push({
              date: session.completedAt?.toISOString() || '',
              score: areaScore,
              testId: session.id
            })
          }
        }
      })

      // Calculate averages
      if (industryScores.length > 0) {
        const totalIndustry = industryScores.reduce((sum, score) => sum + score, 0)
        categoryPerformance.INDUSTRY.averageScore = Math.round(totalIndustry / industryScores.length)
        categoryPerformance.INDUSTRY.successRate = categoryPerformance.INDUSTRY.totalQuestions > 0
          ? Math.round((categoryPerformance.INDUSTRY.correctAnswers / categoryPerformance.INDUSTRY.totalQuestions) * 100)
          : 0
      }

      if (areaScores.length > 0) {
        const totalArea = areaScores.reduce((sum, score) => sum + score, 0)
        categoryPerformance.AREA_KNOWLEDGE.averageScore = Math.round(totalArea / areaScores.length)
        categoryPerformance.AREA_KNOWLEDGE.successRate = categoryPerformance.AREA_KNOWLEDGE.totalQuestions > 0
          ? Math.round((categoryPerformance.AREA_KNOWLEDGE.correctAnswers / categoryPerformance.AREA_KNOWLEDGE.totalQuestions) * 100)
          : 0
      }

      // Reverse trends for chronological order
      categoryPerformance.INDUSTRY.recentTrend.reverse()
      categoryPerformance.AREA_KNOWLEDGE.recentTrend.reverse()
    }

    return NextResponse.json({
      categoryPerformance
    })
  } catch (error: any) {
    console.error('Error fetching category performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category performance' },
      { status: 500 }
    )
  }
}
