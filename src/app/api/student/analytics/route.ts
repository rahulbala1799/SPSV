import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET aggregated analytics across all chapters
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can view analytics' },
        { status: 403 }
      )
    }

    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Get all answers for this student across all chapters
    const allAnswers = await prisma.answer.findMany({
      where: { studentId: student.id },
      include: {
        question: {
          select: {
            id: true,
            chapterId: true,
            difficulty: true,
            chapter: {
              select: {
                id: true,
                title: true,
                chapterNumber: true
              }
            }
          }
        }
      },
      orderBy: { answeredAt: 'desc' }
    })

    // Calculate overall statistics
    const totalAttempts = allAnswers.length
    const correctAttempts = allAnswers.filter(a => a.isCorrect).length
    const overallSuccessRate = totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0

    // Get unique questions attempted
    const uniqueQuestions = new Set(allAnswers.map(a => a.question.id))
    const totalQuestionsAttempted = uniqueQuestions.size

    // Calculate success rate by difficulty
    const easyAnswers = allAnswers.filter(a => a.question.difficulty === 'easy')
    const mediumAnswers = allAnswers.filter(a => a.question.difficulty === 'medium')
    const hardAnswers = allAnswers.filter(a => a.question.difficulty === 'hard')

    const difficultyStats = {
      easy: {
        total: easyAnswers.length,
        correct: easyAnswers.filter(a => a.isCorrect).length,
        successRate: easyAnswers.length > 0
          ? Math.round((easyAnswers.filter(a => a.isCorrect).length / easyAnswers.length) * 100)
          : 0
      },
      medium: {
        total: mediumAnswers.length,
        correct: mediumAnswers.filter(a => a.isCorrect).length,
        successRate: mediumAnswers.length > 0
          ? Math.round((mediumAnswers.filter(a => a.isCorrect).length / mediumAnswers.length) * 100)
          : 0
      },
      hard: {
        total: hardAnswers.length,
        correct: hardAnswers.filter(a => a.isCorrect).length,
        successRate: hardAnswers.length > 0
          ? Math.round((hardAnswers.filter(a => a.isCorrect).length / hardAnswers.length) * 100)
          : 0
      }
    }

    // Calculate performance by chapter
    const chapterStats = new Map<string, {
      chapterId: string
      chapterTitle: string
      chapterNumber: number
      totalAttempts: number
      correctAttempts: number
      successRate: number
      questionsAttempted: number
    }>()

    allAnswers.forEach(answer => {
      const chapterId = answer.question.chapterId
      const existing = chapterStats.get(chapterId)
      
      if (existing) {
        existing.totalAttempts++
        if (answer.isCorrect) existing.correctAttempts++
      } else {
        chapterStats.set(chapterId, {
          chapterId,
          chapterTitle: answer.question.chapter.title,
          chapterNumber: answer.question.chapter.chapterNumber,
          totalAttempts: 1,
          correctAttempts: answer.isCorrect ? 1 : 0,
          successRate: 0,
          questionsAttempted: 0
        })
      }
    })

    // Calculate success rates and count unique questions per chapter
    const chapterQuestions = new Map<string, Set<string>>()
    allAnswers.forEach(answer => {
      const chapterId = answer.question.chapterId
      if (!chapterQuestions.has(chapterId)) {
        chapterQuestions.set(chapterId, new Set())
      }
      chapterQuestions.get(chapterId)!.add(answer.question.id)
    })

    const chapterPerformance = Array.from(chapterStats.values()).map(stat => ({
      ...stat,
      questionsAttempted: chapterQuestions.get(stat.chapterId)?.size || 0,
      successRate: stat.totalAttempts > 0
        ? Math.round((stat.correctAttempts / stat.totalAttempts) * 100)
        : 0
    })).sort((a, b) => b.successRate - a.successRate)

    // Get study streak (days studied)
    const answerDates = allAnswers.map(a => a.answeredAt.toDateString())
    const uniqueDates = new Set(answerDates)
    const daysStudied = uniqueDates.size

    // Get most recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentAnswers = allAnswers.filter(a => a.answeredAt >= sevenDaysAgo)
    const recentSuccessRate = recentAnswers.length > 0
      ? Math.round((recentAnswers.filter(a => a.isCorrect).length / recentAnswers.length) * 100)
      : 0

    // Calculate study duration (first answer to last answer)
    let studyDuration = 0
    if (allAnswers.length > 0) {
      const firstAnswer = allAnswers[allAnswers.length - 1].answeredAt
      const lastAnswer = allAnswers[0].answeredAt
      studyDuration = Math.ceil((lastAnswer.getTime() - firstAnswer.getTime()) / (1000 * 60 * 60 * 24))
    }

    return NextResponse.json({
      overall: {
        totalAttempts,
        correctAttempts,
        overallSuccessRate,
        totalQuestionsAttempted,
        daysStudied,
        studyDuration,
        recentSuccessRate: recentSuccessRate,
        recentActivityCount: recentAnswers.length
      },
      difficultyStats,
      chapterPerformance,
      strongestChapters: chapterPerformance.slice(0, 3),
      weakestChapters: chapterPerformance.slice(-3).reverse()
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get student analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
