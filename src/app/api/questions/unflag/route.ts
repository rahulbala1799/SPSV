import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/questions/unflag
 * Unflag a question (only allowed for Question model, not QuestionBank)
 * Only works from chapter context
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { questionId } = body

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required' },
        { status: 400 }
      )
    }

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Find active flag
    const flag = await prisma.flaggedQuestion.findFirst({
      where: {
        studentId: student.id,
        questionId,
        isActive: true,
      },
    })

    if (!flag) {
      return NextResponse.json({
        success: true,
        unflagged: false,
        message: 'Question is not flagged',
      })
    }

    // Soft delete by setting isActive to false
    await prisma.flaggedQuestion.update({
      where: { id: flag.id },
      data: {
        isActive: false,
        unflaggedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      unflagged: true,
      message: 'Question unflagged successfully',
    })
  } catch (error: any) {
    console.error('Error unflagging question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to unflag question' },
      { status: 500 }
    )
  }
}
