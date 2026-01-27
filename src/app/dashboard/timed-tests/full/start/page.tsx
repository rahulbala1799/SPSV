'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiAlertCircle } from 'react-icons/fi'

export default function FullTestStartPage() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleStart() {
    if (!agreed) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/tests/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'FULL_TIMED'
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
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Full Timed Test</h1>
                <p className="text-sm text-gray-600">90 questions in 90 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-3xl mx-auto pb-20">
        {/* Test Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiClock className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Test Details</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Questions</span>
              <span className="text-xl font-bold text-gray-900">90</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Time Allotted</span>
              <span className="text-xl font-bold text-gray-900">90 minutes</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-700 mb-2">Question Breakdown:</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">54 Industry Knowledge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold">36 Area Knowledge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Rules Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertCircle className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Important Rules</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">Questions can be answered in any order</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 mt-1">⚠️</span>
              <span className="text-gray-700">Timer cannot be paused once started</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 mt-1">⚠️</span>
              <span className="text-gray-700">Test will auto-submit when time expires</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-600 mt-1">✗</span>
              <span className="text-gray-700">You cannot change answers after submission</span>
            </li>
          </ul>
        </div>

        {/* Agreement Checkbox */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-6 h-6 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-900">
              I understand and agree to the test conditions. I am ready to begin the timed test.
            </span>
          </label>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={!agreed || loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Starting Test...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FiClock className="w-5 h-5" />
              Start Full Test
            </span>
          )}
        </button>
      </main>
    </div>
  )
}
