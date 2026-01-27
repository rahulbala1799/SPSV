'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Configure Mock Test</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Questions
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full border rounded px-4 py-2"
          >
            {QUESTION_COUNTS.map(count => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            value={categories}
            onChange={(e) => setCategories(e.target.value as any)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="BOTH">Both (60% Industry, 40% Area)</option>
            <option value="INDUSTRY">Industry Only</option>
            <option value="AREA_KNOWLEDGE">Area Knowledge Only</option>
          </select>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Test Preview</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Time Allotted:</strong> {timeMinutes} minutes</p>
            <p><strong>Question Breakdown:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Industry: {industryCount} questions</li>
              {areaCount > 0 && <li>Area Knowledge: {areaCount} questions</li>}
            </ul>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Starting...' : 'Start Test'}
        </button>
      </div>
    </div>
  )
}
