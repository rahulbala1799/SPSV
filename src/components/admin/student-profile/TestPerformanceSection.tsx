'use client'

import { useState, useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiClock, FiFilter, FiDownload } from 'react-icons/fi'

interface TestAttempt {
  id: string
  testName: string
  testType: string
  category: string
  dateAttempted: string
  score: number
  scorePercentage: number
  questionsTotal: number
  questionsCorrect: number
  questionsIncorrect: number
  timeTaken: number | null
  status: string
  industryScore?: number
  areaScore?: number
  industryPercentage?: number
  areaPercentage?: number
}

interface TestSummary {
  totalTests: number
  untimedTests: number
  timedTests: number
  passedTests: number
  failedTests: number
  averageScore: number
  bestScore: number
  recentScore: number
  passRate: number
}

interface Props {
  studentId: string
}

export function TestPerformanceSection({ studentId }: Props) {
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<TestAttempt[]>([])
  const [filteredTests, setFilteredTests] = useState<TestAttempt[]>([])
  const [summary, setSummary] = useState<TestSummary | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all')
  const [filterType, setFilterType] = useState<'all' | 'timed' | 'untimed'>('all')
  const [selectedTest, setSelectedTest] = useState<TestAttempt | null>(null)

  useEffect(() => {
    fetchTestPerformance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests, filterStatus, filterType])

  const fetchTestPerformance = async () => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/tests`)
      const data = await response.json()

      if (response.ok) {
        setTests(data.tests)
        setSummary(data.summary)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching test performance:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...tests]

    if (filterStatus !== 'all') {
      filtered = filtered.filter(test => 
        test.status.toLowerCase() === filterStatus
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(test => 
        test.testType.toLowerCase() === filterType
      )
    }

    setFilteredTests(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m ${secs}s`
  }

  const getStatusBadge = (status: string) => {
    if (status === 'Passed') {
      return 'bg-green-100 text-green-800'
    }
    return 'bg-red-100 text-red-800'
  }

  const exportToCSV = () => {
    const headers = ['Test Name', 'Type', 'Date', 'Score %', 'Correct', 'Total', 'Time', 'Status']
    const rows = filteredTests.map(test => [
      test.testName,
      test.testType,
      formatDate(test.dateAttempted),
      test.scorePercentage,
      test.questionsCorrect,
      test.questionsTotal,
      formatDuration(test.timeTaken),
      test.status
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `student-test-history-${studentId}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Test Performance</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
        >
          <FiDownload className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{summary.totalTests}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{summary.averageScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{summary.bestScore}%</div>
            <div className="text-sm text-gray-600">Best Score</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{summary.passRate}%</div>
            <div className="text-sm text-gray-600">Pass Rate</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter:</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Types</option>
          <option value="timed">Timed</option>
          <option value="untimed">Untimed</option>
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredTests.length} of {tests.length} tests
        </span>
      </div>

      {/* Tests Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Correct</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTests.map((test) => (
              <tr 
                key={test.id}
                onClick={() => setSelectedTest(test)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{test.testName}</div>
                  <div className="text-xs text-gray-500">{test.category}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {test.testType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(test.dateAttempted)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className={`font-bold ${test.scorePercentage >= 80 ? 'text-green-600' : test.scorePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {test.scorePercentage}%
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  {test.questionsCorrect} / {test.questionsTotal}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {formatDuration(test.timeTaken)}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(test.status)}`}>
                    {test.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {tests.length === 0 
              ? 'No test attempts yet.'
              : 'No tests match the selected filters.'}
          </div>
        )}
      </div>

      {/* Test Detail Modal */}
      {selectedTest && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTest(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedTest.testName}</h3>
                <p className="text-sm text-gray-600">{formatDate(selectedTest.dateAttempted)}</p>
              </div>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Score</div>
                <div className="text-2xl font-bold text-gray-900">{selectedTest.scorePercentage}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Correct Answers</div>
                <div className="text-2xl font-bold text-gray-900">
                  {selectedTest.questionsCorrect} / {selectedTest.questionsTotal}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Time Taken</div>
                <div className="text-2xl font-bold text-gray-900">{formatDuration(selectedTest.timeTaken)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(selectedTest.status)}`}>
                    {selectedTest.status}
                  </span>
                </div>
              </div>
            </div>

            {selectedTest.testType === 'Timed' && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Category Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Industry Knowledge</div>
                    <div className="text-xl font-bold text-blue-600">
                      {selectedTest.industryPercentage?.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedTest.industryScore} correct
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Area Knowledge</div>
                    <div className="text-xl font-bold text-green-600">
                      {selectedTest.areaPercentage?.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedTest.areaScore} correct
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
