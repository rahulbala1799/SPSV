import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { calculateTimeFromQuestions, calculateChapterTimeFromAnswers } from '@/lib/analytics'

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

    // Get enrollment date
    const enrollmentDate = new Date(student.enrollmentDate)
    const today = new Date()
    const daysSinceEnrollment = Math.max(1, Math.ceil((today.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24)))

    // Get chapter time data
    const chapterProgress = await prisma.chapterProgress.findMany({
      where: { studentId },
      include: { chapter: true }
    })

    // Calculate time - use stored time or calculate from questions
    let totalTimeSpent = 0
    for (const cp of chapterProgress) {
      if (cp.timeSpentSeconds && cp.timeSpentSeconds > 0) {
        totalTimeSpent += cp.timeSpentSeconds
      } else {
        // Calculate from questions answered for this chapter
        const calculatedTime = await calculateChapterTimeFromAnswers(studentId, cp.chapterId)
        totalTimeSpent += calculatedTime
      }
    }
    // Calculate average time per day (in seconds, then convert to minutes)
    // Use at least 1 day to avoid division by very small numbers
    const avgTimePerDaySeconds = totalTimeSpent / daysSinceEnrollment
    const avgTimePerDay = Math.round(avgTimePerDaySeconds / 60) // Convert to minutes

    // Time spent per chapter
    const chapterTimeData = chapterProgress
      .filter(cp => cp.timeSpentSeconds > 0)
      .map(cp => ({
        chapterTitle: cp.chapter.title,
        chapterNumber: cp.chapter.chapterNumber,
        timeSpentSeconds: cp.timeSpentSeconds,
        questionsAttempted: cp.totalQuestions,
        avgTimePerQuestion: cp.totalQuestions > 0 
          ? Math.round(cp.timeSpentSeconds / cp.totalQuestions) 
          : 0
      }))
      .sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds)

    // Calculate session data (if we had session tracking)
    // For now, use chapter progress data as proxy
    const sessions = chapterProgress
      .filter(cp => cp.startedAt)
      .map(cp => {
        const duration = cp.timeSpentSeconds || 0
        return {
          startedAt: cp.startedAt,
          duration,
          chapterId: cp.chapterId
        }
      })

    const avgSessionDuration = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
      : 0

    const longestSession = sessions.length > 0
      ? Math.max(...sessions.map(s => s.duration))
      : 0

    // Simulate daily time data (last 30 days)
    // In reality, this would come from daily activity tracking
    const last30Days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Calculate time spent on this day (simplified - uses chapter completion dates)
      const dayProgress = chapterProgress.filter(cp => {
        if (!cp.completedAt) return false
        const completedDate = cp.completedAt.toISOString().split('T')[0]
        return completedDate === dateStr
      })
      
      const timeSpent = dayProgress.reduce((sum, cp) => sum + (cp.timeSpentSeconds || 0), 0)
      
      last30Days.push({
        date: dateStr,
        timeSpentSeconds: timeSpent,
        questionsAttempted: dayProgress.reduce((sum, cp) => sum + cp.totalQuestions, 0)
      })
    }

    // Find peak study days
    const peakDays = [...last30Days]
      .sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds)
      .slice(0, 3)
      .filter(d => d.timeSpentSeconds > 0)

    // Calculate efficiency metrics
    const totalQuestionsAttempted = chapterProgress.reduce((sum, cp) => sum + cp.totalQuestions, 0)
    const totalQuestionsCorrect = chapterProgress.reduce((sum, cp) => sum + cp.correctAnswers, 0)
    
    const questionsPerHour = totalTimeSpent > 0 
      ? Math.round((totalQuestionsAttempted / (totalTimeSpent / 3600)) * 10) / 10
      : 0

    const accuracyTrend = chapterProgress
      .filter(cp => cp.totalQuestions > 0)
      .map((cp, index) => ({
        chapterNumber: cp.chapter.chapterNumber,
        accuracy: Math.round((cp.correctAnswers / cp.totalQuestions) * 100),
        order: index
      }))

    const avgTimePerQuestion = totalQuestionsAttempted > 0
      ? Math.round(totalTimeSpent / totalQuestionsAttempted)
      : 0

    // Calculate improvement rate
    const improvementRate = accuracyTrend.length >= 2
      ? accuracyTrend[accuracyTrend.length - 1].accuracy - accuracyTrend[0].accuracy
      : 0

    return NextResponse.json({
      summary: {
        totalTimeSpent,
        avgTimePerDay: Math.round(avgTimePerDay),
        daysSinceEnrollment,
        totalSessions: sessions.length,
        avgSessionDuration: Math.round(avgSessionDuration),
        longestSession
      },
      chapterTimeData: chapterTimeData.slice(0, 10),
      dailyTimeData: last30Days,
      peakDays,
      efficiency: {
        questionsPerHour,
        avgTimePerQuestion,
        accuracyTrend,
        improvementRate
      }
    })
  } catch (error: any) {
    console.error('Error fetching time statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time statistics' },
      { status: 500 }
    )
  }
}
