'use client'

import { useState, useEffect } from 'react'
import { FiAward, FiAlertTriangle, FiInfo } from 'react-icons/fi'

interface ChapterArea {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  category?: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  timeSpent?: number
  performanceLevel?: string
  recommendation?: string
}

interface CategoryPerformance {
  category: string
  accuracy: number
  questionsAttempted: number
  correctAnswers: number
}

interface Recommendation {
  type: string
  priority: string
  message: string
  chapters: string[]
}

interface AnalysisSummary {
  totalChaptersAnalyzed: number
  strongCount: number
  weakCount: number
  averageAccuracy: number
}

interface Props {
  studentId: string
}

export function StrengthWeaknessSection({ studentId }: Props) {
  const [loading, setLoading] = useState(true)
  const [strongAreas, setStrongAreas] = useState<ChapterArea[]>([])
  const [weakAreas, setWeakAreas] = useState<ChapterArea[]>([])
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [summary, setSummary] = useState<AnalysisSummary | null>(null)

  useEffect(() => {
    fetchAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/analysis`)
      const data = await response.json()

      if (response.ok) {
        setStrongAreas(data.strongAreas)
        setWeakAreas(data.weakAreas)
        setCategoryPerformance(data.categoryPerformance)
        setRecommendations(data.recommendations)
        setSummary(data.summary)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analysis:', error)
      setLoading(false)
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600'
    if (accuracy >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-40 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!summary || summary.totalChaptersAnalyzed === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Not enough data for analysis yet. Student needs to complete more chapters.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Strength & Weakness Analysis</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{summary.totalChaptersAnalyzed}</div>
          <div className="text-sm text-gray-600">Chapters Analyzed</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary.strongCount}</div>
          <div className="text-sm text-gray-600">Strong Areas</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{summary.weakCount}</div>
          <div className="text-sm text-gray-600">Weak Areas</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{summary.averageAccuracy}%</div>
          <div className="text-sm text-gray-600">Avg Accuracy</div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiInfo className="w-5 h-5 text-blue-600" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 border-2 rounded-lg ${getPriorityColor(rec.priority)}`}>
                <div className="font-semibold mb-1">{rec.message}</div>
                {rec.chapters.length > 0 && (
                  <div className="text-sm mt-2">
                    <span className="font-medium">Chapters:</span> {rec.chapters.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong & Weak Areas Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strong Areas */}
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FiAward className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Strong Areas</h3>
          </div>
          {strongAreas.length > 0 ? (
            <div className="space-y-3">
              {strongAreas.map((area) => (
                <div key={area.chapterId} className="p-3 bg-white rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Chapter {area.chapterNumber}: {area.chapterTitle}
                      </div>
                      {area.category && (
                        <div className="text-xs text-gray-500 mt-1">{area.category}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{area.accuracy}%</div>
                      <div className="text-xs text-gray-500">
                        {area.correctAnswers}/{area.totalQuestions}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAward className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">Excellent Performance</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600 text-center py-4">
              No strong areas yet. Keep practicing to achieve 80%+ accuracy.
            </div>
          )}
        </div>

        {/* Weak Areas */}
        <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Weak Areas</h3>
          </div>
          {weakAreas.length > 0 ? (
            <div className="space-y-3">
              {weakAreas.map((area) => (
                <div key={area.chapterId} className="p-3 bg-white rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Chapter {area.chapterNumber}: {area.chapterTitle}
                      </div>
                      {area.category && (
                        <div className="text-xs text-gray-500 mt-1">{area.category}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600">{area.accuracy}%</div>
                      <div className="text-xs text-gray-500">
                        {area.correctAnswers}/{area.totalQuestions}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-700 font-medium">Needs Review</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600 text-center py-4">
              Great! No weak areas detected. All chapters performing well.
            </div>
          )}
        </div>
      </div>

      {/* Category Performance */}
      {categoryPerformance.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryPerformance.map((cat, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{cat.category}</div>
                    <div className="text-sm text-gray-600">
                      {cat.correctAnswers} / {cat.questionsAttempted} questions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getAccuracyColor(cat.accuracy)}`}>
                      {cat.accuracy}%
                    </div>
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      cat.accuracy >= 80 ? 'bg-green-600' :
                      cat.accuracy >= 60 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${cat.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
