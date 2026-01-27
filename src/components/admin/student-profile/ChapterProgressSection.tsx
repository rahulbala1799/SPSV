'use client'

import { useState, useEffect } from 'react'
import { FiCheckCircle, FiClock, FiPlayCircle, FiCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface ChapterProgress {
  id: string
  title: string
  chapterNumber: number
  type: string
  category: string | null
  duration: number | null
  status: string
  progressPercent: number
  timeSpentSeconds: number
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  startedAt: string | null
  completedAt: string | null
  lastAccessed: string | null
}

interface ChapterProgressSummary {
  total: number
  completed: number
  inProgress: number
  notStarted: number
  totalTimeSpent: number
  averageAccuracy: number
}

interface Props {
  studentId: string
}

export function ChapterProgressSection({ studentId }: Props) {
  const [loading, setLoading] = useState(true)
  const [chapters, setChapters] = useState<ChapterProgress[]>([])
  const [summary, setSummary] = useState<ChapterProgressSummary | null>(null)
  const [sortBy, setSortBy] = useState<'chapterNumber' | 'progress' | 'timeSpent' | 'accuracy'>('chapterNumber')
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchChapterProgress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, sortBy])

  const fetchChapterProgress = async () => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/chapters?sortBy=${sortBy}`)
      const data = await response.json()

      if (response.ok) {
        setChapters(data.chapters)
        setSummary(data.summary)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching chapter progress:', error)
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not started'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />
      case 'IN_PROGRESS':
        return <FiPlayCircle className="w-5 h-5 text-blue-600" />
      default:
        return <FiCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      COMPLETED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      NOT_STARTED: 'bg-gray-100 text-gray-800'
    }
    return styles[status as keyof typeof styles] || styles.NOT_STARTED
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600'
    if (accuracy >= 60) return 'text-blue-600'
    if (accuracy >= 40) return 'text-yellow-600'
    return 'text-red-600'
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Chapter Progress</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="chapterNumber">Chapter Order</option>
            <option value="progress">Progress %</option>
            <option value="timeSpent">Time Spent</option>
            <option value="accuracy">Accuracy</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{summary.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{summary.notStarted}</div>
            <div className="text-sm text-gray-600">Not Started</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{summary.averageAccuracy}%</div>
            <div className="text-sm text-gray-600">Avg Accuracy</div>
          </div>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-3">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
          >
            {/* Chapter Header */}
            <div
              onClick={() => toggleChapter(chapter.id)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-4 flex-1">
                {getStatusIcon(chapter.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      Chapter {chapter.chapterNumber}: {chapter.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(chapter.status)}`}>
                      {chapter.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          chapter.status === 'COMPLETED' ? 'bg-green-600' :
                          chapter.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${chapter.progressPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {chapter.progressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock className="w-4 h-4" />
                    <span>{formatDuration(chapter.timeSpentSeconds)}</span>
                  </div>
                  {chapter.totalQuestions > 0 && (
                    <div className={`text-sm font-semibold ${getAccuracyColor(chapter.accuracy)}`}>
                      {chapter.accuracy}% accuracy
                    </div>
                  )}
                </div>
                {expandedChapters.has(chapter.id) ? (
                  <FiChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Chapter Details (Expanded) */}
            {expandedChapters.has(chapter.id) && (
              <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Time Spent</div>
                    <div className="font-semibold text-gray-900">
                      {formatDuration(chapter.timeSpentSeconds)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Questions</div>
                    <div className="font-semibold text-gray-900">
                      {chapter.correctAnswers} / {chapter.totalQuestions}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                    <div className={`font-semibold ${getAccuracyColor(chapter.accuracy)}`}>
                      {chapter.accuracy}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {chapter.completedAt ? 'Completed' : chapter.startedAt ? 'Started' : 'Status'}
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {formatDate(chapter.completedAt || chapter.startedAt)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No chapter progress data available yet.
        </div>
      )}
    </div>
  )
}
