'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  FiTrendingUp,
  FiClock,
  FiTarget,
  FiCheckCircle,
  FiAward,
  FiUsers,
  FiActivity,
  FiZap,
  FiStar,
  FiTrophy,
} from 'react-icons/fi'

interface StudentRanking {
  id: string
  name: string
  email: string
  rank: number
  score: number
  change: number // position change
  avatar?: string
}

interface LeaderboardMetric {
  studentsCount: number
  totalQuestions: number
  totalStudyTime: number
  averageAccuracy: number
  activeStudents: number
  completionRate: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedMetric, setSelectedMetric] = useState<string>('accuracy')

  // Leaderboard data
  const [topByAccuracy, setTopByAccuracy] = useState<StudentRanking[]>([])
  const [topByQuestions, setTopByQuestions] = useState<StudentRanking[]>([])
  const [topByTime, setTopByTime] = useState<StudentRanking[]>([])
  const [topByCompletion, setTopByCompletion] = useState<StudentRanking[]>([])
  const [topByStreak, setTopByStreak] = useState<StudentRanking[]>([])
  const [metrics, setMetrics] = useState<LeaderboardMetric | null>(null)

  useEffect(() => {
    checkAdminAndFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAdminAndFetchData = async () => {
    try {
      const authResponse = await fetch('/api/admin/check')
      const authData = await authResponse.json()

      if (!authData.authenticated || !authData.isAdmin) {
        router.push('/login')
        return
      }

      setCurrentUser(authData.user)
      await fetchAnalytics()
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      const data = await response.json()

      if (data.success) {
        setTopByAccuracy(data.topByAccuracy || [])
        setTopByQuestions(data.topByQuestions || [])
        setTopByTime(data.topByTime || [])
        setTopByCompletion(data.topByCompletion || [])
        setTopByStreak(data.topByStreak || [])
        setMetrics(data.metrics || null)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  const getCurrentLeaderboard = () => {
    switch (selectedMetric) {
      case 'accuracy':
        return topByAccuracy
      case 'questions':
        return topByQuestions
      case 'time':
        return topByTime
      case 'completion':
        return topByCompletion
      case 'streak':
        return topByStreak
      default:
        return topByAccuracy
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'accuracy':
        return 'Accuracy Rate'
      case 'questions':
        return 'Questions Answered'
      case 'time':
        return 'Study Time'
      case 'completion':
        return 'Completion Rate'
      case 'streak':
        return 'Learning Streak'
      default:
        return 'Score'
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-lg">
          <FiTrophy className="w-6 h-6" />
        </div>
      )
    if (rank === 2)
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold shadow-lg">
          {rank}
        </div>
      )
    if (rank === 3)
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold shadow-lg">
          {rank}
        </div>
      )
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold">
        {rank}
      </div>
    )
  }

  const getChangeIndicator = (change: number) => {
    if (change > 0)
      return (
        <span className="flex items-center gap-1 text-green-600 text-sm">
          <FiTrendingUp className="w-4 h-4" />+{change}
        </span>
      )
    if (change < 0)
      return (
        <span className="flex items-center gap-1 text-red-600 text-sm">
          <FiTrendingUp className="w-4 h-4 rotate-180" />
          {change}
        </span>
      )
    return <span className="text-gray-400 text-sm">—</span>
  }

  if (loading) {
    return (
      <AdminLayout user={currentUser}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={currentUser}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <FiTrophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Leaderboards</h1>
              <p className="text-gray-600">Track student performance and rankings</p>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.studentsCount}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {metrics.activeStudents} active this week
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Questions Answered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.totalQuestions.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Across all students</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FiClock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Study Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(metrics.totalStudyTime)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Cumulative learning hours</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FiTarget className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.averageAccuracy.toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Overall platform accuracy</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <FiActivity className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.completionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Average chapter progress</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FiZap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Active Learners</p>
                  <p className="text-2xl font-bold text-white">{metrics.activeStudents}</p>
                </div>
              </div>
              <p className="text-xs text-white/80">Currently studying</p>
            </div>
          </div>
        )}

        {/* Metric Selector */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'accuracy', label: 'Top by Accuracy', icon: FiTarget, color: 'emerald' },
            { id: 'questions', label: 'Top by Questions', icon: FiCheckCircle, color: 'blue' },
            { id: 'time', label: 'Top by Study Time', icon: FiClock, color: 'purple' },
            { id: 'completion', label: 'Top by Completion', icon: FiActivity, color: 'amber' },
            { id: 'streak', label: 'Top by Streak', icon: FiZap, color: 'pink' },
          ].map((metric) => {
            const Icon = metric.icon
            const isActive = selectedMetric === metric.id
            return (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? `bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 text-white shadow-lg scale-105`
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                {metric.label}
              </button>
            )
          })}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Leaderboard Header */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiAward className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">{getMetricLabel(selectedMetric)} Leaderboard</h2>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 rounded-lg font-medium text-sm">
                Top 10 Students
              </span>
            </div>
          </div>

          {/* Leaderboard Content */}
          <div className="p-6">
            {getCurrentLeaderboard().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No data available yet</p>
                <p className="text-sm text-gray-500 mt-1">Student rankings will appear once there is activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getCurrentLeaderboard().map((student, index) => (
                  <Link
                    key={student.id}
                    href={`/admin/students/${student.id}/profile`}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">{getRankBadge(student.rank)}</div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
                        {student.name?.[0] || student.email[0].toUpperCase()}
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {student.name || 'Unnamed Student'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{student.email}</p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedMetric === 'time'
                          ? formatTime(student.score)
                          : selectedMetric === 'questions'
                          ? student.score.toLocaleString()
                          : `${student.score.toFixed(1)}%`}
                      </p>
                      <p className="text-xs text-gray-500">{getMetricLabel(selectedMetric)}</p>
                    </div>

                    {/* Change Indicator */}
                    <div className="flex-shrink-0 w-16 text-right">
                      {getChangeIndicator(student.change)}
                    </div>

                    {/* Star for Top 3 */}
                    {student.rank <= 3 && (
                      <div className="flex-shrink-0">
                        <FiStar
                          className={`w-6 h-6 ${
                            student.rank === 1
                              ? 'text-yellow-500 fill-yellow-500'
                              : student.rank === 2
                              ? 'text-gray-400 fill-gray-400'
                              : 'text-amber-600 fill-amber-600'
                          }`}
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Most Improved */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Most Improved This Week</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Students showing the greatest improvement in performance
            </p>
            <div className="space-y-3">
              {getCurrentLeaderboard()
                .slice(0, 3)
                .filter((s) => s.change > 0)
                .map((student, idx) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="flex-1 font-medium truncate">{student.name || student.email}</span>
                    <span className="text-green-300 font-bold">+{student.change}</span>
                  </div>
                ))}
              {getCurrentLeaderboard().filter((s) => s.change > 0).length === 0 && (
                <p className="text-white/60 text-sm text-center py-4">No improvements tracked yet</p>
              )}
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FiActivity className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Performance Distribution</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Top Performers (80%+)</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {getCurrentLeaderboard().filter((s) => s.score >= 80).length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                    style={{
                      width: `${(getCurrentLeaderboard().filter((s) => s.score >= 80).length / getCurrentLeaderboard().length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Good (60-79%)</span>
                  <span className="text-sm font-bold text-blue-600">
                    {getCurrentLeaderboard().filter((s) => s.score >= 60 && s.score < 80).length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{
                      width: `${(getCurrentLeaderboard().filter((s) => s.score >= 60 && s.score < 80).length / getCurrentLeaderboard().length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Needs Support (&lt;60%)</span>
                  <span className="text-sm font-bold text-amber-600">
                    {getCurrentLeaderboard().filter((s) => s.score < 60).length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{
                      width: `${(getCurrentLeaderboard().filter((s) => s.score < 60).length / getCurrentLeaderboard().length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
