import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncQuestionsToQuestionBank } from '@/lib/questionBankSync'

/**
 * GET /api/admin/chapters/[chapterId]
 * Get a single chapter by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    await requireAdmin(request)

    const chapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        questions: {
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
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      chapter,
    })
  } catch (error: any) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chapter' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

/**
 * PATCH /api/admin/chapters/[chapterId]
 * Update a chapter
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
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

    // Check if chapter exists
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
    })

    if (!existingChapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // If changing chapter number, check if it's already taken
    if (chapterNumber && chapterNumber !== existingChapter.chapterNumber) {
      const numberTaken = await prisma.chapter.findFirst({
        where: {
          chapterNumber,
          id: { not: params.chapterId },
        },
      })

      if (numberTaken) {
        return NextResponse.json(
          { error: `Chapter number ${chapterNumber} already exists` },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (chapterNumber !== undefined) updateData.chapterNumber = chapterNumber
    if (type !== undefined) updateData.type = type
    if (category !== undefined) updateData.category = category
    if (duration !== undefined) updateData.duration = duration
    if (isActive !== undefined) updateData.isActive = isActive

    // Track if category changed
    const categoryChanged = category !== undefined && category !== existingChapter.category

    // Update the chapter
    const updatedChapter = await prisma.chapter.update({
      where: { id: params.chapterId },
      data: updateData,
    })

    // If category changed, update all questions in this chapter
    if (categoryChanged && category) {
      await prisma.question.updateMany({
        where: { chapterId: params.chapterId },
        data: { category },
      })

      // Re-sync to QuestionBank
      if (updatedChapter.isActive) {
        try {
          await syncQuestionsToQuestionBank([params.chapterId])
        } catch (syncError) {
          console.error('Error syncing to QuestionBank:', syncError)
        }
      }
    }

    // If isActive changed to true, sync to QuestionBank
    if (isActive === true && !existingChapter.isActive) {
      try {
        await syncQuestionsToQuestionBank([params.chapterId])
      } catch (syncError) {
        console.error('Error syncing to QuestionBank:', syncError)
      }
    }

    // If isActive changed to false, deactivate questions in QuestionBank
    if (isActive === false && existingChapter.isActive) {
      try {
        const questions = await prisma.question.findMany({
          where: { chapterId: params.chapterId },
          select: { questionText: true, category: true },
        })

        for (const question of questions) {
          const timedCategory =
            question.category === 'INDUSTRY_KNOWLEDGE'
              ? 'INDUSTRY'
              : question.category === 'AREA_KNOWLEDGE'
              ? 'AREA_KNOWLEDGE'
              : null

          if (timedCategory) {
            await prisma.questionBank.updateMany({
              where: {
                questionText: question.questionText,
                category: timedCategory,
              },
              data: { isActive: false },
            })
          }
        }
      } catch (syncError) {
        console.error('Error deactivating questions in QuestionBank:', syncError)
      }
    }

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      message: 'Chapter updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/chapters/[chapterId]
 * Delete a chapter
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    await requireAdmin(request)

    // Check if chapter exists
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        questions: {
          select: {
            questionText: true,
            category: true,
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

    // Deactivate all questions in QuestionBank before deleting
    if (existingChapter.isActive) {
      try {
        for (const question of existingChapter.questions) {
          const timedCategory =
            question.category === 'INDUSTRY_KNOWLEDGE'
              ? 'INDUSTRY'
              : question.category === 'AREA_KNOWLEDGE'
              ? 'AREA_KNOWLEDGE'
              : null

          if (timedCategory) {
            await prisma.questionBank.updateMany({
              where: {
                questionText: question.questionText,
                category: timedCategory,
              },
              data: { isActive: false },
            })
          }
        }
      } catch (syncError) {
        console.error('Error deactivating questions in QuestionBank:', syncError)
      }
    }

    // Delete the chapter (cascade deletes questions)
    await prisma.chapter.delete({
      where: { id: params.chapterId },
    })

    return NextResponse.json({
      success: true,
      message: 'Chapter deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
