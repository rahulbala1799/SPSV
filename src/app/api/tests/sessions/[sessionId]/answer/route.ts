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
    const { questionId, selectedAnswer, timeSpent } = body

    // Verify session belongs to user and is in progress
    const session = await prisma.testSession.findUnique({
      where: { id: params.sessionId, userId: user.id }
    })

    if (!session || session.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    // Get question to verify
    const question = await prisma.timedTestQuestion.findUnique({
      where: { id: questionId, sessionId: params.sessionId }
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Upsert answer - questionId is unique
    const answer = await prisma.timedTestAnswer.upsert({
      where: {
        questionId
      },
      update: {
        selectedAnswer,
        timeSpent: timeSpent || 0,
        answeredAt: new Date()
      },
      create: {
        sessionId: params.sessionId,
        questionId,
        selectedAnswer,
        timeSpent: timeSpent || 0,
        answeredAt: new Date()
      }
    })

    return NextResponse.json({ success: true, answer })
  } catch (error) {
    console.error('Error saving answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
