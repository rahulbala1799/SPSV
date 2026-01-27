'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Full Timed Test</h1>
      
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Details</h2>
        <ul className="space-y-2 mb-4">
          <li><strong>Total Questions:</strong> 90</li>
          <li><strong>Time Allotted:</strong> 90 minutes</li>
          <li><strong>Breakdown:</strong> 54 Industry + 36 Area Knowledge</li>
        </ul>
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Important Rules</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>All questions must be answered before submission</li>
          <li>Timer cannot be paused</li>
          <li>Test will auto-submit when time expires</li>
          <li>You cannot change answers after submission</li>
        </ul>
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5"
          />
          <span>I understand the test conditions</span>
        </label>
      </div>

      <button
        onClick={handleStart}
        disabled={!agreed || loading}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Starting...' : 'Start Test'}
      </button>
    </div>
  )
}
