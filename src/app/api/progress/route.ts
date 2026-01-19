import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const progressSchema = z.object({
  chapterId: z.string(),
  chapterTitle: z.string(),
  isCompleted: z.boolean().optional(),
  notes: z.string().optional(),
})

// GET - Get user progress
export async function GET() {
  try {
    const user = await requireAuth()
    
    const progress = await prisma.chapterProgress.findMany({
      where: { userId: user.id },
      orderBy: { lastAccessed: 'desc' },
    })

    return NextResponse.json({ progress })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// POST - Update progress
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const data = progressSchema.parse(body)

    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId: data.chapterId,
        }
      },
      update: {
        chapterTitle: data.chapterTitle,
        isCompleted: data.isCompleted ?? undefined,
        notes: data.notes,
        lastAccessed: new Date(),
        completedAt: data.isCompleted ? new Date() : undefined,
      },
      create: {
        userId: user.id,
        chapterId: data.chapterId,
        chapterTitle: data.chapterTitle,
        isCompleted: data.isCompleted ?? false,
        notes: data.notes,
        lastAccessed: new Date(),
        completedAt: data.isCompleted ? new Date() : undefined,
      }
    })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Progress error:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
