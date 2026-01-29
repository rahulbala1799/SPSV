'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiCheck, FiX, FiAward, FiBarChart2, FiRefreshCw } from 'react-icons/fi'
import { BottomNav } from '@/components/dashboard/BottomNav'

interface Question {
  id: string
  questionOrder: number
  questionText: string
  options: { id: string; text: string }[]
  selectedAnswer: string | null
  correctAnswer: string
  isCorrect: boolean | null
  explanation: string | null
}

interface TestResult {
  id: string
  category: string
  questionCount: number
  state: string
  score: number
  correctAnswers: number
  totalAnswered: number
  createdAt: string
  startedAt: string
  completedAt: string
  questions: Question[]
}

export default function TestResultsPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/tests/untimed/${testId}`)
      const data = await response.json()

      if (response.ok) {
        if (data.testAttempt.state !== 'COMPLETED') {
          // Redirect back to test if not completed
          router.push(`/dashboard/tests/untimed/${testId}`)
          return
        }
        setTestResult(data.testAttempt)
      } else {
        setError(data.error || 'Failed to load results')
      }
    } catch (err) {
      console.error('Error fetching results:', err)
      setError('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300'
    if (score >= 60) return 'bg-blue-100 border-blue-300'
    if (score >= 40) return 'bg-orange-100 border-orange-300'
    return 'bg-red-100 border-red-300'
  }

  useEffect(() => {
    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <FiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Failed to load results'}</p>
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

  const correctCount = testResult.correctAnswers
  const incorrectCount = testResult.totalAnswered - testResult.correctAnswers

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/tests/untimed"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Test Results</h1>
              <p className="text-sm text-gray-600">
                {testResult.category === 'INDUSTRY_KNOWLEDGE' ? 'Industry' : 'Area'} Knowledge
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-24">
        {/* Score Card */}
        <div className={`rounded-2xl shadow-lg p-8 mb-6 border-2 ${getScoreBgColor(testResult.score)}`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-32 h-32 rounded-full border-8 ${
                testResult.score >= 80 ? 'border-green-600 bg-green-50' :
                testResult.score >= 60 ? 'border-blue-600 bg-blue-50' :
                testResult.score >= 40 ? 'border-orange-600 bg-orange-50' :
                'border-red-600 bg-red-50'
              } flex items-center justify-center`}>
                <div>
                  <p className={`text-4xl font-bold ${getScoreColor(testResult.score)}`}>
                    {testResult.score}%
                  </p>
                </div>
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${getScoreColor(testResult.score)}`}>
              {testResult.score >= 80 ? 'Excellent!' : 
               testResult.score >= 60 ? 'Good Job!' :
               testResult.score >= 40 ? 'Keep Practicing' :
               'Need More Practice'}
            </h2>
            <p className="text-gray-700 mb-4">
              You answered {correctCount} out of {testResult.totalAnswered} questions correctly
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white bg-opacity-70 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FiCheck className="w-5 h-5 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                </div>
                <p className="text-xs text-gray-600">Correct</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FiX className="w-5 h-5 text-red-600" />
                  <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
                </div>
                <p className="text-xs text-gray-600">Incorrect</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FiBarChart2 className="w-5 h-5 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">{testResult.questionCount}</p>
                </div>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/dashboard/tests/untimed"
            className="bg-blue-600 text-white py-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="w-5 h-5" />
            Take Another Test
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-gray-700 py-4 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all shadow-md"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiAward className="w-6 h-6 text-blue-600" />
            Question Review
          </h3>

          <div className="space-y-3">
            {testResult.questions.map((question) => {
              const isExpanded = expandedQuestions.has(question.id)
              const selectedOption = question.options.find(o => o.id === question.selectedAnswer)
              const correctOption = question.options.find(o => o.id === question.correctAnswer)

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-xl overflow-hidden ${
                    question.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full p-4 text-left hover:bg-opacity-70 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                            Q{question.questionOrder}
                          </span>
                          {question.isCorrect ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1">
                              <FiCheck className="w-4 h-4" />
                              Correct
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              <FiX className="w-4 h-4" />
                              Incorrect
                            </span>
                          )}
                        </div>
                        <p className="text-gray-900 font-medium">{question.questionText}</p>
                      </div>
                      <span className="text-gray-400 text-2xl">
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-white">
                      <div className="border-t border-gray-200 pt-4">
                        {/* Your Answer */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Your Answer:</p>
                          <div className={`p-3 rounded-lg ${
                            question.isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                          }`}>
                            <p className="text-gray-900">
                              <span className="font-semibold">{question.selectedAnswer}:</span> {selectedOption?.text}
                            </p>
                          </div>
                        </div>

                        {/* Correct Answer (if wrong) */}
                        {!question.isCorrect && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Correct Answer:</p>
                            <div className="p-3 rounded-lg bg-green-100 border border-green-300">
                              <p className="text-gray-900">
                                <span className="font-semibold">{question.correctAnswer}:</span> {correctOption?.text}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Explanation */}
                        {question.explanation && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Explanation:</p>
                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <p className="text-gray-800 text-sm leading-relaxed">{question.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
