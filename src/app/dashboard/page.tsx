'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiBook,
  FiClipboard,
  FiTrendingUp, 
  FiCheckCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiFlag,
  FiAward,
  FiTarget,
  FiZap,
  FiStar
} from 'react-icons/fi'
import { BottomNav } from '@/components/dashboard/BottomNav'
import { AchievementNotification } from '@/components/motivation'
import { useAchievements } from '@/hooks/useAchievements'

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

interface StudentData {
  user: {
    name: string
    email: string
  }
  progress?: ProgressOverview
}

interface AssignedTest {
  id: string
  status: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentData | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [assignedTestsCount, setAssignedTestsCount] = useState(0)
  const [newAchievements, setNewAchievements] = useState<any[]>([])
  const { data: achievements, loading: achievementsLoading } = useAchievements()

  const checkStudentAccess = async () => {
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

      const progressResponse = await fetch('/api/student/progress')
      const progressData = await progressResponse.json()

      if (progressResponse.ok && progressData.overview) {
        setStudent({
          user: data.user,
          progress: progressData.overview
        })
      } else {
        setStudent({
          user: data.user,
          progress: {
            completedChapters: 0,
            totalChapters: 0,
            completedTests: 0,
            totalTests: 5,
            overallProgress: 0,
            inProgressChapters: 0,
            notStartedChapters: 0,
            averageScore: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0
          }
        })
      }

      try {
        const assignedTestsResponse = await fetch('/api/student/assigned-tests')
        const assignedTestsData = await assignedTestsResponse.json()
        if (assignedTestsResponse.ok && assignedTestsData.tests) {
          const notStartedCount = assignedTestsData.tests.filter((t: AssignedTest) => t.status === 'NOT_STARTED').length
          setAssignedTestsCount(notStartedCount)
        }
      } catch (error) {
        console.error('Error fetching assigned tests:', error)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error checking access:', error)
      router.push('/login')
    }
  }

  useEffect(() => {
    checkStudentAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (achievements?.newAchievements?.length) {
      setNewAchievements(achievements.newAchievements)
    }
  }, [achievements?.newAchievements])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading && !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiZap className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const progressPercentage = student.progress?.overallProgress || 0
  const firstName = student.user.name?.split(' ')[0] || 'Student'
  const accuracy = student.progress?.totalQuestionsAnswered 
    ? Math.round((student.progress.totalCorrectAnswers / student.progress.totalQuestionsAnswered) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {student.user.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-gray-900">
                  {firstName}
                </h1>
                <p className="text-xs text-gray-500">SPSV Taxi Course</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {menuOpen ? <FiX className="w-6 h-6 text-gray-700" /> : <FiMenu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1 max-w-7xl mx-auto">
              <Link
                href="/dashboard/flagged-questions"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <FiFlag className="w-5 h-5 text-red-500" />
                <span className="font-medium">Flagged Questions</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto pb-24">
        {/* Hero Section with Progress */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {firstName}! 👋
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {progressPercentage > 75 
              ? "You're doing amazing! Keep up the great work!"
              : progressPercentage > 50 
              ? "Great progress! You're over halfway there!"
              : progressPercentage > 25
              ? "Keep going! You're making steady progress!"
              : "Let's get started on your learning journey!"}
          </p>
        </div>

        {/* Main Progress Card */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl shadow-2xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Overall Progress</p>
                <p className="text-5xl md:text-6xl font-bold">{progressPercentage}%</p>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiTrendingUp className="w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 mb-6 overflow-hidden">
              <div
                className="bg-white h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiBook className="w-5 h-5 text-green-200" />
                  <p className="text-sm text-green-100">Chapters</p>
                </div>
                <p className="text-2xl font-bold">{student.progress?.completedChapters}/{student.progress?.totalChapters}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiClipboard className="w-5 h-5 text-green-200" />
                  <p className="text-sm text-green-100">Tests</p>
                </div>
                <p className="text-2xl font-bold">{student.progress?.untimedTests?.completed || 0}/{student.progress?.untimedTests?.total || 0}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiTarget className="w-5 h-5 text-green-200" />
                  <p className="text-sm text-green-100">Accuracy</p>
                </div>
                <p className="text-2xl font-bold">{accuracy}%</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheckCircle className="w-5 h-5 text-green-200" />
                  <p className="text-sm text-green-100">Questions</p>
                </div>
                <p className="text-2xl font-bold">{student.progress?.totalQuestionsAnswered || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {/* Chapters */}
            <Link
              href="/dashboard/chapters"
              className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl p-5 transition-all transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <FiBook className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Chapters</h4>
              <p className="text-xs text-gray-500">Study materials</p>
              {student.progress && student.progress.totalChapters > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-green-600">
                      {Math.round((student.progress.completedChapters / student.progress.totalChapters) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(student.progress.completedChapters / student.progress.totalChapters) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </Link>

            {/* Tests */}
            <Link
              href="/dashboard/tests"
              className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl p-5 transition-all transform hover:-translate-y-1 relative"
            >
              {assignedTestsCount > 0 && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {assignedTestsCount}
                </div>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <FiClipboard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Tests</h4>
              <p className="text-xs text-gray-500">
                {assignedTestsCount > 0 ? `${assignedTestsCount} new` : 'Practice tests'}
              </p>
            </Link>

            {/* Progress */}
            <Link
              href="/dashboard/progress"
              className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-2xl shadow-lg hover:shadow-xl p-5 transition-all transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <FiAward className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Progress</h4>
              <p className="text-xs text-gray-500">Track performance</p>
            </Link>

            {/* Achievements */}
            <Link
              href="/dashboard/achievements"
              className="group bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 rounded-2xl shadow-lg hover:shadow-xl p-5 transition-all transform hover:-translate-y-1 relative"
            >
              {newAchievements.length > 0 && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {newAchievements.length}
                </div>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <FiAward className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Achievements</h4>
              <p className="text-xs text-gray-500">
                {achievements ? `${achievements.achievements.totalEarned} unlocked` : 'View rewards'}
              </p>
            </Link>
          </div>
        </div>

        {/* Performance Insights */}
        {student.progress && student.progress.totalQuestionsAnswered > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Insights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiTarget className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Questions Answered</p>
                    <p className="text-2xl font-bold text-gray-900">{student.progress.totalQuestionsAnswered}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <span className="font-bold">{student.progress.totalCorrectAnswers}</span> correct answers
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiStar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{student.progress.averageScore}%</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-700">
                    {student.progress.averageScore >= 80 ? 'Excellent!' : student.progress.averageScore >= 60 ? 'Good progress!' : 'Keep practicing!'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiZap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{student.progress.inProgressChapters}</p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700">
                    Chapters in progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements & Level Section */}
        {achievements && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Level Progress Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Your Level</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-900">{achievements.points.level}</p>
                      <p className="text-sm text-gray-500">{achievements.points.levelTitle}</p>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FiStar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{achievements.points.currentXP.toLocaleString()} XP</span>
                    <span>{achievements.points.nextLevelXP.toLocaleString()} XP</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${achievements.points.progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total Points</p>
                    <p className="text-lg font-bold text-gray-900">{achievements.points.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Day Streak</p>
                    <p className="text-lg font-bold text-gray-900">🔥 {achievements.points.currentStreak}</p>
                  </div>
                </div>
              </div>

              {/* Trophies Preview */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trophy Cabinet</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {achievements.achievements.trophies.length} / {achievements.achievements.totalAvailable - achievements.achievements.medals.length - achievements.achievements.badges.length}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🏆</span>
                  </div>
                </div>
                {achievements.achievements.trophies.length > 0 ? (
                  <div className="flex gap-2 mb-3">
                    {achievements.achievements.trophies.slice(0, 3).map((trophy: any) => (
                      <div
                        key={trophy.id}
                        className="w-16 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md"
                        title={trophy.name}
                      >
                        <span className="text-3xl">{trophy.icon}</span>
                      </div>
                    ))}
                    {achievements.achievements.trophies.length > 3 && (
                      <div className="w-16 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-500">+{achievements.achievements.trophies.length - 3}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Complete major milestones to earn trophies!</p>
                )}
                <Link
                  href="/dashboard/achievements"
                  className="text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors"
                >
                  View All Achievements →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Card */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiZap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">Keep Learning!</h3>
              <p className="text-sm text-white/90 mb-3">
                {progressPercentage < 25 
                  ? "Start your learning journey today. Consistency is key!"
                  : progressPercentage < 75
                  ? "You're making great progress! Keep up the momentum!"
                  : "You're almost there! Finish strong!"}
              </p>
              <Link
                href="/dashboard/chapters"
                className="inline-block bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Continue Learning →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Achievement Notifications */}
      {newAchievements.map((achievement, index) => (
        <AchievementNotification
          key={achievement.code}
          achievement={achievement}
          onClose={() => {
            setNewAchievements(prev => prev.filter(a => a.code !== achievement.code))
          }}
          autoCloseDelay={5000}
        />
      ))}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
