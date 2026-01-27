'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiBarChart2, FiRefreshCw, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import TimedTestTrendsSection from '@/components/progress/TimedTestTrendsSection'

interface TestHistory {
  id: string
  testType: string
  totalQuestions: number
  score: number
  scorePercentage: number | null
  completedAt: string | null
  startedAt: string | null
}

export default function TimedTestsAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<TestHistory[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'trends'>('overview')
  const [trendsPeriod, setTrendsPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('all')

  const checkAccess = async () => {
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

      setLoading(false)
      loadData()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadData = async () => {
    try {
      const response = await fetch('/api/tests/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.tests || [])
      }
    } catch (error) {
      console.error('Error loading timed tests history:', error)
    }
  }

  useEffect(() => {
    checkAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculate statistics from history
  const stats = {
    totalTests: history.length,
    averageScore: history.length > 0
      ? history
          .map(t => Number(t.scorePercentage || 0))
          .filter(s => s > 0)
          .reduce((a, b) => a + b, 0) / history.filter(t => Number(t.scorePercentage || 0) > 0).length
      : 0,
    bestScore: history.length > 0
      ? Math.max(...history.map(t => Number(t.scorePercentage || 0)).filter(s => s > 0))
      : 0,
    passedTests: history.filter(t => Number(t.scorePercentage || 0) >= 80).length,
    fullTests: history.filter(t => t.testType === 'FULL_TIMED').length,
    mockTests: history.filter(t => t.testType === 'MOCK').length,
  }

  // Calculate trends data
  const calculateTrends = () => {
    const now = new Date()
    let startDate: Date | null = null

    switch (trendsPeriod) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = null
    }

    const filteredHistory = startDate
      ? history.filter(t => t.completedAt && new Date(t.completedAt) >= startDate!)
      : history

    const scoreTrend = filteredHistory
      .filter(t => t.completedAt && t.scorePercentage)
      .map(t => ({
        date: t.completedAt!,
        score: Number(t.scorePercentage || 0),
        testId: t.id,
        testType: t.testType,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate improvement metrics
    const scores = scoreTrend.map(t => t.score)
    const firstScore = scores[0] || 0
    const lastScore = scores[scores.length - 1] || 0
    const scoreImprovement = firstScore > 0 ? lastScore - firstScore : 0

    // Calculate consistency (standard deviation)
    const mean = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const variance = scores.length > 0
      ? scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
      : 0
    const consistencyScore = Math.sqrt(variance)

    // Calculate average improvement per test
    const improvements = []
    for (let i = 1; i < scores.length; i++) {
      improvements.push(scores[i] - scores[i - 1])
    }
    const averageImprovement = improvements.length > 0
      ? improvements.reduce((a, b) => a + b, 0) / improvements.length
      : 0

    return {
      scoreTrend,
      industryTrend: scoreTrend, // Simplified - would need category breakdown from API
      areaTrend: scoreTrend, // Simplified - would need category breakdown from API
      timeEfficiency: filteredHistory
        .filter(t => t.completedAt && t.startedAt)
        .map(t => {
          const start = new Date(t.startedAt!)
          const end = new Date(t.completedAt!)
          const timeUsedSeconds = Math.floor((end.getTime() - start.getTime()) / 1000)
          return {
            date: t.completedAt!,
            timeUsedSeconds,
            timeUsedMinutes: Math.floor(timeUsedSeconds / 60),
            timePerQuestion: t.totalQuestions > 0 ? timeUsedSeconds / t.totalQuestions : 0,
            questionsCount: t.totalQuestions,
            testId: t.id,
          }
        }),
      testTypeBreakdown: {
        FULL_TIMED: stats.fullTests,
        MOCK: stats.mockTests,
      },
      improvement: {
        scoreImprovement: Math.round(scoreImprovement * 10) / 10,
        consistencyScore: Math.round(consistencyScore * 10) / 10,
        averageImprovement: Math.round(averageImprovement * 10) / 10,
      },
      weeklyActivity: [], // Would need to calculate from API
      monthlyActivity: [], // Would need to calculate from API
    }
  }

  const trendsData = calculateTrends()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'trends', label: 'Trends', icon: FiClock },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/progress"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Timed Tests Analytics</h1>
                <p className="text-sm text-gray-600">Performance metrics and insights</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <FiRefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto pb-20">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiClock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Tests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiBarChart2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '0'}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Best Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.bestScore > 0 ? stats.bestScore.toFixed(1) : '0'}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passed Tests</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.passedTests} / {stats.totalTests}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Type Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Type Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Full Timed Tests</span>
                      <span className="font-semibold text-gray-900">{stats.fullTests}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${stats.totalTests > 0 ? (stats.fullTests / stats.totalTests) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Mock Tests</span>
                      <span className="font-semibold text-gray-900">{stats.mockTests}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${stats.totalTests > 0 ? (stats.mockTests / stats.totalTests) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tests */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h3>
                {history.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No tests taken yet</p>
                ) : (
                  <div className="space-y-3">
                    {history.slice(0, 5).map((test) => (
                      <Link
                        key={test.id}
                        href={`/dashboard/timed-tests/results/${test.id}`}
                        className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-900">
                              {test.testType === 'FULL_TIMED' ? 'Full Test' : 'Mock Test'}
                            </span>
                            <span className="text-gray-600 ml-2 text-sm">
                              {test.totalQuestions} questions
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              Number(test.scorePercentage || 0) >= 80 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {test.scorePercentage ? Number(test.scorePercentage).toFixed(1) : 'N/A'}%
                            </div>
                            <div className="text-xs text-gray-600">
                              {test.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Empty State */}
            {history.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                <FiClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Timed Tests Yet</h3>
                <p className="text-gray-600 mb-6">
                  Take your first timed test to see comprehensive performance metrics here.
                </p>
                <Link
                  href="/dashboard/tests/timed"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Take Your First Timed Test
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <TimedTestTrendsSection
            trends={trendsData}
            period={trendsPeriod}
            onPeriodChange={setTrendsPeriod}
          />
        )}
      </main>
    </div>
  )
}
