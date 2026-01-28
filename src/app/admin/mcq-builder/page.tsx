'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiClock, 
  FiUsers,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi'

interface Test {
  id: string
  title: string
  description: string | null
  questionCount: number
  isTimed: boolean
  timeLimitMinutes: number | null
  status: string
  dueDate: string | null
  assignedStudentsCount: number
  completedCount: number
  inProgressCount: number
  notStartedCount: number
  averageScore: number | null
  createdAt: string
}

export default function MCQBuilderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<Test[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAndFetchTests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAdminAndFetchTests = async () => {
    try {
      // Check admin access
      const authResponse = await fetch('/api/admin/check')
      const authData = await authResponse.json()

      if (!authData.authenticated || !authData.isAdmin) {
        router.push('/login')
        return
      }

      // Fetch tests
      await fetchTests()
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/admin/mcq-builder/tests')
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

  const handleDelete = async (testId: string) => {
    try {
      const response = await fetch(`/api/admin/mcq-builder/tests/${testId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTests(tests.filter(t => t.id !== testId))
        setDeleteConfirm(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete test')
      }
    } catch (error) {
      console.error('Error deleting test:', error)
      alert('Failed to delete test')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      DRAFT: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      ARCHIVED: 'bg-gray-100 text-gray-800'
    }
    return styles[status as keyof typeof styles] || styles.DRAFT
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MCQ Builder</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create and manage custom MCQ tests for students
              </p>
            </div>
            <Link
              href="/admin/mcq-builder/create"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Create New Test
            </Link>
          </div>
          {/* Navigation */}
          <nav className="flex items-center gap-4 border-t border-gray-200 pt-4">
            <Link
              href="/admin"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/students"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Students
            </Link>
            <Link
              href="/admin/mcq-builder"
              className="px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors font-medium"
            >
              MCQ Builder
            </Link>
            <Link
              href="/admin/settings"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPlus className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tests created yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first MCQ test to assign to students
            </p>
            <Link
              href="/admin/mcq-builder/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Create First Test
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{test.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(test.status)}`}>
                        {test.status}
                      </span>
                    </div>
                    {test.description && (
                      <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiCheckCircle className="w-4 h-4" />
                        <span>{test.questionCount} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {test.isTimed ? (
                          <>
                            <FiClock className="w-4 h-4" />
                            <span>Timed ({test.timeLimitMinutes} min)</span>
                          </>
                        ) : (
                          <>
                            <FiXCircle className="w-4 h-4" />
                            <span>Untimed</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{test.assignedStudentsCount} students</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/mcq-builder/tests/${test.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/mcq-builder/tests/${test.id}/edit`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Test"
                    >
                      <FiEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(test.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Test"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{test.completedCount}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{test.inProgressCount}</p>
                    <p className="text-xs text-gray-600">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">{test.notStartedCount}</p>
                    <p className="text-xs text-gray-600">Not Started</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {test.averageScore !== null ? `${test.averageScore}%` : '-'}
                    </p>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Test</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this test? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
