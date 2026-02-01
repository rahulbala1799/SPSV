import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncSingleQuestion } from '@/lib/questionBankSyncFast'

/**
 * POST /api/admin/content/questions
 * Create a new question (automatically syncs to QuestionBank if chapter is active)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const {
      chapterId,
      questionText,
      options,
      correctAnswer,
      explanation,
      difficulty = 'MEDIUM',
      points = 10,
      category,
    } = body

    // Validation
    if (!chapterId || !questionText || !options || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields: chapterId, questionText, options, correctAnswer' },
        { status: 400 }
      )
    }

    // Validate options format
    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json({ error: 'Options must be an array of 4 items' }, { status: 400 })
    }

    // Validate correct answer
    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      return NextResponse.json({ error: 'Correct answer must be A, B, C, or D' }, { status: 400 })
    }

    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    // Get the next question number
    const lastQuestion = await prisma.question.findFirst({
      where: { chapterId },
      orderBy: { questionNumber: 'desc' },
    })

    const questionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1

    // Create the question
    const question = await prisma.question.create({
      data: {
        chapterId,
        questionText,
        questionNumber,
        options,
        correctAnswer,
        explanation: explanation || null,
        difficulty,
        points,
        category: category || chapter.category,
      },
    })

    // Auto-sync to QuestionBank if chapter is active
    let syncResult = null
    let syncError = null
    if (chapter.isActive) {
      try {
        syncResult = await syncSingleQuestion(question.id)
        console.log(`✅ Auto-synced question to QuestionBank`, syncResult)
      } catch (error: any) {
        syncError = error.message || 'Unknown sync error'
        console.error('Error syncing question:', error)
        // Don't fail the request, but return sync status
      }
    }

    return NextResponse.json({
      success: true,
      question,
      syncResult,
      syncError,
      message: chapter.isActive
        ? syncResult?.skipped
          ? `Question created but sync skipped: ${syncResult.reason || 'Unknown reason'}`
          : syncError
          ? `Question created but sync failed: ${syncError}. Please re-sync manually.`
          : 'Question created and added to student tests'
        : 'Question created (will appear in tests when chapter is published)',
    })
  } catch (error: any) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create question' },
      { status: 500 }
    )
  }
}
