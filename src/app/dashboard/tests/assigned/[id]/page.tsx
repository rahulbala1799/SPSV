'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface Question {
  id: string
  questionText: string
  questionOrder: number
  options: { id: string; text: string }[]
}

interface Test {
  id: string
  title: string
  description: string | null
  questionCount: number
  isTimed: boolean
  timeLimitMinutes: number | null
  dueDate: string | null
  questions: Question[]
  studentStatus: {
    status: string
    startedAt: string | null
    completedAt: string | null
    score: number | null
  }
}

export default function TakeAssignedTestPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [loading, setLoading] = useState(true)
  const [test, setTest] = useState<Test | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, string>>(new Map())
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    fetchTest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId])

  useEffect(() => {
    if (started && test?.isTimed && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            handleSubmitTest(true) // Auto-submit when time runs out
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, test, timeRemaining])

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/student/assigned-tests/${testId}`)
      const data = await response.json()

      if (response.ok) {
        setTest(data.test)
        
        // Check if already completed
        if (data.test.studentStatus.status === 'COMPLETED') {
          router.push(`/dashboard/tests/assigned/${testId}/results`)
          return
        }

        // Check if in progress
        if (data.test.studentStatus.status === 'IN_PROGRESS') {
          setStarted(true)
          // Set timer if timed test
          if (data.test.isTimed && data.test.studentStatus.startedAt) {
            const startTime = new Date(data.test.studentStatus.startedAt).getTime()
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            const remaining = (data.test.timeLimitMinutes! * 60) - elapsed
            setTimeRemaining(Math.max(0, remaining))
          }
        }
      } else {
        alert(data.error || 'Failed to load test')
        router.push('/dashboard/tests/assigned')
      }
    } catch (error) {
      console.error('Error fetching test:', error)
      alert('Failed to load test')
      router.push('/dashboard/tests/assigned')
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = async () => {
    try {
      const response = await fetch(`/api/student/assigned-tests/${testId}/start`, {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        setAttemptId(data.attempt.id)
        setStarted(true)
        
        // Start timer if timed
        if (test?.isTimed) {
          setTimeRemaining(test.timeLimitMinutes! * 60)
        }
      } else {
        alert(data.error || 'Failed to start test')
      }
    } catch (error) {
      console.error('Error starting test:', error)
      alert('Failed to start test')
    }
  }

  const handleAnswerChange = (questionId: string, answerId: string) => {
    const newAnswers = new Map(answers)
    newAnswers.set(questionId, answerId)
    setAnswers(newAnswers)
  }

  const handleSubmitTest = async (autoSubmit = false) => {
    if (!started || !test) return

    if (!autoSubmit) {
      const unanswered = test.questions.filter(q => !answers.has(q.id))
      if (unanswered.length > 0) {
        const confirmSubmit = confirm(
          `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
        )
        if (!confirmSubmit) return
      }
    }

    setSubmitting(true)

    try {
      const answerArray = test.questions.map(q => ({
        questionId: q.id,
        selectedAnswer: answers.get(q.id) || null
      }))

      const response = await fetch(`/api/student/assigned-tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attemptId,
          answers: answerArray
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Navigate to results
        router.push(`/dashboard/tests/assigned/${testId}/results`)
      } else {
        alert(data.error || 'Failed to submit test')
        setSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Failed to submit test')
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!test) return 0
    return Math.round((answers.size / test.questionCount) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (!test) return null

  const currentQuestion = test.questions[currentQuestionIndex]
  const selectedAnswerForCurrent = currentQuestion ? answers.get(currentQuestion.id) : null

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-4 max-w-7xl mx-auto">
            <Link href="/dashboard/tests/assigned" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Assigned Tests
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
          </div>
        </header>

        <main className="px-4 py-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Instructions</h2>
            
            {test.description && (
              <p className="text-gray-600 mb-6">{test.description}</p>
            )}

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Number of Questions:</span>
                <span className="font-semibold text-gray-900">{test.questionCount}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Test Type:</span>
                <span className="font-semibold text-gray-900">
                  {test.isTimed ? `Timed (${test.timeLimitMinutes} minutes)` : 'Untimed'}
                </span>
              </div>
              {test.dueDate && (
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(test.dueDate).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {test.isTimed && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>⏰ Important:</strong> This is a timed test. You will have {test.timeLimitMinutes} minutes 
                  to complete all questions once you start. The test will automatically submit when time expires.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 text-sm">
                <strong>💡 Tip:</strong> Read each question carefully. You can navigate between questions using 
                the navigation buttons, and you can change your answers before submitting.
              </p>
            </div>

            <button
              onClick={handleStartTest}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Start Test
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Test taking interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
            {test.isTimed && timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <FiClock className="w-5 h-5" />
                <span className="font-semibold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress: {answers.size} / {test.questionCount} answered</span>
              <span>{getProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-32">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Question */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">
                Question {currentQuestionIndex + 1} of {test.questionCount}
              </span>
              {selectedAnswerForCurrent && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <FiCheck className="w-4 h-4" />
                  Answered
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.questionText}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option: any) => {
                const isSelected = selectedAnswerForCurrent === option.id

                return (
                  <label
                    key={option.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-700 mr-2">{option.id}.</span>
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
              Previous
            </button>

            <div className="flex gap-2">
              {test.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers.has(test.questions[index].id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === test.questionCount - 1 ? (
              <button
                onClick={() => handleSubmitTest()}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
                <FiCheck />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(test.questionCount - 1, currentQuestionIndex + 1))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Next
                <FiChevronRight />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Floating Submit Button */}
      {answers.size === test.questionCount && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => handleSubmitTest()}
              disabled={submitting}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting...' : 'All Questions Answered - Submit Test'}
              <FiCheck className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
