'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FiCheck, FiX, FiClock, FiAward } from 'react-icons/fi'

interface Answer {
  questionId: string
  questionText: string
  options: { id: string; text: string }[]
  selectedAnswer: string | null
  correctAnswer: string
  isCorrect: boolean | null
  explanation: string | null
  answeredAt: string | null
}

interface AttemptResults {
  id: string
  testTitle: string
  score: number
  correctAnswers: number
  totalQuestions: number
  percentageScore: number
  startedAt: string
  completedAt: string
  timeSpentSeconds: number | null
}

export default function AssignedTestResultsPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState<AttemptResults | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false)

  useEffect(() => {
    fetchResults()
  }, [testId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/student/assigned-tests/${testId}/results`)
      const data = await response.json()

      if (response.ok) {
        setAttempt(data.attempt)
        setAnswers(data.answers)
      } else {
        alert(data.error || 'Failed to load results')
        router.push('/dashboard/tests/assigned')
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      alert('Failed to load results')
      router.push('/dashboard/tests/assigned')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!attempt) return null

  const filteredAnswers = showOnlyIncorrect 
    ? answers.filter(a => !a.isCorrect)
    : answers

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <Link href="/dashboard/tests/assigned" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
            ← Back to Assigned Tests
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
          <p className="text-sm text-gray-600 mt-1">{attempt.testTitle}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto pb-20">
        {/* Score Card */}
        <div className={`rounded-2xl shadow-lg p-8 mb-6 ${getScoreBg(attempt.score)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Score</h2>
              <div className={`text-6xl font-bold ${getScoreColor(attempt.score)}`}>
                {attempt.score}%
              </div>
              <p className="text-gray-700 mt-2">
                {attempt.correctAnswers} out of {attempt.totalQuestions} questions correct
              </p>
            </div>
            <div className="text-right">
              <FiAward className={`w-24 h-24 ${getScoreColor(attempt.score)}`} />
              <p className="text-sm text-gray-700 mt-2">
                {attempt.score >= 80 ? 'Excellent!' :
                 attempt.score >= 60 ? 'Good Job!' :
                 'Keep Practicing!'}
              </p>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Test Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-semibold text-gray-900">{formatDate(attempt.completedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="font-semibold text-gray-900">{formatTime(attempt.timeSpentSeconds)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Correct</p>
              <p className="font-semibold text-green-600">{attempt.correctAnswers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Incorrect</p>
              <p className="font-semibold text-red-600">
                {attempt.totalQuestions - attempt.correctAnswers}
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyIncorrect}
              onChange={(e) => setShowOnlyIncorrect(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Show only incorrect answers ({answers.filter(a => !a.isCorrect).length})
            </span>
          </label>
        </div>

        {/* Answers Review */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Answer Review</h3>
          
          <div className="space-y-6">
            {filteredAnswers.map((answer, index) => {
              const questionNumber = answers.indexOf(answer) + 1

              return (
                <div
                  key={answer.questionId}
                  className={`border-2 rounded-lg p-6 ${
                    answer.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-600">
                          Question {questionNumber}
                        </span>
                        {answer.isCorrect ? (
                          <span className="flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <FiCheck className="w-4 h-4" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-red-700 bg-red-100 px-2 py-1 rounded-full">
                            <FiX className="w-4 h-4" />
                            Incorrect
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-medium text-gray-900">
                        {answer.questionText}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {answer.options.map((option) => {
                      const isCorrect = option.id === answer.correctAnswer
                      const isSelected = option.id === answer.selectedAnswer

                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrect
                              ? 'border-green-500 bg-green-50'
                              : isSelected && !isCorrect
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrect && (
                              <FiCheck className="w-5 h-5 text-green-600 mt-0.5" />
                            )}
                            {isSelected && !isCorrect && (
                              <FiX className="w-5 h-5 text-red-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <span className="font-semibold mr-2">{option.id}.</span>
                              <span>{option.text}</span>
                              {isCorrect && (
                                <span className="ml-2 text-sm text-green-700 font-semibold">
                                  (Correct Answer)
                                </span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="ml-2 text-sm text-red-700 font-semibold">
                                  (Your Answer)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {answer.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-800">{answer.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/dashboard/tests/assigned"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition-colors"
          >
            Back to Assigned Tests
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg text-center transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
