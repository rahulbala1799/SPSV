import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { calculateTimeFromQuestions } from '@/lib/analytics'

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
      include: {
        user: true
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Calculate statistics from existing data
    
    // 1. Chapter Progress
    const chapterProgress = await prisma.chapterProgress.findMany({
      where: { studentId },
      include: { chapter: true }
    })

    const totalChapters = await prisma.chapter.count({
      where: { isActive: true }
    })

    const chaptersCompleted = chapterProgress.filter(cp => cp.isCompleted).length
    
    // Find current chapter (latest accessed but not completed)
    const currentChapterProgress = chapterProgress
      .filter(cp => !cp.isCompleted)
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())[0]
    
    const currentChapter = currentChapterProgress?.chapter.title || null

    // Calculate total time spent from chapter progress
    // If timeSpentSeconds is 0 or null, calculate from questions answered
    let totalStudyTime = chapterProgress.reduce((sum, cp) => {
      if (cp.timeSpentSeconds && cp.timeSpentSeconds > 0) {
        return sum + cp.timeSpentSeconds
      }
      // Calculate from questions if time not set
      return sum + calculateTimeFromQuestions(cp.totalQuestions)
    }, 0)

    // Also add time from test questions if chapter progress time is missing
    if (totalStudyTime === 0) {
      // Fallback: calculate from all answers
      const totalAnswers = await prisma.answer.count({
        where: { studentId }
      })
      totalStudyTime = calculateTimeFromQuestions(totalAnswers)
    }

    // 2. Untimed Test Statistics
    const untimedTests = await prisma.untimedTestAttempt.findMany({
      where: {
        studentId,
        state: 'COMPLETED'
      }
    })

    // 3. Timed Test Statistics
    const timedTests = await prisma.testSession.findMany({
      where: {
        userId: student.userId,
        status: 'COMPLETED'
      }
    })

    // Fetch assigned test attempts
    const assignedTests = await prisma.assignedTestAttempt.findMany({
      where: {
        studentId,
        completedAt: { not: null }
      }
    })

    // Combine test statistics
    const allTests = [
      ...untimedTests.map(t => ({
        score: t.score || 0,
        type: 'untimed'
      })),
      ...timedTests.map(t => ({
        score: Number(t.scorePercentage) || 0,
        type: 'timed'
      })),
      ...assignedTests.map(t => ({
        score: Number(t.percentageScore) || (t.score || 0),
        type: 'assigned'
      }))
    ]

    const testsAttempted = allTests.length
    const averageScore = testsAttempted > 0
      ? allTests.reduce((sum, t) => sum + t.score, 0) / testsAttempted
      : 0
    const bestScore = testsAttempted > 0
      ? Math.max(...allTests.map(t => t.score))
      : 0

    // 4. Question Statistics
    // From chapter answers
    const chapterAnswers = await prisma.answer.findMany({
      where: { studentId }
    })

    // From test questions (untimed)
    const testQuestions = await prisma.testQuestion.findMany({
      where: {
        testAttempt: {
          studentId
        },
        isCorrect: { not: null }
      }
    })

    // From timed test answers
    const timedTestAnswers = await prisma.timedTestAnswer.findMany({
      where: {
        session: {
          userId: student.userId
        },
        isCorrect: { not: null }
      }
    })

    // From assigned test answers
    const assignedTestAnswers = await prisma.assignedTestAnswer.findMany({
      where: {
        attempt: {
          studentId
        },
        isCorrect: { not: null }
      }
    })

    const questionsAttempted = chapterAnswers.length + testQuestions.length + timedTestAnswers.length + assignedTestAnswers.length
    const questionsCorrect = 
      chapterAnswers.filter(a => a.isCorrect).length +
      testQuestions.filter(q => q.isCorrect === true).length +
      timedTestAnswers.filter(a => a.isCorrect === true).length +
      assignedTestAnswers.filter(a => a.isCorrect === true).length

    // 5. Calculate overall completion
    // Based on chapters completed and tests taken
    const chapterCompletion = totalChapters > 0 ? (chaptersCompleted / totalChapters) * 60 : 0
    const testCompletion = testsAttempted >= 3 ? 40 : (testsAttempted / 3) * 40
    const overallCompletion = Math.round(chapterCompletion + testCompletion)

    const stats = {
      totalStudyTime,
      chaptersCompleted,
      totalChapters,
      currentChapter,
      testsAttempted,
      averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
      bestScore: Math.round(bestScore),
      questionsAttempted,
      questionsCorrect,
      overallCompletion: Math.min(100, overallCompletion)
    }

    return NextResponse.json({ stats })
  } catch (error: any) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student statistics' },
      { status: 500 }
    )
  }
}
