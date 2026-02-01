import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { updateChapterProgress } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

// POST mark chapter as completed
export async function POST(
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

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can complete chapters' },
        { status: 403 }
      )
    }

    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Get progress
    let progress = await prisma.chapterProgress.findUnique({
      where: {
        studentId_chapterId: {
          studentId: student.id,
          chapterId: params.chapterId
        }
      }
    })

    if (!progress) {
      return NextResponse.json(
        { error: 'Chapter progress not found. Please start the chapter first.' },
        { status: 400 }
      )
    }

    // Check if all questions are answered
    const totalQuestions = await prisma.question.count({
      where: { chapterId: params.chapterId }
    })

    const answeredCount = await prisma.answer.count({
      where: {
        studentId: student.id,
        question: {
          chapterId: params.chapterId
        }
      }
    })

    if (answeredCount < totalQuestions) {
      return NextResponse.json(
        { error: `Please answer all ${totalQuestions} questions before completing the chapter. You have answered ${answeredCount}.` },
        { status: 400 }
      )
    }

    // Mark as completed
    progress = await prisma.chapterProgress.update({
      where: { id: progress.id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        score: progress.score || Math.round((progress.correctAnswers / totalQuestions) * 100)
      }
    })

    // Track chapter completion for analytics
    await updateChapterProgress(student.id, params.chapterId, {
      isCompleted: true,
      progressPercent: 100,
      correctAnswers: progress.correctAnswers,
      totalQuestions: progress.totalQuestions
    }).catch(err => {
      // Don't fail the request if analytics tracking fails
      console.log('[Analytics] Failed to track chapter completion:', err.message)
    })

    // Check achievements (non-blocking)
    const { checkAchievements } = await import('@/lib/achievements')
    const achievementResult = await checkAchievements(student.id, {
      action: 'chapter_completed',
      data: {
        chapterId: params.chapterId,
        score: progress.score || 0
      }
    }).catch(err => {
      console.log('[Achievements] Achievement check failed:', err.message)
      return null
    })

    return NextResponse.json({
      success: true,
      progress: {
        isCompleted: progress.isCompleted,
        score: progress.score,
        totalQuestions: progress.totalQuestions,
        correctAnswers: progress.correctAnswers,
        completedAt: progress.completedAt
      }
    }, { status: 200 })
  } catch (error: any) {
    console.error('Complete chapter error:', error)
    return NextResponse.json(
      { error: 'Failed to complete chapter' },
      { status: 500 }
    )
  }
}
