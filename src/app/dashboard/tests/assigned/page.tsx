'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiClock, FiCheckCircle, FiAlertCircle, FiArrowRight, FiCalendar } from 'react-icons/fi'

interface AssignedTest {
  id: string
  title: string
  description: string | null
  questionCount: number
  isTimed: boolean
  timeLimitMinutes: number | null
  dueDate: string | null
  testStatus: string
  assignedAt: string
  status: string
  startedAt: string | null
  completedAt: string | null
  score: number | null
  correctAnswers: number | null
}

export default function AssignedTestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<AssignedTest[]>([])

  useEffect(() => {
    checkAccessAndFetchTests()
  }, [])

  const checkAccessAndFetchTests = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (!response.ok || !data.user) {
        router.push('/login')
        return
      }

      // Fetch assigned tests
      await fetchTests()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/student/assigned-tests')
      const data = await response.json()

      if (response.ok) {
        setTests(data.tests)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tests:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      NOT_STARTED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      EXPIRED: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || styles.NOT_STARTED
  }

  const getStatusText = (status: string) => {
    const texts = {
      NOT_STARTED: 'Not Started',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      EXPIRED: 'Expired'
    }
    return texts[status as keyof typeof texts] || status
  }

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <FiCheckCircle className="w-5 h-5" />
    if (status === 'IN_PROGRESS') return <FiAlertCircle className="w-5 h-5" />
    return <FiClock className="w-5 h-5" />
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Tests</h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete the tests assigned to you by your instructor
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto pb-20">
        {tests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Tests Assigned</h2>
            <p className="text-gray-600">
              You don't have any tests assigned yet. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{test.title}</h3>
                    {test.description && (
                      <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FiCheckCircle className="w-4 h-4" />
                        <span>{test.questionCount} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {test.isTimed ? (
                          <>
                            <FiClock className="w-4 h-4" />
                            <span>Timed: {test.timeLimitMinutes} min</span>
                          </>
                        ) : (
                          <>
                            <FiClock className="w-4 h-4" />
                            <span>Untimed</span>
                          </>
                        )}
                      </div>
                      {test.dueDate && (
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          <span>Due: {formatDate(test.dueDate)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1 ${getStatusBadge(test.status)}`}>
                        {getStatusIcon(test.status)}
                        {getStatusText(test.status)}
                      </span>
                      {test.status === 'COMPLETED' && test.score !== null && (
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          test.score >= 80 ? 'bg-green-100 text-green-800' :
                          test.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Score: {test.score}% ({test.correctAnswers}/{test.questionCount})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {test.status === 'COMPLETED' && test.completedAt && (
                      <span>Completed on {formatDate(test.completedAt)}</span>
                    )}
                    {test.status === 'IN_PROGRESS' && test.startedAt && (
                      <span>Started on {formatDate(test.startedAt)}</span>
                    )}
                    {test.status === 'NOT_STARTED' && (
                      <span>Assigned on {formatDate(test.assignedAt)}</span>
                    )}
                  </div>
                  <Link
                    href={
                      test.status === 'COMPLETED'
                        ? `/dashboard/tests/assigned/${test.id}/results`
                        : `/dashboard/tests/assigned/${test.id}`
                    }
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                      test.status === 'COMPLETED'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : test.status === 'IN_PROGRESS'
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {test.status === 'COMPLETED' ? 'View Results' :
                     test.status === 'IN_PROGRESS' ? 'Continue Test' :
                     'Start Test'}
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
