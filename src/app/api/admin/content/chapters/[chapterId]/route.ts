import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncChapterQuestions, deactivateChapterQuestions } from '@/lib/questionBankSyncFast'

/**
 * PATCH /api/admin/content/chapters/[chapterId]
 * Update a chapter (automatically syncs to QuestionBank if active)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const chapterId = params.chapterId

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const wasActive = chapter.isActive
    const willBeActive = body.isActive !== undefined ? body.isActive : wasActive

    // Update chapter
    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: body,
    })

    // Handle QuestionBank sync based on visibility change
    if (willBeActive && !wasActive) {
      // Chapter was just made active - sync all questions to QuestionBank
      try {
        await syncChapterQuestions(chapterId)
        console.log(`✅ Synced all questions for chapter "${updatedChapter.title}" to QuestionBank`)
      } catch (syncError) {
        console.error('Error syncing chapter questions:', syncError)
      }
    } else if (!willBeActive && wasActive) {
      // Chapter was just deactivated - remove all questions from QuestionBank
      try {
        await deactivateChapterQuestions(chapterId)
        console.log(`🗑️ Deactivated all questions for chapter "${updatedChapter.title}" from QuestionBank`)
      } catch (syncError) {
        console.error('Error deactivating chapter questions:', syncError)
      }
    }

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      message: willBeActive
        ? 'Chapter updated and visible to students'
        : 'Chapter updated and hidden from students',
    })
  } catch (error: any) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/content/chapters/[chapterId]
 * Delete a chapter and all its questions
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    await requireAdmin(request)

    const chapterId = params.chapterId

    // First, deactivate all questions in QuestionBank
    try {
      await deactivateChapterQuestions(chapterId)
    } catch (syncError) {
      console.error('Error deactivating chapter questions:', syncError)
    }

    // Delete the chapter (cascade will delete questions due to schema)
    await prisma.chapter.delete({
      where: { id: chapterId },
    })

    return NextResponse.json({
      success: true,
      message: 'Chapter and all its questions deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
