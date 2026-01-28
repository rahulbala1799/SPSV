'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StudentTable } from '@/components/admin/StudentTable'
import { AddStudentModal } from '@/components/admin/AddStudentModal'
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal'
import { Button } from '@/components/Button'
import { FiPlus, FiArrowLeft, FiSearch } from 'react-icons/fi'

interface Student {
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

export default function StudentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const checkAdminAndFetchStudents = async () => {
    try {
      // Check if user is admin
      const adminCheck = await fetch('/api/admin/check')
      const adminData = await adminCheck.json()

      if (!adminData.authenticated || !adminData.isAdmin) {
        router.push('/login')
        return
      }

      // Fetch students
      await fetchStudents()
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to load students')
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminAndFetchStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Filter students based on search query
    if (searchQuery.trim() === '') {
      setFilteredStudents(students)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = students.filter(student => 
        student.user.name?.toLowerCase().includes(query) ||
        student.user.email.toLowerCase().includes(query) ||
        student.phoneNumber?.toLowerCase().includes(query)
      )
      setFilteredStudents(filtered)
    }
  }, [searchQuery, students])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students')
      const data = await response.json()

      if (response.ok) {
        setStudents(data.students)
        setFilteredStudents(data.students)
      } else {
        setError(data.error || 'Failed to fetch students')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching students:', error)
      setError('Failed to fetch students')
      setLoading(false)
    }
  }

  const handleAddSuccess = () => {
    fetchStudents()
  }

  const handleEdit = (student: Student) => {
    // TODO: Implement edit functionality
    console.log('Edit student:', student)
    alert('Edit functionality coming soon!')
  }

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/admin/students/${studentToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchStudents()
        setShowDeleteModal(false)
        setStudentToDelete(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
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
            onClick={() => router.push('/admin')}
            className="text-green-600 hover:underline"
          >
            Back to Dashboard
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {students.length} student{students.length !== 1 ? 's' : ''} enrolled
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Student
            </Button>
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
              className="px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              Students
            </Link>
            <Link
              href="/admin/mcq-builder"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
        {/* Info Box */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📝 How it works:</strong> When you add a student, you&apos;re creating their login account. 
            Students will use their email address as their username and the password you set to sign in at the login page. 
            Public signup is disabled - only admins can create student accounts.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Student Table */}
        <StudentTable
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* Empty State */}
        {students.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md mt-6">
            <FiPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first student</p>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Your First Student
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        studentName={studentToDelete?.user.name || studentToDelete?.user.email || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false)
          setStudentToDelete(null)
        }}
        loading={deleteLoading}
      />
    </div>
  )
}
