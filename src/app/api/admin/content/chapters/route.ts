import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncChapterQuestions } from '@/lib/questionBankSyncFast'

/**
 * GET /api/admin/content/chapters
 * Get all chapters with their questions
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const includeQuestions = searchParams.get('includeQuestions') === 'true'

    const chapters = await prisma.chapter.findMany({
      include: {
        questions: includeQuestions
          ? {
              orderBy: {
                questionNumber: 'asc',
              },
            }
          : false,
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
      ...(includeQuestions && {
        questions: chapter.questions.map((q: any) => ({
          id: q.id,
          questionText: q.questionText,
          questionNumber: q.questionNumber,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          points: q.points,
          createdAt: q.createdAt,
        })),
      }),
    }))

    return NextResponse.json({
      success: true,
      chapters: formattedChapters,
    })
  } catch (error: any) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chapters' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/content/chapters
 * Create a new chapter
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const {
      title,
      description,
      chapterNumber,
      type = 'MCQ',
      category,
      duration,
      isActive = false,
    } = body

    if (!title || !chapterNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: title, chapterNumber' },
        { status: 400 }
      )
    }

    const chapter = await prisma.chapter.create({
      data: {
        title,
        description: description || null,
        chapterNumber,
        type,
        category,
        duration: duration || 30,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      chapter,
      message: `Chapter "${title}" created successfully${isActive ? ' and is now visible to students' : ''}`,
    })
  } catch (error: any) {
    console.error('Error creating chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create chapter' },
      { status: 500 }
    )
  }
}
