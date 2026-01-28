import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * GET /api/student/assigned-tests
 * Get all tests assigned to the current student
 */
export async function GET(request: NextRequest) {
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

    // Fetch assigned tests
    const assignments = await prisma.assignedTestStudent.findMany({
      where: {
        studentId
      },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            description: true,
            questionCount: true,
            isTimed: true,
            timeLimitMinutes: true,
            dueDate: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // NOT_STARTED first, then IN_PROGRESS, then COMPLETED
        { assignedAt: 'desc' }
      ]
    })

    // Format response
    const tests = assignments.map(assignment => ({
      id: assignment.test.id,
      title: assignment.test.title,
      description: assignment.test.description,
      questionCount: assignment.test.questionCount,
      isTimed: assignment.test.isTimed,
      timeLimitMinutes: assignment.test.timeLimitMinutes,
      dueDate: assignment.test.dueDate,
      testStatus: assignment.test.status,
      assignedAt: assignment.assignedAt,
      status: assignment.status,
      startedAt: assignment.startedAt,
      completedAt: assignment.completedAt,
      score: assignment.score,
      correctAnswers: assignment.correctAnswers
    }))

    return NextResponse.json({
      success: true,
      tests
    })
  } catch (error: any) {
    console.error('Error fetching assigned tests:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assigned tests' },
      { status: 500 }
    )
  }
}
