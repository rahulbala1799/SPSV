'use client'

import { useState, useEffect } from 'react'
import { FiClock, FiTrendingUp, FiZap, FiBarChart2 } from 'react-icons/fi'

interface TimeSummary {
  totalTimeSpent: number
  avgTimePerDay: number
  daysSinceEnrollment: number
  totalSessions: number
  avgSessionDuration: number
  longestSession: number
}

interface ChapterTime {
  chapterTitle: string
  chapterNumber: number
  timeSpentSeconds: number
  questionsAttempted: number
  avgTimePerQuestion: number
}

interface DailyTimeData {
  date: string
  timeSpentSeconds: number
  questionsAttempted: number
}

interface PeakDay {
  date: string
  timeSpentSeconds: number
  questionsAttempted: number
}

interface Efficiency {
  questionsPerHour: number
  avgTimePerQuestion: number
  accuracyTrend: Array<{ chapterNumber: number; accuracy: number; order: number }>
  improvementRate: number
}

interface Props {
  studentId: string
}

export function TimeAnalyticsSection({ studentId }: Props) {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<TimeSummary | null>(null)
  const [chapterTimeData, setChapterTimeData] = useState<ChapterTime[]>([])
  const [dailyTimeData, setDailyTimeData] = useState<DailyTimeData[]>([])
  const [peakDays, setPeakDays] = useState<PeakDay[]>([])
  const [efficiency, setEfficiency] = useState<Efficiency | null>(null)

  useEffect(() => {
    fetchTimeStats()
  }, [studentId])

  const fetchTimeStats = async () => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/time-stats`)
      const data = await response.json()

      if (response.ok) {
        setSummary(data.summary)
        setChapterTimeData(data.chapterTimeData)
        setDailyTimeData(data.dailyTimeData)
        setPeakDays(data.peakDays)
        setEfficiency(data.efficiency)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching time stats:', error)
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    })
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
        No time data available yet.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Time Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{formatDuration(summary.totalTimeSpent)}</div>
          <div className="text-sm text-gray-600">Total Time</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary.avgTimePerDay}m</div>
          <div className="text-sm text-gray-600">Avg/Day</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{summary.totalSessions}</div>
          <div className="text-sm text-gray-600">Sessions</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{formatDuration(summary.avgSessionDuration)}</div>
          <div className="text-sm text-gray-600">Avg Session</div>
        </div>
        <div className="p-4 bg-pink-50 rounded-lg">
          <div className="text-2xl font-bold text-pink-600">{formatDuration(summary.longestSession)}</div>
          <div className="text-sm text-gray-600">Longest</div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">{summary.daysSinceEnrollment}</div>
          <div className="text-sm text-gray-600">Days Active</div>
        </div>
      </div>

      {/* Time Spent Trends (Last 30 Days) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FiBarChart2 className="w-5 h-5 text-blue-600" />
          Study Time Trends (Last 30 Days)
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-end justify-between h-32 gap-1">
            {dailyTimeData.map((day, index) => {
              const maxTime = Math.max(...dailyTimeData.map(d => d.timeSpentSeconds), 1)
              const height = (day.timeSpentSeconds / maxTime) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className={`w-full rounded-t transition-all ${
                      day.timeSpentSeconds > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  {/* Tooltip */}
                  <div className="hidden group-hover:block absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    {formatDate(day.date)}
                    <br />
                    {formatDuration(day.timeSpentSeconds)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Peak Study Days */}
        {peakDays.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
              Peak Study Days
            </h3>
            <div className="space-y-2">
              {peakDays.map((day, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{formatDate(day.date)}</div>
                    <div className="text-sm text-gray-600">{day.questionsAttempted} questions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{formatDuration(day.timeSpentSeconds)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Efficiency Metrics */}
        {efficiency && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiZap className="w-5 h-5 text-yellow-600" />
              Efficiency Metrics
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{efficiency.questionsPerHour}</div>
                <div className="text-sm text-gray-600">Questions per Hour</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{efficiency.avgTimePerQuestion}s</div>
                <div className="text-sm text-gray-600">Avg Time per Question</div>
              </div>
              <div className={`p-4 border rounded-lg ${
                efficiency.improvementRate >= 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className={`text-2xl font-bold ${
                  efficiency.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {efficiency.improvementRate >= 0 ? '+' : ''}{efficiency.improvementRate}%
                </div>
                <div className="text-sm text-gray-600">Accuracy Improvement</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Spent by Chapter */}
      {chapterTimeData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiClock className="w-5 h-5 text-blue-600" />
            Time Spent by Chapter (Top 10)
          </h3>
          <div className="space-y-2">
            {chapterTimeData.map((chapter) => (
              <div key={chapter.chapterNumber} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Chapter {chapter.chapterNumber}: {chapter.chapterTitle}
                    </div>
                    <div className="text-sm text-gray-600">
                      {chapter.questionsAttempted} questions • {chapter.avgTimePerQuestion}s per question
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{formatDuration(chapter.timeSpentSeconds)}</div>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (chapter.timeSpentSeconds / chapterTimeData[0].timeSpentSeconds) * 100)}%` 
                    }}
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
