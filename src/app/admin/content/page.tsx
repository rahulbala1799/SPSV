'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiSave,
  FiX,
  FiClock,
  FiTarget,
} from 'react-icons/fi'

interface Question {
  id: string
  questionText: string
  questionNumber: number
  options: Array<{ id: string; text: string }>
  correctAnswer: string
  explanation: string | null
  difficulty: string
  points: number
  createdAt: string
}

interface Chapter {
  id: string
  title: string
  description: string | null
  chapterNumber: number
  type: string
  category: string | null
  isActive: boolean
  questionCount: number
  questions?: Question[]
}

export default function ContentManagementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [addingQuestionTo, setAddingQuestionTo] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    checkAdminAndFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAdminAndFetch = async () => {
    try {
      const authResponse = await fetch('/api/admin/check')
      const authData = await authResponse.json()

      if (!authData.authenticated || !authData.isAdmin) {
        router.push('/login')
        return
      }

      setCurrentUser(authData.user)
      await fetchChapters()
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const fetchChapters = async () => {
    try {
      const response = await fetch('/api/admin/content/chapters?includeQuestions=true')
      const data = await response.json()

      if (data.chapters) {
        setChapters(data.chapters)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching chapters:', error)
      setLoading(false)
    }
  }

  const toggleChapterVisibility = async (chapterId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/content/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        await fetchChapters()
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const handleSaveChapter = async (chapterData: any) => {
    setSaving(true)
    try {
      const chapterId = editingChapter?.id
      const url = chapterId
        ? `/api/admin/content/chapters/${chapterId}`
        : '/api/admin/content/chapters'
      
      const response = await fetch(url, {
        method: chapterId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chapterData),
      })

      if (response.ok) {
        await fetchChapters()
        setEditingChapter(null)
      }
    } catch (error) {
      console.error('Error saving chapter:', error)
    }
    setSaving(false)
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Delete this chapter and all its questions? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/content/chapters/${chapterId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchChapters()
      }
    } catch (error) {
      console.error('Error deleting chapter:', error)
    }
  }

  const handleSaveQuestion = async (questionData: any) => {
    setSaving(true)
    try {
      const url = editingQuestion
        ? `/api/admin/content/questions/${editingQuestion.id}`
        : '/api/admin/content/questions'
      
      const response = await fetch(url, {
        method: editingQuestion ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      })

      if (response.ok) {
        await fetchChapters()
        setEditingQuestion(null)
        setAddingQuestionTo(null)
      }
    } catch (error) {
      console.error('Error saving question:', error)
    }
    setSaving(false)
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Delete this question? It will be removed from student view and tests.')) return

    try {
      const response = await fetch(`/api/admin/content/questions/${questionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchChapters()
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout user={currentUser}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={currentUser}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">
              Manage chapters and questions. Changes appear instantly for students.
            </p>
          </div>
          <button
            onClick={() => setEditingChapter({} as Chapter)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <FiPlus className="w-5 h-5" />
            New Chapter
          </button>
        </div>

        {/* Chapters List */}
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Chapter Header */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() =>
                        setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedChapter === chapter.id ? (
                        <FiChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <FiChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-semibold text-gray-500">
                          #{chapter.chapterNumber}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{chapter.title}</h3>
                        {chapter.isActive ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                            <FiEye className="w-3 h-3" />
                            Visible
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold flex items-center gap-1">
                            <FiEyeOff className="w-3 h-3" />
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiCheckCircle className="w-4 h-4" />
                          {chapter.questionCount} questions
                        </span>
                        {chapter.category && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {chapter.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleChapterVisibility(chapter.id, chapter.isActive)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        chapter.isActive
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {chapter.isActive ? 'Hide from Students' : 'Show to Students'}
                    </button>
                    <button
                      onClick={() => setEditingChapter(chapter)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiEdit2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List (Expanded) */}
              {expandedChapter === chapter.id && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Questions</h4>
                    <button
                      onClick={() => setAddingQuestionTo(chapter.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  {chapter.questions && chapter.questions.length > 0 ? (
                    <div className="space-y-3">
                      {chapter.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </span>
                                <p className="font-medium text-gray-900">{question.questionText}</p>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <FiTarget className="w-3 h-3" />
                                  {question.points} points
                                </span>
                                <span className="px-2 py-1 bg-gray-200 rounded">
                                  {question.difficulty}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingQuestion(question)}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                              >
                                <FiEdit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <p className="text-gray-600 mb-4">No questions yet</p>
                      <button
                        onClick={() => setAddingQuestionTo(chapter.id)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Add your first question →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {chapters.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No chapters yet</h3>
              <p className="text-gray-600 mb-6">Create your first chapter to get started</p>
              <button
                onClick={() => setEditingChapter({} as Chapter)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FiPlus className="w-5 h-5" />
                Create First Chapter
              </button>
            </div>
          )}
        </div>

        {/* Chapter Edit Modal */}
        {editingChapter && (
          <ChapterModal
            chapter={editingChapter?.id ? editingChapter : null}
            onSave={handleSaveChapter}
            onClose={() => setEditingChapter(null)}
            saving={saving}
          />
        )}

        {/* Question Edit Modal */}
        {(editingQuestion || addingQuestionTo) && (
          <QuestionModal
            question={editingQuestion}
            chapterId={addingQuestionTo}
            onSave={handleSaveQuestion}
            onClose={() => {
              setEditingQuestion(null)
              setAddingQuestionTo(null)
            }}
            saving={saving}
          />
        )}
      </div>
    </AdminLayout>
  )
}

// Chapter Modal Component
function ChapterModal({
  chapter,
  onSave,
  onClose,
  saving,
}: {
  chapter: Chapter | null
  onSave: (data: any) => void
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    title: chapter?.title || '',
    description: chapter?.description || '',
    chapterNumber: chapter?.chapterNumber || 1,
    category: chapter?.category || 'INDUSTRY_KNOWLEDGE',
    type: chapter?.type || 'MCQ',
    duration: chapter?.duration || 30,
    isActive: chapter?.isActive || false,
  })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {chapter ? 'Edit Chapter' : 'New Chapter'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chapter Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
              placeholder="e.g., Industry Knowledge Part 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
              placeholder="Brief description of this chapter..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Number
              </label>
              <input
                type="number"
                value={formData.chapterNumber}
                onChange={(e) =>
                  setFormData({ ...formData, chapterNumber: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration (min)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
            >
              <option value="INDUSTRY_KNOWLEDGE">Industry Knowledge</option>
              <option value="AREA_KNOWLEDGE">Area Knowledge</option>
            </select>
          </div>

          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 text-emerald-600"
            />
            <div>
              <p className="font-medium text-gray-900">Visible to Students</p>
              <p className="text-sm text-gray-600">
                Students can access this chapter immediately when enabled
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.title}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Save Chapter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Question Modal Component (simplified - will expand later)
function QuestionModal({
  question,
  chapterId,
  onSave,
  onClose,
  saving,
}: {
  question: Question | null
  chapterId: string | null
  onSave: (data: any) => void
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    questionText: question?.questionText || '',
    options: question?.options || [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctAnswer: question?.correctAnswer || '',
    explanation: question?.explanation || '',
    difficulty: question?.difficulty || 'MEDIUM',
    points: question?.points || 10,
    chapterId: chapterId || '',
  })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {question ? 'Edit Question' : 'New Question'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
              placeholder="Enter your question here..."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Answer Options</label>
            {formData.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                  {option.id}
                </span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...formData.options]
                    newOptions[index].text = e.target.value
                    setFormData({ ...formData, options: newOptions })
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                  placeholder={`Option ${option.id}`}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === option.id}
                  onChange={() => setFormData({ ...formData, correctAnswer: option.id })}
                  className="w-5 h-5 text-emerald-600"
                />
              </div>
            ))}
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FiCheckCircle className="w-4 h-4" />
              Select the correct answer using the radio button
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
              placeholder="Explain why this answer is correct..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.questionText || !formData.correctAnswer}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Save Question
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
