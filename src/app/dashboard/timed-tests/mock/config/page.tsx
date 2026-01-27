'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiSettings } from 'react-icons/fi'

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]

export default function MockTestConfigPage() {
  const router = useRouter()
  const [questionCount, setQuestionCount] = useState(10)
  const [categories, setCategories] = useState<'BOTH' | 'INDUSTRY' | 'AREA_KNOWLEDGE'>('BOTH')
  const [loading, setLoading] = useState(false)

  const timeMinutes = questionCount
  const industryCount = categories === 'BOTH' ? Math.round(questionCount * 0.6) : categories === 'INDUSTRY' ? questionCount : 0
  const areaCount = questionCount - industryCount

  async function handleStart() {
    setLoading(true)
    try {
      const res = await fetch('/api/tests/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'MOCK',
          config: {
            questionCount,
            categories
          }
        })
      })
      
      const data = await res.json()
      if (res.ok) {
        router.push(`/dashboard/timed-tests/session/${data.sessionId}`)
      } else {
        alert('Error starting test: ' + (data.error || 'Unknown error'))
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start test')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/tests/timed"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiSettings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Configure Mock Test</h1>
                <p className="text-sm text-gray-600">Customize your practice test</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-3xl mx-auto pb-20">
        <div className="space-y-6">
          {/* Question Count Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FiClock className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Number of Questions</span>
              </div>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                {QUESTION_COUNTS.map(count => (
                  <option key={count} value={count}>
                    {count} questions ({count} {count === 1 ? 'minute' : 'minutes'})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Category Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 flex">
                  <div className="w-2.5 h-5 bg-green-500 rounded-l"></div>
                  <div className="w-2.5 h-5 bg-blue-500 rounded-r"></div>
                </div>
                <span className="text-lg font-semibold text-gray-900">Question Categories</span>
              </div>
              <select
                value={categories}
                onChange={(e) => setCategories(e.target.value as any)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="BOTH">Both Categories (60% Industry, 40% Area)</option>
                <option value="INDUSTRY">Industry Knowledge Only</option>
                <option value="AREA_KNOWLEDGE">Area Knowledge Only</option>
              </select>
            </label>
          </div>

          {/* Test Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Test Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Time Allotted</span>
                <span className="text-xl font-bold text-blue-600">
                  {timeMinutes} {timeMinutes === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-700 font-medium mb-3">Question Breakdown:</div>
                <div className="space-y-2">
                  {industryCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">
                        Industry Knowledge: {industryCount} questions
                      </span>
                    </div>
                  )}
                  {areaCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">
                        Area Knowledge: {areaCount} questions
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Starting Test...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FiClock className="w-5 h-5" />
                Start Mock Test
              </span>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
