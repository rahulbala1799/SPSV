'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { FiChevronLeft, FiChevronRight, FiCheck, FiClipboard, FiSearch } from 'react-icons/fi'

interface Question {
  id: string
  questionText: string
  questionNumber: number
  options: any
  correctAnswer: string
  explanation: string | null
  category: string | null
  difficulty: string
  points: number
}

interface Chapter {
  id: string
  title: string
  chapterNumber: number
  description: string | null
  questionCount: number
  questions: Question[]
}

interface Student {
  id: string
  user: {
    name: string
    email: string
  }
  status: string
}

export default function CreateTestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  // Step 1: Basic Information
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [isTimed, setIsTimed] = useState(false)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30)
  const [dueDate, setDueDate] = useState('')

  // Step 2: Question Selection
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())

  // Step 3: Student Assignment
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [studentSearch, setStudentSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    checkAdminAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/check')
      const data = await response.json()

      if (!data.authenticated || !data.isAdmin) {
        router.push('/login')
        return
      }

      setCurrentUser(data.user)
      // Fetch questions and students
      await Promise.all([fetchQuestions(), fetchStudents()])
      
      // Check for preset data from student hard questions
      loadPresetData()
      
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadPresetData = () => {
    try {
      const presetQuestionIds = sessionStorage.getItem('mcqCreatePresetQuestionIds')
      const presetStudentId = sessionStorage.getItem('mcqCreatePresetStudentId')
      const presetQuestionCount = sessionStorage.getItem('mcqCreatePresetQuestionCount')

      if (presetQuestionIds) {
        const questionIds = JSON.parse(presetQuestionIds)
        setSelectedQuestions(questionIds)
        
        if (presetQuestionCount) {
          setQuestionCount(parseInt(presetQuestionCount))
        }
        
        // Auto-suggest a title based on the preset
        setTitle('Hard Questions Practice Test')
        setDescription('Practice test generated from student\'s hard questions')
        
        // Clear sessionStorage after reading (one-time use)
        sessionStorage.removeItem('mcqCreatePresetQuestionIds')
        sessionStorage.removeItem('mcqCreatePresetQuestionCount')
      }

      if (presetStudentId) {
        setSelectedStudents([presetStudentId])
        // Clear after reading
        sessionStorage.removeItem('mcqCreatePresetStudentId')
      }
    } catch (error) {
      console.error('Error loading preset data:', error)
    }
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/mcq-builder/questions')
      const data = await response.json()

      if (response.ok) {
        setChapters(data.chapters)
        // Expand first chapter by default
        if (data.chapters.length > 0) {
          setExpandedChapters(new Set([data.chapters[0].id]))
        }
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students')
      const data = await response.json()

      if (response.ok) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleQuestionToggle = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId))
    } else {
      if (selectedQuestions.length >= questionCount) {
        alert(`Maximum ${questionCount} questions can be selected`)
        return
      }
      setSelectedQuestions([...selectedQuestions, questionId])
    }
  }

  const handleStudentToggle = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const handleSelectAllStudents = () => {
    const filteredStudents = getFilteredStudents()
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id))
    }
  }

  const getFilteredStudents = () => {
    return students.filter(student => {
      const matchesSearch = student.user.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                           student.user.email.toLowerCase().includes(studentSearch.toLowerCase())
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!title || title.trim().length < 3) {
        alert('Test title must be at least 3 characters')
        return false
      }
      if (questionCount < 1 || questionCount > 100) {
        alert('Question count must be between 1 and 100')
        return false
      }
      if (isTimed && (timeLimitMinutes < 5 || timeLimitMinutes > 180)) {
        alert('Time limit must be between 5 and 180 minutes')
        return false
      }
    } else if (currentStep === 2) {
      if (selectedQuestions.length !== questionCount) {
        alert(`Please select exactly ${questionCount} questions`)
        return false
      }
    } else if (currentStep === 3) {
      if (selectedStudents.length === 0) {
        alert('Please select at least one student')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleCreateTest = async () => {
    if (!validateStep(step)) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/admin/mcq-builder/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          questionCount,
          isTimed,
          timeLimitMinutes: isTimed ? timeLimitMinutes : null,
          dueDate: dueDate || null,
          questionIds: selectedQuestions,
          studentIds: selectedStudents,
          status: 'ACTIVE'
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Test created successfully!')
        router.push('/admin/mcq-builder')
      } else {
        alert(data.error || 'Failed to create test')
      }
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout user={currentUser}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={currentUser}>
      <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/mcq-builder" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
            ← Back to MCQ Builder
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New MCQ Test</h1>
          <p className="text-sm text-gray-600 mt-1">Step {step} of 4</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {['Basic Info', 'Select Questions', 'Assign Students', 'Review'].map((label, index) => {
              const stepNum = index + 1
              const isActive = step === stepNum
              const isCompleted = step > stepNum

              return (
                <div key={stepNum} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-600 text-white' :
                      isActive ? 'bg-blue-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? <FiCheck /> : stepNum}
                    </div>
                    <span className={`ml-2 text-sm ${isActive ? 'font-semibold' : ''}`}>
                      {label}
                    </span>
                  </div>
                  {stepNum < 4 && (
                    <div className={`flex-1 h-1 mx-4 ${step > stepNum ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Chapter 1 Review Test"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the test..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions *
                </label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Between 1 and 100 questions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!isTimed}
                      onChange={() => setIsTimed(false)}
                      className="mr-2"
                    />
                    <span>Untimed</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={isTimed}
                      onChange={() => setIsTimed(true)}
                      className="mr-2"
                    />
                    <span>Timed</span>
                  </label>
                </div>
              </div>

              {isTimed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes) *
                  </label>
                  <input
                    type="number"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value) || 0)}
                    min="5"
                    max="180"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Between 5 and 180 minutes</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Questions */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Pre-loaded questions notice */}
              {selectedQuestions.length > 0 && selectedQuestions.length === questionCount && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FiClipboard className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">Pre-selected Questions</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {selectedQuestions.length} questions have been pre-selected from the student&apos;s hard questions.
                        You can adjust the selection below if needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Selected: {selectedQuestions.length} / {questionCount}
                  </h3>
                  <div className="w-64 bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(selectedQuestions.length / questionCount) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {chapter.title} ({chapter.questionCount} questions)
                      </span>
                      <span className="text-gray-500">
                        {expandedChapters.has(chapter.id) ? '▼' : '▶'}
                      </span>
                    </button>

                    {expandedChapters.has(chapter.id) && (
                      <div className="px-4 pb-4 space-y-2">
                        {chapter.questions
                          .filter(q => !searchQuery || q.questionText.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((question) => {
                            const isSelected = selectedQuestions.includes(question.id)
                            const isDisabled = !isSelected && selectedQuestions.length >= questionCount

                            return (
                              <label
                                key={question.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${
                                  isSelected ? 'bg-green-50 border-green-500' :
                                  isDisabled ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' :
                                  'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleQuestionToggle(question.id)}
                                  disabled={isDisabled}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    Q{question.questionNumber}: {question.questionText}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Correct: {question.correctAnswer} | Difficulty: {question.difficulty}
                                  </p>
                                </div>
                              </label>
                            )
                          })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Assign Students */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Pre-selected student notice */}
              {selectedStudents.length === 1 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FiClipboard className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">Pre-selected Student</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        A student has been pre-selected for this test. You can add more students or change the selection below.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Selected: {selectedStudents.length} students
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === getFilteredStudents().length && getFilteredStudents().length > 0}
                    onChange={handleSelectAllStudents}
                  />
                  <span className="font-medium text-blue-900">
                    Select All Filtered Students ({getFilteredStudents().length})
                  </span>
                </label>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getFilteredStudents().map((student) => (
                  <label
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStudents.includes(student.id)
                        ? 'bg-green-50 border-green-500'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.user.name}</p>
                      <p className="text-sm text-gray-600">{student.user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' :
                      student.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Test Details</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{title}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{questionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {isTimed ? `Timed (${timeLimitMinutes} minutes)` : 'Untimed'}
                    </span>
                  </div>
                  {dueDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">
                        {new Date(dueDate).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned Students:</span>
                    <span className="font-medium">{selectedStudents.length}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Selected Questions Summary:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {chapters.map(chapter => {
                    const chapterQuestions = chapter.questions.filter(q => selectedQuestions.includes(q.id))
                    if (chapterQuestions.length === 0) return null
                    return (
                      <div key={chapter.id} className="mb-2">
                        <span className="font-medium">{chapter.title}:</span> {chapterQuestions.length} questions
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Next
                <FiChevronRight />
              </button>
            ) : (
              <button
                onClick={handleCreateTest}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Test'}
                <FiCheck />
              </button>
            )}
          </div>
        </div>
      </main>
      </div>
    </AdminLayout>
  )
}
