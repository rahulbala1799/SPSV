'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiTrendingUp, FiCheckCircle, FiClock, FiAward, FiBook, FiBarChart2 } from 'react-icons/fi'

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
  const inProgressChapters = chapterProgress.filter(cp => !cp.isCompleted && cp.totalQuestions > 0).length
  const totalTests = 5
  const completedTests = 0
  const averageScore = chapterProgress.length > 0 && chapterProgress.some(cp => cp.score !== null)
    ? Math.round(chapterProgress.reduce((sum, cp) => sum + (cp.score || 0), 0) / chapterProgress.filter(cp => cp.score !== null).length)
    : 0
  const overallProgress = totalChapters > 0
    ? Math.round((completedChapters / totalChapters) * 100)
    : 0
  const totalQuestionsAnswered = chapterProgress.reduce((sum, cp) => sum + cp.totalQuestions, 0)
  const totalCorrectAnswers = chapterProgress.reduce((sum, cp) => sum + cp.correctAnswers, 0)

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
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-4 border-4 border-white/30">
              <span className="text-4xl font-bold">{overallProgress}%</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Your Learning Progress</h2>
            <p className="text-green-100">
              {overallProgress === 100 
                ? '🎉 Amazing! All chapters completed!' 
                : overallProgress > 0 
                ? 'Keep up the excellent work!' 
                : 'Start your learning journey today!'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <FiCheckCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-3xl font-bold">{completedChapters}</p>
              <p className="text-sm text-green-100">Completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <FiClock className="w-6 h-6 mx-auto mb-2" />
              <p className="text-3xl font-bold">{inProgressChapters}</p>
              <p className="text-sm text-green-100">In Progress</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <FiTrendingUp className="w-6 h-6 mx-auto mb-2" />
              <p className="text-3xl font-bold">{averageScore}%</p>
              <p className="text-sm text-green-100">Avg Score</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <FiBook className="w-6 h-6 mx-auto mb-2" />
              <p className="text-3xl font-bold">{totalQuestionsAnswered}</p>
              <p className="text-sm text-green-100">Questions</p>
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
            <h3 className="font-bold text-gray-900 mb-4">Chapter Progress</h3>
            <div className="space-y-4">
              {chapterProgress.map((cp) => (
                <div key={cp.chapterId} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{cp.chapterTitle}</h4>
                    {cp.isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                  
                  {cp.totalQuestions > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{cp.correctAnswers}</span> of{' '}
                          <span className="font-semibold text-gray-900">{cp.totalQuestions}</span> questions correct
                        </span>
                        {cp.score !== null && (
                          <span className="text-lg font-bold text-green-600">{cp.score}%</span>
                        )}
                      </div>
                      {cp.score !== null && (
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              cp.score >= 80 ? 'bg-green-500' : cp.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${cp.score}%` }}
                          ></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mb-3">No questions answered yet</p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Link
                      href={`/dashboard/chapters/southside-full`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center text-sm"
                    >
                      Practice
                    </Link>
                    {cp.totalQuestions > 0 && (
                      <Link
                        href={`/dashboard/chapters/southside-full/analytics`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center text-sm flex items-center justify-center gap-2"
                      >
                        <FiBarChart2 className="w-4 h-4" />
                        Analytics
                      </Link>
                    )}
                  </div>
                  
                  {cp.startedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last practiced: {new Date(cp.startedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
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
