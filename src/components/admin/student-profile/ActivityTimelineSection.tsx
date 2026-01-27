'use client'

import { useState, useEffect } from 'react'
import { FiCheckCircle, FiPlayCircle, FiFileText, FiClock } from 'react-icons/fi'

interface Activity {
  type: string
  timestamp: string
  description: string
  metadata: any
}

interface ActivitySummary {
  totalActivities: number
  recentActivitiesCount: number
  activityByType: {
    chaptersCompleted: number
    testsCompleted: number
    chaptersStarted: number
  }
}

interface Props {
  studentId: string
}

export function ActivityTimelineSection({ studentId }: Props) {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])
  const [summary, setSummary] = useState<ActivitySummary | null>(null)

  useEffect(() => {
    fetchActivityTimeline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  const fetchActivityTimeline = async () => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/activity?limit=20`)
      const data = await response.json()

      if (response.ok) {
        setActivities(data.activities)
        setSummary(data.summary)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching activity timeline:', error)
      setLoading(false)
    }
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffMs = now.getTime() - activityTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    
    return activityTime.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CHAPTER_COMPLETE':
        return { icon: <FiCheckCircle className="w-5 h-5" />, color: 'text-green-600 bg-green-100' }
      case 'CHAPTER_START':
        return { icon: <FiPlayCircle className="w-5 h-5" />, color: 'text-blue-600 bg-blue-100' }
      case 'TEST_COMPLETE':
      case 'TIMED_TEST_COMPLETE':
        return { icon: <FiFileText className="w-5 h-5" />, color: 'text-purple-600 bg-purple-100' }
      default:
        return { icon: <FiClock className="w-5 h-5" />, color: 'text-gray-600 bg-gray-100' }
    }
  }

  const getActivityDetails = (activity: Activity) => {
    switch (activity.type) {
      case 'CHAPTER_COMPLETE':
        return activity.metadata.score ? `Score: ${activity.metadata.score}%` : null
      case 'TEST_COMPLETE':
        return `Score: ${activity.metadata.score}% (${activity.metadata.correctAnswers}/${activity.metadata.totalQuestions})`
      case 'TIMED_TEST_COMPLETE':
        return `Score: ${activity.metadata.percentage}% (${activity.metadata.score}/${activity.metadata.totalQuestions})`
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!summary || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No activity recorded yet. Activity will appear here as the student uses the platform.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{summary.totalActivities}</div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{summary.recentActivitiesCount}</div>
          <div className="text-sm text-gray-600">Last 7 Days</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary.activityByType.chaptersCompleted}</div>
          <div className="text-sm text-gray-600">Chapters Done</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{summary.activityByType.testsCompleted}</div>
          <div className="text-sm text-gray-600">Tests Done</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Activities */}
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const { icon, color } = getActivityIcon(activity.type)
            const details = getActivityDetails(activity)

            return (
              <div key={index} className="relative pl-14">
                {/* Icon */}
                <div className={`absolute left-0 p-2 rounded-full ${color}`}>
                  {icon}
                </div>

                {/* Content */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium text-gray-900">{activity.description}</div>
                    <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {getRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                  {details && (
                    <div className="text-sm text-gray-600 mt-1">{details}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {activities.length >= 20 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing last 20 activities
        </div>
      )}
    </div>
  )
}
