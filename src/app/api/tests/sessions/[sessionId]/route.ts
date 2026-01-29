import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await prisma.testSession.findUnique({
      where: { id: params.sessionId, userId: user.id },
      include: {
        questions: {
          orderBy: { orderNumber: 'asc' },
          include: { answer: true }
        }
      }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Calculate actual remaining time for in-progress sessions (not paused)
    let actualTimeRemaining = session.timeRemaining
    if (session.status === 'IN_PROGRESS') {
      const now = new Date()
      const startedAt = session.startedAt
      const elapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
      const calculatedRemaining = session.timeAllotted - elapsedSeconds
      
      // Use the minimum of stored timeRemaining and calculated remaining time
      // This ensures we don't give extra time if the stored value is outdated
      actualTimeRemaining = Math.max(0, Math.min(session.timeRemaining, calculatedRemaining))
      
      // Update the database with the correct remaining time if it's different
      if (actualTimeRemaining !== session.timeRemaining) {
        await prisma.testSession.update({
          where: { id: session.id },
          data: { timeRemaining: actualTimeRemaining }
        })
      }
    }

    return NextResponse.json({
      session: {
        id: session.id,
        testType: session.testType,
        status: session.status,
        totalQuestions: session.totalQuestions,
        timeAllotted: session.timeAllotted,
        timeRemaining: actualTimeRemaining,
        startedAt: session.startedAt
      },
      questions: session.questions.map(q => ({
        id: q.id,
        questionBankId: q.questionBankId,
        orderNumber: q.orderNumber,
        questionText: q.questionText,
        options: {
          A: q.optionA,
          B: q.optionB,
          C: q.optionC,
          D: q.optionD
        },
        category: q.category,
        selectedAnswer: q.answer?.selectedAnswer || null
      })),
      answers: session.questions
        .filter(q => q.answer)
        .map(q => ({
          questionId: q.id,
          selectedAnswer: q.answer!.selectedAnswer,
          timeSpent: q.answer!.timeSpent
        }))
    })
  } catch (error) {
    console.error('Error getting session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
