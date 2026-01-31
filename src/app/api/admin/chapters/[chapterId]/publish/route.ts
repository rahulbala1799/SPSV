import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncQuestionsToQuestionBank } from '@/lib/questionBankSync'

/**
 * POST /api/admin/chapters/[chapterId]/publish
 * Publish a chapter (make it active and sync questions to QuestionBank)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    await requireAdmin(request)

    // Check if chapter exists
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    })

    if (!existingChapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Check if chapter has questions
    if (existingChapter._count.questions === 0) {
      return NextResponse.json(
        { error: 'Cannot publish chapter without questions' },
        { status: 400 }
      )
    }

    // Check if chapter has category
    if (!existingChapter.category) {
      return NextResponse.json(
        { error: 'Chapter must have a category before publishing' },
        { status: 400 }
      )
    }

    // Set chapter as active
    const updatedChapter = await prisma.chapter.update({
      where: { id: params.chapterId },
      data: { isActive: true },
    })

    // Sync all questions to QuestionBank
    let syncResult
    try {
      syncResult = await syncQuestionsToQuestionBank([params.chapterId])
    } catch (syncError) {
      console.error('Error syncing to QuestionBank:', syncError)
      return NextResponse.json(
        {
          error: 'Chapter published but sync to QuestionBank failed',
          details: syncError instanceof Error ? syncError.message : 'Unknown error',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      sync: syncResult,
      message: 'Chapter published successfully',
    })
  } catch (error: any) {
    console.error('Error publishing chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to publish chapter' },
      { status: 500 }
    )
  }
}
