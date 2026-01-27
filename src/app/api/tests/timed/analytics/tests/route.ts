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
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const testType = searchParams.get('testType') || 'all' // FULL_TIMED, MOCK, or all
    const sortBy = searchParams.get('sortBy') || 'date' // date, score, questions
    const sortOrder = searchParams.get('sortOrder') || 'desc' // asc, desc

    // Build where clause
    const where: any = {
      userId: user.id,
      status: 'COMPLETED'
    }

    if (testType !== 'all') {
      where.testType = testType
    }

    // Build orderBy
    let orderBy: any = { completedAt: sortOrder }
    if (sortBy === 'score') {
      orderBy = { scorePercentage: sortOrder }
    } else if (sortBy === 'questions') {
      orderBy = { totalQuestions: sortOrder }
    }

    // Get total count
    const total = await prisma.testSession.count({ where })

    // Get paginated tests
    const sessions = await prisma.testSession.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit
    })

    // Calculate improvement metrics for each test
    const allCompletedSessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      },
      orderBy: { completedAt: 'asc' },
      select: {
        id: true,
        scorePercentage: true,
        completedAt: true
      }
    })

    const avgScore = allCompletedSessions.length > 0
      ? allCompletedSessions.reduce((sum, s) => sum + Number(s.scorePercentage || 0), 0) / allCompletedSessions.length
      : 0

    const tests = sessions.map((session, index) => {
      const score = Number(session.scorePercentage || 0)
      
      // Find previous test
      const sessionIndex = allCompletedSessions.findIndex(s => s.id === session.id)
      const previousSession = sessionIndex > 0 ? allCompletedSessions[sessionIndex - 1] : null
      const vsPrevious = previousSession 
        ? Math.round(score - Number(previousSession.scorePercentage || 0))
        : null

      // Compare to average
      const vsAverage = Math.round(score - avgScore)

      // Determine trend (looking at last 3 tests)
      let trend: 'improving' | 'declining' | 'stable' | null = null
      if (sessionIndex >= 2) {
        const last3 = allCompletedSessions.slice(Math.max(0, sessionIndex - 2), sessionIndex + 1)
        const scores = last3.map(s => Number(s.scorePercentage || 0))
        const isImproving = scores.every((score, i) => i === 0 || score >= scores[i - 1])
        const isDeclining = scores.every((score, i) => i === 0 || score <= scores[i - 1])
        
        if (isImproving && scores[scores.length - 1] > scores[0]) trend = 'improving'
        else if (isDeclining && scores[scores.length - 1] < scores[0]) trend = 'declining'
        else trend = 'stable'
      }

      // Calculate duration
      const duration = session.completedAt && session.startedAt
        ? Math.round((session.completedAt.getTime() - session.startedAt.getTime()) / 1000)
        : null

      return {
        id: session.id,
        testType: session.testType,
        totalQuestions: session.totalQuestions,
        score: score,
        correctAnswers: session.score || 0,
        startedAt: session.startedAt.toISOString(),
        completedAt: session.completedAt?.toISOString() || null,
        duration,
        industryScore: session.industryScore,
        industryTotal: session.industryQuestions,
        industryPercentage: Number(session.industryPercentage || 0),
        areaScore: session.areaScore,
        areaTotal: session.areaQuestions,
        areaPercentage: Number(session.areaPercentage || 0),
        timeAllotted: session.timeAllotted,
        timeRemaining: session.timeRemaining,
        improvement: {
          vsPrevious,
          vsAverage,
          trend
        }
      }
    })

    return NextResponse.json({
      tests,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error: any) {
    console.error('Error fetching timed tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}
