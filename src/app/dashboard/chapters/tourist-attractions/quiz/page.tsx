'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { MCQQuestion } from '@/components/chapters/MCQQuestion'

interface Question {
  id: string
  questionText: string
  questionNumber: number
  options: Array<{ id: string; text: string }>
  correctAnswer?: string
  explanation?: string
  points: number
  studentAnswer?: {
    selectedAnswer: string
    isCorrect: boolean
  }
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState<any>(null)
  const [questionCount, setQuestionCount] = useState<number | 'all'>('all')
  const quizSessionIdRef = useRef<string | null>(null)

  const checkAccessAndLoad = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (!response.ok || !data.user) {
        router.push('/login')
        return
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        router.push('/admin')
        return
      }

      await loadQuestions()
      await loadProgress()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadQuestions = async () => {
    try {
      // Get count and strategy from URL params
      const count = searchParams.get('count') || 'all'
      const strategy = searchParams.get('strategy') || 'mix'
      setQuestionCount(count as any)
      
      // Build query string with strategy and count
      // Don't include previous answers - start fresh each time
      const queryParams = new URLSearchParams({
        includeAnswers: 'false', // Start fresh - don't show previous answers
        random: 'true',
        strategy: strategy
      })
      if (count !== 'all') {
        queryParams.set('count', count)
      }
      
      const response = await fetch(`/api/chapters/chapter_tourist_attractions/questions?${queryParams.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setQuestions(data.questions)
        if (data.questions?.length && !quizSessionIdRef.current) {
          quizSessionIdRef.current = crypto.randomUUID?.() ?? `quiz-${Date.now()}`
        }
        setAnsweredQuestions({})
        setSelectedAnswers({})
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/chapters/chapter_tourist_attractions/progress')
      const data = await response.json()

      if (response.ok && data.progress) {
        setProgress(data.progress)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (answeredQuestions[questionId]) return // Don't allow changing answered questions
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    })
  }

  const handleSubmitAnswer = async (questionId: string) => {
    const selectedAnswer = selectedAnswers[questionId]
    if (!selectedAnswer || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(
        `/api/chapters/chapter_tourist_attractions/questions/${questionId}/answer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedAnswer })
        }
      )

      const data = await response.json()

      if (response.ok) {
        // Mark as answered
        setAnsweredQuestions({
          ...answeredQuestions,
          [questionId]: true
        })

        // Update question with correct answer and explanation
        setQuestions(questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              correctAnswer: data.correctAnswer,
              explanation: data.explanation,
              studentAnswer: {
                selectedAnswer: selectedAnswer,
                isCorrect: data.isCorrect
              }
            }
          }
          return q
        }))

        // Update progress
        if (data.chapterProgress) {
          setProgress({
            ...progress,
            correctAnswers: data.chapterProgress.correctAnswers,
            totalQuestions: data.chapterProgress.totalQuestions,
            score: data.chapterProgress.score
          })
        }

        // Auto-advance to next question after 2 seconds
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
          }
        }, 2000)
      } else {
        alert(data.error || 'Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteChapter = async () => {
    const count = questionCount === 'all' ? 'all' : questionCount.toString()
    const sessionTotal = questions.length
    const sessionCorrect = questions.filter((q) => q.studentAnswer?.isCorrect).length
    const params = new URLSearchParams({ count: count.toString() })
    if (sessionTotal > 0) {
      params.set('sessionCorrect', sessionCorrect.toString())
      params.set('sessionTotal', sessionTotal.toString())
    }
    router.push(`/dashboard/chapters/tourist-attractions/results?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const allAnswered = questions.every(q => answeredQuestions[q.id])
  const answeredCount = Object.keys(answeredQuestions).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/chapters/tourist-attractions"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {answeredCount} / {questions.length} answered
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {currentQuestion && (
          <MCQQuestion
            question={currentQuestion}
            shuffleSeed={quizSessionIdRef.current ? `${quizSessionIdRef.current}-${currentQuestion.id}` : undefined}
            selectedAnswer={selectedAnswers[currentQuestion.id] || null}
            isAnswered={answeredQuestions[currentQuestion.id] || false}
            isCorrect={currentQuestion.studentAnswer?.isCorrect || null}
            onSelectAnswer={(answerId) => handleSelectAnswer(currentQuestion.id, answerId)}
            onSubmitAnswer={() => handleSubmitAnswer(currentQuestion.id)}
            submitting={submitting}
            showFlagOption={true}
          />
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-colors"
          >
            Next
          </button>
        </div>

        {/* Complete Chapter Button */}
        {allAnswered && (
          <button
            onClick={handleCompleteChapter}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <FiCheckCircle className="w-6 h-6" />
            <span>Complete Chapter</span>
          </button>
        )}
      </main>
    </div>
  )
}

export default function SouthsideFullQuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
