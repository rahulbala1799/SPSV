'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiBook, 
  FiClipboard, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle,
  FiCalendar,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX
} from 'react-icons/fi'

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
}

interface StudentData {
  user: {
    name: string
    email: string
  }
  progress?: ProgressOverview
}

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentData | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const checkStudentAccess = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (!response.ok || !data.user) {
        router.push('/login')
        return
      }

      // If admin, redirect to admin dashboard
      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        router.push('/admin')
        return
      }

      // Fetch real progress data
      const progressResponse = await fetch('/api/student/progress')
      const progressData = await progressResponse.json()

      if (progressResponse.ok && progressData.overview) {
        setStudent({
          user: data.user,
          progress: progressData.overview
        })
      } else {
        // Fallback to empty progress
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const progressPercentage = student.progress?.overallProgress || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                {student.user.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Hi, {student.user.name?.split(' ')[0] || 'Student'}!
                </h1>
                <p className="text-xs text-gray-600">SPSV Taxi Course</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <FiUser className="w-5 h-5" />
                  <span>My Profile</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto pb-20">
        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Your Progress</h2>
            <span className="text-2xl font-bold text-green-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">
                {student.progress?.completedChapters}/{student.progress?.totalChapters}
              </p>
              <p className="text-xs text-gray-600 mt-1">Chapters</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">-</p>
              <p className="text-xs text-gray-600 mt-1">Tests</p>
            </div>
          </div>
          {student.progress && student.progress.totalQuestionsAnswered > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-bold text-gray-900">{student.progress.totalQuestionsAnswered}</p>
                  <p className="text-xs text-gray-600">Questions</p>
                </div>
                <div>
                  <p className="font-bold text-green-600">{student.progress.averageScore}%</p>
                  <p className="text-xs text-gray-600">Avg Score</p>
                </div>
                <div>
                  <p className="font-bold text-blue-600">{student.progress.inProgressChapters}</p>
                  <p className="text-xs text-gray-600">In Progress</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Chapters */}
          <Link
            href="/dashboard/chapters"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <FiBook className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {student.progress?.completedChapters} of {student.progress?.totalChapters}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chapters</h3>
            <p className="text-sm text-gray-600">Study course materials and lessons</p>
          </Link>

          {/* Tests */}
          <Link
            href="/dashboard/tests"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <FiClipboard className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tests</h3>
            <p className="text-sm text-gray-600">Practice tests and assessments</p>
          </Link>

          {/* Progress */}
          <Link
            href="/dashboard/progress"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <FiTrendingUp className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                {progressPercentage}%
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Progress</h3>
            <p className="text-sm text-gray-600">Track your learning journey</p>
          </Link>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Additional Resources</h2>
          <div className="space-y-3">
            <Link
              href="/spsv-manual"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiBook className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">SPSV Manual</h3>
                <p className="text-sm text-gray-600">Complete study manual</p>
              </div>
            </Link>

            <Link
              href="/test-guide"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClipboard className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Test Guide</h3>
                <p className="text-sm text-gray-600">Preparation guidelines</p>
              </div>
            </Link>

            <Link
              href="/timetable"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Timetable</h3>
                <p className="text-sm text-gray-600">Class schedule</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
