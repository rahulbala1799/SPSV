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
        score: session.score,
        scorePercentage: session.scorePercentage,
        industryScore: session.industryScore,
        industryTotal: session.industryQuestions,
        industryPercentage: session.industryPercentage,
        areaScore: session.areaScore,
        areaTotal: session.areaQuestions,
        areaPercentage: session.areaPercentage,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        timeAllotted: session.timeAllotted,
        timeRemaining: session.timeRemaining
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
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        category: q.category,
        selectedAnswer: q.answer?.selectedAnswer || null,
        isCorrect: q.answer?.isCorrect || false,
        timeSpent: q.answer?.timeSpent || 0
      }))
    })
  } catch (error) {
    console.error('Error getting results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
