'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiXCircle,
  FiBook,
  FiRefreshCw,
  FiSave,
  FiUpload,
} from 'react-icons/fi'

interface Question {
  id: string
  questionText: string
  questionNumber: number
  options: Array<{ id: string; text: string }>
  correctAnswer: string
  explanation: string | null
  category: string | null
  difficulty: string
  points: number
  createdAt: string
  updatedAt: string
}

interface Chapter {
  id: string
  title: string
  description: string | null
  chapterNumber: number
  type: string
  category: string | null
  duration: number | null
  isActive: boolean
  questionCount: number
  createdAt: string
  updatedAt: string
  questions: Question[]
}

export default function QuestionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [addingToChapter, setAddingToChapter] = useState<string | null>(null)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'question' | 'chapter'; id: string } | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncingQuestionId, setSyncingQuestionId] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAndFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAdminAndFetchData = async () => {
    try {
      const authResponse = await fetch('/api/admin/check')
      const authData = await authResponse.json()

      if (!authData.authenticated || !authData.isAdmin) {
        router.push('/login')
        return
      }

      await fetchQuestions()
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/admin/questions${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`)
      const data = await response.json()

      if (response.ok) {
        setChapters(data.chapters)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setLoading(false)
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

  const handleSearch = () => {
    fetchQuestions()
  }

  const handleSaveQuestion = async (questionData: any) => {
    try {
      const url = editingQuestion
        ? `/api/admin/questions/${editingQuestion.id}`
        : `/api/admin/questions`
      
      const method = editingQuestion ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      })

      if (response.ok) {
        await fetchQuestions()
        setEditingQuestion(null)
        setAddingToChapter(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save question')
      }
    } catch (error) {
      console.error('Error saving question:', error)
      alert('Failed to save question')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchQuestions()
        setDeleteConfirm(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete question')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question')
    }
  }

  const handlePublishChapter = async (chapterId: string) => {
    try {
      const response = await fetch(`/api/admin/chapters/${chapterId}/publish`, {
        method: 'POST',
      })

      if (response.ok) {
        await fetchQuestions()
        alert('Chapter published successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to publish chapter')
      }
    } catch (error) {
      console.error('Error publishing chapter:', error)
      alert('Failed to publish chapter')
    }
  }

  const handleSyncQuestionBank = async () => {
    try {
      setSyncing(true)
      const response = await fetch('/api/admin/question-bank/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (response.ok) {
        alert(
          `Full Sync complete!\nCreated: ${data.sync.created}\nUpdated: ${data.sync.updated}\nSkipped: ${data.sync.skipped}`
        )
      } else {
        alert(data.error || 'Sync failed')
      }
    } catch (error) {
      console.error('Error syncing:', error)
      alert('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncSingleQuestion = async (questionId: string) => {
    try {
      setSyncingQuestionId(questionId)
      const response = await fetch(`/api/admin/questions/${questionId}/sync`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ ${data.message}\nTime: ${data.duration}ms`)
      } else {
        alert(data.error || 'Sync failed')
      }
    } catch (error) {
      console.error('Error syncing question:', error)
      alert('Sync failed')
    } finally {
      setSyncingQuestionId(null)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage all questions and chapters across the platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSyncQuestionBank}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                title="Full sync of all questions (use only for initial setup or troubleshooting)"
              >
                <FiRefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                Full Sync (All Questions)
              </button>
            </div>
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
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              MCQ Builder
            </Link>
            <Link
              href="/admin/questions"
              className="px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              Questions
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
        {/* Search Bar */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Search
          </button>
        </div>

        {/* Chapters and Questions */}
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Chapter Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {expandedChapters.has(chapter.id) ? (
                        <FiChevronUp className="w-5 h-5" />
                      ) : (
                        <FiChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-500">#{chapter.chapterNumber}</span>
                        <h3 className="text-lg font-bold text-gray-900">{chapter.title}</h3>
                        {chapter.isActive ? (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                            <FiCheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                            <FiXCircle className="w-3 h-3" />
                            Draft
                          </span>
                        )}
                        {chapter.category && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {chapter.category.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{chapter.questionCount} questions</span>
                        {chapter.duration && <span>{chapter.duration} minutes</span>}
                        <span className="capitalize">{chapter.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!chapter.isActive && chapter.questionCount > 0 && (
                      <button
                        onClick={() => handlePublishChapter(chapter.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => setAddingToChapter(chapter.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              {expandedChapters.has(chapter.id) && (
                <div className="divide-y divide-gray-200">
                  {chapter.questions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <FiBook className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No questions in this chapter yet</p>
                      <button
                        onClick={() => setAddingToChapter(chapter.id)}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add First Question
                      </button>
                    </div>
                  ) : (
                    chapter.questions.map((question) => (
                      <div key={question.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-semibold">
                            {question.questionNumber}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium mb-2">{question.questionText}</p>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className={`p-2 rounded-lg text-sm ${
                                    option.id === question.correctAnswer
                                      ? 'bg-green-50 border-2 border-green-500 text-green-900 font-medium'
                                      : 'bg-gray-50 border border-gray-200 text-gray-700'
                                  }`}
                                >
                                  <span className="font-semibold">{option.id}.</span> {option.text}
                                </div>
                              ))}
                            </div>
                            {question.explanation && (
                              <p className="text-sm text-gray-600 italic mb-2">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="capitalize">{question.difficulty}</span>
                              <span>•</span>
                              <span>{question.points} point{question.points !== 1 ? 's' : ''}</span>
                              {question.category && (
                                <>
                                  <span>•</span>
                                  <span>{question.category.replace('_', ' ')}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSyncSingleQuestion(question.id)}
                              disabled={syncingQuestionId === question.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Sync this question to QuestionBank (instant)"
                            >
                              {syncingQuestionId === question.id ? (
                                <FiRefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <FiUpload className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingQuestion(question)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Question"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'question', id: question.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Question"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {chapters.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiBook className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No chapters found</h2>
            <p className="text-gray-600 mb-6">Create your first chapter to start adding questions</p>
          </div>
        )}
      </main>

      {/* Question Edit/Add Modal */}
      {(editingQuestion || addingToChapter) && (
        <QuestionModal
          question={editingQuestion}
          chapterId={addingToChapter || editingQuestion?.id || null}
          chapters={chapters}
          onSave={handleSaveQuestion}
          onClose={() => {
            setEditingQuestion(null)
            setAddingToChapter(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuestion(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Question Modal Component
function QuestionModal({
  question,
  chapterId,
  chapters,
  onSave,
  onClose,
}: {
  question: Question | null
  chapterId: string | null
  chapters: Chapter[]
  onSave: (data: any) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    chapterId: chapterId || question?.id || '',
    questionText: question?.questionText || '',
    optionA: question?.options.find((o) => o.id === 'A')?.text || '',
    optionB: question?.options.find((o) => o.id === 'B')?.text || '',
    optionC: question?.options.find((o) => o.id === 'C')?.text || '',
    optionD: question?.options.find((o) => o.id === 'D')?.text || '',
    correctAnswer: question?.correctAnswer || 'A',
    explanation: question?.explanation || '',
    difficulty: question?.difficulty || 'medium',
    points: question?.points || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const options = [
      { id: 'A', text: formData.optionA },
      { id: 'B', text: formData.optionB },
      { id: 'C', text: formData.optionC },
      { id: 'D', text: formData.optionD },
    ]

    onSave({
      chapterId: formData.chapterId,
      questionText: formData.questionText,
      options,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation || null,
      difficulty: formData.difficulty,
      points: formData.points,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {question ? 'Edit Question' : 'Add New Question'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!question && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
              <select
                value={formData.chapterId}
                onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a chapter</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    #{ch.chapterNumber} - {ch.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <div key={letter}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option {letter}
                </label>
                <input
                  type="text"
                  value={formData[`option${letter}` as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [`option${letter}`]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
            <select
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Explanation (Optional)
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              {question ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
