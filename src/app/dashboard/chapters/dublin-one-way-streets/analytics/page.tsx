'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiTrendingUp, FiTrendingDown, FiTarget, FiCheckCircle, FiAlertCircle, FiClock, FiBarChart2 } from 'react-icons/fi'

interface QuestionStat {
  questionId: string
  questionNumber: number
  questionText: string
  difficulty: string
  attemptCount: number
  correctAttempts: number
  successRate: number
  latestAnswer: {
    isCorrect: boolean
    answeredAt: string
  } | null
  isImproving: boolean | null
  status: 'mastered' | 'needs_review' | 'not_attempted'
}

interface Analytics {
  overview: {
    totalQuestions: number
    questionsAttempted: number
    questionsMastered: number
    questionsNeedReview: number
    questionsNotAttempted: number
    totalAttempts: number
    averageAttemptsPerQuestion: number
    overallSuccessRate: number
    recentSuccessRate: number
    studyDuration: number
    progressPercentage: number
  }
  questionStats: QuestionStat[]
  weakestQuestions: QuestionStat[]
  strongestQuestions: QuestionStat[]
  categoryBreakdown: {
    mastered: number
    needsReview: number
    notAttempted: number
  }
}

export default function SouthsideFullAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      await loadAnalytics()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/chapter/chapter_dublin_one_way_streets')
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available yet.</p>
          <Link href="/dashboard/chapters/dublin-one-way-streets" className="text-green-600 hover:underline mt-4 inline-block">
            Start practicing to see your stats
          </Link>
        </div>
      </div>
    )
  }

  const { overview, questionStats, weakestQuestions, strongestQuestions } = analytics

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/chapters/dublin-one-way-streets"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Detailed Analytics</h1>
              <p className="text-sm text-gray-600">Southside Full - Performance Metrics</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-6xl mx-auto pb-20">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiTarget className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Progress</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.progressPercentage}%</p>
            <p className="text-xs text-gray-500">{overview.questionsAttempted}/{overview.totalQuestions} questions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.overallSuccessRate}%</p>
            <p className="text-xs text-gray-500">All attempts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiBarChart2 className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Total Attempts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.totalAttempts}</p>
            <p className="text-xs text-gray-500">Avg: {overview.averageAttemptsPerQuestion} per Q</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiClock className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Study Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.studyDuration}</p>
            <p className="text-xs text-gray-500">days practicing</p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Mastered</span>
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{overview.questionsMastered}</p>
              <p className="text-xs text-green-700 mt-1">Latest attempt correct</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-900">Needs Review</span>
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{overview.questionsNeedReview}</p>
              <p className="text-xs text-yellow-700 mt-1">Latest attempt incorrect</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Not Attempted</span>
                <FiTarget className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-600">{overview.questionsNotAttempted}</p>
              <p className="text-xs text-gray-700 mt-1">Never answered</p>
            </div>
          </div>
        </div>

        {/* Weakest Questions */}
        {weakestQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiTrendingDown className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Questions That Need Attention</h2>
            </div>
            <div className="space-y-3">
              {weakestQuestions.map((q) => (
                <div key={q.questionId} className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Q{q.questionNumber}</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{q.questionText}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{q.attemptCount} attempts</span>
                        <span>{q.correctAttempts} correct</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-red-600">{q.successRate}%</p>
                      <p className="text-xs text-gray-500">success</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strongest Questions */}
        {strongestQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900">Your Strongest Areas</h2>
            </div>
            <div className="space-y-3">
              {strongestQuestions.map((q) => (
                <div key={q.questionId} className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Q{q.questionNumber}</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{q.questionText}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{q.attemptCount} attempts</span>
                        <span>{q.correctAttempts} correct</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-green-600">{q.successRate}%</p>
                      <p className="text-xs text-gray-500">success</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Questions Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All Questions Statistics</h2>
          <div className="space-y-2">
            {questionStats.map((q) => (
              <div 
                key={q.questionId} 
                className={`p-3 rounded-lg border-2 transition-colors ${
                  q.status === 'mastered' 
                    ? 'bg-green-50 border-green-200' 
                    : q.status === 'needs_review'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-semibold text-gray-600 w-12">Q{q.questionNumber}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{q.questionText}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {q.attemptCount > 0 ? (
                      <>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Attempts</p>
                          <p className="text-sm font-bold text-gray-900">{q.attemptCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Success</p>
                          <p className={`text-sm font-bold ${
                            q.successRate >= 80 ? 'text-green-600' : 
                            q.successRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {q.successRate}%
                          </p>
                        </div>
                        {q.status === 'mastered' && (
                          <FiCheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {q.status === 'needs_review' && (
                          <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Not attempted</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
