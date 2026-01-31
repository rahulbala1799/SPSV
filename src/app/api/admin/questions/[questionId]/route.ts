import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncSingleQuestion, deactivateQuestionInBank } from '@/lib/questionBankSyncFast'

/**
 * GET /api/admin/questions/[questionId]
 * Get a single question by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    await requireAdmin(request)

    const question = await prisma.question.findUnique({
      where: { id: params.questionId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            category: true,
            isActive: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      question,
    })
  } catch (error: any) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch question' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

/**
 * PATCH /api/admin/questions/[questionId]
 * Update a question
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const {
      questionText,
      options,
      correctAnswer,
      explanation,
      difficulty,
      points,
      category,
    } = body

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id: params.questionId },
      include: { chapter: true },
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Validate options if provided
    if (options && (!Array.isArray(options) || options.length !== 4)) {
      return NextResponse.json(
        { error: 'Options must be an array of 4 items' },
        { status: 400 }
      )
    }

    // Validate correct answer if provided
    if (correctAnswer && !['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      return NextResponse.json(
        { error: 'Correct answer must be A, B, C, or D' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (questionText !== undefined) updateData.questionText = questionText
    if (options !== undefined) updateData.options = options
    if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer
    if (explanation !== undefined) updateData.explanation = explanation
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (points !== undefined) updateData.points = points
    if (category !== undefined) updateData.category = category

    // Update the question
    const updatedQuestion = await prisma.question.update({
      where: { id: params.questionId },
      data: updateData,
    })

    // Auto-sync to QuestionBank if chapter is active (fast single-question sync)
    if (existingQuestion.chapter.isActive) {
      try {
        await syncSingleQuestion(params.questionId)
      } catch (syncError) {
        console.error('Error syncing to QuestionBank:', syncError)
        // Don't fail the request if sync fails
      }
    }

    return NextResponse.json({
      success: true,
      question: updatedQuestion,
      message: 'Question updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update question' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/questions/[questionId]
 * Delete a question
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    await requireAdmin(request)

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id: params.questionId },
      include: { chapter: true },
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Delete the question (cascade deletes related records)
    await prisma.question.delete({
      where: { id: params.questionId },
    })

    // Deactivate corresponding QuestionBank entry (fast lookup by sourceQuestionId)
    if (existingQuestion.chapter.isActive) {
      try {
        await deactivateQuestionInBank(params.questionId)
      } catch (syncError) {
        console.error('Error deactivating in QuestionBank:', syncError)
        // Don't fail the request if sync fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete question' },
      { status: 500 }
    )
  }
}
