import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncSingleQuestion } from '@/lib/questionBankSyncFast'

/**
 * GET /api/admin/questions
 * Get all questions organized by chapters
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('q')
    const chapterIdFilter = searchParams.get('chapterId')
    const categoryFilter = searchParams.get('category')
    const difficultyFilter = searchParams.get('difficulty')
    const activeFilter = searchParams.get('isActive')

    // Build where clause for chapters
    const chapterWhere: any = {}
    if (chapterIdFilter) {
      chapterWhere.id = chapterIdFilter
    }
    if (categoryFilter) {
      chapterWhere.category = categoryFilter
    }
    if (activeFilter !== null && activeFilter !== undefined) {
      chapterWhere.isActive = activeFilter === 'true'
    }

    // Fetch all chapters with their questions
    const chapters = await prisma.chapter.findMany({
      where: chapterWhere,
      include: {
        questions: {
          where: searchQuery
            ? {
                OR: [
                  { questionText: { contains: searchQuery, mode: 'insensitive' } },
                  { explanation: { contains: searchQuery, mode: 'insensitive' } },
                ],
                ...(difficultyFilter && { difficulty: difficultyFilter }),
              }
            : difficultyFilter
            ? { difficulty: difficultyFilter }
            : {},
          orderBy: {
            questionNumber: 'asc',
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        chapterNumber: 'asc',
      },
    })

    // Format the response
    const formattedChapters = chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      chapterNumber: chapter.chapterNumber,
      type: chapter.type,
      category: chapter.category,
      duration: chapter.duration,
      isActive: chapter.isActive,
      questionCount: chapter._count.questions,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      questions: chapter.questions.map((question) => ({
        id: question.id,
        questionText: question.questionText,
        questionNumber: question.questionNumber,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
        points: question.points,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
    }))

    const totalQuestions = formattedChapters.reduce(
      (sum, ch) => sum + ch.questionCount,
      0
    )

    return NextResponse.json({
      success: true,
      chapters: formattedChapters,
      totalQuestions,
    })
  } catch (error: any) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

/**
 * POST /api/admin/questions
 * Create a new question
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
      difficulty,
      points,
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
      return NextResponse.json(
        { error: 'Options must be an array of 4 items' },
        { status: 400 }
      )
    }

    // Validate correct answer is A, B, C, or D
    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      return NextResponse.json(
        { error: 'Correct answer must be A, B, C, or D' },
        { status: 400 }
      )
    }

    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Get the next question number for this chapter
    const lastQuestion = await prisma.question.findFirst({
      where: { chapterId },
      orderBy: { questionNumber: 'desc' },
    })

    const questionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1

    // Determine category (use provided or inherit from chapter)
    const questionCategory = category || chapter.category

    // Create the question
    const question = await prisma.question.create({
      data: {
        chapterId,
        questionText,
        questionNumber,
        options,
        correctAnswer,
        explanation: explanation || null,
        difficulty: difficulty || 'medium',
        points: points || 1,
        category: questionCategory,
      },
    })

    // Auto-sync to QuestionBank if chapter is active (fast single-question sync)
    if (chapter.isActive) {
      try {
        await syncSingleQuestion(question.id)
      } catch (syncError) {
        console.error('Error syncing to QuestionBank:', syncError)
        // Don't fail the request if sync fails
      }
    }

    return NextResponse.json({
      success: true,
      question,
      message: 'Question created successfully',
    })
  } catch (error: any) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create question' },
      { status: 500 }
    )
  }
}
