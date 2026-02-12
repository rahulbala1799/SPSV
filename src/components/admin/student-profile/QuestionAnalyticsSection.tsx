'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiCheckCircle, FiAlertCircle, FiTarget, FiTrendingUp, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiClipboard } from 'react-icons/fi'

interface QuestionSummary {
  totalUniqueQuestions: number
  totalAttempts: number
  avgAttemptsPerQuestion: number
  firstTryCorrect: number
  multipleAttempts: number
  easyCount: number
  mediumCount: number
  hardCount: number
}

interface QuestionData {
  questionId: string
  questionText: string
  chapter?: string
  category?: string
  attempts: number
  successRate?: number
}

interface DifficultyData {
  easy: QuestionData[]
  medium: QuestionData[]
  hard: QuestionData[]
}

interface QuestionDetail {
  id: string
  questionText: string
  options: any
  correctAnswer: string
  explanation: string | null
  category: string | null
  difficulty: string
  points: number
  chapter: {
    id: string
    title: string
    chapterNumber: number
  } | null
}

interface Props {
  studentId: string
}

export function QuestionAnalyticsSection({ studentId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<QuestionSummary | null>(null)
  const [mostAttempted, setMostAttempted] = useState<QuestionData[]>([])
  const [difficulty, setDifficulty] = useState<DifficultyData | null>(null)
  
  // Hard questions pagination and selection
  const [hardQuestionsPage, setHardQuestionsPage] = useState(1)
  const [hardQuestionsPageSize, setHardQuestionsPageSize] = useState(10)
  const [selectedHardQuestions, setSelectedHardQuestions] = useState<Set<string>>(new Set())
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [questionDetails, setQuestionDetails] = useState<Map<string, QuestionDetail>>(new Map())
  const [loadingQuestionIds, setLoadingQuestionIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchQuestionAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  const fetchQuestionAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/questions`)
      const data = await response.json()

      if (response.ok) {
        setSummary(data.summary)
        setMostAttempted(data.mostAttempted)
        setDifficulty(data.difficulty)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching question analytics:', error)
      setLoading(false)
    }
  }

  const fetchQuestionDetail = async (questionId: string) => {
    if (questionDetails.has(questionId)) return // Already loaded
    
    setLoadingQuestionIds(prev => new Set(prev).add(questionId))
    
    try {
      const response = await fetch(`/api/admin/questions/${questionId}`)
      const data = await response.json()
      
      if (response.ok) {
        setQuestionDetails(prev => new Map(prev).set(questionId, data))
      }
    } catch (error) {
      console.error('Error fetching question detail:', error)
    } finally {
      setLoadingQuestionIds(prev => {
        const next = new Set(prev)
        next.delete(questionId)
        return next
      })
    }
  }

  const toggleQuestionExpand = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
      fetchQuestionDetail(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const toggleSelectHardQuestion = (questionId: string) => {
    const newSelected = new Set(selectedHardQuestions)
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId)
    } else {
      newSelected.add(questionId)
    }
    setSelectedHardQuestions(newSelected)
  }

  const selectAllHardOnPage = () => {
    if (!difficulty?.hard) return
    const start = (hardQuestionsPage - 1) * hardQuestionsPageSize
    const end = start + hardQuestionsPageSize
    const pageQuestions = difficulty.hard.slice(start, end)
    
    const newSelected = new Set(selectedHardQuestions)
    pageQuestions.forEach(q => newSelected.add(q.questionId))
    setSelectedHardQuestions(newSelected)
  }

  const clearHardSelection = () => {
    setSelectedHardQuestions(new Set())
  }

  const handleGenerateMCQ = () => {
    if (selectedHardQuestions.size === 0) return
    
    // Store in sessionStorage
    sessionStorage.setItem('mcqCreatePresetQuestionIds', JSON.stringify(Array.from(selectedHardQuestions)))
    sessionStorage.setItem('mcqCreatePresetStudentId', studentId)
    sessionStorage.setItem('mcqCreatePresetQuestionCount', selectedHardQuestions.size.toString())
    
    // Navigate to MCQ builder
    router.push('/admin/mcq-builder/create')
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No question data available yet.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Question Analytics</h2>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{summary.totalUniqueQuestions}</div>
          <div className="text-sm text-gray-600">Unique Questions</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{summary.totalAttempts}</div>
          <div className="text-sm text-gray-600">Total Attempts</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary.avgAttemptsPerQuestion}</div>
          <div className="text-sm text-gray-600">Avg Per Question</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{summary.firstTryCorrect}</div>
          <div className="text-sm text-gray-600">First Try Correct</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{summary.multipleAttempts}</div>
          <div className="text-sm text-gray-600">Multiple Attempts</div>
        </div>
      </div>

      {/* Most Attempted Questions */}
      {mostAttempted.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5 text-blue-600" />
            Most Attempted Questions
          </h3>
          <div className="space-y-2">
            {mostAttempted.map((q, index) => (
              <div key={q.questionId} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                      <span className="text-sm text-gray-900">{q.questionText}</span>
                    </div>
                    {q.chapter && (
                      <div className="text-xs text-gray-500">
                        {q.chapter} {q.category && `• ${q.category}`}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{q.attempts}</div>
                      <div className="text-xs text-gray-500">Attempts</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        q.successRate! >= 80 ? 'text-green-600' :
                        q.successRate! >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {q.successRate}%
                      </div>
                      <div className="text-xs text-gray-500">Success</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Analysis */}
      {difficulty && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiTarget className="w-5 h-5 text-purple-600" />
            Question Difficulty Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Easy Questions */}
            <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Easy Questions</h4>
                  <p className="text-xs text-green-700">
                    {summary.easyCount} questions ({summary.totalUniqueQuestions > 0 ? Math.round((summary.easyCount / summary.totalUniqueQuestions) * 100) : 0}%)
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {difficulty.easy.length > 0 ? (
                  difficulty.easy.map((q, i) => (
                    <div key={i} className="p-2 bg-white rounded text-xs">
                      <div className="text-gray-900 mb-1">{q.questionText}</div>
                      {q.chapter && (
                        <div className="text-gray-500">{q.chapter}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-600">No easy questions yet</p>
                )}
              </div>
            </div>

            {/* Medium Questions */}
            <div className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Medium Questions</h4>
                  <p className="text-xs text-yellow-700">
                    {summary.mediumCount} questions ({summary.totalUniqueQuestions > 0 ? Math.round((summary.mediumCount / summary.totalUniqueQuestions) * 100) : 0}%)
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {difficulty.medium.length > 0 ? (
                  difficulty.medium.map((q, i) => (
                    <div key={i} className="p-2 bg-white rounded text-xs">
                      <div className="text-gray-900 mb-1">{q.questionText}</div>
                      {q.chapter && (
                        <div className="text-gray-500">{q.chapter}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-600">No medium questions yet</p>
                )}
              </div>
            </div>

            {/* Hard Questions - Compact (for 3-column layout) */}
            <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FiAlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-900">Hard Questions</h4>
                  <p className="text-xs text-red-700">
                    {summary.hardCount} questions ({summary.totalUniqueQuestions > 0 ? Math.round((summary.hardCount / summary.totalUniqueQuestions) * 100) : 0}%)
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {difficulty.hard.length > 0 ? (
                  <>
                    {difficulty.hard.slice(0, 3).map((q, i) => (
                      <div key={i} className="p-2 bg-white rounded text-xs">
                        <div className="text-gray-900 mb-1 line-clamp-2">{q.questionText}</div>
                        {q.chapter && (
                          <div className="text-gray-500">{q.chapter}</div>
                        )}
                      </div>
                    ))}
                    {difficulty.hard.length > 3 && (
                      <p className="text-xs text-red-600 font-medium">
                        + {difficulty.hard.length - 3} more (see full list below)
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-600">No hard questions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Hard Questions List with Pagination */}
      {difficulty && difficulty.hard.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-600" />
                All Hard Questions ({difficulty.hard.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Questions that need review - select questions to generate a practice MCQ test
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">
                Per page:
                <select
                  value={hardQuestionsPageSize}
                  onChange={(e) => {
                    setHardQuestionsPageSize(Number(e.target.value))
                    setHardQuestionsPage(1)
                  }}
                  className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
            </div>
          </div>

          {/* Selection Actions */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={selectAllHardOnPage}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Select all on page
              </button>
              {selectedHardQuestions.size > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearHardSelection}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Clear selection
                  </button>
                  <span className="text-sm text-gray-600">
                    ({selectedHardQuestions.size} selected)
                  </span>
                </>
              )}
            </div>
            <button
              onClick={handleGenerateMCQ}
              disabled={selectedHardQuestions.size === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedHardQuestions.size === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <FiClipboard className="w-4 h-4" />
              Generate MCQ from Selected
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-2 mb-4">
            {difficulty.hard
              .slice(
                (hardQuestionsPage - 1) * hardQuestionsPageSize,
                hardQuestionsPage * hardQuestionsPageSize
              )
              .map((q, index) => {
                const isExpanded = expandedQuestions.has(q.questionId)
                const isSelected = selectedHardQuestions.has(q.questionId)
                const detail = questionDetails.get(q.questionId)
                const isLoadingDetail = loadingQuestionIds.has(q.questionId)
                const globalIndex = (hardQuestionsPage - 1) * hardQuestionsPageSize + index + 1

                return (
                  <div
                    key={q.questionId}
                    className={`border rounded-lg transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Question Row */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectHardQuestion(q.questionId)}
                          className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                        />
                        
                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-500">#{globalIndex}</span>
                                <span className="text-sm text-gray-900">{q.questionText}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {q.chapter && <span>{q.chapter}</span>}
                                {q.category && (
                                  <>
                                    <span>•</span>
                                    <span>{q.category}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>{q.attempts} attempt{q.attempts !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                            
                            {/* Expand/Collapse Button */}
                            <button
                              onClick={() => toggleQuestionExpand(q.questionId)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <FiChevronUp className="w-3 h-3" />
                                  Hide Answer
                                </>
                              ) : (
                                <>
                                  <FiChevronDown className="w-3 h-3" />
                                  Show Answer
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Answer Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-200">
                        {isLoadingDetail ? (
                          <div className="py-4 text-center">
                            <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-500 mt-2">Loading answer...</p>
                          </div>
                        ) : detail ? (
                          <div className="pt-4 space-y-3">
                            <div>
                              <h5 className="text-xs font-semibold text-gray-700 mb-2">Options:</h5>
                              <div className="space-y-2">
                                {Array.isArray(detail.options) ? (
                                  detail.options.map((option: any) => {
                                    const isCorrect = option.id === detail.correctAnswer
                                    return (
                                      <div
                                        key={option.id}
                                        className={`p-2 rounded text-sm ${
                                          isCorrect
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-gray-50 border border-gray-200'
                                        }`}
                                      >
                                        <span className="font-semibold mr-2">{option.id}.</span>
                                        {option.text}
                                        {isCorrect && (
                                          <span className="ml-2 text-xs font-semibold text-green-600">
                                            ✓ Correct Answer
                                          </span>
                                        )}
                                      </div>
                                    )
                                  })
                                ) : (
                                  <p className="text-sm text-gray-500">No options available</p>
                                )}
                              </div>
                            </div>
                            {detail.explanation && (
                              <div>
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Explanation:</h5>
                                <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
                                  {detail.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-4 text-center text-sm text-red-600">
                            Failed to load answer details
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>

          {/* Pagination Controls */}
          {difficulty.hard.length > hardQuestionsPageSize && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {(hardQuestionsPage - 1) * hardQuestionsPageSize + 1} to{' '}
                {Math.min(hardQuestionsPage * hardQuestionsPageSize, difficulty.hard.length)} of{' '}
                {difficulty.hard.length} questions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHardQuestionsPage(p => Math.max(1, p - 1))}
                  disabled={hardQuestionsPage === 1}
                  className={`p-2 rounded border transition-colors ${
                    hardQuestionsPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {(() => {
                    const totalPages = Math.ceil(difficulty.hard.length / hardQuestionsPageSize)
                    let pages: (number | 'ellipsis')[] = []
                    if (totalPages <= 7) {
                      pages = Array.from({ length: totalPages }, (_, i) => i + 1)
                    } else {
                      const show = new Set<number>([1, totalPages])
                      for (let i = Math.max(1, hardQuestionsPage - 1); i <= Math.min(totalPages, hardQuestionsPage + 1); i++) {
                        show.add(i)
                      }
                      const sorted = Array.from(show).sort((a, b) => a - b)
                      for (let i = 0; i < sorted.length; i++) {
                        if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) pages.push('ellipsis')
                        pages.push(sorted[i]!)
                      }
                    }
                    return pages.map((page, idx) => {
                      if (page === 'ellipsis') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setHardQuestionsPage(page)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            hardQuestionsPage === page
                              ? 'bg-red-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })
                  })()}
                </div>
                <button
                  onClick={() =>
                    setHardQuestionsPage(p =>
                      Math.min(Math.ceil(difficulty.hard.length / hardQuestionsPageSize), p + 1)
                    )
                  }
                  disabled={
                    hardQuestionsPage === Math.ceil(difficulty.hard.length / hardQuestionsPageSize)
                  }
                  className={`p-2 rounded border transition-colors ${
                    hardQuestionsPage === Math.ceil(difficulty.hard.length / hardQuestionsPageSize)
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
