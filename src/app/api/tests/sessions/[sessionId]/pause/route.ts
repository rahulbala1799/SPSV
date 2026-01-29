import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { timeRemaining } = body

    // Verify session belongs to user and is in progress
    const session = await prisma.testSession.findUnique({
      where: { id: params.sessionId, userId: user.id }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Test is not in progress' },
        { status: 400 }
      )
    }

    // Update session to paused status
    const updatedSession = await prisma.testSession.update({
      where: { id: params.sessionId },
      data: {
        status: 'PAUSED',
        timeRemaining: timeRemaining || session.timeRemaining,
        pausedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      session: {
        id: updatedSession.id,
        status: updatedSession.status,
        timeRemaining: updatedSession.timeRemaining,
        pausedAt: updatedSession.pausedAt
      }
    })
  } catch (error) {
    console.error('Error pausing session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
