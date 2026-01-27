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

    // Get untimed test attempts
    const untimedTests = await prisma.untimedTestAttempt.findMany({
      where: { studentId: student.id },
      include: {
        testQuestions: {
          where: { selectedAnswer: { not: null } },
          select: {
            isCorrect: true,
            answeredAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const completedUntimedTests = untimedTests.filter(t => t.state === 'COMPLETED')
    
    // Calculate overall statistics (including untimed tests)
    const totalAttempts = allAnswers.length
    const correctAttempts = allAnswers.filter(a => a.isCorrect).length
    
    // Add untimed test attempts
    const untimedTestAttempts = untimedTests.flatMap(t => t.testQuestions)
    const untimedCorrectAttempts = untimedTestAttempts.filter(tq => tq.isCorrect).length
    
    const combinedTotalAttempts = totalAttempts + untimedTestAttempts.length
    const combinedCorrectAttempts = correctAttempts + untimedCorrectAttempts
    const overallSuccessRate = combinedTotalAttempts > 0
      ? Math.round((combinedCorrectAttempts / combinedTotalAttempts) * 100)
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

    // Get study streak (days studied) - including test activity
    const answerDates = allAnswers.map(a => a.answeredAt.toDateString())
    const testDates = untimedTestAttempts
      .filter(tq => tq.answeredAt)
      .map(tq => new Date(tq.answeredAt!).toDateString())
    const allDates = new Set([...answerDates, ...testDates])
    const daysStudied = allDates.size

    // Get most recent activity (last 7 days) - including tests
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentAnswers = allAnswers.filter(a => a.answeredAt >= sevenDaysAgo)
    const recentTestAnswers = untimedTestAttempts.filter(
      tq => tq.answeredAt && new Date(tq.answeredAt) >= sevenDaysAgo
    )
    const recentTotal = recentAnswers.length + recentTestAnswers.length
    const recentCorrect = 
      recentAnswers.filter(a => a.isCorrect).length +
      recentTestAnswers.filter(tq => tq.isCorrect).length
    const recentSuccessRate = recentTotal > 0
      ? Math.round((recentCorrect / recentTotal) * 100)
      : 0

    // Calculate study duration (first answer to last answer)
    let studyDuration = 0
    if (allAnswers.length > 0) {
      const firstAnswer = allAnswers[allAnswers.length - 1].answeredAt
      const lastAnswer = allAnswers[0].answeredAt
      studyDuration = Math.ceil((lastAnswer.getTime() - firstAnswer.getTime()) / (1000 * 60 * 60 * 24))
    }

    // Calculate untimed test statistics
    const untimedTestStats = {
      totalTests: untimedTests.length,
      completedTests: completedUntimedTests.length,
      averageScore: completedUntimedTests.length > 0
        ? Math.round(
            completedUntimedTests
              .filter(t => t.score !== null)
              .reduce((sum, t) => sum + (t.score || 0), 0) / 
            completedUntimedTests.filter(t => t.score !== null).length
          )
        : null,
      byCategory: {
        INDUSTRY_KNOWLEDGE: {
          total: untimedTests.filter(t => t.category === 'INDUSTRY_KNOWLEDGE').length,
          completed: completedUntimedTests.filter(t => t.category === 'INDUSTRY_KNOWLEDGE').length,
          averageScore: (() => {
            const industryTests = completedUntimedTests.filter(
              t => t.category === 'INDUSTRY_KNOWLEDGE' && t.score !== null
            )
            return industryTests.length > 0
              ? Math.round(industryTests.reduce((sum, t) => sum + (t.score || 0), 0) / industryTests.length)
              : null
          })(),
        },
        AREA_KNOWLEDGE: {
          total: untimedTests.filter(t => t.category === 'AREA_KNOWLEDGE').length,
          completed: completedUntimedTests.filter(t => t.category === 'AREA_KNOWLEDGE').length,
          averageScore: (() => {
            const areaTests = completedUntimedTests.filter(
              t => t.category === 'AREA_KNOWLEDGE' && t.score !== null
            )
            return areaTests.length > 0
              ? Math.round(areaTests.reduce((sum, t) => sum + (t.score || 0), 0) / areaTests.length)
              : null
          })(),
        },
      },
    }

    return NextResponse.json({
      overall: {
        totalAttempts: combinedTotalAttempts,
        correctAttempts: combinedCorrectAttempts,
        overallSuccessRate,
        totalQuestionsAttempted,
        daysStudied,
        studyDuration,
        recentSuccessRate: recentSuccessRate,
        recentActivityCount: recentTotal
      },
      difficultyStats,
      chapterPerformance,
      strongestChapters: chapterPerformance.slice(0, 3),
      weakestChapters: chapterPerformance.slice(-3).reverse(),
      untimedTests: untimedTestStats
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get student analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
