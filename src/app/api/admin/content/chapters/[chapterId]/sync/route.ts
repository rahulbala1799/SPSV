import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncChapterQuestions } from '@/lib/questionBankSyncFast'

/**
 * POST /api/admin/content/chapters/[chapterId]/sync
 * Manually sync all questions in a chapter to QuestionBank
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    await requireAdmin(request)

    const chapterId = params.chapterId

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        title: true,
        isActive: true
      }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Sync all questions in the chapter
    const result = await syncChapterQuestions(chapterId)

    return NextResponse.json({
      success: true,
      created: result.created,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors,
      questionsProcessed: result.questionsProcessed,
      duration: result.duration,
      message: `Synced ${result.created + result.updated} questions for "${chapter.title}"`
    })
  } catch (error: any) {
    console.error('Error syncing chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync chapter' },
      { status: 500 }
    )
  }
}
