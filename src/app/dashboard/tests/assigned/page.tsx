'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiClock, FiCheckCircle, FiAlertCircle, FiArrowRight, FiCalendar, 
  FiRefreshCw, FiTrendingUp, FiAward, FiArrowLeft
} from 'react-icons/fi'

interface AssignedTest {
  id: string
  title: string
  description: string | null
  questionCount: number
  isTimed: boolean
  timeLimitMinutes: number | null
  dueDate: string | null
  testStatus: string
  assignedAt: string
  status: string
  startedAt: string | null
  completedAt: string | null
  score: number | null
  correctAnswers: number | null
  // Multi-attempt data
  totalAttempts: number
  bestScore: number | null
  firstScore: number | null
  improvement: number | null
  canRetake: boolean
}

export default function AssignedTestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<AssignedTest[]>([])

  useEffect(() => {
    checkAccessAndFetchTests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAccessAndFetchTests = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (!response.ok || !data.user) {
        router.push('/login')
        return
      }

      // Fetch assigned tests
      await fetchTests()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/student/assigned-tests')
      const data = await response.json()

      if (response.ok) {
        setTests(data.tests)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tests:', error)
      setLoading(false)
    }
  }

  const handleRetake = async (testId: string) => {
    try {
      const response = await fetch(`/api/student/assigned-tests/${testId}/start`, {
        method: 'POST'
      })
      const data = await response.json()

      if (response.ok && data.success) {
        router.push(`/dashboard/tests/assigned/${testId}`)
      } else {
        alert(data.error || 'Failed to start retake')
      }
    } catch (error) {
      console.error('Error starting retake:', error)
      alert('Failed to start retake')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      NOT_STARTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      IN_PROGRESS: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      PAUSED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      EXPIRED: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    return styles[status as keyof typeof styles] || styles.NOT_STARTED
  }

  const getStatusText = (status: string) => {
    const texts = {
      NOT_STARTED: 'Not Started',
      IN_PROGRESS: 'In Progress',
      PAUSED: 'Paused',
      COMPLETED: 'Completed',
      EXPIRED: 'Expired'
    }
    return texts[status as keyof typeof texts] || status
  }

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <FiCheckCircle className="w-4 h-4" />
    if (status === 'IN_PROGRESS') return <FiAlertCircle className="w-4 h-4" />
    if (status === 'PAUSED') return <FiClock className="w-4 h-4" />
    return <FiClock className="w-4 h-4" />
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30'
    if (score >= 60) return 'bg-amber-500/20 border-amber-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="px-4 py-4 max-w-4xl mx-auto">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Assigned Tests</h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete the tests assigned by your instructor
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-24">
        {tests.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 p-12 text-center">
            <div className="w-20 h-20 bg-slate-700/50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Tests Assigned</h2>
            <p className="text-slate-400">
              You don&apos;t have any tests assigned yet. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div 
                key={test.id} 
                className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 p-5 hover:border-slate-600 transition-colors"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{test.title}</h3>
                    {test.description && (
                      <p className="text-slate-400 text-sm line-clamp-2">{test.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 border ${getStatusBadge(test.status)}`}>
                    {getStatusIcon(test.status)}
                    {getStatusText(test.status)}
                  </span>
                </div>

                {/* Info Row */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4 text-slate-500" />
                    <span>{test.questionCount} questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock className="w-4 h-4 text-slate-500" />
                    <span>{test.isTimed ? `${test.timeLimitMinutes} min` : 'Untimed'}</span>
                  </div>
                  {test.dueDate && (
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="w-4 h-4 text-slate-500" />
                      <span>Due: {formatDate(test.dueDate)}</span>
                    </div>
                  )}
                </div>

                {/* Scores Section (for completed tests) */}
                {test.status === 'COMPLETED' && test.score !== null && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {/* Latest Score */}
                    <div className={`p-3 rounded-xl border ${getScoreBg(test.score)}`}>
                      <p className="text-xs text-slate-400 mb-1">Latest Score</p>
                      <p className={`text-xl font-bold ${getScoreColor(test.score)}`}>
                        {test.score}%
                      </p>
                    </div>
                    
                    {/* Best Score */}
                    {test.bestScore !== null && (
                      <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                          <FiAward className="w-3 h-3" /> Best
                        </p>
                        <p className="text-xl font-bold text-purple-400">
                          {test.bestScore}%
                        </p>
                      </div>
                    )}
                    
                    {/* Attempts */}
                    <div className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
                      <p className="text-xs text-slate-400 mb-1">Attempts</p>
                      <p className="text-xl font-bold text-white">
                        {test.totalAttempts}
                      </p>
                    </div>
                    
                    {/* Improvement */}
                    {test.improvement !== null && test.improvement > 0 && (
                      <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                          <FiTrendingUp className="w-3 h-3" /> Improved
                        </p>
                        <p className="text-xl font-bold text-cyan-400">
                          +{test.improvement}%
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500">
                    {test.status === 'COMPLETED' && test.completedAt && (
                      <span>Completed {formatDate(test.completedAt)}</span>
                    )}
                    {(test.status === 'IN_PROGRESS' || test.status === 'PAUSED') && test.startedAt && (
                      <span>Started {formatDate(test.startedAt)}</span>
                    )}
                    {test.status === 'NOT_STARTED' && (
                      <span>Assigned {formatDate(test.assignedAt)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* View Results (for completed) */}
                    {test.status === 'COMPLETED' && (
                      <Link
                        href={`/dashboard/tests/assigned/${test.id}/results`}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                      >
                        View Results
                      </Link>
                    )}
                    
                    {/* Retake Button (for completed) */}
                    {test.canRetake && (
                      <button
                        onClick={() => handleRetake(test.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        Retake
                      </button>
                    )}
                    
                    {/* Start/Continue/Resume (for non-completed) */}
                    {test.status !== 'COMPLETED' && (
                      <Link
                        href={`/dashboard/tests/assigned/${test.id}`}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          test.status === 'NOT_STARTED'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20'
                            : test.status === 'IN_PROGRESS'
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {test.status === 'NOT_STARTED' ? 'Start Test' :
                         test.status === 'IN_PROGRESS' ? 'Continue' :
                         'Resume'}
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
