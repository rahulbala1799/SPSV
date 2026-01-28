import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * POST /api/student/assigned-tests/[id]/start
 * Start an assigned test (creates attempt)
 */
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

    // Check if test is assigned to this student
    const assignment = await prisma.assignedTestStudent.findUnique({
      where: {
        testId_studentId: {
          testId: params.id,
          studentId
        }
      },
      include: {
        test: true
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Test not assigned to you' },
        { status: 403 }
      )
    }

    // Check if already completed
    if (assignment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Test already completed' },
        { status: 400 }
      )
    }

    // Create attempt and update assignment in transaction
    const attempt = await prisma.$transaction(async (tx) => {
      // Create the attempt
      const newAttempt = await tx.assignedTestAttempt.create({
        data: {
          testId: params.id,
          studentId,
          totalQuestions: assignment.test.questionCount,
          startedAt: new Date()
        }
      })

      // Update assignment status
      await tx.assignedTestStudent.update({
        where: {
          testId_studentId: {
            testId: params.id,
            studentId
          }
        },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      })

      return newAttempt
    })

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        testId: attempt.testId,
        startedAt: attempt.startedAt
      }
    })
  } catch (error: any) {
    console.error('Error starting test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start test' },
      { status: 500 }
    )
  }
}
