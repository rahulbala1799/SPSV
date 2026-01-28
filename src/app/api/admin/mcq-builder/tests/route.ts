import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/mcq-builder/tests
 * Get all created MCQ tests with statistics
 */
export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get total count
    const total = await prisma.assignedMCQTest.count({ where })

    // Fetch tests with statistics
    const tests = await prisma.assignedMCQTest.findMany({
      where,
      include: {
        studentAssignments: {
          select: {
            id: true,
            status: true,
            score: true,
            completedAt: true
          }
        },
        testQuestions: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                chapterId: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Format response with statistics
    const formattedTests = tests.map(test => {
      const assignedCount = test.studentAssignments.length
      const completedAssignments = test.studentAssignments.filter(a => a.status === 'COMPLETED')
      const completedCount = completedAssignments.length
      const averageScore = completedAssignments.length > 0
        ? completedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssignments.length
        : null

      return {
        id: test.id,
        title: test.title,
        description: test.description,
        questionCount: test.questionCount,
        isTimed: test.isTimed,
        timeLimitMinutes: test.timeLimitMinutes,
        status: test.status,
        dueDate: test.dueDate,
        assignedStudentsCount: assignedCount,
        completedCount,
        inProgressCount: test.studentAssignments.filter(a => a.status === 'IN_PROGRESS').length,
        notStartedCount: test.studentAssignments.filter(a => a.status === 'NOT_STARTED').length,
        averageScore: averageScore ? Math.round(averageScore) : null,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      }
    })

    return NextResponse.json({
      success: true,
      tests: formattedTests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tests' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

/**
 * POST /api/admin/mcq-builder/tests
 * Create a new MCQ test
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request)
    const body = await request.json()

    const {
      title,
      description,
      questionCount,
      isTimed,
      timeLimitMinutes,
      dueDate,
      questionIds,
      studentIds,
      status = 'ACTIVE'
    } = body

    // Validation
    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Test title must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (!questionCount || questionCount < 1 || questionCount > 100) {
      return NextResponse.json(
        { error: 'Question count must be between 1 and 100' },
        { status: 400 }
      )
    }

    if (!questionIds || questionIds.length !== questionCount) {
      return NextResponse.json(
        { error: `You must select exactly ${questionCount} questions` },
        { status: 400 }
      )
    }

    if (!studentIds || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'You must select at least one student' },
        { status: 400 }
      )
    }

    if (isTimed && (!timeLimitMinutes || timeLimitMinutes < 5 || timeLimitMinutes > 180)) {
      return NextResponse.json(
        { error: 'Time limit must be between 5 and 180 minutes for timed tests' },
        { status: 400 }
      )
    }

    // Verify all questions exist
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds
        }
      }
    })

    if (questions.length !== questionIds.length) {
      return NextResponse.json(
        { error: 'Some selected questions do not exist' },
        { status: 400 }
      )
    }

    // Verify all students exist
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds
        }
      }
    })

    if (students.length !== studentIds.length) {
      return NextResponse.json(
        { error: 'Some selected students do not exist' },
        { status: 400 }
      )
    }

    // Create test with questions and student assignments in a transaction
    const test = await prisma.$transaction(async (tx) => {
      // Create the test
      const newTest = await tx.assignedMCQTest.create({
        data: {
          title: title.trim(),
          description: description?.trim(),
          questionCount,
          isTimed,
          timeLimitMinutes: isTimed ? timeLimitMinutes : null,
          dueDate: dueDate ? new Date(dueDate) : null,
          status,
          createdBy: adminUser.id
        }
      })

      // Create test questions
      const testQuestions = questionIds.map((questionId: string, index: number) => ({
        testId: newTest.id,
        questionId,
        questionOrder: index + 1
      }))

      await tx.assignedTestQuestion.createMany({
        data: testQuestions
      })

      // Create student assignments
      const studentAssignments = studentIds.map((studentId: string) => ({
        testId: newTest.id,
        studentId,
        status: 'NOT_STARTED' as const
      }))

      await tx.assignedTestStudent.createMany({
        data: studentAssignments
      })

      return newTest
    })

    return NextResponse.json({
      success: true,
      test: {
        id: test.id,
        title: test.title,
        questionCount: test.questionCount,
        isTimed: test.isTimed,
        timeLimitMinutes: test.timeLimitMinutes,
        status: test.status,
        createdAt: test.createdAt
      }
    })
  } catch (error: any) {
    console.error('Error creating test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create test' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}
