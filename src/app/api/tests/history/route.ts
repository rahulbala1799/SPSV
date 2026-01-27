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

    const sessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      },
      orderBy: { completedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        testType: true,
        totalQuestions: true,
        score: true,
        scorePercentage: true,
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
