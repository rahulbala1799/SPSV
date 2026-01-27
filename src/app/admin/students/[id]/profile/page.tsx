'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiEdit2, FiClock, FiBookOpen, FiFileText, FiHelpCircle } from 'react-icons/fi'
import { ChapterProgressSection } from '@/components/admin/student-profile/ChapterProgressSection'
import { TestPerformanceSection } from '@/components/admin/student-profile/TestPerformanceSection'
import { QuestionAnalyticsSection } from '@/components/admin/student-profile/QuestionAnalyticsSection'
import { StrengthWeaknessSection } from '@/components/admin/student-profile/StrengthWeaknessSection'
import { TimeAnalyticsSection } from '@/components/admin/student-profile/TimeAnalyticsSection'
import { ActivityTimelineSection } from '@/components/admin/student-profile/ActivityTimelineSection'

interface StudentProfile {
  id: string
  user: {
    id: string
    email: string
    name: string | null
    createdAt: string
  }
  phoneNumber: string | null
  dateOfBirth: string | null
  address: string | null
  status: string
  enrollmentDate: string
}

interface StudentStats {
  totalStudyTime: number // in seconds
  chaptersCompleted: number
  totalChapters: number
  currentChapter: string | null
  testsAttempted: number
  averageScore: number
  bestScore: number
  questionsAttempted: number
  questionsCorrect: number
  overallCompletion: number
}

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [stats, setStats] = useState<StudentStats | null>(null)

  useEffect(() => {
    fetchStudentProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  const fetchStudentProfile = async () => {
    try {
      // Check admin access
      const adminCheck = await fetch('/api/admin/check')
      const adminData = await adminCheck.json()

      if (!adminData.authenticated || !adminData.isAdmin) {
        router.push('/login')
        return
      }

      // Fetch student profile
      const response = await fetch(`/api/admin/students/${studentId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load student')
        setLoading(false)
        return
      }

      setStudent(data.student)

      // Fetch student statistics
      const statsResponse = await fetch(`/api/admin/students/${studentId}/stats`)
      const statsData = await statsResponse.json()

      if (statsResponse.ok) {
        setStats(statsData.stats)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching student profile:', error)
      setError('Failed to load student profile')
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
  }

  const getDaysSinceEnrollment = (enrollmentDate: string) => {
    const now = new Date()
    const enrolled = new Date(enrollmentDate)
    const diffTime = Math.abs(now.getTime() - enrolled.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // Use at least 1 day to avoid division by zero or very small numbers
    return Math.max(1, diffDays)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
          <Link
            href="/admin/students"
            className="text-green-600 hover:underline"
          >
            Back to Students
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const daysSinceEnrollment = getDaysSinceEnrollment(student.enrollmentDate)
  // Calculate average minutes per day (totalStudyTime is in seconds)
  const avgMinutesPerDay = stats && daysSinceEnrollment > 0 
    ? Math.round((stats.totalStudyTime / daysSinceEnrollment) / 60) 
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/students"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed analytics and progress tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Profile Photo Placeholder */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {student.user.name?.charAt(0).toUpperCase() || 'S'}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {student.user.name || 'No Name'}
                  </h2>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <span>{student.user.email}</span>
                  </div>
                  {student.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4" />
                      <span>{student.phoneNumber}</span>
                    </div>
                  )}
                  {student.dateOfBirth && (
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>DOB: {formatDate(student.dateOfBirth)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>
                      Enrolled: {formatDate(student.enrollmentDate)} 
                      <span className="text-gray-500 ml-2">
                        ({daysSinceEnrollment} days ago)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Completion Circle */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-green-600 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - (stats?.overallCompletion || 0) / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-gray-900">
                  {stats?.overallCompletion || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Overall Completion</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => alert('Edit functionality coming soon')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit Details
            </button>
            <button
              onClick={() => alert('Status change functionality coming soon')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {student.status === 'active' ? 'Suspend Student' : 'Activate Student'}
            </button>
            <button
              onClick={() => router.push(`/admin/students/${studentId}/profile/export`)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Study Time */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Study Time</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatDuration(stats?.totalStudyTime || 0)}
            </div>
            <p className="text-sm text-gray-500">
              ~{avgMinutesPerDay} min/day
            </p>
          </div>

          {/* Chapters Progress */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Chapters Progress</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiBookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.chaptersCompleted || 0} / {stats?.totalChapters || 0}
            </div>
            <p className="text-sm text-gray-500 truncate">
              {stats?.currentChapter || 'No active chapter'}
            </p>
          </div>

          {/* Test Performance */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Test Performance</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.averageScore.toFixed(1) || 0}%
            </div>
            <p className="text-sm text-gray-500">
              {stats?.testsAttempted || 0} tests · Best: {stats?.bestScore || 0}%
            </p>
          </div>

          {/* Questions Attempted */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Questions</h3>
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiHelpCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.questionsAttempted || 0}
            </div>
            <p className="text-sm text-gray-500">
              {stats && stats.questionsAttempted > 0 
                ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) 
                : 0}% correct
            </p>
          </div>
        </div>

        {/* Chapter Progress Section */}
        <div className="mb-8">
          <ChapterProgressSection studentId={studentId} />
        </div>

        {/* Test Performance Section */}
        <div className="mb-8">
          <TestPerformanceSection studentId={studentId} />
        </div>

        {/* Question Analytics Section */}
        <div className="mb-8">
          <QuestionAnalyticsSection studentId={studentId} />
        </div>

        {/* Strength & Weakness Analysis Section */}
        <div className="mb-8">
          <StrengthWeaknessSection studentId={studentId} />
        </div>

        {/* Time Analytics Section */}
        <div className="mb-8">
          <TimeAnalyticsSection studentId={studentId} />
        </div>

        {/* Activity Timeline Section */}
        <div className="mb-8">
          <ActivityTimelineSection studentId={studentId} />
        </div>
      </main>
    </div>
  )
}
