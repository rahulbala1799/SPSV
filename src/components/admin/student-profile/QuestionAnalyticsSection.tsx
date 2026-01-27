'use client'

import { useState, useEffect } from 'react'
import { FiCheckCircle, FiAlertCircle, FiTarget, FiTrendingUp } from 'react-icons/fi'

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

interface Props {
  studentId: string
}

export function QuestionAnalyticsSection({ studentId }: Props) {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<QuestionSummary | null>(null)
  const [mostAttempted, setMostAttempted] = useState<QuestionData[]>([])
  const [difficulty, setDifficulty] = useState<DifficultyData | null>(null)

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

            {/* Hard Questions */}
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
                  difficulty.hard.map((q, i) => (
                    <div key={i} className="p-2 bg-white rounded text-xs">
                      <div className="text-gray-900 mb-1">{q.questionText}</div>
                      {q.chapter && (
                        <div className="text-gray-500">{q.chapter}</div>
                      )}
                      <div className="mt-1">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                          Needs Review
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-600">No hard questions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
