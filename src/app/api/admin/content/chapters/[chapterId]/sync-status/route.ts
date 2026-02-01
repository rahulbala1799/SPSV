import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/content/chapters/[chapterId]/sync-status
 * Check sync status of all questions in a chapter
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    await requireAdmin(request)

    const chapterId = params.chapterId

    // Get chapter with questions
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' }
        }
      }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Check sync status for each question
    const syncStatus = await Promise.all(
      chapter.questions.map(async (question) => {
        // Check if question exists in QuestionBank
        const inQuestionBank = await prisma.questionBank.findFirst({
          where: { sourceQuestionId: question.id }
        })

        // Check if question can be synced
        let canSync = true
        let syncError: string | null = null

        if (!chapter.isActive) {
          canSync = false
          syncError = 'Chapter is not active'
        } else {
          // Check category
          const questionCategory = question.category || chapter.category
          if (!questionCategory || 
              (questionCategory !== 'INDUSTRY_KNOWLEDGE' && questionCategory !== 'AREA_KNOWLEDGE')) {
            canSync = false
            syncError = `Invalid category: ${questionCategory || 'none'}`
          }

          // Check options format
          const options = question.options as Array<{ id: string; text: string }>
          if (!Array.isArray(options) || options.length < 4) {
            canSync = false
            syncError = `Invalid options format: ${Array.isArray(options) ? `only ${options.length} options` : 'not an array'}`
          }
        }

        return {
          questionId: question.id,
          questionNumber: question.questionNumber,
          questionText: question.questionText.substring(0, 50) + '...',
          isInQuestionBank: !!inQuestionBank,
          questionBankId: inQuestionBank?.id || null,
          questionBankActive: inQuestionBank?.isActive || false,
          canSync,
          syncError,
          category: question.category || chapter.category,
          optionsCount: Array.isArray(question.options) ? question.options.length : 0
        }
      })
    )

    const summary = {
      totalQuestions: chapter.questions.length,
      inQuestionBank: syncStatus.filter(s => s.isInQuestionBank).length,
      activeInQuestionBank: syncStatus.filter(s => s.questionBankActive).length,
      canSync: syncStatus.filter(s => s.canSync).length,
      cannotSync: syncStatus.filter(s => !s.canSync).length,
      chapterActive: chapter.isActive,
      chapterCategory: chapter.category
    }

    return NextResponse.json({
      success: true,
      chapter: {
        id: chapter.id,
        title: chapter.title,
        isActive: chapter.isActive,
        category: chapter.category
      },
      summary,
      questions: syncStatus
    })
  } catch (error: any) {
    console.error('Error checking sync status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check sync status' },
      { status: 500 }
    )
  }
}
