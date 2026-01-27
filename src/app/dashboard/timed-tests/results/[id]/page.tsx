'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiAward, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Results not found</p>
          <Link href="/dashboard/timed-tests" className="text-blue-600 hover:underline mt-2 inline-block">
            Return to Timed Tests
          </Link>
        </div>
      </div>
    )
  }

  const score = Number(results.session.scorePercentage || 0)
  const passed = score >= 80
  const stars = Math.min(5, Math.floor(score / 20))
  const timeTaken = results.session.timeAllotted - results.session.timeRemaining

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/timed-tests"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <FiCheckCircle className={`w-5 h-5 ${passed ? 'text-green-600' : 'text-red-600'}`} />
                ) : (
                  <FiXCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Test Results</h1>
                <p className="text-sm text-gray-600">
                  {results.session.testType === 'FULL_TIMED' ? 'Full Test' : 'Mock Test'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Hero Result Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <FiCheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <FiXCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {results.session.score} / {results.session.totalQuestions}
          </div>
          <div className="text-4xl font-bold mb-4" style={{
            color: passed ? '#16a34a' : '#dc2626'
          }}>
            {score.toFixed(1)}%
          </div>
          <div className={`text-2xl font-bold mb-3 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? '✓ PASSED' : '✗ FAILED'}
          </div>
          <div className="text-3xl">
            {'⭐'.repeat(stars)}{stars < 5 && '☆'.repeat(5 - stars)}
          </div>
        </div>

        {/* Test Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiAward className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Test Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Date</div>
              <div className="font-semibold text-gray-900">
                {results.session.completedAt 
                  ? new Date(results.session.completedAt).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Type</div>
              <div className="font-semibold text-gray-900">
                {results.session.testType === 'FULL_TIMED' ? 'Full Test' : 'Mock Test'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                Time Taken
              </div>
              <div className="font-semibold text-gray-900">
                {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, '0')}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Pass Mark</div>
              <div className="font-semibold text-gray-900">80%</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-900">Industry Knowledge</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {results.session.industryScore} / {results.session.industryTotal}
            </div>
            <div className="text-xl font-semibold text-green-600 mb-3">
              {Number(results.session.industryPercentage || 0).toFixed(1)}%
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-green-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, Number(results.session.industryPercentage || 0))}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-900">Area Knowledge</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {results.session.areaScore} / {results.session.areaTotal}
            </div>
            <div className="text-xl font-semibold text-blue-600 mb-3">
              {Number(results.session.areaPercentage || 0).toFixed(1)}%
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, Number(results.session.areaPercentage || 0))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href={`/dashboard/timed-tests/review/${params.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            📝 Review Answers
          </Link>
          <Link
            href="/dashboard/timed-tests"
            className="bg-green-600 hover:bg-green-700 text-white text-center py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            🔄 Take New Test
          </Link>
        </div>
      </main>
    </div>
  )
}
