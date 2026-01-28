import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/mcq-builder/questions
 * Get all questions organized by chapters for test creation
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    // Fetch all chapters with their questions
    const chapters = await prisma.chapter.findMany({
      where: {
        isActive: true
      },
      include: {
        questions: {
          orderBy: {
            questionNumber: 'asc'
          }
        }
      },
      orderBy: {
        chapterNumber: 'asc'
      }
    })

    // Format the response
    const formattedChapters = chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      chapterNumber: chapter.chapterNumber,
      description: chapter.description,
      category: chapter.category,
      questionCount: chapter.questions.length,
      questions: chapter.questions.map(question => ({
        id: question.id,
        questionText: question.questionText,
        questionNumber: question.questionNumber,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
        points: question.points
      }))
    }))

    const totalQuestions = formattedChapters.reduce((sum, ch) => sum + ch.questionCount, 0)

    return NextResponse.json({
      success: true,
      chapters: formattedChapters,
      totalQuestions
    })
  } catch (error: any) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}
