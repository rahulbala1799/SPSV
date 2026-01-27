/**
 * Analytics tracking utilities for student activity
 * 
 * Note: These functions will work once the database migration is applied.
 * Until then, they will fail silently in development.
 */

import { prisma } from './prisma'

export type ActivityType = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'CHAPTER_VIEW'
  | 'CHAPTER_COMPLETE'
  | 'QUESTION_ATTEMPT'
  | 'TEST_START'
  | 'TEST_COMPLETE'
  | 'SESSION_START'
  | 'SESSION_END'

/**
 * Track a student activity
 */
export async function trackActivity(
  studentId: string,
  activityType: ActivityType,
  metadata?: Record<string, any>,
  duration?: number
) {
  try {
    // Only track if the analytics tables exist
    await prisma.studentActivity.create({
      data: {
        studentId,
        activityType,
        metadata: metadata || {},
        duration,
        timestamp: new Date()
      }
    })
  } catch (error) {
    // Fail silently in development if tables don't exist yet
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Tracking skipped (migration not applied yet)')
    } else {
      console.error('[Analytics] Failed to track activity:', error)
    }
  }
}

/**
 * Track a question attempt
 */
export async function trackQuestionAttempt(
  studentId: string,
  questionId: string,
  answerGiven: string,
  isCorrect: boolean,
  timeSpentSeconds?: number,
  chapterId?: string,
  testType?: string
) {
  try {
    // Get previous attempts for this question
    const previousAttempts = await prisma.questionAttempt.count({
      where: { studentId, questionId }
    })

    await prisma.questionAttempt.create({
      data: {
        studentId,
        questionId,
        answerGiven,
        isCorrect,
        timeSpentSeconds,
        chapterId,
        testType,
        attemptNumber: previousAttempts + 1,
        attemptedAt: new Date()
      }
    })

    // Also track as activity
    await trackActivity(studentId, 'QUESTION_ATTEMPT', {
      questionId,
      chapterId,
      isCorrect,
      testType
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Question tracking skipped')
    } else {
      console.error('[Analytics] Failed to track question:', error)
    }
  }
}

/**
 * Update chapter progress with time tracking
 */
export async function updateChapterProgress(
  studentId: string,
  chapterId: string,
  updates: {
    isCompleted?: boolean
    progressPercent?: number
    timeSpentSeconds?: number
    correctAnswers?: number
    totalQuestions?: number
  }
) {
  try {
    const existing = await prisma.chapterProgress.findUnique({
      where: {
        studentId_chapterId: { studentId, chapterId }
      }
    })

    const data: any = {
      ...updates,
      lastAccessed: new Date()
    }

    // Set status based on completion
    if (updates.isCompleted) {
      data.progressStatus = 'COMPLETED'
      data.completedAt = new Date()
    } else if (updates.progressPercent && updates.progressPercent > 0) {
      data.progressStatus = 'IN_PROGRESS'
      if (!existing?.startedAt) {
        data.startedAt = new Date()
      }
    }

    // Accumulate time spent
    if (updates.timeSpentSeconds && existing) {
      data.timeSpentSeconds = existing.timeSpentSeconds + updates.timeSpentSeconds
    }

    await prisma.chapterProgress.upsert({
      where: {
        studentId_chapterId: { studentId, chapterId }
      },
      update: data,
      create: {
        studentId,
        chapterId,
        totalQuestions: updates.totalQuestions || 0,
        ...data
      }
    })

    // Track activity
    if (updates.isCompleted) {
      await trackActivity(studentId, 'CHAPTER_COMPLETE', { chapterId })
    } else {
      await trackActivity(studentId, 'CHAPTER_VIEW', { chapterId })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Chapter progress tracking skipped')
    } else {
      console.error('[Analytics] Failed to update chapter progress:', error)
    }
  }
}

/**
 * Track test completion (for timed tests)
 */
export async function trackTimedTestCompletion(
  studentId: string,
  testSessionId: string,
  testType: string,
  score: number,
  maxScore: number,
  questionsTotal: number,
  questionsCorrect: number,
  industryCorrect: number,
  areaCorrect: number,
  durationSeconds: number
) {
  try {
    // Count previous attempts for this test type
    const previousAttempts = await prisma.timedTestAttemptTracking.count({
      where: { studentId, testType }
    })

    const percentage = (score / maxScore) * 100

    await prisma.timedTestAttemptTracking.create({
      data: {
        studentId,
        testSessionId,
        testType,
        attemptNumber: previousAttempts + 1,
        score,
        maxScore,
        percentage,
        questionsTotal,
        questionsCorrect,
        industryCorrect,
        areaCorrect,
        durationSeconds,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    // Track activity
    await trackActivity(studentId, 'TEST_COMPLETE', {
      testSessionId,
      testType,
      score: percentage
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Test tracking skipped')
    } else {
      console.error('[Analytics] Failed to track test:', error)
    }
  }
}

/**
 * Update daily activity summary
 * This should be called at the end of each session or via a cron job
 */
export async function updateDailyActivity(
  studentId: string,
  date: Date = new Date()
) {
  try {
    // Normalize date to midnight
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    // Get today's activities
    const activities = await prisma.studentActivity.findMany({
      where: {
        studentId,
        timestamp: {
          gte: normalizedDate,
          lt: new Date(normalizedDate.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    // Calculate stats
    const questionsAttempted = activities.filter(a => a.activityType === 'QUESTION_ATTEMPT').length
    const questionsCorrect = activities.filter(
      a => a.activityType === 'QUESTION_ATTEMPT' && (a.metadata as any)?.isCorrect
    ).length

    const chaptersAccessed = [
      ...new Set(
        activities
          .filter(a => ['CHAPTER_VIEW', 'CHAPTER_COMPLETE'].includes(a.activityType))
          .map(a => (a.metadata as any)?.chapterId)
          .filter(Boolean)
      )
    ]

    const testsAttempted = [
      ...new Set(
        activities
          .filter(a => ['TEST_START', 'TEST_COMPLETE'].includes(a.activityType))
          .map(a => (a.metadata as any)?.testId || (a.metadata as any)?.testSessionId)
          .filter(Boolean)
      )
    ]

    const timeSpentSeconds = activities
      .filter(a => a.duration)
      .reduce((sum, a) => sum + (a.duration || 0), 0)

    const loginCount = activities.filter(a => a.activityType === 'LOGIN').length
    const firstLoginAt = activities.find(a => a.activityType === 'LOGIN')?.timestamp
    const lastLogoutAt = activities
      .filter(a => a.activityType === 'LOGOUT')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]?.timestamp

    // Upsert daily activity
    await prisma.dailyActivity.upsert({
      where: {
        studentId_date: {
          studentId,
          date: normalizedDate
        }
      },
      update: {
        timeSpentSeconds,
        questionsAttempted,
        questionsCorrect,
        chaptersAccessed,
        testsAttempted,
        loginCount,
        firstLoginAt,
        lastLogoutAt
      },
      create: {
        studentId,
        date: normalizedDate,
        timeSpentSeconds,
        questionsAttempted,
        questionsCorrect,
        chaptersAccessed,
        testsAttempted,
        loginCount,
        firstLoginAt,
        lastLogoutAt
      }
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Daily activity update skipped')
    } else {
      console.error('[Analytics] Failed to update daily activity:', error)
    }
  }
}
