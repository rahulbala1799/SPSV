'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiBarChart2, FiRefreshCw } from 'react-icons/fi'
import TestOverviewSection from '@/components/progress/TestOverviewSection'
import CategoryPerformanceSection from '@/components/progress/CategoryPerformanceSection'
import TestListSection from '@/components/progress/TestListSection'
import TestTrendsSection from '@/components/progress/TestTrendsSection'
import TestAnalyticsSection from '@/components/progress/TestAnalyticsSection'

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
  scoreTrend: Array<{ date: string; score: number; testId: string }>
  completionTrend: Array<{ date: string; testsCompleted: number }>
}

interface CategoryData {
  INDUSTRY_KNOWLEDGE: any
  AREA_KNOWLEDGE: any
}

interface TestData {
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

export default function TestPerformancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'category' | 'tests' | 'trends' | 'analytics'
  >('overview')

  // Data states
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [trends, setTrends] = useState<TrendsData | null>(null)
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [tests, setTests] = useState<TestData[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [trendsData, setTrendsData] = useState<any>(null)

  // Filters and pagination
  const [testFilters, setTestFilters] = useState({
    category: 'all',
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
      const overviewRes = await fetch('/api/tests/performance/overview')
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json()
        setOverview(overviewData.overview)
        setTrends(overviewData.trends)
      }

      // Load category performance
      const categoryRes = await fetch('/api/tests/performance/category')
      if (categoryRes.ok) {
        const categoryData = await categoryRes.json()
        setCategoryData(categoryData.categoryPerformance)
      }

      // Load tests
      await loadTests()

      // Load analytics
      const analyticsRes = await fetch('/api/tests/performance/analytics')
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData.analytics)
      }

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
        ...(testFilters.category !== 'all' && { category: testFilters.category }),
        sortBy: testFilters.sortBy,
        sortOrder: testFilters.sortOrder,
      })

      const response = await fetch(`/api/tests/performance/tests?${params}`)
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

      const response = await fetch(`/api/tests/performance/trends?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTrendsData(data.trends)
      }
    } catch (error) {
      console.error('Error loading trends:', error)
    }
  }

  const handleTestFilterChange = (filters: {
    category: string
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
    { id: 'category', label: 'Categories', icon: FiBarChart2 },
    { id: 'tests', label: 'Test History', icon: FiBarChart2 },
    { id: 'trends', label: 'Trends', icon: FiBarChart2 },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
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
                <h1 className="text-xl font-bold text-gray-900">Test Performance Metrics</h1>
                <p className="text-sm text-gray-600">Comprehensive test analytics and insights</p>
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
          <TestOverviewSection overview={overview} trends={trends} />
        )}

        {activeTab === 'category' && categoryData && (
          <CategoryPerformanceSection
            categoryPerformance={categoryData}
            comparison={{
              industryAverage: categoryData.INDUSTRY_KNOWLEDGE.averageScore,
              areaAverage: categoryData.AREA_KNOWLEDGE.averageScore,
              strongerCategory:
                categoryData.INDUSTRY_KNOWLEDGE.averageScore !== null &&
                categoryData.AREA_KNOWLEDGE.averageScore !== null
                  ? categoryData.INDUSTRY_KNOWLEDGE.averageScore >
                    categoryData.AREA_KNOWLEDGE.averageScore
                    ? 'INDUSTRY_KNOWLEDGE'
                    : 'AREA_KNOWLEDGE'
                  : null,
            }}
          />
        )}

        {activeTab === 'tests' && (
          <TestListSection
            tests={tests}
            pagination={testPagination}
            onFilterChange={handleTestFilterChange}
            onPageChange={handleTestPageChange}
          />
        )}

        {activeTab === 'trends' && trendsData && (
          <TestTrendsSection
            trends={trendsData}
            period={trendsPeriod}
            onPeriodChange={setTrendsPeriod}
          />
        )}

        {activeTab === 'analytics' && analytics && (
          <TestAnalyticsSection analytics={analytics} />
        )}

        {/* Empty States */}
        {activeTab === 'overview' && (!overview || overview.totalTests === 0) && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <FiBarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Test Data Yet</h3>
            <p className="text-gray-600 mb-6">
              Take your first test to see comprehensive performance metrics here.
            </p>
            <Link
              href="/dashboard/tests/untimed"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Your First Test
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
