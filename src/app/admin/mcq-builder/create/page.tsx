'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { FiChevronLeft, FiChevronRight, FiCheck, FiClipboard, FiSearch, FiX } from 'react-icons/fi'

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

interface QuestionWithChapter extends Question {
  chapterTitle: string
  chapterId: string
}

interface Student {
  id: string
  user: {
    name: string
    email: string
  }
  status: string
}

const STEPS = ['Select Questions', 'Review Selected', 'Add from Bank', 'Details & Create'] as const

export default function CreateTestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [hasPreset, setHasPreset] = useState(false)
  const [initialPresetIds, setInitialPresetIds] = useState<string[] | null>(null)

  // Test details (Step 4)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isTimed, setIsTimed] = useState(false)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30)
  const [dueDate, setDueDate] = useState('')

  // Questions: selected IDs (used in all steps)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchQueryBank, setSearchQueryBank] = useState('')
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [expandedChaptersBank, setExpandedChaptersBank] = useState<Set<string>>(new Set())

  // Students (Step 4)
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

      if (presetQuestionIds) {
        const questionIds = JSON.parse(presetQuestionIds)
        setSelectedQuestions(questionIds)
        setInitialPresetIds(questionIds)
        setHasPreset(true)
        setTitle('Hard Questions Practice Test')
        setDescription('Practice test generated from student\'s hard questions')
        sessionStorage.removeItem('mcqCreatePresetQuestionIds')
        sessionStorage.removeItem('mcqCreatePresetQuestionCount')
      }

      if (presetStudentId) {
        setSelectedStudents([presetStudentId])
        sessionStorage.removeItem('mcqCreatePresetStudentId')
      }
    } catch (error) {
      console.error('Error loading preset data:', error)
    }
  }

  // Step 1: initial list = preset only (fixed IDs) or all questions (with chapter info)
  const initialListQuestions = useMemo((): QuestionWithChapter[] => {
    const flat: QuestionWithChapter[] = []
    chapters.forEach(ch => {
      ch.questions.forEach(q => {
        flat.push({ ...q, chapterTitle: ch.title, chapterId: ch.id })
      })
    })
    if (hasPreset && initialPresetIds && initialPresetIds.length > 0) {
      return flat.filter(q => initialPresetIds.includes(q.id))
    }
    return flat
  }, [chapters, hasPreset, initialPresetIds])

  // Step 2: selected questions with chapter (for review)
  const selectedQuestionsWithChapter = useMemo((): QuestionWithChapter[] => {
    const flat: QuestionWithChapter[] = []
    chapters.forEach(ch => {
      ch.questions.forEach(q => {
        flat.push({ ...q, chapterTitle: ch.title, chapterId: ch.id })
      })
    })
    return selectedQuestions
      .map(id => flat.find(q => q.id === id))
      .filter((q): q is QuestionWithChapter => q != null)
  }, [chapters, selectedQuestions])

  // Step 3: chapters with questions EXCLUDING already selected
  const chaptersExcludingSelected = useMemo(() => {
    return chapters.map(ch => ({
      ...ch,
      questions: ch.questions.filter(q => !selectedQuestions.includes(q.id))
    })).filter(ch => ch.questions.length > 0)
  }, [chapters, selectedQuestions])

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
      if (selectedQuestions.length >= 100) {
        alert('Maximum 100 questions per test')
        return
      }
      setSelectedQuestions([...selectedQuestions, questionId])
    }
  }

  const removeSelectedQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(id => id !== questionId))
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

  const toggleChapterBank = (chapterId: string) => {
    const newExpanded = new Set(expandedChaptersBank)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChaptersBank(newExpanded)
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
      if (selectedQuestions.length < 1) {
        alert('Select at least one question to continue')
        return false
      }
    } else if (currentStep === 4) {
      if (!title || title.trim().length < 3) {
        alert('Test title must be at least 3 characters')
        return false
      }
      if (isTimed && (timeLimitMinutes < 5 || timeLimitMinutes > 180)) {
        alert('Time limit must be between 5 and 180 minutes')
        return false
      }
      if (selectedStudents.length === 0) {
        alert('Select at least one student')
        return false
      }
      if (selectedQuestions.length === 0) {
        alert('Add at least one question (go back to add from the question bank)')
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
    if (!validateStep(4)) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/admin/mcq-builder/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          questionCount: selectedQuestions.length,
          isTimed,
          timeLimitMinutes: isTimed ? timeLimitMinutes : null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
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
          <p className="text-sm text-gray-600 mt-1">Step {step} of 4 — {STEPS[step - 1]}</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {STEPS.map((label, index) => {
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
          {/* Step 1 (A): Initial question list — preset only or full bank */}
          {step === 1 && (
            <div className="space-y-4">
              {hasPreset && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FiClipboard className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">Questions from student&apos;s hard questions</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Select the questions you want. You can add more from the full question bank in the next steps.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {!hasPreset && (
                <p className="text-sm text-gray-600 mb-4">
                  Select questions for your test. You can add more from the question bank later.
                </p>
              )}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedQuestions.length} selected
                </h3>
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

              {hasPreset ? (
                <div className="space-y-2 max-h-[28rem] overflow-y-auto">
                  {initialListQuestions
                    .filter(q => !searchQuery || q.questionText.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((question) => (
                      <label
                        key={question.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedQuestions.includes(question.id)
                            ? 'bg-green-50 border-green-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question.id)}
                          onChange={() => handleQuestionToggle(question.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{question.questionText}</p>
                          <p className="text-xs text-gray-500 mt-1">{question.chapterTitle}</p>
                        </div>
                      </label>
                    ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-[28rem] overflow-y-auto">
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
                            .map((question) => (
                              <label
                                key={question.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                  selectedQuestions.includes(question.id)
                                    ? 'bg-green-50 border-green-500'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedQuestions.includes(question.id)}
                                  onChange={() => handleQuestionToggle(question.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    Q{question.questionNumber}: {question.questionText}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{chapter.title}</p>
                                </div>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2 (B): Review selected questions only */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected questions ({selectedQuestions.length})
              </h3>
              <p className="text-sm text-gray-600">
                Review your selection. Remove any you don&apos;t want. Then add more from the question bank in the next step.
              </p>
              <div className="space-y-2 max-h-[28rem] overflow-y-auto">
                {selectedQuestionsWithChapter.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{q.questionText}</p>
                      <p className="text-xs text-gray-500 mt-1">{q.chapterTitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelectedQuestion(q.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {selectedQuestions.length === 0 && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  No questions selected. Go back to add at least one, or add from the bank in the next step.
                </p>
              )}
            </div>
          )}

          {/* Step 3 (C): Add more from question bank (exclude already selected) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Add more questions (optional)</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Test currently has <strong>{selectedQuestions.length}</strong> questions. Select any more below from the full question bank. Already selected questions are not shown.
                </p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {chaptersExcludingSelected.reduce((sum, ch) => sum + ch.questions.length, 0)} questions available to add
                </span>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQueryBank}
                    onChange={(e) => setSearchQueryBank(e.target.value)}
                    placeholder="Search in bank..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-[28rem] overflow-y-auto">
                {chaptersExcludingSelected.map((chapter) => (
                  <div key={chapter.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleChapterBank(chapter.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {chapter.title} ({chapter.questions.length} available)
                      </span>
                      <span className="text-gray-500">
                        {expandedChaptersBank.has(chapter.id) ? '▼' : '▶'}
                      </span>
                    </button>
                    {expandedChaptersBank.has(chapter.id) && (
                      <div className="px-4 pb-4 space-y-2">
                        {chapter.questions
                          .filter(q => !searchQueryBank || q.questionText.toLowerCase().includes(searchQueryBank.toLowerCase()))
                          .map((question) => (
                            <label
                              key={question.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedQuestions.includes(question.id)
                                  ? 'bg-green-50 border-green-500'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedQuestions.includes(question.id)}
                                onChange={() => handleQuestionToggle(question.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Q{question.questionNumber}: {question.questionText}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{chapter.title}</p>
                              </div>
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {chaptersExcludingSelected.length === 0 && (
                <p className="text-sm text-gray-600">No more questions in the bank (all are already selected).</p>
              )}
            </div>
          )}

          {/* Step 4 (D): Test details + Assign students + Create */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Test details &amp; assign students</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Chapter 1 Review Test"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description..."
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Questions in test: </span>
                <span className="font-semibold">{selectedQuestions.length}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test type</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time limit (minutes) *</label>
                  <input
                    type="number"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value) || 0)}
                    min={5}
                    max={180}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due date (optional)</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pre-selected student notice */}
              {selectedStudents.length === 1 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Pre-selected student</h4>
                  <p className="text-sm text-blue-700 mt-1">A student has been pre-selected. You can add more or change below.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign students *</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
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
                <p className="text-sm text-gray-500 mt-2">{selectedStudents.length} student(s) selected</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                <p className="text-sm text-gray-600">
                  {selectedQuestions.length} questions · {selectedStudents.length} student(s) · {isTimed ? `${timeLimitMinutes} min` : 'Untimed'}
                </p>
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
