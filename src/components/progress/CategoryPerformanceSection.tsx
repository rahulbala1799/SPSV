'use client'

import { FiBook, FiMapPin, FiTrendingUp } from 'react-icons/fi'
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

interface CategoryPerformanceSectionProps {
  categoryPerformance: {
    INDUSTRY_KNOWLEDGE: {
      totalTests: number
      completedTests: number
      averageScore: number | null
      bestScore: number | null
      worstScore: number | null
      improvementTrend: Array<{ date: string; score: number }>
      totalQuestions: number
      correctAnswers: number
      successRate: number
    }
    AREA_KNOWLEDGE: {
      totalTests: number
      completedTests: number
      averageScore: number | null
      bestScore: number | null
      worstScore: number | null
      improvementTrend: Array<{ date: string; score: number }>
      totalQuestions: number
      correctAnswers: number
      successRate: number
    }
  }
  comparison: {
    industryAverage: number | null
    areaAverage: number | null
    strongerCategory: 'INDUSTRY_KNOWLEDGE' | 'AREA_KNOWLEDGE' | null
  }
}

export default function CategoryPerformanceSection({
  categoryPerformance,
  comparison,
}: CategoryPerformanceSectionProps) {
  // Format trend data for chart
  const industryTrend = categoryPerformance.INDUSTRY_KNOWLEDGE.improvementTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    industry: item.score,
  }))

  const areaTrend = categoryPerformance.AREA_KNOWLEDGE.improvementTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    area: item.score,
  }))

  // Merge trend data
  const allDates = new Set([
    ...industryTrend.map(t => t.date),
    ...areaTrend.map(t => t.date),
  ])

  const combinedTrend = Array.from(allDates)
    .sort()
    .map(date => {
      const industry = industryTrend.find(t => t.date === date)
      const area = areaTrend.find(t => t.date === date)
      return {
        date,
        industry: industry?.industry || null,
        area: area?.area || null,
      }
    })

  return (
    <div className="space-y-6">
      {/* Category Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Knowledge */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <FiBook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Industry Knowledge</h3>
              <p className="text-sm text-gray-600">
                {categoryPerformance.INDUSTRY_KNOWLEDGE.completedTests} tests completed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Average</p>
              <p className="text-2xl font-bold text-purple-600">
                {categoryPerformance.INDUSTRY_KNOWLEDGE.averageScore !== null
                  ? `${categoryPerformance.INDUSTRY_KNOWLEDGE.averageScore}%`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Best</p>
              <p className="text-2xl font-bold text-green-600">
                {categoryPerformance.INDUSTRY_KNOWLEDGE.bestScore !== null
                  ? `${categoryPerformance.INDUSTRY_KNOWLEDGE.bestScore}%`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {categoryPerformance.INDUSTRY_KNOWLEDGE.successRate}%
              </p>
            </div>
          </div>

          {categoryPerformance.INDUSTRY_KNOWLEDGE.improvementTrend.length > 0 && (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={industryTrend}>
                  <Line
                    type="monotone"
                    dataKey="industry"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', r: 3 }}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Area Knowledge */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <FiMapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Area Knowledge</h3>
              <p className="text-sm text-gray-600">
                {categoryPerformance.AREA_KNOWLEDGE.completedTests} tests completed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Average</p>
              <p className="text-2xl font-bold text-orange-600">
                {categoryPerformance.AREA_KNOWLEDGE.averageScore !== null
                  ? `${categoryPerformance.AREA_KNOWLEDGE.averageScore}%`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Best</p>
              <p className="text-2xl font-bold text-green-600">
                {categoryPerformance.AREA_KNOWLEDGE.bestScore !== null
                  ? `${categoryPerformance.AREA_KNOWLEDGE.bestScore}%`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {categoryPerformance.AREA_KNOWLEDGE.successRate}%
              </p>
            </div>
          </div>

          {categoryPerformance.AREA_KNOWLEDGE.improvementTrend.length > 0 && (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={areaTrend}>
                  <Line
                    type="monotone"
                    dataKey="area"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ fill: '#F97316', r: 3 }}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Category Comparison Chart */}
      {combinedTrend.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Category Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="industry"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 4 }}
                name="Industry Knowledge"
              />
              <Line
                type="monotone"
                dataKey="area"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ fill: '#F97316', r: 4 }}
                name="Area Knowledge"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stronger Category Indicator */}
      {comparison.strongerCategory && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Stronger Category</p>
              <p className="text-sm text-gray-600">
                You perform better in{' '}
                <span className="font-semibold">
                  {comparison.strongerCategory === 'INDUSTRY_KNOWLEDGE'
                    ? 'Industry Knowledge'
                    : 'Area Knowledge'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
