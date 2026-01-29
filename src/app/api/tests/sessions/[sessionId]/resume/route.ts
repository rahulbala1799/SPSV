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

    // Verify session belongs to user and is paused
    const session = await prisma.testSession.findUnique({
      where: { id: params.sessionId, userId: user.id }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.status !== 'PAUSED') {
      return NextResponse.json(
        { error: 'Test is not paused' },
        { status: 400 }
      )
    }

    // Resume session - status back to IN_PROGRESS, clear pausedAt
    const updatedSession = await prisma.testSession.update({
      where: { id: params.sessionId },
      data: {
        status: 'IN_PROGRESS',
        pausedAt: null
      }
    })

    return NextResponse.json({
      success: true,
      session: {
        id: updatedSession.id,
        status: updatedSession.status,
        timeRemaining: updatedSession.timeRemaining
      }
    })
  } catch (error) {
    console.error('Error resuming session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
