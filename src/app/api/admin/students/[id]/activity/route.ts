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
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

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

    // Collect recent activities from various sources
    interface Activity {
      type: string
      timestamp: Date
      description: string
      metadata: Record<string, any>
    }
    const activities: Activity[] = []

    // 1. Chapter completions
    const completedChapters = await prisma.chapterProgress.findMany({
      where: {
        studentId,
        isCompleted: true,
        completedAt: { not: null }
      },
      include: { chapter: true },
      orderBy: { completedAt: 'desc' },
      take: limit
    })

    completedChapters.forEach(cp => {
      if (cp.completedAt) {
        activities.push({
          type: 'CHAPTER_COMPLETE',
          timestamp: cp.completedAt,
          description: `Completed Chapter ${cp.chapter.chapterNumber}: ${cp.chapter.title}`,
          metadata: {
            chapterId: cp.chapterId,
            chapterTitle: cp.chapter.title,
            chapterNumber: cp.chapter.chapterNumber,
            score: cp.score
          }
        })
      }
    })

    // 2. Test completions (untimed)
    const untimedTests = await prisma.untimedTestAttempt.findMany({
      where: {
        studentId,
        state: 'COMPLETED',
        completedAt: { not: null }
      },
      orderBy: { completedAt: 'desc' },
      take: limit
    })

    untimedTests.forEach(test => {
      if (test.completedAt) {
        activities.push({
          type: 'TEST_COMPLETE',
          timestamp: test.completedAt,
          description: `Completed ${test.category} Test (${test.questionCount} questions)`,
          metadata: {
            testId: test.id,
            category: test.category,
            score: test.score,
            correctAnswers: test.correctAnswers,
            totalQuestions: test.questionCount
          }
        })
      }
    })

    // 3. Test completions (timed)
    const timedTests = await prisma.testSession.findMany({
      where: {
        userId: student.userId,
        status: 'COMPLETED',
        completedAt: { not: null }
      },
      orderBy: { completedAt: 'desc' },
      take: limit
    })

    timedTests.forEach(test => {
      if (test.completedAt) {
        activities.push({
          type: 'TIMED_TEST_COMPLETE',
          timestamp: test.completedAt,
          description: `Completed ${test.testType} Timed Test`,
          metadata: {
            sessionId: test.id,
            testType: test.testType,
            score: test.score,
            percentage: Number(test.scorePercentage),
            totalQuestions: test.totalQuestions
          }
        })
      }
    })

    // 4. Chapter starts
    const startedChapters = await prisma.chapterProgress.findMany({
      where: {
        studentId,
        startedAt: { not: null },
        isCompleted: false
      },
      include: { chapter: true },
      orderBy: { startedAt: 'desc' },
      take: limit
    })

    startedChapters.forEach(cp => {
      if (cp.startedAt) {
        activities.push({
          type: 'CHAPTER_START',
          timestamp: cp.startedAt,
          description: `Started Chapter ${cp.chapter.chapterNumber}: ${cp.chapter.title}`,
          metadata: {
            chapterId: cp.chapterId,
            chapterTitle: cp.chapter.title,
            chapterNumber: cp.chapter.chapterNumber
          }
        })
      }
    })

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Take only the requested limit
    const recentActivities = activities.slice(0, limit).map(activity => ({
      ...activity,
      timestamp: activity.timestamp.toISOString()
    }))

    // Calculate activity summary
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)

    const recentActivitiesCount = activities.filter(
      a => a.timestamp >= last7Days
    ).length

    const activityByType = {
      chaptersCompleted: activities.filter(a => a.type === 'CHAPTER_COMPLETE').length,
      testsCompleted: activities.filter(a => 
        a.type === 'TEST_COMPLETE' || a.type === 'TIMED_TEST_COMPLETE'
      ).length,
      chaptersStarted: activities.filter(a => a.type === 'CHAPTER_START').length
    }

    return NextResponse.json({
      activities: recentActivities,
      summary: {
        totalActivities: activities.length,
        recentActivitiesCount,
        activityByType
      }
    })
  } catch (error: any) {
    console.error('Error fetching activity timeline:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity timeline' },
      { status: 500 }
    )
  }
}
