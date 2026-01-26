import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET chapter details with student progress
export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get chapter
    const chapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
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

    // Get student progress if user is a student
    let studentProgress = null
    if (user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: user.id }
      })

      if (student) {
        studentProgress = await prisma.chapterProgress.findUnique({
          where: {
            studentId_chapterId: {
              studentId: student.id,
              chapterId: chapter.id
            }
          }
        })
      }
    }

    return NextResponse.json({
      chapter: {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        chapterNumber: chapter.chapterNumber,
        type: chapter.type,
        duration: chapter.duration,
        isActive: chapter.isActive
      },
      totalQuestions: chapter.questions.length,
      studentProgress: studentProgress ? {
        isCompleted: studentProgress.isCompleted,
        score: studentProgress.score,
        correctAnswers: studentProgress.correctAnswers,
        totalQuestions: studentProgress.totalQuestions,
        startedAt: studentProgress.startedAt,
        completedAt: studentProgress.completedAt
      } : null
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get chapter error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}
