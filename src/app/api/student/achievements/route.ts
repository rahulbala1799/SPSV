import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { achievementDefinitions, calculateLevel, getLevelTitle, calculateActionPoints } from '@/data/achievements'

export const dynamic = 'force-dynamic'

// GET student achievements and points
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can view achievements' }, { status: 403 })
    }

    // Get student using singular model name
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    // Get student achievements using camelCase model name
    const studentAchievements = await prisma.studentAchievement.findMany({
      where: { studentId: student.id },
      include: {
        achievement: true
      },
      orderBy: { earnedAt: 'desc' }
    })

    // Get or create student points record using camelCase model name
    let studentPoints = await prisma.studentPoints.findUnique({
      where: { studentId: student.id }
    })

    if (!studentPoints) {
      studentPoints = await prisma.studentPoints.create({
        data: {
          studentId: student.id,
          totalPoints: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0
        }
      })
    }

    // Calculate level info
    const levelInfo = calculateLevel(studentPoints.totalPoints)
    const levelTitle = getLevelTitle(levelInfo.level)

    // Format achievements - using singular relation name
    const formattedAchievements = studentAchievements.map(sa => ({
      id: sa.id,
      code: sa.achievement.code,
      name: sa.achievement.name,
      description: sa.achievement.description,
      type: sa.achievement.type,
      tier: sa.achievement.tier,
      icon: sa.achievement.icon,
      pointsValue: sa.achievement.pointsValue,
      category: sa.achievement.category,
      earnedAt: sa.earnedAt.toISOString(),
      isNew: sa.isNew,
      currentProgress: sa.currentProgress,
      targetProgress: sa.targetProgress
    }))

    // Get all available achievements for "locked" display
    const earnedCodes = new Set(formattedAchievements.map(a => a.code))
    const lockedAchievements = achievementDefinitions
      .filter(a => !earnedCodes.has(a.code))
      .map(a => ({
        code: a.code,
        name: a.name,
        description: a.description,
        type: a.type,
        tier: a.tier,
        icon: a.icon,
        pointsValue: a.pointsValue,
        category: a.category
      }))

    // Separate by type
    const medals = formattedAchievements.filter(a => a.type === 'MEDAL')
    const trophies = formattedAchievements.filter(a => a.type === 'TROPHY')
    const badges = formattedAchievements.filter(a => a.type === 'BADGE')

    return NextResponse.json({
      points: {
        total: studentPoints.totalPoints,
        level: levelInfo.level,
        levelTitle,
        currentXP: levelInfo.currentXP,
        nextLevelXP: levelInfo.nextLevelXP,
        progress: levelInfo.progress,
        currentStreak: studentPoints.currentStreak,
        longestStreak: studentPoints.longestStreak,
        weeklyPoints: studentPoints.weeklyPoints,
        monthlyPoints: studentPoints.monthlyPoints
      },
      achievements: {
        all: formattedAchievements,
        medals,
        trophies,
        badges,
        locked: lockedAchievements,
        totalEarned: formattedAchievements.length,
        totalAvailable: achievementDefinitions.length
      },
      newAchievements: formattedAchievements.filter(a => a.isNew)
    }, { status: 200 })

  } catch (error: any) {
    console.error('Get achievements error:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

// POST - Check and award new achievements based on current progress
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can earn achievements' }, { status: 403 })
    }

    // Get student using singular model name
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { action, data } = body // action: 'question_answered', 'chapter_completed', 'test_completed', etc.

    // Get or create points record using camelCase model name
    let studentPoints = await prisma.studentPoints.findUnique({
      where: { studentId: student.id }
    })

    if (!studentPoints) {
      studentPoints = await prisma.studentPoints.create({
        data: {
          studentId: student.id,
          totalPoints: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0
        }
      })
    }

    // Get current stats for achievement checking
    const stats = await getStudentStats(student.id)
    
    // Get all achievements from DB using singular model name
    let dbAchievements = await prisma.achievement.findMany({
      where: { isActive: true }
    })

    // If no achievements in DB, we need to seed them first
    if (dbAchievements.length === 0) {
      // Seed achievements
      await seedAchievements()
      dbAchievements = await prisma.achievement.findMany({
        where: { isActive: true }
      })
    }

    // Check which achievements are newly earned
    const newlyEarned: { achievement: typeof dbAchievements[0]; earnedNow: boolean }[] = []

    for (const achievement of dbAchievements) {
      // Skip already earned achievements using camelCase model name
      const alreadyEarned = await prisma.studentAchievement.findUnique({
        where: {
          studentId_achievementId: {
            studentId: student.id,
            achievementId: achievement.id
          }
        }
      })

      if (alreadyEarned) continue

      // Check if achievement is earned
      const requirement = achievement.requirement as { type: string; count: number }
      const isEarned = checkRequirement(requirement, stats)

      if (isEarned) {
        // Award achievement using camelCase model name
        await prisma.studentAchievement.create({
          data: {
            studentId: student.id,
            achievementId: achievement.id,
            earnedAt: new Date(),
            isNew: true,
            currentProgress: requirement.count,
            targetProgress: requirement.count
          }
        })

        // Award points using camelCase model name
        await prisma.studentPoints.update({
          where: { studentId: student.id },
          data: {
            totalPoints: { increment: achievement.pointsValue },
            weeklyPoints: { increment: achievement.pointsValue },
            monthlyPoints: { increment: achievement.pointsValue }
          }
        })

        // Log points history using camelCase model name
        await prisma.pointsHistory.create({
          data: {
            studentId: student.id,
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
    if (action && data) {
      const count = stats.questionsAnswered || 1
      actionPoints = calculateActionPoints(action, count)

      if (actionPoints > 0) {
        await prisma.studentPoints.update({
          where: { studentId: student.id },
          data: {
            totalPoints: { increment: actionPoints },
            weeklyPoints: { increment: actionPoints },
            monthlyPoints: { increment: actionPoints }
          }
        })

        await prisma.pointsHistory.create({
          data: {
            studentId: student.id,
            points: actionPoints,
            reason: `Action: ${action}`,
            sourceType: action,
            sourceId: data?.questionId || data?.chapterId || data?.testId
          }
        })
      }
    }

    // Update streak
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
          where: { studentId: student.id },
          data: {
            currentStreak: { increment: 1 },
            longestStreak: Math.max(studentPoints.longestStreak, studentPoints.currentStreak + 1),
            lastActiveDate: new Date()
          }
        })
      } else if (daysDiff > 1) {
        // Streak broken
        await prisma.studentPoints.update({
          where: { studentId: student.id },
          data: {
            currentStreak: 1,
            lastActiveDate: new Date()
          }
        })
      }
    } else {
      // First activity
      await prisma.studentPoints.update({
        where: { studentId: student.id },
        data: {
          currentStreak: 1,
          lastActiveDate: new Date()
        }
      })
    }

    // Get updated points
    const updatedPoints = await prisma.studentPoints.findUnique({
      where: { studentId: student.id }
    })

    return NextResponse.json({
      success: true,
      pointsAwarded: actionPoints,
      newAchievements: newlyEarned.map(n => ({
        code: n.achievement.code,
        name: n.achievement.name,
        description: n.achievement.description,
        type: n.achievement.type,
        tier: n.achievement.tier,
        icon: n.achievement.icon,
        pointsValue: n.achievement.pointsValue
      })),
      currentPoints: updatedPoints?.totalPoints || 0,
      currentLevel: calculateLevel(updatedPoints?.totalPoints || 0).level,
      currentStreak: updatedPoints?.currentStreak || 0
    }, { status: 200 })

  } catch (error: any) {
    console.error('Check achievements error:', error)
    return NextResponse.json({ error: 'Failed to check achievements' }, { status: 500 })
  }
}

// Helper function to get student stats - using correct model names
async function getStudentStats(studentId: string) {
  // First get the student to access userId
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

// Helper function to seed achievements - using singular model name
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
