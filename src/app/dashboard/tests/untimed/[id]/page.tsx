'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiCheck, FiX, FiClock, FiCheckCircle } from 'react-icons/fi'
import { FaRegFlag } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'

interface Question {
  id: string
  questionOrder: number
  questionText: string
  options: { id: string; text: string }[]
  selectedAnswer: string | null
  isCorrect: boolean | null
  answeredAt: string | null
  correctAnswer?: string
  explanation?: string
}

interface TestAttempt {
  id: string
  category: string
  questionCount: number
  state: string
  score: number | null
  correctAnswers: number
  totalAnswered: number
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  questions: Question[]
}

export default function TakeTestPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [testAttempt, setTestAttempt] = useState<TestAttempt | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [flagging, setFlagging] = useState(false)

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/untimed/${testId}`)
      const data = await response.json()

      if (response.ok) {
        setTestAttempt(data.testAttempt)
        
        // If test is completed, navigate to results
        if (data.testAttempt.state === 'COMPLETED') {
          router.push(`/dashboard/tests/untimed/${testId}/results`)
          return
        }

        // Set current question to first unanswered or first question
        const firstUnanswered = data.testAttempt.questions.findIndex(
          (q: Question) => q.selectedAnswer === null
        )
        if (firstUnanswered !== -1) {
          setCurrentQuestionIndex(firstUnanswered)
        }
        
        // Set selected answer if question is already answered
        const currentQuestion = data.testAttempt.questions[currentQuestionIndex]
        if (currentQuestion?.selectedAnswer) {
          setSelectedAnswer(currentQuestion.selectedAnswer)
        }
      } else {
        setError(data.error || 'Failed to load test')
      }
    } catch (err) {
      console.error('Error fetching test:', err)
      setError('Failed to load test')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !testAttempt) return

    setSubmitting(true)
    setError(null)

    const currentQuestion = testAttempt.questions[currentQuestionIndex]

    try {
      const response = await fetch(`/api/tests/untimed/${testId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testQuestionId: currentQuestion.id,
          selectedAnswer: selectedAnswer,
          idempotencyKey: uuidv4(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update local state
        const updatedQuestions = [...testAttempt.questions]
        updatedQuestions[currentQuestionIndex] = {
          ...updatedQuestions[currentQuestionIndex],
          selectedAnswer: data.answer.selectedAnswer,
          isCorrect: data.answer.isCorrect,
          answeredAt: data.answer.answeredAt,
        }

        setTestAttempt({
          ...testAttempt,
          questions: updatedQuestions,
          state: data.testState,
          totalAnswered: data.progress.totalAnswered,
          correctAnswers: data.progress.correctAnswers,
        })

        // Move to next question
        if (currentQuestionIndex < testAttempt.questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextIndex)
          setSelectedAnswer(updatedQuestions[nextIndex].selectedAnswer)
        }
      } else {
        setError(data.error || 'Failed to submit answer')
      }
    } catch (err) {
      console.error('Error submitting answer:', err)
      setError('Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteTest = async () => {
    if (!testAttempt) return

    const unansweredCount = testAttempt.questions.filter(q => q.selectedAnswer === null).length
    
    if (unansweredCount > 0) {
      if (!confirm(`You have ${unansweredCount} unanswered question(s). Complete test anyway?`)) {
        return
      }
    }

    setCompleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/tests/untimed/${testId}/complete`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        // Navigate to results page
        router.push(`/dashboard/tests/untimed/${testId}/results`)
      } else {
        setError(data.error || 'Failed to complete test')
        alert(data.error || 'Failed to complete test')
      }
    } catch (err) {
      console.error('Error completing test:', err)
      setError('Failed to complete test')
    } finally {
      setCompleting(false)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setSelectedAnswer(testAttempt?.questions[index].selectedAnswer || null)
  }

  const handleFlagQuestion = async (questionId: string) => {
    if (flagging) return
    
    setFlagging(true)
    try {
      const res = await fetch('/api/questions/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          flaggedFrom: 'UNTIMED_TEST'
        })
      })
      
      if (res.ok) {
        // Silent success - don't show the user if it was already flagged
      }
    } catch (error) {
      console.error('Error flagging question:', error)
    } finally {
      setFlagging(false)
    }
  }

  useEffect(() => {
    fetchTest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId])

  useEffect(() => {
    if (testAttempt) {
      const currentQuestion = testAttempt.questions[currentQuestionIndex]
      setSelectedAnswer(currentQuestion?.selectedAnswer || null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error && !testAttempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <FiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/dashboard/tests/untimed"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Tests
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!testAttempt) return null

  const currentQuestion = testAttempt.questions[currentQuestionIndex]
  const progress = {
    answered: testAttempt.questions.filter(q => q.selectedAnswer !== null).length,
    total: testAttempt.questionCount,
    percentage: Math.round((testAttempt.questions.filter(q => q.selectedAnswer !== null).length / testAttempt.questionCount) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/tests/untimed"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {testAttempt.category === 'INDUSTRY_KNOWLEDGE' ? 'Industry' : 'Area'} Knowledge Test
                </h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {testAttempt.questionCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-sm font-semibold text-gray-900">
                  {progress.answered}/{progress.total}
                </p>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Question Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">Jump to question:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {testAttempt.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white shadow-md'
                    : q.selectedAnswer
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                  Question {currentQuestion.questionOrder}
                </span>
                {currentQuestion.selectedAnswer && (
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <FiCheckCircle className="w-4 h-4" />
                    Answered
                  </span>
                )}
              </div>
              <button
                onClick={() => handleFlagQuestion(currentQuestion.id)}
                disabled={flagging}
                className={`p-2 rounded-lg transition-all text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${flagging ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Flag for review"
              >
                <FaRegFlag className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option: { id: string; text: string }) => (
              <button
                key={option.id}
                onClick={() => setSelectedAnswer(option.id)}
                disabled={submitting}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedAnswer === option.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                      selectedAnswer === option.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {option.id}
                  </div>
                  <p className="text-gray-900 pt-1">{option.text}</p>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || submitting}
            className={`py-4 rounded-xl font-semibold transition-all ${
              selectedAnswer && !submitting
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : currentQuestion.selectedAnswer ? (
              'Update Answer'
            ) : (
              'Submit Answer'
            )}
          </button>

          <button
            onClick={handleCompleteTest}
            disabled={completing || progress.answered === 0}
            className={`py-4 rounded-xl font-semibold transition-all ${
              !completing && progress.answered > 0
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {completing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Completing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FiCheck className="w-5 h-5" />
                Complete Test
              </span>
            )}
          </button>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={() => goToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === testAttempt.questions.length - 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentQuestionIndex === testAttempt.questions.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  )
}
