/**
 * Achievement checking utility
 * Call this after student actions to check and award achievements
 */

import { prisma } from './prisma'
import { achievementDefinitions, calculateActionPoints } from '@/data/achievements'

interface AchievementCheckOptions {
  action: 'question_answered' | 'chapter_completed' | 'test_completed'
  data?: {
    questionId?: string
    chapterId?: string
    testId?: string
    isCorrect?: boolean
    score?: number
  }
}

/**
 * Check and award achievements after a student action
 * This is a non-blocking operation - failures won't affect the main action
 */
export async function checkAchievements(
  studentId: string,
  options: AchievementCheckOptions
): Promise<{ newAchievements: any[]; pointsAwarded: number } | null> {
  try {
    // Get or create points record
    let studentPoints = await prisma.studentPoints.findUnique({
      where: { studentId }
    })

    if (!studentPoints) {
      studentPoints = await prisma.studentPoints.create({
        data: {
          studentId,
          totalPoints: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0
        }
      })
    }

    // Get current stats for achievement checking
    const stats = await getStudentStats(studentId)
    
    // Get all achievements from DB
    let dbAchievements = await prisma.achievement.findMany({
      where: { isActive: true }
    })

    // If no achievements in DB, seed them first
    if (dbAchievements.length === 0) {
      await seedAchievements()
      dbAchievements = await prisma.achievement.findMany({
        where: { isActive: true }
      })
    }

    // Check which achievements are newly earned
    const newlyEarned: { achievement: typeof dbAchievements[0]; earnedNow: boolean }[] = []

    for (const achievement of dbAchievements) {
      // Skip already earned achievements
      const alreadyEarned = await prisma.studentAchievement.findUnique({
        where: {
          studentId_achievementId: {
            studentId,
            achievementId: achievement.id
          }
        }
      })

      if (alreadyEarned) continue

      // Check if achievement is earned
      const requirement = achievement.requirement as { type: string; count: number }
      const isEarned = checkRequirement(requirement, stats)

      if (isEarned) {
        // Award achievement
        await prisma.studentAchievement.create({
          data: {
            studentId,
            achievementId: achievement.id,
            earnedAt: new Date(),
            isNew: true,
            currentProgress: requirement.count,
            targetProgress: requirement.count
          }
        })

        // Award points
        await prisma.studentPoints.update({
          where: { studentId },
          data: {
            totalPoints: { increment: achievement.pointsValue },
            weeklyPoints: { increment: achievement.pointsValue },
            monthlyPoints: { increment: achievement.pointsValue }
          }
        })

        // Log points history
        await prisma.pointsHistory.create({
          data: {
            studentId,
            points: achievement.pointsValue,
            reason: `Achievement unlocked: ${achievement.name}`,
            sourceType: 'achievement',
            sourceId: achievement.id
          }
        })

        newlyEarned.push({ achievement, earnedNow: true })
      }
    }

    // Award action-based points (with diminishing returns)
    let actionPoints = 0
    if (options.action && options.data) {
      const count = stats.questionsAnswered || 1
      actionPoints = calculateActionPoints(options.action, count)

      if (actionPoints > 0) {
        await prisma.studentPoints.update({
          where: { studentId },
          data: {
            totalPoints: { increment: actionPoints },
            weeklyPoints: { increment: actionPoints },
            monthlyPoints: { increment: actionPoints }
          }
        })

        await prisma.pointsHistory.create({
          data: {
            studentId,
            points: actionPoints,
            reason: `Action: ${options.action}`,
            sourceType: options.action,
            sourceId: options.data?.questionId || options.data?.chapterId || options.data?.testId
          }
        })
      }
    }

    // Update streak
    await updateStreak(studentId, studentPoints)

    return {
      newAchievements: newlyEarned.map(n => ({
        code: n.achievement.code,
        name: n.achievement.name,
        description: n.achievement.description,
        type: n.achievement.type,
        tier: n.achievement.tier,
        icon: n.achievement.icon,
        pointsValue: n.achievement.pointsValue
      })),
      pointsAwarded: actionPoints
    }
  } catch (error) {
    // Don't fail the main action if achievement checking fails
    console.error('[Achievements] Failed to check achievements:', error)
    return null
  }
}

// Helper function to get student stats
async function getStudentStats(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { userId: true }
  })

  if (!student) {
    return {
      questionsAnswered: 0,
      correctAnswers: 0,
      chaptersCompleted: 0,
      testsCompleted: 0,
      perfectScores: 0
    }
  }

  const [
    answersCount,
    correctAnswersCount,
    chapterProgress,
    untimedTests,
    timedTests
  ] = await Promise.all([
    prisma.answer.count({ where: { studentId } }),
    prisma.answer.count({ where: { studentId, isCorrect: true } }),
    prisma.chapterProgress.findMany({ where: { studentId } }),
    prisma.untimedTestAttempt.findMany({ where: { studentId, state: 'COMPLETED' } }),
    prisma.testSession.findMany({ 
      where: { 
        userId: student.userId,
        status: 'COMPLETED' 
      } 
    })
  ])

  const completedChapters = chapterProgress.filter(cp => cp.isCompleted).length
  const perfectScores = [
    ...chapterProgress.filter(cp => cp.score === 100),
    ...untimedTests.filter(t => t.score === 100),
    ...timedTests.filter(t => t.scorePercentage?.toNumber() === 100)
  ].length

  return {
    questionsAnswered: answersCount,
    correctAnswers: correctAnswersCount,
    chaptersCompleted: completedChapters,
    testsCompleted: untimedTests.length + timedTests.length,
    perfectScores
  }
}

// Helper function to check if requirement is met
function checkRequirement(requirement: { type: string; count: number }, stats: Awaited<ReturnType<typeof getStudentStats>>): boolean {
  switch (requirement.type) {
    case 'questions_answered':
      return stats.questionsAnswered >= requirement.count
    case 'correct_answers':
      return stats.correctAnswers >= requirement.count
    case 'chapters_completed':
      return stats.chaptersCompleted >= requirement.count
    case 'tests_completed':
      return stats.testsCompleted >= requirement.count
    case 'perfect_scores':
      return stats.perfectScores >= requirement.count
    default:
      return false
  }
}

// Helper function to seed achievements
async function seedAchievements() {
  for (const achievement of achievementDefinitions) {
    try {
      await prisma.achievement.upsert({
        where: { code: achievement.code },
        update: {},
        create: {
          code: achievement.code,
          name: achievement.name,
          description: achievement.description,
          type: achievement.type,
          tier: achievement.tier,
          icon: achievement.icon,
          pointsValue: achievement.pointsValue,
          category: achievement.category,
          requirement: achievement.requirement as any,
          sortOrder: achievement.sortOrder,
          isActive: true
        }
      })
    } catch (e) {
      console.log(`Achievement ${achievement.code} already exists or error:`, e)
    }
  }
}

// Helper function to update streak
async function updateStreak(studentId: string, studentPoints: { lastActiveDate: Date | null; currentStreak: number; longestStreak: number }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastActive = studentPoints.lastActiveDate
  
  if (lastActive) {
    const lastActiveDay = new Date(lastActive)
    lastActiveDay.setHours(0, 0, 0, 0)
    const daysDiff = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 1) {
      // Consecutive day - increase streak
      await prisma.studentPoints.update({
        where: { studentId },
        data: {
          currentStreak: { increment: 1 },
          longestStreak: Math.max(studentPoints.longestStreak, studentPoints.currentStreak + 1),
          lastActiveDate: new Date()
        }
      })
    } else if (daysDiff > 1) {
      // Streak broken
      await prisma.studentPoints.update({
        where: { studentId },
        data: {
          currentStreak: 1,
          lastActiveDate: new Date()
        }
      })
    }
  } else {
    // First activity
    await prisma.studentPoints.update({
      where: { studentId },
      data: {
        currentStreak: 1,
        lastActiveDate: new Date()
      }
    })
  }
}
