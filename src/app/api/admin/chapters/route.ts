import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/chapters
 * Get all chapters
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const chapters = await prisma.chapter.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
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
    }))

    return NextResponse.json({
      success: true,
      chapters: formattedChapters,
      totalChapters: formattedChapters.length,
    })
  } catch (error: any) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chapters' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

/**
 * POST /api/admin/chapters
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
      type,
      category,
      duration,
      isActive,
    } = body

    // Validation
    if (!title || !chapterNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: title, chapterNumber' },
        { status: 400 }
      )
    }

    // Check if chapter number already exists
    const existingChapter = await prisma.chapter.findFirst({
      where: { chapterNumber },
    })

    if (existingChapter) {
      return NextResponse.json(
        { error: `Chapter number ${chapterNumber} already exists` },
        { status: 400 }
      )
    }

    // Create the chapter
    const chapter = await prisma.chapter.create({
      data: {
        title,
        description: description || null,
        chapterNumber,
        type: type || 'MCQ',
        category: category || null,
        duration: duration || null,
        isActive: isActive !== undefined ? isActive : false, // Default to draft
      },
    })

    return NextResponse.json({
      success: true,
      chapter,
      message: 'Chapter created successfully',
    })
  } catch (error: any) {
    console.error('Error creating chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create chapter' },
      { status: 500 }
    )
  }
}
