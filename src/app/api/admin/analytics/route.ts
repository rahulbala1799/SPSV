import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    // Fetch all students with their related data
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        chapterProgress: {
          select: {
            progressStatus: true,
            timeSpentSeconds: true,
            totalQuestions: true,
            correctAnswers: true,
            lastAccessed: true,
            isCompleted: true,
          },
        },
        testSessions: {
          where: {
            status: 'COMPLETED',
          },
          select: {
            score: true,
            completedAt: true,
          },
        },
        activities: {
          select: {
            type: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    // Calculate rankings by different metrics
    const studentMetrics = students.map((student) => {
      const totalTimeSpent = student.chapterProgress.reduce(
        (sum, cp) => sum + (cp.timeSpentSeconds || 0),
        0
      )
      const totalQuestions = student.chapterProgress.reduce(
        (sum, cp) => sum + (cp.totalQuestions || 0),
        0
      )
      const totalCorrect = student.chapterProgress.reduce(
        (sum, cp) => sum + (cp.correctAnswers || 0),
        0
      )
      const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0

      const completedChapters = student.chapterProgress.filter(
        (cp) => cp.isCompleted === true
      ).length
      const totalChapters = student.chapterProgress.length
      const completionRate = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0

      // Calculate streak (consecutive days with activity)
      const activityDates = student.activities.map((a) =>
        new Date(a.createdAt).toDateString()
      )
      const uniqueDates = [...new Set(activityDates)]
      let streak = 0
      const today = new Date()
      for (let i = 0; i < uniqueDates.length; i++) {
        const date = new Date(uniqueDates[i])
        const daysDiff = Math.floor(
          (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysDiff === i) {
          streak++
        } else {
          break
        }
      }

      // Check if active in last 7 days
      const lastActivity = student.activities[0]
      const isActive = lastActivity
        ? new Date(lastActivity.createdAt).getTime() >
          Date.now() - 7 * 24 * 60 * 60 * 1000
        : false

      return {
        id: student.id,
        name: student.user.name || 'Unnamed Student',
        email: student.user.email,
        timeSpent: totalTimeSpent,
        questionsAnswered: totalQuestions,
        accuracy,
        completionRate,
        streak,
        isActive,
      }
    })

    // Sort by accuracy
    const topByAccuracy = [...studentMetrics]
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 10)
      .map((s, idx) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        rank: idx + 1,
        score: s.accuracy,
        change: Math.floor(Math.random() * 5) - 2, // TODO: Calculate actual change from historical data
      }))

    // Sort by questions answered
    const topByQuestions = [...studentMetrics]
      .sort((a, b) => b.questionsAnswered - a.questionsAnswered)
      .slice(0, 10)
      .map((s, idx) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        rank: idx + 1,
        score: s.questionsAnswered,
        change: Math.floor(Math.random() * 5) - 2,
      }))

    // Sort by time spent
    const topByTime = [...studentMetrics]
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 10)
      .map((s, idx) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        rank: idx + 1,
        score: s.timeSpent,
        change: Math.floor(Math.random() * 5) - 2,
      }))

    // Sort by completion rate
    const topByCompletion = [...studentMetrics]
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 10)
      .map((s, idx) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        rank: idx + 1,
        score: s.completionRate,
        change: Math.floor(Math.random() * 5) - 2,
      }))

    // Sort by streak
    const topByStreak = [...studentMetrics]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 10)
      .map((s, idx) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        rank: idx + 1,
        score: s.streak,
        change: Math.floor(Math.random() * 5) - 2,
      }))

    // Calculate overall metrics
    const metrics = {
      studentsCount: students.length,
      totalQuestions: studentMetrics.reduce((sum, s) => sum + s.questionsAnswered, 0),
      totalStudyTime: studentMetrics.reduce((sum, s) => sum + s.timeSpent, 0),
      averageAccuracy:
        studentMetrics.reduce((sum, s) => sum + s.accuracy, 0) / students.length || 0,
      activeStudents: studentMetrics.filter((s) => s.isActive).length,
      completionRate:
        studentMetrics.reduce((sum, s) => sum + s.completionRate, 0) / students.length || 0,
    }

    return NextResponse.json({
      success: true,
      topByAccuracy,
      topByQuestions,
      topByTime,
      topByCompletion,
      topByStreak,
      metrics,
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch analytics',
      },
      { status: 500 }
    )
  }
}
