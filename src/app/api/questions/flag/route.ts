import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/questions/flag
 * Flag a question from any context (chapters, timed tests, untimed tests, assigned tests)
 * Handles deduplication automatically
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
    const { questionId, questionBankId, flaggedFrom } = body

    // Validate input
    if (!questionId && !questionBankId) {
      return NextResponse.json(
        { error: 'Either questionId or questionBankId must be provided' },
        { status: 400 }
      )
    }

    if (questionId && questionBankId) {
      return NextResponse.json(
        { error: 'Cannot provide both questionId and questionBankId' },
        { status: 400 }
      )
    }

    if (!flaggedFrom || !['CHAPTER', 'TIMED_TEST', 'UNTIMED_TEST', 'ASSIGNED_TEST'].includes(flaggedFrom)) {
      return NextResponse.json(
        { error: 'Invalid flaggedFrom value' },
        { status: 400 }
      )
    }

    // Verify question/questionBank exists
    if (questionId) {
      const question = await prisma.question.findUnique({
        where: { id: questionId }
      })
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        )
      }
    } else {
      const questionBank = await prisma.questionBank.findUnique({
        where: { id: questionBankId }
      })
      if (!questionBank) {
        return NextResponse.json(
          { error: 'Question bank item not found' },
          { status: 404 }
        )
      }
    }

    // Build where clause for checking existing flag
    const whereClause: any = {
      studentId: student.id,
      isActive: true,
    }
    
    if (questionId) {
      whereClause.questionId = questionId
      whereClause.questionBankId = null
    } else {
      whereClause.questionId = null
      whereClause.questionBankId = questionBankId
    }

    // Check for existing active flag
    const existingFlag = await prisma.flaggedQuestion.findFirst({
      where: whereClause,
    })

    if (existingFlag) {
      // Already flagged - return success but don't create duplicate
      return NextResponse.json({
        success: true,
        flagged: false,
        flagId: existingFlag.id,
        message: 'Question is already flagged',
      })
    }

    // Create new flag
    try {
      const flag = await prisma.flaggedQuestion.create({
        data: {
          studentId: student.id,
          questionId: questionId || null,
          questionBankId: questionBankId || null,
          flaggedFrom,
          isActive: true,
        },
      })

      return NextResponse.json({
        success: true,
        flagged: true,
        flagId: flag.id,
        message: 'Question flagged successfully',
      })
    } catch (error: any) {
      // Handle unique constraint violation (safety net)
      if (error.code === 'P2002') {
        // Duplicate entry - query to get existing flag
        const existingFlag = await prisma.flaggedQuestion.findFirst({
          where: whereClause,
        })
        
        return NextResponse.json({
          success: true,
          flagged: false,
          flagId: existingFlag?.id || '',
          message: 'Question is already flagged',
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Error flagging question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to flag question' },
      { status: 500 }
    )
  }
}
