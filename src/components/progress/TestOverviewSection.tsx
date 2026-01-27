'use client'

import { FiTrendingUp, FiCheckCircle, FiClock, FiBook, FiAward } from 'react-icons/fi'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface TestOverviewSectionProps {
  overview: {
    totalTests: number
    completedTests: number
    inProgressTests: number
    completionRate: number
    overallAverageScore: number
    bestScore: number
    worstScore: number
    scoreDistribution: {
      excellent: number
      good: number
      average: number
      needsWork: number
    }
    averageQuestionsPerTest: number
    totalQuestionsAnswered: number
    totalCorrectAnswers: number
    overallSuccessRate: number
    testFrequency: {
      last7Days: number
      last30Days: number
      last90Days: number
    }
  }
  trends: {
    scoreTrend: Array<{
      date: string
      score: number
      testId: string
    }>
    completionTrend: Array<{
      date: string
      testsCompleted: number
    }>
  }
}

export default function TestOverviewSection({
  overview,
  trends,
}: TestOverviewSectionProps) {
  // Format score trend data for chart
  const scoreChartData = trends.scoreTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: item.score,
  }))

  // Format score distribution for chart
  const distributionData = [
    { name: 'Excellent (90-100%)', value: overview.scoreDistribution.excellent, color: '#10B981' },
    { name: 'Good (80-89%)', value: overview.scoreDistribution.good, color: '#3B82F6' },
    { name: 'Average (70-79%)', value: overview.scoreDistribution.average, color: '#F59E0B' },
    { name: 'Needs Work (<70%)', value: overview.scoreDistribution.needsWork, color: '#EF4444' },
  ]

  return (
    <div className="space-y-6">
      {/* Key Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiBook className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-gray-600 font-medium">Total Tests</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.totalTests}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600 font-medium">Completed</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.completedTests}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-5 h-5 text-purple-600" />
            <p className="text-xs text-gray-600 font-medium">Avg Score</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.overallAverageScore}%</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiAward className="w-5 h-5 text-yellow-600" />
            <p className="text-xs text-gray-600 font-medium">Best Score</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.bestScore}%</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Completion Rate</p>
          <p className="text-xl font-bold text-gray-900">{overview.completionRate}%</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Success Rate</p>
          <p className="text-xl font-bold text-gray-900">{overview.overallSuccessRate}%</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Questions</p>
          <p className="text-xl font-bold text-gray-900">{overview.totalQuestionsAnswered}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Avg Questions/Test</p>
          <p className="text-xl font-bold text-gray-900">{overview.averageQuestionsPerTest}</p>
        </div>
      </div>

      {/* Test Frequency */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Test Frequency</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Last 7 Days</p>
            <p className="text-lg font-bold text-blue-600">{overview.testFrequency.last7Days}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Last 30 Days</p>
            <p className="text-lg font-bold text-green-600">{overview.testFrequency.last30Days}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Last 90 Days</p>
            <p className="text-lg font-bold text-purple-600">{overview.testFrequency.last90Days}</p>
          </div>
        </div>
      </div>

      {/* Score Distribution Chart */}
      {overview.completedTests > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {distributionData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Score Trend Chart */}
      {scoreChartData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Score Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
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
    </div>
  )
}
