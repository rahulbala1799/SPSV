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

    return NextResponse.json({
      session: {
        id: session.id,
        testType: session.testType,
        status: session.status,
        totalQuestions: session.totalQuestions,
        timeAllotted: session.timeAllotted,
        timeRemaining: session.timeRemaining,
        startedAt: session.startedAt
      },
      questions: session.questions.map(q => ({
        id: q.id,
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
