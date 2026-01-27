'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    try {
      const res = await fetch(`/api/tests/sessions/${params.id}/results`)
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>
  if (!results) return <div className="container mx-auto px-4 py-8">Results not found</div>

  const score = Number(results.session.scorePercentage || 0)
  const passed = score >= 80
  const stars = Math.min(5, Math.floor(score / 20))
  const timeTaken = results.session.timeAllotted - results.session.timeRemaining

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold mb-2">
            {results.session.score} / {results.session.totalQuestions}
          </div>
          <div className="text-3xl mb-4">
            {score.toFixed(1)}%
          </div>
          <div className={`text-2xl font-semibold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? 'PASSED' : 'FAILED'}
          </div>
          <div className="text-2xl">
            {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </div>
        </div>

        {/* Test Details */}
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Date:</span>{' '}
              {results.session.completedAt 
                ? new Date(results.session.completedAt).toLocaleDateString()
                : 'N/A'}
            </div>
            <div>
              <span className="text-gray-600">Type:</span>{' '}
              {results.session.testType === 'FULL_TIMED' ? 'Full Test' : 'Mock Test'}
            </div>
            <div>
              <span className="text-gray-600">Time Taken:</span>{' '}
              {Math.floor(timeTaken / 60)}:
              {String(timeTaken % 60).padStart(2, '0')}
            </div>
            <div>
              <span className="text-gray-600">Pass Mark:</span> 80%
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Industry Knowledge</h3>
            <div className="text-2xl font-bold mb-1">
              {results.session.industryScore} / {results.session.industryTotal}
            </div>
            <div className="text-gray-600">
              {Number(results.session.industryPercentage || 0).toFixed(1)}%
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-600 rounded"
                style={{ width: `${Math.min(100, Number(results.session.industryPercentage || 0))}%` }}
              />
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Area Knowledge</h3>
            <div className="text-2xl font-bold mb-1">
              {results.session.areaScore} / {results.session.areaTotal}
            </div>
            <div className="text-gray-600">
              {Number(results.session.areaPercentage || 0).toFixed(1)}%
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${Math.min(100, Number(results.session.areaPercentage || 0))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href={`/dashboard/timed-tests/review/${params.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700"
          >
            Review Answers
          </Link>
          <Link
            href="/dashboard/timed-tests"
            className="flex-1 bg-gray-600 text-white text-center py-3 rounded hover:bg-gray-700"
          >
            Take New Test
          </Link>
        </div>
      </div>
    </div>
  )
}
