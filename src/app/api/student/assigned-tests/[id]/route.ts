import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * GET /api/student/assigned-tests/[id]
 * Get test details for taking the test
 */
export async function GET(
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
        test: {
          include: {
            testQuestions: {
              include: {
                question: true
              },
              orderBy: {
                questionOrder: 'asc'
              }
            }
          }
        }
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Test not assigned to you' },
        { status: 403 }
      )
    }

    // Format questions (hide correct answers)
    const questions = assignment.test.testQuestions.map(tq => ({
      id: tq.question.id,
      questionText: tq.question.questionText,
      questionOrder: tq.questionOrder,
      options: tq.question.options,
      explanation: null // Don't show explanation until completed
    }))

    // Get attempt ID if test is in progress
    let attemptId = null
    if (assignment.status === 'IN_PROGRESS') {
      const attempt = await prisma.assignedTestAttempt.findFirst({
        where: {
          testId: params.id,
          studentId,
          completedAt: null
        },
        orderBy: {
          startedAt: 'desc'
        }
      })
      if (attempt) {
        attemptId = attempt.id
      }
    }

    return NextResponse.json({
      success: true,
      test: {
        id: assignment.test.id,
        title: assignment.test.title,
        description: assignment.test.description,
        questionCount: assignment.test.questionCount,
        isTimed: assignment.test.isTimed,
        timeLimitMinutes: assignment.test.timeLimitMinutes,
        dueDate: assignment.test.dueDate,
        questions,
        studentStatus: {
          status: assignment.status,
          startedAt: assignment.startedAt,
          completedAt: assignment.completedAt,
          score: assignment.score
        },
        attemptId
      }
    })
  } catch (error: any) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch test' },
      { status: 500 }
    )
  }
}
