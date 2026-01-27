'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiBarChart2, FiRefreshCw, FiClock, FiTarget, FiTrendingUp, FiAward, FiCheckCircle, FiZap } from 'react-icons/fi'
import TimedTestOverviewSection from '@/components/progress/TimedTestOverviewSection'
import TimedTestCategorySection from '@/components/progress/TimedTestCategorySection'
import TimedTestListSection from '@/components/progress/TimedTestListSection'
import TimedTestTrendsSection from '@/components/progress/TimedTestTrendsSection'

interface OverviewData {
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

interface TrendsData {
  scoreTrend: Array<{ date: string; score: number; testId: string; testType: string }>
  completionTrend: Array<{ date: string; testsCompleted: number }>
}

interface CategoryData {
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

interface TestData {
  id: string
  testType: string
  totalQuestions: number
  score: number
  correctAnswers: number
  startedAt: string
  completedAt: string | null
  duration: number | null
  industryScore: number
  industryTotal: number
  industryPercentage: number
  areaScore: number
  areaTotal: number
  areaPercentage: number
  timeAllotted: number
  timeRemaining: number
  improvement: {
    vsPrevious: number | null
    vsAverage: number | null
    trend: 'improving' | 'declining' | 'stable' | null
  }
}

interface TrendsFullData {
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

export default function TimedTestsAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'category' | 'tests' | 'trends'
  >('overview')

  // Data states
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [trends, setTrends] = useState<TrendsData | null>(null)
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [tests, setTests] = useState<TestData[]>([])
  const [trendsData, setTrendsData] = useState<TrendsFullData | null>(null)

  // Filters and pagination
  const [testFilters, setTestFilters] = useState({
    testType: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  })
  const [testPagination, setTestPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  })
  const [trendsPeriod, setTrendsPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('all')

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (!response.ok || !data.user) {
        router.push('/login')
        return
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        router.push('/admin')
        return
      }

      setLoading(false)
      loadData()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadData = async () => {
    try {
      // Load overview
      const overviewRes = await fetch('/api/tests/timed/analytics/overview')
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json()
        setOverview(overviewData.overview)
        setTrends(overviewData.trends)
      }

      // Load category performance
      const categoryRes = await fetch('/api/tests/timed/analytics/category')
      if (categoryRes.ok) {
        const categoryData = await categoryRes.json()
        setCategoryData(categoryData.categoryPerformance)
      }

      // Load tests
      await loadTests()

      // Load trends
      await loadTrends()
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const loadTests = async () => {
    try {
      const params = new URLSearchParams({
        limit: testPagination.limit.toString(),
        offset: testPagination.offset.toString(),
        ...(testFilters.testType !== 'all' && { testType: testFilters.testType }),
        sortBy: testFilters.sortBy,
        sortOrder: testFilters.sortOrder,
      })

      const response = await fetch(`/api/tests/timed/analytics/tests?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTests(data.tests)
        setTestPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error loading tests:', error)
    }
  }

  const loadTrends = async () => {
    try {
      const params = new URLSearchParams({
        period: trendsPeriod,
      })

      const response = await fetch(`/api/tests/timed/analytics/trends?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTrendsData(data.trends)
      }
    } catch (error) {
      console.error('Error loading trends:', error)
    }
  }

  const handleTestFilterChange = (filters: {
    testType: string
    sortBy: string
    sortOrder: string
  }) => {
    setTestFilters(filters)
    setTestPagination(prev => ({ ...prev, offset: 0 }))
  }

  const handleTestPageChange = (offset: number) => {
    setTestPagination(prev => ({ ...prev, offset }))
  }

  useEffect(() => {
    checkAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading) {
      loadTests()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testFilters, testPagination.offset])

  useEffect(() => {
    if (!loading) {
      loadTrends()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendsPeriod])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'category', label: 'Categories', icon: FiTarget },
    { id: 'tests', label: 'Test History', icon: FiClock },
    { id: 'trends', label: 'Trends', icon: FiTrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/progress"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Timed Tests Analytics</h1>
                <p className="text-sm text-gray-600">Detailed performance metrics for timed tests</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <FiRefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto pb-20">
        {activeTab === 'overview' && overview && trends && (
          <TimedTestOverviewSection overview={overview} trends={trends} />
        )}

        {activeTab === 'category' && categoryData && (
          <TimedTestCategorySection categoryPerformance={categoryData} />
        )}

        {activeTab === 'tests' && (
          <TimedTestListSection
            tests={tests}
            pagination={testPagination}
            onFilterChange={handleTestFilterChange}
            onPageChange={handleTestPageChange}
          />
        )}

        {activeTab === 'trends' && trendsData && (
          <TimedTestTrendsSection
            trends={trendsData}
            period={trendsPeriod}
            onPeriodChange={setTrendsPeriod}
          />
        )}

        {/* Empty States */}
        {activeTab === 'overview' && (!overview || overview.totalTests === 0) && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <FiClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Timed Tests Yet</h3>
            <p className="text-gray-600 mb-6">
              Take your first timed test to see comprehensive performance metrics here.
            </p>
            <Link
              href="/dashboard/timed-tests"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Your First Timed Test
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
