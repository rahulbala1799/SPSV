'use client'

import { FiTrendingUp, FiTarget, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

interface TimedTestCategorySectionProps {
  categoryPerformance: {
    INDUSTRY: {
      totalTests: number
      averageScore: number | null
      bestScore: number
      worstScore: number
      totalQuestions: number
      correctAnswers: number
      successRate: number
      recentTrend: Array<{ date: string; score: number; testId: string }>
    }
    AREA_KNOWLEDGE: {
      totalTests: number
      averageScore: number | null
      bestScore: number
      worstScore: number
      totalQuestions: number
      correctAnswers: number
      successRate: number
      recentTrend: Array<{ date: string; score: number; testId: string }>
    }
  }
}

export default function TimedTestCategorySection({
  categoryPerformance,
}: TimedTestCategorySectionProps) {
  const industry = categoryPerformance.INDUSTRY
  const area = categoryPerformance.AREA_KNOWLEDGE

  // Format trend data for chart
  const industryTrendData = industry.recentTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: item.score,
  }))

  const areaTrendData = area.recentTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: item.score,
  }))

  // Radar chart data for comparison
  const comparisonData = [
    {
      metric: 'Avg Score',
      Industry: industry.averageScore || 0,
      'Area Knowledge': area.averageScore || 0,
    },
    {
      metric: 'Best Score',
      Industry: industry.bestScore,
      'Area Knowledge': area.bestScore,
    },
    {
      metric: 'Success Rate',
      Industry: industry.successRate,
      'Area Knowledge': area.successRate,
    },
  ]

  const strongerCategory = 
    industry.averageScore !== null && area.averageScore !== null
      ? industry.averageScore > area.averageScore
        ? 'Industry Knowledge'
        : 'Area Knowledge'
      : null

  return (
    <div className="space-y-6">
      {/* Category Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Knowledge */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">Industry Knowledge</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Average Score</p>
              <p className="text-4xl font-bold text-green-600">
                {industry.averageScore !== null ? `${industry.averageScore}%` : 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Tests Taken</p>
                <p className="text-xl font-bold text-gray-900">{industry.totalTests}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                <p className="text-xl font-bold text-gray-900">{industry.successRate}%</p>
              </div>
            </div>

            <div className="pt-3 border-t border-green-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Best:</span>
                <span className="font-semibold text-green-600">{industry.bestScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Worst:</span>
                <span className="font-semibold text-orange-600">{industry.worstScore}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-green-200">
              <p className="text-xs text-gray-600 mb-1">Questions Answered</p>
              <p className="text-sm font-medium text-gray-900">
                {industry.correctAnswers} of {industry.totalQuestions} correct
              </p>
            </div>
          </div>
        </div>

        {/* Area Knowledge */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Area Knowledge</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Average Score</p>
              <p className="text-4xl font-bold text-blue-600">
                {area.averageScore !== null ? `${area.averageScore}%` : 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Tests Taken</p>
                <p className="text-xl font-bold text-gray-900">{area.totalTests}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                <p className="text-xl font-bold text-gray-900">{area.successRate}%</p>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Best:</span>
                <span className="font-semibold text-blue-600">{area.bestScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Worst:</span>
                <span className="font-semibold text-orange-600">{area.worstScore}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Questions Answered</p>
              <p className="text-sm font-medium text-gray-900">
                {area.correctAnswers} of {area.totalQuestions} correct
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      {strongerCategory && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FiTrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Performance Comparison</h3>
          </div>
          <div className="flex items-center gap-4">
            {strongerCategory === 'Industry Knowledge' ? (
              <FiCheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <FiAlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                Your stronger category is <span className="text-purple-600 font-bold">{strongerCategory}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {strongerCategory === 'Industry Knowledge' 
                  ? `Industry Knowledge: ${industry.averageScore}% vs Area Knowledge: ${area.averageScore}%`
                  : `Area Knowledge: ${area.averageScore}% vs Industry Knowledge: ${industry.averageScore}%`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Radar Comparison Chart */}
      {industry.totalTests > 0 && area.totalTests > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Category Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={comparisonData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Industry"
                dataKey="Industry"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
              <Radar
                name="Area Knowledge"
                dataKey="Area Knowledge"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trend Charts */}
      {industryTrendData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Industry Knowledge Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={industryTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                name="Score (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {areaTrendData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Area Knowledge Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={areaTrendData}>
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
