import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncSingleQuestion, deactivateQuestionInBank } from '@/lib/questionBankSyncFast'

/**
 * PATCH /api/admin/content/questions/[questionId]
 * Update a question (automatically syncs to QuestionBank if chapter is active)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const questionId = params.questionId

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { chapter: true },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Update the question
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: body,
    })

    // Auto-sync to QuestionBank if chapter is active
    if (question.chapter.isActive) {
      try {
        await syncSingleQuestion(questionId)
        console.log(`✅ Auto-synced updated question to QuestionBank`)
      } catch (syncError) {
        console.error('Error syncing question:', syncError)
      }
    }

    return NextResponse.json({
      success: true,
      question: updatedQuestion,
      message: question.chapter.isActive
        ? 'Question updated everywhere (student view + tests)'
        : 'Question updated',
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
 * DELETE /api/admin/content/questions/[questionId]
 * Delete a question (automatically removes from QuestionBank)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    await requireAdmin(request)

    const questionId = params.questionId

    // Deactivate in QuestionBank first
    try {
      await deactivateQuestionInBank(questionId)
      console.log(`✅ Removed question from QuestionBank`)
    } catch (syncError) {
      console.error('Error deactivating question:', syncError)
    }

    // Delete the question
    await prisma.question.delete({
      where: { id: questionId },
    })

    return NextResponse.json({
      success: true,
      message: 'Question deleted from everywhere (student view + tests)',
    })
  } catch (error: any) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete question' },
      { status: 500 }
    )
  }
}
