'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiBook, FiMapPin, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'

interface TestPerformance {
  id: string
  category: string
  questionCount: number
  score: number
  correctAnswers: number
  totalAnswered: number
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  duration: number | null
  categoryBreakdown: Record<string, any>
  difficultyBreakdown: Record<string, any>
  improvement: {
    vsPrevious: number | null
    vsAverage: number | null
    trend: 'improving' | 'declining' | 'stable' | null
  }
}

interface TestListSectionProps {
  tests: TestPerformance[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  onFilterChange: (filters: { category: string; sortBy: string; sortOrder: string }) => void
  onPageChange: (offset: number) => void
}

export default function TestListSection({
  tests,
  pagination,
  onFilterChange,
  onPageChange,
}: TestListSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const handleFilterChange = () => {
    onFilterChange({ category: categoryFilter, sortBy, sortOrder })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-300'
    if (score >= 80) return 'bg-blue-100 border-blue-300'
    if (score >= 70) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'improving':
        return <FiTrendingUp className="w-4 h-4 text-green-600" />
      case 'declining':
        return <FiTrendingDown className="w-4 h-4 text-red-600" />
      case 'stable':
        return <FiMinus className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                handleFilterChange()
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="INDUSTRY_KNOWLEDGE">Industry Knowledge</option>
              <option value="AREA_KNOWLEDGE">Area Knowledge</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                handleFilterChange()
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Date</option>
              <option value="score">Score</option>
              <option value="questions">Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value)
                handleFilterChange()
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test List */}
      {tests.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-2">No tests found</p>
          <p className="text-sm text-gray-400">
            {categoryFilter !== 'all'
              ? 'Try changing the filter or take a test first'
              : 'Take your first test to see results here'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/dashboard/tests/untimed/${test.id}/results`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {test.category === 'INDUSTRY_KNOWLEDGE' ? (
                        <FiBook className="w-4 h-4 text-purple-600" />
                      ) : (
                        <FiMapPin className="w-4 h-4 text-orange-600" />
                      )}
                      <span className="font-semibold text-gray-900">
                        {test.category === 'INDUSTRY_KNOWLEDGE'
                          ? 'Industry Knowledge'
                          : 'Area Knowledge'}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {test.questionCount} questions
                      </span>
                      {test.improvement.trend && (
                        <span className="flex items-center gap-1">
                          {getTrendIcon(test.improvement.trend)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        {test.correctAnswers}/{test.totalAnswered} correct
                      </span>
                      {test.duration && (
                        <span>• {test.duration} minutes</span>
                      )}
                      {test.completedAt && (
                        <span>
                          • {new Date(test.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 ${getScoreBgColor(
                        test.score
                      )}`}
                    >
                      <span className={`text-xl font-bold ${getScoreColor(test.score)}`}>
                        {test.score}%
                      </span>
                    </div>
                    {test.improvement.vsPrevious !== null && (
                      <p
                        className={`text-xs mt-1 ${
                          test.improvement.vsPrevious > 0
                            ? 'text-green-600'
                            : test.improvement.vsPrevious < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {test.improvement.vsPrevious > 0 ? '+' : ''}
                        {test.improvement.vsPrevious}%
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {pagination.offset + 1}-
                {Math.min(pagination.offset + pagination.limit, pagination.total)} of{' '}
                {pagination.total} tests
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(Math.max(0, pagination.offset - pagination.limit))}
                  disabled={pagination.offset === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(pagination.offset + pagination.limit)}
                  disabled={!pagination.hasMore}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
