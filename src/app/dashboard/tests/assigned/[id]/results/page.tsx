'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  FiCheck, FiX, FiClock, FiAward, FiArrowLeft, FiTrendingUp, 
  FiRefreshCw, FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import { BottomNav } from '@/components/dashboard/BottomNav'

interface Answer {
  questionId: string
  questionText: string
  options: { id: string; text: string }[]
  selectedAnswer: string | null
  correctAnswer: string
  isCorrect: boolean | null
  explanation: string | null
  answeredAt: string | null
}

interface AttemptSummary {
  attemptNumber: number
  score: number | null
  correctAnswers: number | null
  totalQuestions: number
  completedAt: string | null
  timeSpentSeconds: number | null
  improvementFromPrevious: number | null
}

interface AttemptResults {
  id: string
  testTitle: string
  attemptNumber: number
  score: number
  correctAnswers: number
  totalQuestions: number
  percentageScore: number
  startedAt: string
  completedAt: string
  timeSpentSeconds: number | null
  improvementFromPrevious: number | null
}

interface Stats {
  totalAttempts: number
  bestScore: number | null
  firstScore: number | null
  improvement: number | null
  latestScore: number | null
}

export default function AssignedTestResultsPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState<AttemptResults | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [allAttempts, setAllAttempts] = useState<AttemptSummary[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false)
  const [showAllAttempts, setShowAllAttempts] = useState(false)
  const [selectedAttemptNumber, setSelectedAttemptNumber] = useState<number | null>(null)
  const [loadingAttempt, setLoadingAttempt] = useState(false)

  useEffect(() => {
    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId])

  const fetchResults = async (attemptNumber?: number) => {
    try {
      setLoadingAttempt(true)
      const url = attemptNumber 
        ? `/api/student/assigned-tests/${testId}/results?attempt=${attemptNumber}`
        : `/api/student/assigned-tests/${testId}/results`
      
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setAttempt(data.attempt)
        setAnswers(data.answers)
        setAllAttempts(data.allAttempts || [])
        setStats(data.stats)
        setSelectedAttemptNumber(data.attempt.attemptNumber)
      } else {
        alert(data.error || 'Failed to load results')
        router.push('/dashboard/tests/assigned')
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      alert('Failed to load results')
      router.push('/dashboard/tests/assigned')
    } finally {
      setLoading(false)
      setLoadingAttempt(false)
    }
  }

  const handleAttemptSelect = (attemptNumber: number) => {
    if (attemptNumber === selectedAttemptNumber) return
    fetchResults(attemptNumber)
  }

  const handleRetake = async () => {
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

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-GB', {
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
          <p className="text-slate-400">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!attempt) return null

  const filteredAnswers = showOnlyIncorrect 
    ? answers.filter(a => !a.isCorrect)
    : answers

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="px-4 py-4 max-w-4xl mx-auto">
          <Link 
            href="/dashboard/tests/assigned" 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Assigned Tests
          </Link>
          <h1 className="text-2xl font-bold text-white">Test Results</h1>
          <p className="text-sm text-slate-400 mt-1">{attempt.testTitle}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-24">
        
        {/* Hero Score Card */}
        <div className={`rounded-3xl p-6 mb-5 border-2 ${getScoreBg(attempt.score)} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">
                Attempt {attempt.attemptNumber} Score
              </p>
              <p className={`text-5xl font-bold ${getScoreColor(attempt.score)}`}>
                {attempt.score}%
              </p>
              <p className="text-slate-400 mt-2">
                {attempt.correctAnswers} / {attempt.totalQuestions} correct
              </p>
              
              {attempt.improvementFromPrevious !== null && attempt.improvementFromPrevious !== 0 && (
                <div className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  attempt.improvementFromPrevious > 0 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {attempt.improvementFromPrevious > 0 ? (
                    <><FiTrendingUp className="w-4 h-4" /> +{attempt.improvementFromPrevious}% from last</>
                  ) : (
                    <><FiTrendingUp className="w-4 h-4 rotate-180" /> {attempt.improvementFromPrevious}% from last</>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-right">
              <FiAward className={`w-20 h-20 ${getScoreColor(attempt.score)}`} />
              <p className="text-sm text-slate-400 mt-2">
                {attempt.score >= 80 ? 'Excellent!' :
                 attempt.score >= 60 ? 'Good Job!' :
                 'Keep Practicing!'}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Stats (if multiple attempts) */}
        {stats && stats.totalAttempts > 1 && (
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Attempts</p>
              <p className="text-xl font-bold text-white">{stats.totalAttempts}</p>
            </div>
            
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <FiAward className="w-3 h-3" /> Best
              </p>
              <p className="text-xl font-bold text-purple-400">{stats.bestScore}%</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">First</p>
              <p className="text-xl font-bold text-white">{stats.firstScore}%</p>
            </div>
            
            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <FiTrendingUp className="w-3 h-3" /> Gain
              </p>
              <p className="text-xl font-bold text-cyan-400">
                {stats.improvement && stats.improvement > 0 ? `+${stats.improvement}%` : '—'}
              </p>
            </div>
          </div>
        )}

        {/* All Attempts Toggle */}
        {allAttempts.length > 1 && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl mb-5 overflow-hidden">
            <button
              onClick={() => setShowAllAttempts(!showAllAttempts)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
            >
              <span className="font-semibold text-white">View All Attempts ({allAttempts.length})</span>
              {showAllAttempts ? (
                <FiChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
            
            {showAllAttempts && (
              <div className="border-t border-slate-700/50 p-4 space-y-2">
                {allAttempts.map((a) => (
                  <button
                    key={a.attemptNumber}
                    onClick={() => handleAttemptSelect(a.attemptNumber)}
                    disabled={loadingAttempt}
                    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                      selectedAttemptNumber === a.attemptNumber
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                        : 'bg-slate-700/30 border-2 border-transparent hover:border-slate-600'
                    } ${loadingAttempt ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedAttemptNumber === a.attemptNumber
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-600 text-slate-300'
                      }`}>
                        <span className="font-bold">#{a.attemptNumber}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-slate-400">
                          {formatDate(a.completedAt)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Time: {formatTime(a.timeSpentSeconds)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getScoreColor(a.score || 0)}`}>
                        {a.score}%
                      </p>
                      {a.improvementFromPrevious !== null && a.improvementFromPrevious !== 0 && (
                        <p className={`text-xs ${
                          a.improvementFromPrevious > 0 ? 'text-cyan-400' : 'text-red-400'
                        }`}>
                          {a.improvementFromPrevious > 0 ? '+' : ''}{a.improvementFromPrevious}%
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Test Info */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5 mb-5">
          <h3 className="text-lg font-bold text-white mb-4">Test Information</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Completed</p>
              <p className="text-sm font-semibold text-white">{formatDate(attempt.completedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Time Spent</p>
              <p className="text-sm font-semibold text-white">{formatTime(attempt.timeSpentSeconds)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Correct</p>
              <p className="text-sm font-semibold text-emerald-400">{attempt.correctAnswers}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Incorrect</p>
              <p className="text-sm font-semibold text-red-400">
                {attempt.totalQuestions - attempt.correctAnswers}
              </p>
            </div>
          </div>
        </div>

        {/* Retake CTA */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Want to improve?</h3>
              <p className="text-sm text-slate-300">Take the test again and track your progress</p>
            </div>
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <FiRefreshCw className="w-4 h-4" />
              Retake Test
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 mb-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              showOnlyIncorrect 
                ? 'bg-emerald-500 border-emerald-500' 
                : 'border-slate-500'
            }`}>
              {showOnlyIncorrect && <FiCheck className="w-3 h-3 text-white" />}
            </div>
            <input
              type="checkbox"
              checked={showOnlyIncorrect}
              onChange={(e) => setShowOnlyIncorrect(e.target.checked)}
              className="sr-only"
            />
            <span className="text-sm font-medium text-white">
              Show only incorrect answers ({answers.filter(a => !a.isCorrect).length})
            </span>
          </label>
        </div>

        {/* Answers Review */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-5">Answer Review</h3>
          
          <div className="space-y-4">
            {filteredAnswers.map((answer) => {
              const questionNumber = answers.indexOf(answer) + 1

              return (
                <div
                  key={answer.questionId}
                  className={`rounded-2xl p-5 border-2 ${
                    answer.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-red-500/30 bg-red-500/10'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-400">
                          Question {questionNumber}
                        </span>
                        {answer.isCorrect ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                            <FiCheck className="w-3 h-3" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
                            <FiX className="w-3 h-3" />
                            Incorrect
                          </span>
                        )}
                      </div>
                      <p className="text-base text-white">
                        {answer.questionText}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {answer.options.map((option) => {
                      const isCorrect = option.id === answer.correctAnswer
                      const isSelected = option.id === answer.selectedAnswer

                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-xl border-2 ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-500/20'
                              : isSelected && !isCorrect
                              ? 'border-red-500 bg-red-500/20'
                              : 'border-slate-600/50 bg-slate-700/30'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrect && (
                              <FiCheck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            )}
                            {isSelected && !isCorrect && (
                              <FiX className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <span className="font-semibold text-slate-400 mr-2">{option.id}.</span>
                              <span className={isCorrect ? 'text-emerald-300' : isSelected ? 'text-red-300' : 'text-slate-300'}>
                                {option.text}
                              </span>
                              {isCorrect && (
                                <span className="ml-2 text-xs text-emerald-400 font-semibold">
                                  (Correct)
                                </span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="ml-2 text-xs text-red-400 font-semibold">
                                  (Your Answer)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {answer.explanation && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1">
                        <FiAward className="w-3 h-3" /> Explanation
                      </p>
                      <p className="text-sm text-blue-200">{answer.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Link
            href="/dashboard/tests/assigned"
            className="flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-center transition-colors"
          >
            Back to Tests
          </Link>
          <button
            onClick={handleRetake}
            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retake Test
          </button>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
