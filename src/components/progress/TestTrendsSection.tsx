'use client'

import { useState } from 'react'
import { FiTrendingUp } from 'react-icons/fi'
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
} from 'recharts'

interface TestTrendsSectionProps {
  trends: {
    scoreTrend: Array<{
      date: string
      score: number
      testId: string
      category: string
    }>
    completionTrend: Array<{
      date: string
      testsCompleted: number
    }>
    categoryComparison: Array<{
      date: string
      industryScore: number | null
      areaScore: number | null
    }>
    questionCountTrend: Array<{
      date: string
      averageQuestions: number
    }>
  }
  period: '7d' | '30d' | '90d' | 'all'
  onPeriodChange: (period: '7d' | '30d' | '90d' | 'all') => void
}

export default function TestTrendsSection({
  trends,
  period,
  onPeriodChange,
}: TestTrendsSectionProps) {
  // Format score trend data
  const scoreChartData = trends.scoreTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: item.score,
  }))

  // Format completion trend data
  const completionChartData = trends.completionTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    testsCompleted: item.testsCompleted,
  }))

  // Format category comparison data
  const categoryChartData = trends.categoryComparison.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    'Industry Knowledge': item.industryScore,
    'Area Knowledge': item.areaScore,
  }))

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Period:</span>
          {(['7d', '30d', '90d', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Score Trend Chart */}
      {scoreChartData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Score Trend</h3>
          </div>
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

      {/* Completion Trend Chart */}
      {completionChartData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Test Completion Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={completionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="testsCompleted" fill="#10B981" name="Tests Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Comparison Chart */}
      {categoryChartData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Category Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Industry Knowledge"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Area Knowledge"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ fill: '#F97316', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
