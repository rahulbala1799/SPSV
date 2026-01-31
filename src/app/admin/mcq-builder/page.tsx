'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiClock, 
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiTarget,
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
  const [currentUser, setCurrentUser] = useState<any>(null)
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

      setCurrentUser(authData.user)
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
      <AdminLayout user={currentUser}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tests...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MCQ Test Builder</h1>
              <p className="text-gray-600">Create and manage timed tests for students</p>
            </div>
            <Link
              href="/admin/mcq-builder/create"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiPlus className="w-5 h-5" />
              Create New Test
            </Link>
          </div>
        </div>
        {tests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTarget className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No tests created yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first MCQ test to assign to students
            </p>
            <Link
              href="/admin/mcq-builder/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiPlus className="w-5 h-5" />
              Create First Test
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
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
      </div>
    </AdminLayout>
  )
}
