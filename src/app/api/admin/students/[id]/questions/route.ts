import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const studentId = params.id

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get all answer attempts from different sources
    
    // 1. Chapter answers
    const chapterAnswers = await prisma.answer.findMany({
      where: { studentId },
      include: {
        question: {
          include: {
            chapter: true
          }
        }
      },
      orderBy: { answeredAt: 'desc' }
    })

    // 2. Untimed test questions
    const untimedTestQuestions = await prisma.testQuestion.findMany({
      where: {
        testAttempt: { studentId },
        isCorrect: { not: null }
      },
      include: {
        question: {
          include: {
            chapter: true
          }
        },
        testAttempt: true
      },
      orderBy: { answeredAt: 'desc' }
    })

    // 3. Timed test answers
    const timedTestAnswers = await prisma.timedTestAnswer.findMany({
      where: {
        session: {
          userId: student.userId,
          status: 'COMPLETED'
        },
        isCorrect: { not: null }
      },
      include: {
        question: true,
        session: true
      },
      orderBy: { answeredAt: 'desc' }
    })

    // Aggregate question data
    const questionMap = new Map<string, {
      questionId: string
      questionText: string
      chapter?: string
      category?: string
      attempts: number
      correctAttempts: number
      lastAttempted: Date
      firstTryCorrect: boolean
    }>()

    // Process chapter answers
    chapterAnswers.forEach(answer => {
      const qId = answer.questionId
      if (!questionMap.has(qId)) {
        questionMap.set(qId, {
          questionId: qId,
          questionText: answer.question.questionText,
          chapter: answer.question.chapter.title,
          category: answer.question.category || undefined,
          attempts: 0,
          correctAttempts: 0,
          lastAttempted: answer.answeredAt,
          firstTryCorrect: false
        })
      }
      const data = questionMap.get(qId)!
      data.attempts++
      if (answer.isCorrect) data.correctAttempts++
      if (data.attempts === 1 && answer.isCorrect) data.firstTryCorrect = true
    })

    // Process untimed test questions
    untimedTestQuestions.forEach(tq => {
      const qId = tq.questionId
      if (!questionMap.has(qId)) {
        questionMap.set(qId, {
          questionId: qId,
          questionText: tq.question.questionText,
          chapter: tq.question.chapter?.title,
          category: tq.question.category || undefined,
          attempts: 0,
          correctAttempts: 0,
          lastAttempted: tq.answeredAt || new Date(),
          firstTryCorrect: false
        })
      }
      const data = questionMap.get(qId)!
      data.attempts++
      if (tq.isCorrect) data.correctAttempts++
      if (data.attempts === 1 && tq.isCorrect) data.firstTryCorrect = true
    })

    // Process timed test answers
    timedTestAnswers.forEach(ta => {
      const qId = ta.questionId
      const qText = ta.question.questionText
      if (!questionMap.has(qId)) {
        questionMap.set(qId, {
          questionId: qId,
          questionText: qText,
          category: ta.question.category,
          attempts: 0,
          correctAttempts: 0,
          lastAttempted: ta.answeredAt || new Date(),
          firstTryCorrect: false
        })
      }
      const data = questionMap.get(qId)!
      data.attempts++
      if (ta.isCorrect) data.correctAttempts++
      if (data.attempts === 1 && ta.isCorrect) data.firstTryCorrect = true
    })

    const allQuestions = Array.from(questionMap.values())

    // Calculate statistics
    const totalUniqueQuestions = allQuestions.length
    const totalAttempts = allQuestions.reduce((sum, q) => sum + q.attempts, 0)
    const avgAttemptsPerQuestion = totalUniqueQuestions > 0 
      ? Math.round((totalAttempts / totalUniqueQuestions) * 10) / 10 
      : 0
    const firstTryCorrect = allQuestions.filter(q => q.firstTryCorrect).length
    const multipleAttempts = allQuestions.filter(q => q.attempts > 1).length

    // Most attempted questions (top 10)
    const mostAttempted = allQuestions
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 10)
      .map(q => ({
        ...q,
        successRate: Math.round((q.correctAttempts / q.attempts) * 100)
      }))

    // Difficulty analysis
    const easyQuestions = allQuestions.filter(q => q.firstTryCorrect && q.attempts === 1)
    const mediumQuestions = allQuestions.filter(q => 
      q.attempts >= 2 && q.attempts <= 3 && q.correctAttempts > 0
    )
    const hardQuestions = allQuestions.filter(q => 
      q.attempts > 3 || (q.attempts > 0 && q.correctAttempts === 0)
    )

    const summary = {
      totalUniqueQuestions,
      totalAttempts,
      avgAttemptsPerQuestion,
      firstTryCorrect,
      multipleAttempts,
      easyCount: easyQuestions.length,
      mediumCount: mediumQuestions.length,
      hardCount: hardQuestions.length
    }

    const difficulty = {
      easy: easyQuestions.slice(0, 5).map(q => ({
        questionText: q.questionText.substring(0, 100) + (q.questionText.length > 100 ? '...' : ''),
        chapter: q.chapter,
        category: q.category,
        attempts: q.attempts
      })),
      medium: mediumQuestions.slice(0, 5).map(q => ({
        questionText: q.questionText.substring(0, 100) + (q.questionText.length > 100 ? '...' : ''),
        chapter: q.chapter,
        category: q.category,
        attempts: q.attempts
      })),
      hard: hardQuestions.slice(0, 5).map(q => ({
        questionText: q.questionText.substring(0, 100) + (q.questionText.length > 100 ? '...' : ''),
        chapter: q.chapter,
        category: q.category,
        attempts: q.attempts
      }))
    }

    return NextResponse.json({
      summary,
      mostAttempted,
      difficulty
    })
  } catch (error: any) {
    console.error('Error fetching question analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question analytics' },
      { status: 500 }
    )
  }
}
