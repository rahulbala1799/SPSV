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

    // Get assignment
    const assignment = await prisma.assignedTestStudent.findUnique({
      where: {
        testId_studentId: {
          testId: params.id,
          studentId
        }
      }
    })

    if (!assignment || assignment.status !== 'PAUSED') {
      return NextResponse.json(
        { error: 'Test is not paused' },
        { status: 400 }
      )
    }

    // Get the paused attempt
    const attempt = await prisma.assignedTestAttempt.findFirst({
      where: {
        testId: params.id,
        studentId,
        completedAt: null,
        pausedAt: { not: null }
      },
      orderBy: {
        startedAt: 'desc'
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Paused attempt not found' },
        { status: 404 }
      )
    }

    // Resume attempt and assignment
    await prisma.$transaction(async (tx) => {
      await tx.assignedTestAttempt.update({
        where: { id: attempt.id },
        data: {
          pausedAt: null
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
          status: 'IN_PROGRESS'
        }
      })
    })

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      message: 'Test resumed successfully'
    })
  } catch (error: any) {
    console.error('Error resuming test:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
