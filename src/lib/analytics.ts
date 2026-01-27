/**
 * Analytics tracking utilities for student activity
 * 
 * Note: These functions will work once the database migration is applied.
 * Until then, they will fail silently in development.
 */

import { prisma } from './prisma'

/**
 * Time calculation constants
 * Based on average time spent per question
 */
export const TIME_PER_QUESTION_SECONDS = 40 // Average 40 seconds per question

/**
 * Calculate study time from number of questions answered
 */
export function calculateTimeFromQuestions(questionCount: number): number {
  return questionCount * TIME_PER_QUESTION_SECONDS
}

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
 * Calculate and update time spent for a chapter based on questions answered
 */
export async function calculateChapterTimeFromAnswers(
  studentId: string,
  chapterId: string
): Promise<number> {
  try {
    // Count total answers for this chapter
    const answerCount = await prisma.answer.count({
      where: {
        studentId,
        question: {
          chapterId
        }
      }
    })

    // Calculate time: 40 seconds per question answered
    const calculatedTime = calculateTimeFromQuestions(answerCount)

    // Update chapter progress with calculated time
    await prisma.chapterProgress.updateMany({
      where: {
        studentId,
        chapterId
      },
      data: {
        timeSpentSeconds: calculatedTime
      }
    })

    return calculatedTime
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Time calculation skipped')
    } else {
      console.error('[Analytics] Failed to calculate chapter time:', error)
    }
    return 0
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

    // If timeSpentSeconds is not provided, calculate from questions answered
    if (!updates.timeSpentSeconds) {
      const calculatedTime = await calculateChapterTimeFromAnswers(studentId, chapterId)
      if (calculatedTime > 0) {
        data.timeSpentSeconds = calculatedTime
      } else if (existing) {
        // Keep existing time if calculation fails
        data.timeSpentSeconds = existing.timeSpentSeconds
      }
    } else if (existing) {
      // Use provided time or accumulate if it's an increment
      data.timeSpentSeconds = updates.timeSpentSeconds
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
 * Recalculate time spent for all chapters for a student
 * Useful for migrating existing data or fixing time calculations
 */
export async function recalculateStudentTime(studentId: string): Promise<{
  chaptersUpdated: number
  totalTimeCalculated: number
}> {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { isActive: true }
    })

    let chaptersUpdated = 0
    let totalTime = 0

    for (const chapter of chapters) {
      const time = await calculateChapterTimeFromAnswers(studentId, chapter.id)
      if (time > 0) {
        chaptersUpdated++
        totalTime += time
      }
    }

    return {
      chaptersUpdated,
      totalTimeCalculated: totalTime
    }
  } catch (error) {
    console.error('[Analytics] Failed to recalculate student time:', error)
    return {
      chaptersUpdated: 0,
      totalTimeCalculated: 0
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
