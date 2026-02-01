import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { backfillStudentAchievements } from '@/lib/achievements-backfill'

export const dynamic = 'force-dynamic'

// POST - Backfill achievements for current student
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can backfill achievements' }, { status: 403 })
    }

    // Get student
    const { prisma } = await import('@/lib/prisma')
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    // Backfill achievements
    const result = await backfillStudentAchievements(student.id)

    return NextResponse.json({
      success: true,
      achievementsAwarded: result.achievementsAwarded,
      pointsAwarded: result.pointsAwarded,
      message: `Awarded ${result.achievementsAwarded} achievements and ${result.pointsAwarded} points!`
    }, { status: 200 })

  } catch (error: any) {
    console.error('Backfill achievements error:', error)
    return NextResponse.json({ error: 'Failed to backfill achievements' }, { status: 500 })
  }
}
