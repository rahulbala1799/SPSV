import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { testType, config } = body

    if (!testType || !['FULL_TIMED', 'MOCK'].includes(testType)) {
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })
    }

    let questionCount: number
    let industryCount: number
    let areaCount: number
    let timeAllotted: number

    if (testType === 'FULL_TIMED') {
      questionCount = 90
      industryCount = 54
      areaCount = 36
      timeAllotted = 90 * 60 // 90 minutes in seconds
    } else {
      // MOCK test
      questionCount = config.questionCount || 10
      timeAllotted = questionCount * 60 // 1 minute per question

      if (config.categories === 'BOTH') {
        industryCount = Math.round(questionCount * 0.6)
        areaCount = questionCount - industryCount
      } else if (config.categories === 'INDUSTRY') {
        industryCount = questionCount
        areaCount = 0
      } else {
        industryCount = 0
        areaCount = questionCount
      }
    }

    // Get questions from QuestionBank
    const [industryQuestions, areaQuestions] = await Promise.all([
      industryCount > 0
        ? prisma.questionBank.findMany({
            where: { category: 'INDUSTRY', isActive: true },
            take: industryCount * 2 // Get extra for shuffling
          })
        : [],
      areaCount > 0
        ? prisma.questionBank.findMany({
            where: { category: 'AREA_KNOWLEDGE', isActive: true },
            take: areaCount * 2
          })
        : []
    ])

    if (industryQuestions.length < industryCount) {
      return NextResponse.json(
        { error: `Not enough INDUSTRY questions. Need ${industryCount}, have ${industryQuestions.length}` },
        { status: 400 }
      )
    }

    if (areaQuestions.length < areaCount) {
      return NextResponse.json(
        { error: `Not enough AREA_KNOWLEDGE questions. Need ${areaCount}, have ${areaQuestions.length}` },
        { status: 400 }
      )
    }

    // Shuffle and select
    const selectedIndustry = shuffleArray(industryQuestions).slice(0, industryCount)
    const selectedArea = shuffleArray(areaQuestions).slice(0, areaCount)
    const allQuestions = shuffleArray([...selectedIndustry, ...selectedArea])

    // Create test session
    const session = await prisma.testSession.create({
      data: {
        userId: user.id,
        testType,
        status: 'IN_PROGRESS',
        totalQuestions: questionCount,
        industryQuestions: industryCount,
        areaQuestions: areaCount,
        timeAllotted,
        timeRemaining: timeAllotted,
        questions: {
          create: allQuestions.map((q, index) => ({
            questionBankId: q.id,
            orderNumber: index + 1,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            category: q.category
          }))
        }
      },
      include: {
        questions: {
          orderBy: { orderNumber: 'asc' }
        }
      }
    })

    // Update question bank usage
    await prisma.questionBank.updateMany({
      where: { id: { in: allQuestions.map(q => q.id) } },
      data: { timesUsed: { increment: 1 } }
    })

    return NextResponse.json({
      sessionId: session.id,
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
        category: q.category
      })),
      timeAllotted
    })
  } catch (error) {
    console.error('Error creating test session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
