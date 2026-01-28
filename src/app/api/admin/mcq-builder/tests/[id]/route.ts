import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/mcq-builder/tests/[id]
 * Get detailed test information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const test = await prisma.assignedMCQTest.findUnique({
      where: { id: params.id },
      include: {
        testQuestions: {
          include: {
            question: {
              include: {
                chapter: {
                  select: {
                    id: true,
                    title: true,
                    chapterNumber: true
                  }
                }
              }
            }
          },
          orderBy: {
            questionOrder: 'asc'
          }
        },
        studentAssignments: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Format questions
    const questions = test.testQuestions.map(tq => ({
      id: tq.question.id,
      questionText: tq.question.questionText,
      questionNumber: tq.question.questionNumber,
      questionOrder: tq.questionOrder,
      options: tq.question.options,
      correctAnswer: tq.question.correctAnswer,
      explanation: tq.question.explanation,
      category: tq.question.category,
      difficulty: tq.question.difficulty,
      points: tq.question.points,
      chapter: tq.question.chapter
    }))

    // Format students
    const students = test.studentAssignments.map(sa => ({
      id: sa.student.id,
      name: sa.student.user.name,
      email: sa.student.user.email,
      status: sa.status,
      assignedAt: sa.assignedAt,
      startedAt: sa.startedAt,
      completedAt: sa.completedAt,
      score: sa.score,
      correctAnswers: sa.correctAnswers
    }))

    // Calculate statistics
    const completedStudents = students.filter(s => s.status === 'COMPLETED')
    const statistics = {
      totalAssigned: students.length,
      completed: completedStudents.length,
      inProgress: students.filter(s => s.status === 'IN_PROGRESS').length,
      notStarted: students.filter(s => s.status === 'NOT_STARTED').length,
      averageScore: completedStudents.length > 0
        ? completedStudents.reduce((sum, s) => sum + (s.score || 0), 0) / completedStudents.length
        : null
    }

    return NextResponse.json({
      success: true,
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        questionCount: test.questionCount,
        isTimed: test.isTimed,
        timeLimitMinutes: test.timeLimitMinutes,
        status: test.status,
        dueDate: test.dueDate,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        questions,
        students,
        statistics
      }
    })
  } catch (error: any) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch test' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

/**
 * PATCH /api/admin/mcq-builder/tests/[id]
 * Update test (only if no students have started)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)
    const body = await request.json()

    // Check if any student has started the test
    const startedAssignments = await prisma.assignedTestStudent.findFirst({
      where: {
        testId: params.id,
        status: {
          in: ['IN_PROGRESS', 'COMPLETED']
        }
      }
    })

    if (startedAssignments) {
      return NextResponse.json(
        { error: 'Cannot edit test after students have started taking it' },
        { status: 400 }
      )
    }

    const {
      title,
      description,
      questionCount,
      isTimed,
      timeLimitMinutes,
      dueDate,
      status,
      questionIds,
      studentIds
    } = body

    // Build update data
    const updateData: any = {}
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim()
    if (questionCount !== undefined) updateData.questionCount = questionCount
    if (isTimed !== undefined) updateData.isTimed = isTimed
    if (timeLimitMinutes !== undefined) updateData.timeLimitMinutes = isTimed ? timeLimitMinutes : null
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (status !== undefined) updateData.status = status

    // Update test in transaction
    const updatedTest = await prisma.$transaction(async (tx) => {
      // Update test
      const test = await tx.assignedMCQTest.update({
        where: { id: params.id },
        data: updateData
      })

      // If questions changed, update them
      if (questionIds) {
        // Delete existing questions
        await tx.assignedTestQuestion.deleteMany({
          where: { testId: params.id }
        })

        // Create new questions
        const testQuestions = questionIds.map((questionId: string, index: number) => ({
          testId: params.id,
          questionId,
          questionOrder: index + 1
        }))

        await tx.assignedTestQuestion.createMany({
          data: testQuestions
        })
      }

      // If students changed, update them
      if (studentIds) {
        // Delete existing assignments
        await tx.assignedTestStudent.deleteMany({
          where: { testId: params.id }
        })

        // Create new assignments
        const studentAssignments = studentIds.map((studentId: string) => ({
          testId: params.id,
          studentId,
          status: 'NOT_STARTED' as const
        }))

        await tx.assignedTestStudent.createMany({
          data: studentAssignments
        })
      }

      return test
    })

    return NextResponse.json({
      success: true,
      test: updatedTest
    })
  } catch (error: any) {
    console.error('Error updating test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update test' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

/**
 * DELETE /api/admin/mcq-builder/tests/[id]
 * Delete test
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    // Delete test (cascade will handle related records)
    await prisma.assignedMCQTest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Test deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete test' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}
