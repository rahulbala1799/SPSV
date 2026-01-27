'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiPlay, FiBook, FiMapPin, FiClock, FiBarChart2 } from 'react-icons/fi'

interface TestHistory {
  id: string
  category: string
  questionCount: number
  state: string
  score: number | null
  createdAt: string
  completedAt: string | null
  progress: {
    answered: number
    total: number
    percentage: number
  }
}

interface Statistics {
  overall: {
    completedTests: number
    averageScore: number | null
  }
  byCategory: Record<string, {
    completedTests: number
    averageScore: number | null
  }>
}

export default function UntimedTestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  
  // Configuration state
  const [selectedCategory, setSelectedCategory] = useState<'INDUSTRY_KNOWLEDGE' | 'AREA_KNOWLEDGE' | null>(null)
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number | null>(null)
  
  // History state
  const [testHistory, setTestHistory] = useState<TestHistory[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const questionCounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 54]

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
      fetchHistory()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/tests/untimed/history?limit=10')
      if (response.ok) {
        const data = await response.json()
        setTestHistory(data.tests || [])
        setStatistics(data.statistics || null)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleCreateTest = async () => {
    if (!selectedCategory || !selectedQuestionCount) {
      alert('Please select a category and question count')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/tests/untimed/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          questionCount: selectedQuestionCount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Navigate to test taking page
        router.push(`/dashboard/tests/untimed/${data.testAttempt.id}`)
      } else {
        alert(data.error || 'Failed to create test')
      }
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    checkAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/tests"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiPlay className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Untimed Tests</h1>
                <p className="text-sm text-gray-600">Practice at your own pace</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>📚 Untimed Tests:</strong> Take your time to practice and learn. No time pressure - focus on understanding the material.
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && statistics.overall.completedTests > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FiBarChart2 className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-gray-600 font-medium">Tests Completed</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{statistics.overall.completedTests}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="w-4 h-4 text-green-600" />
                <p className="text-xs text-gray-600 font-medium">Average Score</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.overall.averageScore !== null ? `${statistics.overall.averageScore}%` : 'N/A'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FiBook className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-gray-600 font-medium">Categories</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(statistics.byCategory).length}</p>
            </div>
          </div>
        )}

        {/* Test Configuration */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Test</h2>
          
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedCategory('INDUSTRY_KNOWLEDGE')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === 'INDUSTRY_KNOWLEDGE'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedCategory === 'INDUSTRY_KNOWLEDGE' ? 'bg-blue-600' : 'bg-blue-100'
                  }`}>
                    <FiBook className={`w-6 h-6 ${
                      selectedCategory === 'INDUSTRY_KNOWLEDGE' ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Industry Knowledge</p>
                    <p className="text-xs text-gray-600">General taxi industry questions</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedCategory('AREA_KNOWLEDGE')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === 'AREA_KNOWLEDGE'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedCategory === 'AREA_KNOWLEDGE' ? 'bg-green-600' : 'bg-green-100'
                  }`}>
                    <FiMapPin className={`w-6 h-6 ${
                      selectedCategory === 'AREA_KNOWLEDGE' ? 'text-white' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Area Knowledge</p>
                    <p className="text-xs text-gray-600">London routes and locations</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Questions
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedQuestionCount(count)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    selectedQuestionCount === count
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Create Test Button */}
          <button
            onClick={handleCreateTest}
            disabled={!selectedCategory || !selectedQuestionCount || creating}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              selectedCategory && selectedQuestionCount && !creating
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {creating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Test...
              </span>
            ) : (
              'Start Test'
            )}
          </button>
        </div>

        {/* Test History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full bg-white rounded-xl p-4 shadow-sm mb-4 text-left hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiClock className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Test History</span>
              {testHistory.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {testHistory.length}
                </span>
              )}
            </div>
            <span className="text-gray-400">{showHistory ? '▲' : '▼'}</span>
          </div>
        </button>

        {/* Test History List */}
        {showHistory && (
          <div className="space-y-3">
            {loadingHistory ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : testHistory.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">No test history yet</p>
                <p className="text-sm text-gray-400 mt-1">Create your first test above!</p>
              </div>
            ) : (
              testHistory.map((test) => (
                <Link
                  key={test.id}
                  href={`/dashboard/tests/untimed/${test.id}`}
                  className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {test.category === 'INDUSTRY_KNOWLEDGE' ? '📚 Industry' : '🗺️ Area'} Knowledge
                        </span>
                        <span className="text-sm text-gray-500">• {test.questionCount} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {test.state === 'COMPLETED' ? (
                          <>
                            <span className="text-green-600 font-medium">✓ Completed</span>
                            <span>• Score: {test.score}%</span>
                          </>
                        ) : test.state === 'IN_PROGRESS' ? (
                          <>
                            <span className="text-blue-600 font-medium">⏳ In Progress</span>
                            <span>• {test.progress.answered}/{test.progress.total} answered</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Not started</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
