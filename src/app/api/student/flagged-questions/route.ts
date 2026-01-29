import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/student/flagged-questions
 * Get all flagged questions for the current student
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Build where clause
    const whereClause: any = {
      studentId: student.id,
    }

    if (!includeInactive) {
      whereClause.isActive = true
    }

    // Fetch flagged questions with relations
    const flags = await prisma.flaggedQuestion.findMany({
      where: whereClause,
      include: {
        question: {
          include: {
            chapter: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        questionBank: true,
      },
      orderBy: { flaggedAt: 'desc' },
    })

    // Format response with complete question data
    const flaggedQuestions = flags.map(flag => ({
      id: flag.id,
      questionId: flag.questionId,
      questionBankId: flag.questionBankId,
      flaggedFrom: flag.flaggedFrom,
      flaggedAt: flag.flaggedAt,
      unflaggedAt: flag.unflaggedAt,
      isActive: flag.isActive,
      question: flag.question ? {
        id: flag.question.id,
        questionText: flag.question.questionText,
        questionNumber: flag.question.questionNumber,
        options: flag.question.options,
        correctAnswer: flag.question.correctAnswer,
        explanation: flag.question.explanation,
        chapterId: flag.question.chapterId,
        category: flag.question.category,
        chapter: {
          id: flag.question.chapter.id,
          title: flag.question.chapter.title,
        },
      } : null,
      questionBank: flag.questionBank ? {
        id: flag.questionBank.id,
        questionText: flag.questionBank.questionText,
        optionA: flag.questionBank.optionA,
        optionB: flag.questionBank.optionB,
        optionC: flag.questionBank.optionC,
        optionD: flag.questionBank.optionD,
        correctAnswer: flag.questionBank.correctAnswer,
        explanation: flag.questionBank.explanation,
        category: flag.questionBank.category,
      } : null,
    }))

    return NextResponse.json({
      flaggedQuestions,
      total: flaggedQuestions.length,
    })
  } catch (error: any) {
    console.error('Error getting flagged questions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get flagged questions' },
      { status: 500 }
    )
  }
}
