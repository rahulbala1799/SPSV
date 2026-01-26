'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiTrendingUp, FiCheckCircle, FiClock, FiAward, FiBook } from 'react-icons/fi'

interface ChapterProgress {
  chapterId: string
  chapterTitle: string
  isCompleted: boolean
  score: number | null
  correctAnswers: number
  totalQuestions: number
  startedAt: string | null
  completedAt: string | null
}

export default function ProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([])

  const checkAccessAndLoad = async () => {
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

      await loadChapterProgress()
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadChapterProgress = async () => {
    try {
      // Load Southside Full chapter progress
      const response = await fetch('/api/chapters/chapter_southside_full/progress')
      const data = await response.json()

      if (response.ok && data.progress) {
        setChapterProgress([{
          chapterId: 'chapter_southside_full',
          chapterTitle: 'Southside Full',
          isCompleted: data.progress.isCompleted,
          score: data.progress.score,
          correctAnswers: data.progress.correctAnswers,
          totalQuestions: data.progress.totalQuestions,
          startedAt: data.progress.startedAt,
          completedAt: data.progress.completedAt
        }])
      }
    } catch (error) {
      console.error('Error loading chapter progress:', error)
    }
  }

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Calculate stats from chapter progress
  const totalChapters = 1 // Currently only Southside Full
  const completedChapters = chapterProgress.filter(cp => cp.isCompleted).length
  const totalTests = 5
  const completedTests = 0
  const averageScore = chapterProgress.length > 0
    ? Math.round(chapterProgress.reduce((sum, cp) => sum + (cp.score || 0), 0) / chapterProgress.length)
    : 0
  const overallProgress = totalChapters > 0
    ? Math.round((completedChapters / totalChapters) * 100)
    : 0
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

        {/* Chapter Results */}
        {chapterProgress.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Chapter Results</h3>
            <div className="space-y-4">
              {chapterProgress.map((cp) => (
                <Link
                  key={cp.chapterId}
                  href={`/dashboard/chapters/southside-full`}
                  className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-green-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{cp.chapterTitle}</h4>
                    {cp.isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>
                      <span className="font-semibold text-gray-900">{cp.correctAnswers}</span> / {cp.totalQuestions} correct
                    </span>
                    {cp.score !== null && (
                      <span className="font-semibold text-green-600">{cp.score}%</span>
                    )}
                  </div>
                  {cp.score !== null && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          cp.score >= 80 ? 'bg-green-500' : cp.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${cp.score}%` }}
                      ></div>
                    </div>
                  )}
                  {cp.startedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Started: {new Date(cp.startedAt).toLocaleDateString()}
                      {cp.completedAt && ` • Completed: ${new Date(cp.completedAt).toLocaleDateString()}`}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            {chapterProgress.length === 0 ? (
              <p>No activity yet. Start learning to see your progress!</p>
            ) : (
              <p>Keep practicing to see more activity here!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
