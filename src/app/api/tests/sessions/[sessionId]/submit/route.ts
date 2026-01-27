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

    const session = await prisma.testSession.findUnique({
      where: { id: params.sessionId, userId: user.id },
      include: {
        questions: {
          include: { answer: true }
        }
      }
    })

    if (!session || session.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    // Grade answers
    let correctCount = 0
    let industryCorrect = 0
    let areaCorrect = 0

    for (const question of session.questions) {
      if (question.answer) {
        const isCorrect = question.answer.selectedAnswer === question.correctAnswer
        
        await prisma.timedTestAnswer.update({
          where: { id: question.answer.id },
          data: { isCorrect }
        })

        if (isCorrect) {
          correctCount++
          if (question.category === 'INDUSTRY') industryCorrect++
          else areaCorrect++
        }
      }
    }

    const scorePercentage = (correctCount / session.totalQuestions) * 100
    const industryPercentage = session.industryQuestions > 0
      ? (industryCorrect / session.industryQuestions) * 100
      : 0
    const areaPercentage = session.areaQuestions > 0
      ? (areaCorrect / session.areaQuestions) * 100
      : 0

    // Update session
    const updatedSession = await prisma.testSession.update({
      where: { id: params.sessionId },
      data: {
        status: 'COMPLETED',
        score: correctCount,
        scorePercentage,
        industryScore: industryCorrect,
        areaScore: areaCorrect,
        industryPercentage,
        areaPercentage,
        timeRemaining: timeRemaining || 0,
        completedAt: new Date()
      }
    })

    // Update question bank stats
    const questionsWithAnswers = session.questions.filter(q => q.answer)
    for (const question of questionsWithAnswers) {
      if (question.answer?.isCorrect) {
        await prisma.questionBank.update({
          where: { id: question.questionBankId },
          data: { timesCorrect: { increment: 1 } }
        })
      }
    }

    return NextResponse.json({
      sessionId: updatedSession.id,
      score: correctCount,
      totalQuestions: session.totalQuestions,
      scorePercentage: Number(scorePercentage),
      industryScore: industryCorrect,
      industryTotal: session.industryQuestions,
      industryPercentage: Number(industryPercentage),
      areaScore: areaCorrect,
      areaTotal: session.areaQuestions,
      areaPercentage: Number(areaPercentage),
      passed: scorePercentage >= 80
    })
  } catch (error) {
    console.error('Error submitting test:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
