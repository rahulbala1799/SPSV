'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatsCardPro } from '@/components/admin/StatsCardPro'
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiCheckCircle,
  FiBook,
  FiAward,
  FiTrendingUp,
  FiActivity,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi'

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  suspendedStudents: number
  completedStudents: number
  totalQuestions: number
  totalChapters: number
}

interface RecentActivity {
  id: string
  type: string
  student: string
  action: string
  time: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    suspendedStudents: 0,
    completedStudents: 0,
    totalQuestions: 0,
    totalChapters: 0,
  })

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/check')
      const data = await response.json()

      if (!data.authenticated || !data.isAdmin) {
        router.push('/login')
        return
      }

      setCurrentUser(data.user)

      const [studentsResponse, questionsResponse] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/questions')
      ])

      const studentsData = await studentsResponse.json()
      let questionsData = { totalQuestions: 0, chapters: [] }
      if (questionsResponse.ok) {
        questionsData = await questionsResponse.json()
      }

      if (studentsResponse.ok && studentsData.students) {
        const students = studentsData.students
        setStats({
          totalStudents: students.length,
          activeStudents: students.filter((s: any) => s.status === 'active').length,
          suspendedStudents: students.filter((s: any) => s.status === 'suspended').length,
          completedStudents: students.filter((s: any) => s.status === 'completed').length,
          totalQuestions: questionsData.totalQuestions || 0,
          totalChapters: questionsData.chapters?.length || 0,
        })
      }

      setLoading(false)
    } catch (error) {
      console.error('Error checking admin access:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <AdminLayout user={currentUser}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name || 'Admin'}! 👋
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your taxi license training platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCardPro
            title="Total Students"
            value={stats.totalStudents}
            icon={FiUsers}
            trend={{ value: '12%', isPositive: true }}
            color="blue"
          />
          <StatsCardPro
            title="Active Students"
            value={stats.activeStudents}
            icon={FiUserCheck}
            trend={{ value: '8%', isPositive: true }}
            color="green"
          />
          <StatsCardPro
            title="Completed"
            value={stats.completedStudents}
            icon={FiCheckCircle}
            trend={{ value: '23%', isPositive: true }}
            color="purple"
          />
          <StatsCardPro
            title="Suspended"
            value={stats.suspendedStudents}
            icon={FiUserX}
            trend={{ value: '3%', isPositive: false }}
            color="red"
          />
        </div>

        {/* Quick Actions & Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiActivity className="text-emerald-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/students"
                className="group p-6 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Students</h3>
                <p className="text-sm text-gray-600">
                  View, add, or edit student information
                </p>
              </Link>

              <Link
                href="/admin/questions"
                className="group p-6 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <FiBook className="w-6 h-6 text-purple-600" />
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Question Bank</h3>
                <p className="text-sm text-gray-600">
                  Manage questions and chapters
                </p>
              </Link>

              <Link
                href="/admin/mcq-builder"
                className="group p-6 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                    <FiAward className="w-6 h-6 text-orange-600" />
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Create Tests</h3>
                <p className="text-sm text-gray-600">
                  Build and assign custom MCQ tests
                </p>
              </Link>

              <Link
                href="/admin/analytics"
                className="group p-6 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                    <FiTrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">
                  View detailed performance metrics
                </p>
              </Link>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiClock />
              System Overview
            </h2>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/90">Total Chapters</span>
                  <span className="text-2xl font-bold">{stats.totalChapters}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-full"></div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/90">Questions</span>
                  <span className="text-2xl font-bold">{stats.totalQuestions}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-4/5"></div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/90">Active Tests</span>
                  <span className="text-2xl font-bold">
                    {stats.activeStudents > 0 ? stats.activeStudents : '0'}
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-3/5"></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-white/80">Platform Status</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                  S{i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Student {i} completed Chapter {i + 2}
                  </p>
                  <p className="text-xs text-gray-500">{i} hours ago</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200">
                  <span className="text-xs font-medium text-green-700">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
