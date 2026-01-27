'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TestHistory {
  id: string
  testType: string
  totalQuestions: number
  score: number
  scorePercentage: number | null
  completedAt: string | null
}

export default function TimedTestsPage() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Timed Tests</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Full Test Card */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Full Timed Test</h2>
          <div className="space-y-2 mb-4">
            <p><strong>90 questions</strong> in 90 minutes</p>
            <p className="text-sm text-gray-600">
              54 Industry Knowledge + 36 Area Knowledge
            </p>
          </div>
          <Link
            href="/dashboard/timed-tests/full/start"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Start Full Test
          </Link>
        </div>

        {/* Mock Test Card */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Mock Tests</h2>
          <div className="space-y-2 mb-4">
            <p><strong>Customizable</strong> questions and time</p>
            <p className="text-sm text-gray-600">
              Choose 5-90 questions (increments of 5)
            </p>
          </div>
          <Link
            href="/dashboard/timed-tests/mock/config"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Configure Mock Test
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.totalTests}</div>
          <div className="text-sm text-gray-600">Total Tests</div>
        </div>
        <div className="border rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
        <div className="border rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.bestScore.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Best Score</div>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
        {history.length === 0 ? (
          <p className="text-gray-600">No tests taken yet</p>
        ) : (
          <div className="space-y-2">
            {history.map((test) => (
              <Link
                key={test.id}
                href={`/dashboard/timed-tests/results/${test.id}`}
                className="block border rounded p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {test.testType === 'FULL_TIMED' ? 'Full Test' : 'Mock Test'}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {test.totalQuestions} questions
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
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
        )}
      </div>
    </div>
  )
}
