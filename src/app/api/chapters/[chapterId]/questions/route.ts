import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET questions for a chapter
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

    const searchParams = request.nextUrl.searchParams
    const includeAnswers = searchParams.get('includeAnswers') === 'true'
    const countParam = searchParams.get('count')
    const randomize = searchParams.get('random') === 'true'
    const strategy = searchParams.get('strategy') as 'mix' | 'new_only' | 'prioritize_new' | null

    // Get all questions
    let questions = await prisma.question.findMany({
      where: { chapterId: params.chapterId },
      orderBy: { questionNumber: 'asc' }
    })

    // Get student answers if user is a student (needed for strategy)
    let attemptedQuestionIds: string[] = []
    if (user.role === 'STUDENT' && strategy) {
      const student = await prisma.student.findUnique({
        where: { userId: user.id }
      })

      if (student) {
        const answers = await prisma.answer.findMany({
          where: {
            studentId: student.id,
            questionId: { in: questions.map(q => q.id) }
          },
          select: { questionId: true },
          distinct: ['questionId']
        })

        attemptedQuestionIds = answers.map(a => a.questionId)
      }
    }

    // Apply strategy
    if (strategy) {
      const unattemptedQuestions = questions.filter(q => !attemptedQuestionIds.includes(q.id))
      const attemptedQuestions = questions.filter(q => attemptedQuestionIds.includes(q.id))

      if (strategy === 'new_only') {
        // Only unattempted questions
        questions = unattemptedQuestions
      } else if (strategy === 'prioritize_new') {
        // Unattempted first, then attempted
        const targetCount = countParam === 'all' 
          ? questions.length 
          : parseInt(countParam || '0', 10)

        if (unattemptedQuestions.length >= targetCount) {
          // Enough unattempted questions
          questions = unattemptedQuestions.slice(0, targetCount)
        } else {
          // Need to add attempted questions
          const neededFromAttempted = targetCount - unattemptedQuestions.length
          
          // Shuffle attempted questions
          const shuffledAttempted = [...attemptedQuestions]
          for (let i = shuffledAttempted.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledAttempted[i], shuffledAttempted[j]] = [shuffledAttempted[j], shuffledAttempted[i]]
          }
          
          questions = [
            ...unattemptedQuestions,
            ...shuffledAttempted.slice(0, neededFromAttempted)
          ]
        }
      }
      // For 'mix', use all questions (already set)
    }

    // Randomize if requested (and not using strategy which handles its own order)
    if (randomize && !strategy) {
      // Fisher-Yates shuffle algorithm
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]]
      }
    }

    // Always randomize for strategy (except new_only which should show in order)
    if (strategy && strategy !== 'new_only') {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]]
      }
    }

    // Limit count if specified (and not already limited by strategy)
    if (countParam && countParam !== 'all' && !strategy) {
      const count = parseInt(countParam, 10)
      if (!isNaN(count) && count > 0) {
        questions = questions.slice(0, Math.min(count, questions.length))
      }
    }

    // Get student answers if requested and user is a student
    let studentAnswers: Record<string, any> = {}
    if (includeAnswers && user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: user.id }
      })

      if (student) {
        const answers = await prisma.answer.findMany({
          where: {
            studentId: student.id,
            questionId: { in: questions.map(q => q.id) }
          }
        })

        answers.forEach(answer => {
          studentAnswers[answer.questionId] = {
            selectedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect,
            answeredAt: answer.answeredAt
          }
        })
      }
    }

    // Format questions (don't expose correct answer unless student has answered)
    const formattedQuestions = questions.map(q => {
      const questionData: any = {
        id: q.id,
        questionText: q.questionText,
        questionNumber: q.questionNumber,
        options: q.options as any,
        points: q.points,
        difficulty: q.difficulty
      }

      // Only include correct answer and explanation if student has answered
      if (includeAnswers && studentAnswers[q.id]) {
        questionData.correctAnswer = q.correctAnswer
        questionData.explanation = q.explanation
        questionData.studentAnswer = studentAnswers[q.id]
      }

      return questionData
    })

    return NextResponse.json({
      questions: formattedQuestions
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get questions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
