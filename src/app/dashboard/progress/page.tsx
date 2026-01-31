'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiTrendingUp, FiCheckCircle, FiClock, FiAward, FiBook, FiBarChart2, FiTarget, FiZap } from 'react-icons/fi'

interface ChapterProgress {
  chapterId: string
  chapterTitle: string
  chapterNumber: number
  description: string | null
  totalQuestionsInChapter: number
  isCompleted: boolean
  score: number | null
  correctAnswers: number
  totalQuestions: number
  startedAt: string | null
  completedAt: string | null
  lastAccessed: string | null
  hasStarted: boolean
}

interface RecentCompletion {
  chapterId: string
  chapterTitle: string
  chapterNumber: number
  score: number | null
  completedAt: string | null
}

interface ProgressOverview {
  totalChapters: number
  completedChapters: number
  inProgressChapters: number
  notStartedChapters: number
  averageScore: number
  overallProgress: number
  totalQuestionsAnswered: number
  totalCorrectAnswers: number
  totalTests: number
  completedTests: number
  untimedTests?: {
    total: number
    completed: number
    averageScore: number | null
    totalQuestions: number
    totalCorrect: number
  }
}

interface RecentTestCompletion {
  testId: string
  category: string
  questionCount: number
  score: number | null
  completedAt: string | null
}

interface AnalyticsSummary {
  overall: {
    totalAttempts: number
    correctAttempts: number
    overallSuccessRate: number
    totalQuestionsAttempted: number
    daysStudied: number
    studyDuration: number
    recentSuccessRate: number
    recentActivityCount: number
  }
  difficultyStats: {
    easy: { total: number; correct: number; successRate: number }
    medium: { total: number; correct: number; successRate: number }
    hard: { total: number; correct: number; successRate: number }
  }
  strongestChapters: Array<{
    chapterTitle: string
    successRate: number
    questionsAttempted: number
  }>
  weakestChapters: Array<{
    chapterTitle: string
    successRate: number
    questionsAttempted: number
  }>
}

export default function ProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([])
  const [recentCompletions, setRecentCompletions] = useState<RecentCompletion[]>([])
  const [recentTestCompletions, setRecentTestCompletions] = useState<RecentTestCompletion[]>([])
  const [overview, setOverview] = useState<ProgressOverview | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)

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
      // Load all chapter progress from the new API
      const response = await fetch('/api/student/progress')
      const data = await response.json()

      if (response.ok) {
        setOverview(data.overview)
        setChapterProgress(data.chapterProgress || [])
        setRecentCompletions(data.recentCompletions || [])
        setRecentTestCompletions(data.recentTestCompletions || [])
      }

      // Load analytics summary
      const analyticsResponse = await fetch('/api/student/analytics')
      const analyticsData = await analyticsResponse.json()

      if (analyticsResponse.ok) {
        setAnalytics(analyticsData)
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

  // Use stats from API overview
  const totalChapters = overview?.totalChapters || 0
  const completedChapters = overview?.completedChapters || 0
  const inProgressChapters = overview?.inProgressChapters || 0
  const totalTests = overview?.totalTests || 5
  const completedTests = overview?.completedTests || 0
  const averageScore = overview?.averageScore || 0
  const overallProgress = overview?.overallProgress || 0
  const totalQuestionsAnswered = overview?.totalQuestionsAnswered || 0
  const totalCorrectAnswers = overview?.totalCorrectAnswers || 0

  // Helper function to get chapter route
  const getChapterRoute = (chapterId: string) => {
    // Map chapter IDs to their routes
    const routeMap: Record<string, string> = {
      'chapter_southside_full': 'southside-full',
      'chapter_industry_part1': 'industry-part1',
      'chapter_industry_part2': 'industry-part2',
      'chapter_industry_part3': 'industry-part3',
      'chapter_industry_5': 'industry-5',
      'chapter_industry_7': 'industry-7',
      'chapter_industry_8': 'industry-8',
      'chapter_schools_libraries_universities': 'schools-libraries-universities',
      'chapter_dublin_roads_navigation': 'dublin-roads-navigation',
      'chapter_routes': 'routes'
    }
    return routeMap[chapterId] || chapterId.replace('chapter_', '').replace(/_/g, '-')
  }

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

          {analytics && analytics.overall.totalAttempts > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-colors"
              >
                <span className="font-semibold">Detailed Analytics</span>
                <FiBarChart2 className={`w-5 h-5 transition-transform ${showAnalytics ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Analytics Summary (expandable) */}
        {showAnalytics && analytics && analytics.overall.totalAttempts > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTarget className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">Analytics Overview</h3>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.overall.overallSuccessRate}%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Days Studied</p>
                <p className="text-2xl font-bold text-green-600">{analytics.overall.daysStudied}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Total Attempts</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.overall.totalAttempts}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-xs text-gray-600 mb-1">Recent (7d)</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.overall.recentSuccessRate}%</p>
              </div>
            </div>

            {/* Difficulty Performance */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Performance by Difficulty</h4>
              <div className="space-y-3">
                {['easy', 'medium', 'hard'].map((difficulty) => {
                  const stat = analytics.difficultyStats[difficulty as keyof typeof analytics.difficultyStats]
                  return (
                    <div key={difficulty} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-20 capitalize">{difficulty}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            difficulty === 'easy' ? 'bg-green-500' : 
                            difficulty === 'medium' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${stat.successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-16 text-right">
                        {stat.successRate}%
                      </span>
                      <span className="text-xs text-gray-500 w-20 text-right">
                        ({stat.correct}/{stat.total})
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Strongest/Weakest Chapters */}
            {(analytics.strongestChapters.length > 0 || analytics.weakestChapters.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.strongestChapters.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FiZap className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Strongest Chapters</h4>
                    </div>
                    <div className="space-y-2">
                      {analytics.strongestChapters.map((chapter, idx) => (
                        <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{chapter.chapterTitle}</span>
                            <span className="text-lg font-bold text-green-600">{chapter.successRate}%</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {chapter.questionsAttempted} questions attempted
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analytics.weakestChapters.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FiTarget className="w-4 h-4 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Need More Practice</h4>
                    </div>
                    <div className="space-y-2">
                      {analytics.weakestChapters.map((chapter, idx) => (
                        <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{chapter.chapterTitle}</span>
                            <span className="text-lg font-bold text-orange-600">{chapter.successRate}%</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {chapter.questionsAttempted} questions attempted
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

          {/* Untimed Tests Progress */}
          <Link
            href="/dashboard/progress/tests"
            className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiAward className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Untimed Tests</h3>
              </div>
              <FiBarChart2 className="w-5 h-5 text-gray-400" />
            </div>
            {overview?.untimedTests && overview.untimedTests.total > 0 ? (
              <>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {overview.untimedTests.completed}/{overview.untimedTests.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(overview.untimedTests.completed / overview.untimedTests.total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                {overview.untimedTests.averageScore !== null && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-blue-600">{overview.untimedTests.averageScore}%</p>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-sm text-blue-600 font-medium flex items-center gap-2">
                    View detailed metrics →
                  </p>
                </div>
              </>
            ) : (
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">No tests yet</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-300 h-2 rounded-full"
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <Link
                  href="/dashboard/tests/untimed"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start your first test →
                </Link>
              </div>
            )}
          </Link>

          {/* Timed Tests Progress */}
          <Link
            href="/dashboard/progress/timed-tests"
            className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiClock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Timed Tests</h3>
              </div>
              <FiBarChart2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Click to view</span>
                <span className="font-medium text-gray-900">Analytics</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-purple-600 font-medium flex items-center gap-2">
                  View detailed metrics →
                </p>
              </div>
            </div>
          </Link>

        </div>

        {/* Recent Completions */}
        {(recentCompletions.length > 0 || recentTestCompletions.length > 0) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900">Recent Completions</h3>
            </div>
            <div className="space-y-3">
              {/* Chapter Completions */}
              {recentCompletions.map((completion) => (
                <div key={completion.chapterId} className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FiBook className="w-4 h-4 text-green-600" />
                        <h4 className="font-semibold text-gray-900">{completion.chapterTitle}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Completed: {completion.completedAt ? new Date(completion.completedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    {completion.score !== null && (
                      <span className="text-2xl font-bold text-green-600">{completion.score}%</span>
                    )}
                  </div>
                </div>
              ))}
              {/* Test Completions */}
              {recentTestCompletions.map((test) => (
                <Link
                  key={test.testId}
                  href={`/dashboard/tests/untimed/${test.testId}/results`}
                  className="block p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FiAward className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">
                          {test.category === 'INDUSTRY_KNOWLEDGE' ? 'Industry' : 'Area'} Knowledge Test
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {test.questionCount} questions • Completed: {test.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    {test.score !== null && (
                      <span className="text-2xl font-bold text-blue-600">{test.score}%</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Chapters Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">All Chapters</h3>
          {chapterProgress.length > 0 ? (
            <div className="space-y-4">
              {chapterProgress.map((cp) => (
                <div 
                  key={cp.chapterId} 
                  className={`p-4 rounded-xl border-2 ${
                    cp.isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : cp.hasStarted 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">Chapter {cp.chapterNumber}</span>
                        {cp.isCompleted && (
                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <FiCheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                        {!cp.isCompleted && cp.hasStarted && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            In Progress
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg">{cp.chapterTitle}</h4>
                      {cp.description && (
                        <p className="text-sm text-gray-600 mt-1">{cp.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {cp.hasStarted && cp.totalQuestions > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{cp.correctAnswers}</span> of{' '}
                          <span className="font-semibold text-gray-900">{cp.totalQuestions}</span> answered correctly
                          {cp.totalQuestionsInChapter > cp.totalQuestions && (
                            <span className="text-gray-500"> ({cp.totalQuestionsInChapter} total available)</span>
                          )}
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
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">
                        {cp.totalQuestionsInChapter > 0 
                          ? `${cp.totalQuestionsInChapter} questions available` 
                          : 'No questions available yet'}
                      </p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Link
                      href={`/dashboard/chapters/${getChapterRoute(cp.chapterId)}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center text-sm"
                    >
                      {cp.hasStarted ? 'Continue' : 'Start'} Practice
                    </Link>
                    {cp.hasStarted && cp.totalQuestions > 0 && (
                      <Link
                        href={`/dashboard/chapters/${getChapterRoute(cp.chapterId)}/analytics`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center text-sm flex items-center justify-center gap-2"
                      >
                        <FiBarChart2 className="w-4 h-4" />
                        Analytics
                      </Link>
                    )}
                  </div>
                  
                  {cp.lastAccessed && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last accessed: {new Date(cp.lastAccessed).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No chapters available yet.</p>
            </div>
          )}
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Study Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-gray-900">{totalQuestionsAnswered}</p>
              <p className="text-sm text-gray-600 mt-1">Total Questions</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{totalCorrectAnswers}</p>
              <p className="text-sm text-gray-600 mt-1">Correct Answers</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{inProgressChapters}</p>
              <p className="text-sm text-gray-600 mt-1">In Progress</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
