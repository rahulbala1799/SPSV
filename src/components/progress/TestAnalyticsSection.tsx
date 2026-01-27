'use client'

import { FiZap, FiTarget, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface TestAnalyticsSectionProps {
  analytics: {
    streaks: {
      current: number
      longest: number
      averagePerWeek: number
      averagePerMonth: number
    }
    improvement: {
      scoreImprovement: number
      consistencyScore: number
      learningCurve: Array<{
        testNumber: number
        score: number
        date: string
      }>
    }
    weakAreas: Array<{
      category: string
      averageScore: number
      testCount: number
      recommendation: string
    }>
    strengths: Array<{
      category: string
      averageScore: number
      testCount: number
    }>
    recommendations: Array<{
      type: string
      category: string | null
      message: string
      priority: string
    }>
  }
}

export default function TestAnalyticsSection({
  analytics,
}: TestAnalyticsSectionProps) {
  // Format learning curve data
  const learningCurveData = analytics.improvement.learningCurve.map(item => ({
    test: `Test ${item.testNumber}`,
    score: item.score,
  }))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'low':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <FiAlertCircle className="w-4 h-4 text-red-600" />
      case 'medium':
        return <FiTarget className="w-4 h-4 text-yellow-600" />
      case 'low':
        return <FiCheckCircle className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Streak and Improvement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiZap className="w-5 h-5 text-yellow-600" />
            <p className="text-xs text-gray-600 font-medium">Current Streak</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.streaks.current}</p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTarget className="w-5 h-5 text-purple-600" />
            <p className="text-xs text-gray-600 font-medium">Longest Streak</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.streaks.longest}</p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600 font-medium">Improvement</p>
          </div>
          <p className={`text-2xl font-bold ${
            analytics.improvement.scoreImprovement > 0 ? 'text-green-600' : 
            analytics.improvement.scoreImprovement < 0 ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {analytics.improvement.scoreImprovement > 0 ? '+' : ''}
            {analytics.improvement.scoreImprovement}%
          </p>
          <p className="text-xs text-gray-500 mt-1">from first test</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTarget className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-gray-600 font-medium">Consistency</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.improvement.consistencyScore}
          </p>
          <p className="text-xs text-gray-500 mt-1">lower is better</p>
        </div>
      </div>

      {/* Learning Curve Chart */}
      {learningCurveData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Learning Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Score (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weak Areas */}
      {analytics.weakAreas.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiTarget className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Areas Needing Improvement</h3>
          </div>
          <div className="space-y-3">
            {analytics.weakAreas.map((area, index) => (
              <div
                key={index}
                className="p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    {area.category.replace('_', ' ')}
                  </span>
                  <span className="text-lg font-bold text-orange-600">
                    {area.averageScore}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {area.testCount} test{area.testCount !== 1 ? 's' : ''} completed
                </p>
                <p className="text-sm text-gray-700">{area.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {analytics.strengths.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiZap className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Your Strengths</h3>
          </div>
          <div className="space-y-3">
            {analytics.strengths.map((strength, index) => (
              <div
                key={index}
                className="p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {strength.category.replace('_', ' ')}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {strength.averageScore}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {strength.testCount} test{strength.testCount !== 1 ? 's' : ''} completed
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analytics.recommendations.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {analytics.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start gap-3">
                  {getPriorityIcon(rec.priority)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{rec.message}</p>
                    {rec.category && (
                      <p className="text-xs text-gray-600">
                        Category: {rec.category.replace('_', ' ')}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-600 capitalize">
                    {rec.priority} priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
