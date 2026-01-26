'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatsCard } from '@/components/admin/StatsCard'
import { FiUsers, FiUserCheck, FiUserX, FiBookOpen, FiSettings } from 'react-icons/fi'

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  suspendedStudents: number
  completedStudents: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    suspendedStudents: 0,
    completedStudents: 0
  })

  const checkAdminAccess = async () => {
    try {
      // Check if user is admin
      const response = await fetch('/api/admin/check')
      const data = await response.json()

      if (!data.authenticated || !data.isAdmin) {
        router.push('/login')
        return
      }

      setCurrentUser(data.user)

      // Fetch students for stats
      const studentsResponse = await fetch('/api/admin/students')
      const studentsData = await studentsResponse.json()

      if (studentsResponse.ok && studentsData.students) {
        const students = studentsData.students
        setStats({
          totalStudents: students.length,
          activeStudents: students.filter((s: any) => s.status === 'active').length,
          suspendedStudents: students.filter((s: any) => s.status === 'suspended').length,
          completedStudents: students.filter((s: any) => s.status === 'completed').length
        })
      }

      setLoading(false)
    } catch (error) {
      console.error('Error checking admin access:', error)
      setError('Failed to load dashboard')
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminAccess()
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="text-green-600 hover:underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {currentUser?.name || currentUser?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<FiUsers className="w-6 h-6" />}
            color="blue"
            description="All enrolled students"
          />
          <StatsCard
            title="Active Students"
            value={stats.activeStudents}
            icon={<FiUserCheck className="w-6 h-6" />}
            color="green"
            description="Currently enrolled"
          />
          <StatsCard
            title="Suspended"
            value={stats.suspendedStudents}
            icon={<FiUserX className="w-6 h-6" />}
            color="red"
            description="Temporarily suspended"
          />
          <StatsCard
            title="Completed"
            value={stats.completedStudents}
            icon={<FiBookOpen className="w-6 h-6" />}
            color="purple"
            description="Finished the course"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/students"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <FiUsers className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Manage Students</h3>
              <p className="text-sm text-gray-600">View, add, edit, or remove students</p>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <FiSettings className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Settings</h3>
              <p className="text-sm text-gray-600">Configure system settings</p>
            </Link>

            <Link
              href="/"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <FiBookOpen className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">View Course</h3>
              <p className="text-sm text-gray-600">Preview student course content</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity or Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Your Role</span>
              <span className="font-semibold text-green-600">Administrator</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Access Level</span>
              <span className="font-semibold text-gray-900">Full Access</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Student Registration</span>
              <span className="font-semibold text-gray-900">Admin Only</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
