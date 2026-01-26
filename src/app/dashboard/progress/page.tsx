'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiTrendingUp, FiCheckCircle, FiClock, FiAward, FiBook } from 'react-icons/fi'

export default function ProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const overallProgress = 0
  const totalChapters = 12
  const completedChapters = 0
  const totalTests = 5
  const completedTests = 0
  const averageScore = 0
  const hoursStudied = 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your Progress</h1>
              <p className="text-sm text-gray-600">Track your learning journey</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Overall Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
              <span className="text-3xl font-bold text-white">{overallProgress}%</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Progress</h2>
            <p className="text-gray-600">Keep up the great work!</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{completedChapters}</p>
              <p className="text-sm text-gray-600">Chapters Completed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <FiAward className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{completedTests}</p>
              <p className="text-sm text-gray-600">Tests Passed</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Chapters Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiBook className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900">Chapters</h3>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">
                  {completedChapters}/{totalChapters}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completedChapters / totalChapters) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tests Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiAward className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">Tests</h3>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">
                  {completedTests}/{totalTests}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completedTests / totalTests) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">Average Score</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{averageScore}%</p>
            <p className="text-sm text-gray-600 mt-1">Across all tests</p>
          </div>

          {/* Study Time */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900">Study Time</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">{hoursStudied}h</p>
            <p className="text-sm text-gray-600 mt-1">Total hours studied</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <p>No activity yet. Start learning to see your progress!</p>
          </div>
        </div>
      </main>
    </div>
  )
}
