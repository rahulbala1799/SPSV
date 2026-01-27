'use client'

import { FiTrendingUp, FiCheckCircle, FiClock, FiBook, FiAward, FiZap } from 'react-icons/fi'
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

interface TimedTestOverviewSectionProps {
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
      testType: string
    }>
    completionTrend: Array<{
      date: string
      testsCompleted: number
    }>
  }
}

export default function TimedTestOverviewSection({
  overview,
  trends,
}: TimedTestOverviewSectionProps) {
  // Format score trend data for chart
  const scoreChartData = trends.scoreTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: item.score,
    testType: item.testType === 'FULL_TIMED' ? 'Full Test' : 'Mock Test'
  }))

  // Format score distribution for chart
  const distributionData = [
    { name: 'Excellent\n(90-100%)', value: overview.scoreDistribution.excellent, color: '#10B981' },
    { name: 'Good\n(80-89%)', value: overview.scoreDistribution.good, color: '#3B82F6' },
    { name: 'Average\n(70-79%)', value: overview.scoreDistribution.average, color: '#F59E0B' },
    { name: 'Needs Work\n(<70%)', value: overview.scoreDistribution.needsWork, color: '#EF4444' },
  ]

  const passRate = overview.completedTests > 0
    ? Math.round(((overview.scoreDistribution.excellent + overview.scoreDistribution.good) / overview.completedTests) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Key Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiClock className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-gray-600 font-medium">Total Tests</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.totalTests}</p>
          <p className="text-xs text-gray-500 mt-1">{overview.inProgressTests} in progress</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600 font-medium">Completed</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.completedTests}</p>
          <p className="text-xs text-gray-500 mt-1">{overview.completionRate}% completion rate</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-5 h-5 text-purple-600" />
            <p className="text-xs text-gray-600 font-medium">Avg Score</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.overallAverageScore}%</p>
          <p className={`text-xs mt-1 ${overview.overallAverageScore >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
            {overview.overallAverageScore >= 80 ? 'Above pass mark' : 'Below pass mark (80%)'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiAward className="w-5 h-5 text-yellow-600" />
            <p className="text-xs text-gray-600 font-medium">Best Score</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overview.bestScore}%</p>
          <p className="text-xs text-gray-500 mt-1">Range: {overview.worstScore}% - {overview.bestScore}%</p>
        </div>
      </div>

      {/* Pass Rate and Success Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiZap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">Pass Rate (≥80%)</h3>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">{passRate}%</p>
          <p className="text-sm text-gray-600">
            {overview.scoreDistribution.excellent + overview.scoreDistribution.good} of {overview.completedTests} tests passed
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Question Success Rate</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-2">{overview.overallSuccessRate}%</p>
          <p className="text-sm text-gray-600">
            {overview.totalCorrectAnswers} of {overview.totalQuestionsAnswered} questions correct
          </p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Questions</p>
          <p className="text-xl font-bold text-gray-900">{overview.totalQuestionsAnswered}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Avg Questions/Test</p>
          <p className="text-xl font-bold text-gray-900">{overview.averageQuestionsPerTest}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Correct Answers</p>
          <p className="text-xl font-bold text-green-600">{overview.totalCorrectAnswers}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Incorrect Answers</p>
          <p className="text-xl font-bold text-red-600">
            {overview.totalQuestionsAnswered - overview.totalCorrectAnswers}
          </p>
        </div>
      </div>

      {/* Test Frequency */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Test Activity</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Last 7 Days</p>
            <p className="text-2xl font-bold text-blue-600">{overview.testFrequency.last7Days}</p>
            <p className="text-xs text-gray-500 mt-1">tests taken</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Last 30 Days</p>
            <p className="text-2xl font-bold text-green-600">{overview.testFrequency.last30Days}</p>
            <p className="text-xs text-gray-500 mt-1">tests taken</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Last 90 Days</p>
            <p className="text-2xl font-bold text-purple-600">{overview.testFrequency.last90Days}</p>
            <p className="text-xs text-gray-500 mt-1">tests taken</p>
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
              <XAxis 
                dataKey="name" 
                angle={0}
                textAnchor="middle" 
                height={60}
                style={{ fontSize: '12px' }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {distributionData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {distributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600">{item.name.replace('\n', ' ')}: {item.value}</span>
              </div>
            ))}
          </div>
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
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Blue: Full Timed Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-gray-600">Purple: Mock Tests</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
