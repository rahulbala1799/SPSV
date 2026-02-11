import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/questions/[questionId]
 * Get question details including options, correct answer, and explanation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    await requireAdmin(request)

    const questionId = params.questionId

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            chapterNumber: true
          }
        }
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: question.id,
      questionText: question.questionText,
      questionNumber: question.questionNumber,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      category: question.category,
      difficulty: question.difficulty,
      points: question.points,
      chapter: question.chapter ? {
        id: question.chapter.id,
        title: question.chapter.title,
        chapterNumber: question.chapter.chapterNumber
      } : null
    })
  } catch (error: any) {
    console.error('Error fetching question details:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch question details' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}
