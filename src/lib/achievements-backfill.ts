/**
 * Backfill achievements for existing students
 * Awards achievements based on their current progress
 */

import { prisma } from './prisma'
import { checkAchievements } from './achievements'

/**
 * Backfill achievements for a single student
 * Checks all achievement types and awards what they've earned
 */
export async function backfillStudentAchievements(studentId: string): Promise<{
  achievementsAwarded: number
  pointsAwarded: number
}> {
  try {
    // Get student stats
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true }
    })

    if (!student) {
      throw new Error('Student not found')
    }

    // Get all their answers, chapters, tests
    const [
      answers,
      correctAnswers,
      chapterProgress,
      untimedTests,
      timedTests
    ] = await Promise.all([
      prisma.answer.findMany({ where: { studentId } }),
      prisma.answer.findMany({ where: { studentId, isCorrect: true } }),
      prisma.chapterProgress.findMany({ where: { studentId } }),
      prisma.untimedTestAttempt.findMany({ where: { studentId, state: 'COMPLETED' } }),
      prisma.testSession.findMany({ 
        where: { 
          userId: student.userId,
          status: 'COMPLETED' 
        } 
      })
    ])

    // Calculate stats
    const questionsAnswered = answers.length
    const correctAnswersCount = correctAnswers.length
    const chaptersCompleted = chapterProgress.filter(cp => cp.isCompleted).length
    const testsCompleted = untimedTests.length + timedTests.length
    const perfectScores = [
      ...chapterProgress.filter(cp => cp.score === 100),
      ...untimedTests.filter(t => t.score === 100),
      ...timedTests.filter(t => t.scorePercentage?.toNumber() === 100)
    ].length

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

    // Get all achievements from DB (seed if needed)
    let dbAchievements = await prisma.achievement.findMany({
      where: { isActive: true }
    })

    if (dbAchievements.length === 0) {
      // Seed achievements
      const { achievementDefinitions } = await import('@/data/achievements')
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
          // Ignore duplicates
        }
      }
      dbAchievements = await prisma.achievement.findMany({
        where: { isActive: true }
      })
    }

    // Check and award achievements
    let achievementsAwarded = 0
    let totalPointsAwarded = 0

    for (const achievement of dbAchievements) {
      // Skip already earned
      const alreadyEarned = await prisma.studentAchievement.findUnique({
        where: {
          studentId_achievementId: {
            studentId,
            achievementId: achievement.id
          }
        }
      })

      if (alreadyEarned) continue

      // Check requirement
      const requirement = achievement.requirement as { type: string; count: number }
      let isEarned = false

      switch (requirement.type) {
        case 'questions_answered':
          isEarned = questionsAnswered >= requirement.count
          break
        case 'correct_answers':
          isEarned = correctAnswersCount >= requirement.count
          break
        case 'chapters_completed':
          isEarned = chaptersCompleted >= requirement.count
          break
        case 'tests_completed':
          isEarned = testsCompleted >= requirement.count
          break
        case 'perfect_scores':
          isEarned = perfectScores >= requirement.count
          break
        default:
          isEarned = false
      }

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

        achievementsAwarded++
        totalPointsAwarded += achievement.pointsValue
      }
    }

    return {
      achievementsAwarded,
      pointsAwarded: totalPointsAwarded
    }
  } catch (error) {
    console.error('[Backfill] Failed to backfill achievements:', error)
    throw error
  }
}

/**
 * Backfill achievements for all students
 */
export async function backfillAllStudents(): Promise<{
  totalStudents: number
  studentsProcessed: number
  totalAchievementsAwarded: number
}> {
  try {
    const allStudents = await prisma.student.findMany({
      select: { id: true }
    })

    let studentsProcessed = 0
    let totalAchievementsAwarded = 0

    for (const student of allStudents) {
      try {
        const result = await backfillStudentAchievements(student.id)
        studentsProcessed++
        totalAchievementsAwarded += result.achievementsAwarded
      } catch (error) {
        console.error(`[Backfill] Failed for student ${student.id}:`, error)
      }
    }

    return {
      totalStudents: allStudents.length,
      studentsProcessed,
      totalAchievementsAwarded
    }
  } catch (error) {
    console.error('[Backfill] Failed to backfill all students:', error)
    throw error
  }
}
