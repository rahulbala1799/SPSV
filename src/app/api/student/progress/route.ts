import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET overall student progress across all chapters
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
        { error: 'Only students can view progress' },
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

    // Get all active chapters
    const allChapters = await prisma.chapter.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { chapterNumber: 'asc' }
    })

    // Get all progress records for this student
    const allProgress = await prisma.chapterProgress.findMany({
      where: { studentId: student.id },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            description: true,
            _count: {
              select: { questions: true }
            }
          }
        }
      },
      orderBy: {
        lastAccessed: 'desc'
      }
    })

    // Get all answers for this student to calculate detailed stats
    const allAnswers = await prisma.answer.findMany({
      where: { studentId: student.id },
      select: {
        questionId: true,
        isCorrect: true,
        answeredAt: true,
        question: {
          select: {
            chapterId: true
          }
        }
      },
      orderBy: { answeredAt: 'desc' }
    })

    // Calculate overall statistics
    const totalChapters = allChapters.length
    const completedChapters = allProgress.filter(p => p.isCompleted).length
    const inProgressChapters = allProgress.filter(p => !p.isCompleted && p.totalQuestions > 0).length
    
    // Calculate average score across all completed/started chapters
    const chaptersWithScores = allProgress.filter(p => p.score !== null)
    const averageScore = chaptersWithScores.length > 0
      ? Math.round(chaptersWithScores.reduce((sum, p) => sum + (p.score || 0), 0) / chaptersWithScores.length)
      : 0

    // Calculate overall progress percentage
    const overallProgress = totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0

    // Get total questions answered
    const totalQuestionsAnswered = allProgress.reduce((sum, p) => sum + p.totalQuestions, 0)
    const totalCorrectAnswers = allProgress.reduce((sum, p) => sum + p.correctAnswers, 0)

    // Get recent activity (last 10 answers)
    const recentActivity = allAnswers.slice(0, 10).map(answer => ({
      questionId: answer.questionId,
      chapterId: answer.question.chapterId,
      isCorrect: answer.isCorrect,
      answeredAt: answer.answeredAt
    }))

    // Get most recent completions (last 5)
    const recentCompletions = allProgress
      .filter(p => p.isCompleted && p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5)
      .map(p => ({
        chapterId: p.chapter.id,
        chapterTitle: p.chapter.title,
        chapterNumber: p.chapter.chapterNumber,
        score: p.score,
        completedAt: p.completedAt
      }))

    // Format chapter progress with detailed info
    const chapterProgressList = allChapters.map(chapter => {
      const progress = allProgress.find(p => p.chapterId === chapter.id)
      const totalQuestions = chapter._count.questions

      return {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterNumber: chapter.chapterNumber,
        description: chapter.description,
        totalQuestionsInChapter: totalQuestions,
        isCompleted: progress?.isCompleted || false,
        score: progress?.score || null,
        correctAnswers: progress?.correctAnswers || 0,
        totalQuestions: progress?.totalQuestions || 0,
        startedAt: progress?.startedAt || null,
        completedAt: progress?.completedAt || null,
        lastAccessed: progress?.lastAccessed || null,
        hasStarted: progress !== undefined
      }
    })

    return NextResponse.json({
      overview: {
        totalChapters,
        completedChapters,
        inProgressChapters,
        notStartedChapters: totalChapters - completedChapters - inProgressChapters,
        averageScore,
        overallProgress,
        totalQuestionsAnswered,
        totalCorrectAnswers,
        totalTests: 5, // Keep for compatibility (can be made dynamic later)
        completedTests: 0 // Can be calculated from actual test data when tests are implemented
      },
      chapterProgress: chapterProgressList,
      recentActivity,
      recentCompletions
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get student progress error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
