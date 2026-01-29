import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and student profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    })

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const studentId = user.studentProfile.id

    const body = await request.json()
    const { attemptId, timeRemaining } = body

    // Verify attempt belongs to student and test
    const attempt = await prisma.assignedTestAttempt.findFirst({
      where: {
        id: attemptId,
        testId: params.id,
        studentId,
        completedAt: null
      },
      include: {
        test: true
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found or already completed' },
        { status: 404 }
      )
    }

    // Get assignment
    const assignment = await prisma.assignedTestStudent.findUnique({
      where: {
        testId_studentId: {
          testId: params.id,
          studentId
        }
      }
    })

    if (!assignment || assignment.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Test is not in progress' },
        { status: 400 }
      )
    }

    // Update attempt and assignment to paused status
    await prisma.$transaction(async (tx) => {
      await tx.assignedTestAttempt.update({
        where: { id: attemptId },
        data: {
          pausedAt: new Date(),
          timeSpentSeconds: attempt.test.isTimed && timeRemaining
            ? (attempt.test.timeLimitMinutes! * 60) - timeRemaining
            : attempt.timeSpentSeconds
        }
      })

      await tx.assignedTestStudent.update({
        where: {
          testId_studentId: {
            testId: params.id,
            studentId
          }
        },
        data: {
          status: 'PAUSED'
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Test paused successfully'
    })
  } catch (error: any) {
    console.error('Error pausing test:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
