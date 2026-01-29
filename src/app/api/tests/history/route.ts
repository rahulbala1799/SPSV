import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get in-progress, paused, and completed tests
    const sessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        status: {
          in: ['IN_PROGRESS', 'PAUSED', 'COMPLETED']
        }
      },
      orderBy: [
        { status: 'asc' }, // IN_PROGRESS first, then PAUSED, then COMPLETED
        { startedAt: 'desc' }
      ],
      take: 30,
      select: {
        id: true,
        testType: true,
        totalQuestions: true,
        score: true,
        scorePercentage: true,
        status: true,
        timeAllotted: true,
        timeRemaining: true,
        startedAt: true,
        completedAt: true
      }
    })

    return NextResponse.json({ tests: sessions })
  } catch (error) {
    console.error('Error getting history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
