import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET chapter progress for student
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

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can view progress' },
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
    const progress = await prisma.chapterProgress.findUnique({
      where: {
        studentId_chapterId: {
          studentId: student.id,
          chapterId: params.chapterId
        }
      }
    })

    // Get all answers for this chapter
    const questions = await prisma.question.findMany({
      where: { chapterId: params.chapterId },
      select: { id: true }
    })

    const answers = await prisma.answer.findMany({
      where: {
        studentId: student.id,
        questionId: { in: questions.map(q => q.id) }
      },
      select: {
        questionId: true,
        selectedAnswer: true,
        isCorrect: true
      }
    })

    return NextResponse.json({
      progress: progress ? {
        isCompleted: progress.isCompleted,
        score: progress.score,
        totalQuestions: progress.totalQuestions,
        correctAnswers: progress.correctAnswers,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt
      } : null,
      answers: answers.map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect
      }))
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
