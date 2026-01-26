import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET detailed analytics for a chapter
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
        { error: 'Only students can view analytics' },
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

    // Get all questions for this chapter
    const questions = await prisma.question.findMany({
      where: { chapterId: params.chapterId },
      select: {
        id: true,
        questionText: true,
        questionNumber: true,
        difficulty: true
      },
      orderBy: { questionNumber: 'asc' }
    })

    // Get all answers for this chapter
    const allAnswers = await prisma.answer.findMany({
      where: {
        studentId: student.id,
        question: {
          chapterId: params.chapterId
        }
      },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            questionNumber: true,
            difficulty: true
          }
        }
      },
      orderBy: { answeredAt: 'asc' }
    })

    // Calculate question-level statistics
    const questionStats = questions.map(question => {
      const questionAnswers = allAnswers.filter(a => a.questionId === question.id)
      const attemptCount = questionAnswers.length
      const correctAttempts = questionAnswers.filter(a => a.isCorrect).length
      const latestAnswer = questionAnswers[questionAnswers.length - 1]
      
      // Calculate success rate
      const successRate = attemptCount > 0 
        ? Math.round((correctAttempts / attemptCount) * 100) 
        : 0
      
      // Determine if improving (comparing last 2 attempts if available)
      let isImproving = null
      if (attemptCount >= 2) {
        const lastTwo = questionAnswers.slice(-2)
        isImproving = !lastTwo[0].isCorrect && lastTwo[1].isCorrect
      }

      return {
        questionId: question.id,
        questionNumber: question.questionNumber,
        questionText: question.questionText.substring(0, 100) + (question.questionText.length > 100 ? '...' : ''),
        difficulty: question.difficulty,
        attemptCount,
        correctAttempts,
        successRate,
        latestAnswer: latestAnswer ? {
          isCorrect: latestAnswer.isCorrect,
          answeredAt: latestAnswer.answeredAt
        } : null,
        isImproving,
        status: latestAnswer 
          ? (latestAnswer.isCorrect ? 'mastered' : 'needs_review')
          : 'not_attempted'
      }
    })

    // Sort and categorize questions
    const masteredQuestions = questionStats.filter(q => q.status === 'mastered')
    const needsReview = questionStats.filter(q => q.status === 'needs_review')
    const notAttempted = questionStats.filter(q => q.status === 'not_attempted')
    
    // Identify weakest (lowest success rate, attempted at least once)
    const attemptedQuestions = questionStats.filter(q => q.attemptCount > 0)
    const weakestQuestions = [...attemptedQuestions]
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, 5)
    
    // Identify strongest (highest success rate, attempted multiple times)
    const strongestQuestions = [...attemptedQuestions]
      .filter(q => q.attemptCount >= 2)
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5)

    // Calculate overall statistics
    const totalQuestions = questions.length
    const questionsAttempted = attemptedQuestions.length
    const totalAttempts = allAnswers.length
    const averageAttemptsPerQuestion = questionsAttempted > 0 
      ? Math.round((totalAttempts / questionsAttempted) * 10) / 10
      : 0
    
    const overallSuccessRate = totalAttempts > 0
      ? Math.round((allAnswers.filter(a => a.isCorrect).length / totalAttempts) * 100)
      : 0

    // Calculate improvement trend
    const recentAnswers = allAnswers.slice(-10) // Last 10 answers
    const recentSuccessRate = recentAnswers.length > 0
      ? Math.round((recentAnswers.filter(a => a.isCorrect).length / recentAnswers.length) * 100)
      : 0

    // Time-based statistics
    const firstAttempt = allAnswers[0]?.answeredAt
    const lastAttempt = allAnswers[allAnswers.length - 1]?.answeredAt
    const studyDuration = firstAttempt && lastAttempt
      ? Math.round((new Date(lastAttempt).getTime() - new Date(firstAttempt).getTime()) / (1000 * 60 * 60 * 24)) // days
      : 0

    return NextResponse.json({
      overview: {
        totalQuestions,
        questionsAttempted,
        questionsMastered: masteredQuestions.length,
        questionsNeedReview: needsReview.length,
        questionsNotAttempted: notAttempted.length,
        totalAttempts,
        averageAttemptsPerQuestion,
        overallSuccessRate,
        recentSuccessRate,
        studyDuration,
        progressPercentage: Math.round((questionsAttempted / totalQuestions) * 100)
      },
      questionStats: questionStats.sort((a, b) => {
        // Sort by: not attempted, needs review, mastered
        if (a.status === 'not_attempted' && b.status !== 'not_attempted') return 1
        if (a.status !== 'not_attempted' && b.status === 'not_attempted') return -1
        if (a.status === 'needs_review' && b.status === 'mastered') return -1
        if (a.status === 'mastered' && b.status === 'needs_review') return 1
        return a.questionNumber - b.questionNumber
      }),
      weakestQuestions,
      strongestQuestions,
      categoryBreakdown: {
        mastered: masteredQuestions.length,
        needsReview: needsReview.length,
        notAttempted: notAttempted.length
      }
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
