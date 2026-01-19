import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const answerSchema = z.object({
  chapterId: z.string(),
  questionId: z.string(),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
})

// POST - Save question answer
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const data = answerSchema.parse(body)

    const answer = await prisma.questionAnswer.create({
      data: {
        userId: user.id,
        chapterId: data.chapterId,
        questionId: data.questionId,
        selectedAnswer: data.selectedAnswer,
        isCorrect: data.isCorrect,
      }
    })

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Question answer error:', error)
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    )
  }
}

// GET - Get user's question answers
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapterId')

    const answers = await prisma.questionAnswer.findMany({
      where: {
        userId: user.id,
        ...(chapterId && { chapterId }),
      },
      orderBy: { answeredAt: 'desc' },
    })

    return NextResponse.json({ answers })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    )
  }
}
