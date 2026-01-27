'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClock } from 'react-icons/fi'

interface TestHistory {
  id: string
  testType: string
  totalQuestions: number
  score: number
  scorePercentage: number | null
  completedAt: string | null
}

function TimedTestsStats() {
  const [history, setHistory] = useState<TestHistory[]>([])
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0
  })

  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    try {
      const res = await fetch('/api/tests/history')
      const data = await res.json()
      setHistory(data.tests || [])
      
      if (data.tests?.length > 0) {
        const scores = data.tests
          .map((t: TestHistory) => Number(t.scorePercentage || 0))
          .filter((s: number) => s > 0)
        if (scores.length > 0) {
          setStats({
            totalTests: data.tests.length,
            averageScore: scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
            bestScore: Math.max(...scores)
          })
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalTests}</div>
          <div className="text-sm text-gray-600">Total Tests</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.bestScore.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Best Score</div>
        </div>
      </div>

      {/* Recent Tests */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tests</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map((test) => (
              <Link
                key={test.id}
                href={`/dashboard/timed-tests/results/${test.id}`}
                className="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">
                      {test.testType === 'FULL_TIMED' ? 'Full Test' : 'Mock Test'}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {test.totalQuestions} questions
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {test.scorePercentage ? Number(test.scorePercentage).toFixed(1) : 'N/A'}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {test.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default function TimedTestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
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
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Timed Tests</h1>
                <p className="text-sm text-gray-600">Tests with time limits</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Info Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-orange-800">
            <strong>⏱️ Timed Tests:</strong> These tests have time limits to simulate real exam conditions. Make sure you&apos;re ready before starting!
          </p>
        </div>

        {/* Tests Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Full Test Card */}
          <Link
            href="/dashboard/timed-tests/full/start"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FiClock className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Full Timed Test</h2>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700"><strong>90 questions</strong> in 90 minutes</p>
                <p className="text-sm text-gray-600">
                  54 Industry Knowledge + 36 Area Knowledge
                </p>
              </div>
              <div className="mt-auto">
                <span className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Start Full Test
                </span>
              </div>
            </div>
          </Link>

          {/* Mock Test Card */}
          <Link
            href="/dashboard/timed-tests/mock/config"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FiClock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mock Tests</h2>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700"><strong>Customizable</strong> questions and time</p>
                <p className="text-sm text-gray-600">
                  Choose 5-90 questions (increments of 5)
                </p>
              </div>
              <div className="mt-auto">
                <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Configure Mock Test
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <TimedTestsStats />
      </main>
    </div>
  )
}
