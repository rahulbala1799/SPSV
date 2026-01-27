'use client'

import { FiTrendingUp, FiClock, FiActivity, FiCalendar } from 'react-icons/fi'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface TimedTestTrendsSectionProps {
  trends: {
    scoreTrend: Array<{ date: string; score: number; testId: string; testType: string }>
    industryTrend: Array<{ date: string; score: number; testId: string }>
    areaTrend: Array<{ date: string; score: number; testId: string }>
    timeEfficiency: Array<{
      date: string
      timeUsedSeconds: number
      timeUsedMinutes: number
      timePerQuestion: number
      questionsCount: number
      testId: string
    }>
    testTypeBreakdown: {
      FULL_TIMED: number
      MOCK: number
    }
    improvement: {
      scoreImprovement: number
      consistencyScore: number
      averageImprovement: number
    }
    weeklyActivity: Array<{ week: string; testsCompleted: number }>
    monthlyActivity: Array<{ month: string; testsCompleted: number }>
  }
  period: '7d' | '30d' | '90d' | 'all'
  onPeriodChange: (period: '7d' | '30d' | '90d' | 'all') => void
}

export default function TimedTestTrendsSection({
  trends,
  period,
  onPeriodChange,
}: TimedTestTrendsSectionProps) {
  // Format data for charts
  const scoreData = trends.scoreTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: item.score,
  }))

  const categoryData = trends.scoreTrend.map((item, idx) => {
    const industry = trends.industryTrend[idx]
    const area = trends.areaTrend[idx]
    return {
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      Industry: industry?.score || 0,
      Area: area?.score || 0,
    }
  })

  const timeData = trends.timeEfficiency.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    minutes: item.timeUsedMinutes,
    perQuestion: item.timePerQuestion,
  }))

  const testTypePieData = [
    { name: 'Full Timed Tests', value: trends.testTypeBreakdown.FULL_TIMED, color: '#8B5CF6' },
    { name: 'Mock Tests', value: trends.testTypeBreakdown.MOCK, color: '#3B82F6' },
  ]

  const activityData = period === '7d' || period === '30d'
    ? trends.weeklyActivity.map(item => ({
        period: item.week,
        tests: item.testsCompleted,
      }))
    : trends.monthlyActivity.map(item => ({
        period: item.month,
        tests: item.testsCompleted,
      }))

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
          <div className="flex gap-2">
            {['7d', '30d', '90d', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p === '7d' ? 'Last 7 Days' : 
                 p === '30d' ? 'Last 30 Days' : 
                 p === '90d' ? 'Last 90 Days' : 
                 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600 font-medium">Score Improvement</p>
          </div>
          <p className={`text-3xl font-bold ${
            trends.improvement.scoreImprovement > 0 ? 'text-green-600' : 
            trends.improvement.scoreImprovement < 0 ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trends.improvement.scoreImprovement > 0 ? '+' : ''}
            {trends.improvement.scoreImprovement}%
          </p>
          <p className="text-xs text-gray-500 mt-1">from first to latest</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiActivity className="w-5 h-5 text-purple-600" />
            <p className="text-xs text-gray-600 font-medium">Consistency</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {trends.improvement.consistencyScore}
          </p>
          <p className="text-xs text-gray-500 mt-1">standard deviation (lower is better)</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-gray-600 font-medium">Avg Improvement</p>
          </div>
          <p className={`text-3xl font-bold ${
            trends.improvement.averageImprovement > 0 ? 'text-blue-600' : 
            trends.improvement.averageImprovement < 0 ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trends.improvement.averageImprovement > 0 ? '+' : ''}
            {trends.improvement.averageImprovement}%
          </p>
          <p className="text-xs text-gray-500 mt-1">per test (consecutive)</p>
        </div>
      </div>

      {/* Score Trend Chart */}
      {scoreData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Overall Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                name="Score (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Comparison Trend */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Category Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Industry"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                name="Industry (%)"
              />
              <Line
                type="monotone"
                dataKey="Area"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Area (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Time Efficiency Trend */}
      {timeData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiClock className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Time Management Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 4 }}
                name="Time Used (min)"
              />
              <Line
                type="monotone"
                dataKey="perQuestion"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 4 }}
                name="Seconds per Question"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Test Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Test Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={testTypePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {testTypePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              {period === '7d' || period === '30d' ? 'Weekly' : 'Monthly'} Activity
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tests" fill="#3B82F6" name="Tests Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
