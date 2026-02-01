'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiArrowLeft, FiTrendingUp, FiTrendingDown, FiTarget, FiCheckCircle, 
  FiAlertCircle, FiClock, FiBarChart2, FiChevronDown, FiChevronUp,
  FiX
} from 'react-icons/fi'
import { FaFlag, FaRegFlag } from 'react-icons/fa'

interface QuestionOption {
  id: string
  text: string
}

interface QuestionStat {
  questionId: string
  questionNumber: number
  questionText: string
  difficulty: string
  attemptCount: number
  correctAttempts: number
  successRate: number
  latestAnswer: {
    isCorrect: boolean
    answeredAt: string
  } | null
  isImproving: boolean | null
  status: 'mastered' | 'needs_review' | 'not_attempted'
}

interface Analytics {
  overview: {
    totalQuestions: number
    questionsAttempted: number
    questionsMastered: number
    questionsNeedReview: number
    questionsNotAttempted: number
    totalAttempts: number
    averageAttemptsPerQuestion: number
    overallSuccessRate: number
    recentSuccessRate: number
    studyDuration: number
    progressPercentage: number
  }
  questionStats: QuestionStat[]
  weakestQuestions: QuestionStat[]
  strongestQuestions: QuestionStat[]
  categoryBreakdown: {
    mastered: number
    needsReview: number
    notAttempted: number
  }
}

interface FullQuestion {
  id: string
  questionText: string
  questionNumber: number
  options: QuestionOption[]
  correctAnswer?: string
  explanation?: string
  points: number
}

interface ChapterAnalyticsProps {
  chapterId: string
  chapterSlug: string
  chapterTitle: string
}

export function ChapterAnalytics({ chapterId, chapterSlug, chapterTitle }: ChapterAnalyticsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)
  const [fullQuestion, setFullQuestion] = useState<FullQuestion | null>(null)
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation?: string } | null>(null)
  const [isFlagged, setIsFlagged] = useState(false)
  const [flagging, setFlagging] = useState(false)

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAccessAndLoad = async () => {
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

      await loadAnalytics()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/chapter/${chapterId}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExpandQuestion = async (questionId: string) => {
    if (expandedQuestionId === questionId) {
      // Collapse
      setExpandedQuestionId(null)
      setFullQuestion(null)
      setSelectedAnswer(null)
      setAnswered(false)
      setAnswerResult(null)
      return
    }

    // Expand and load full question
    setExpandedQuestionId(questionId)
    setSelectedAnswer(null)
    setAnswered(false)
    setAnswerResult(null)
    setLoadingQuestion(true)

    try {
      // Fetch full question with options
      const response = await fetch(`/api/chapters/${chapterId}/questions?questionId=${questionId}`)
      const data = await response.json()

      if (response.ok && data.questions && data.questions.length > 0) {
        setFullQuestion(data.questions[0])
        
        // Load flag status
        try {
          const flagResponse = await fetch(`/api/questions/${questionId}/flag-status`)
          const flagData = await flagResponse.json()
          if (flagResponse.ok) {
            setIsFlagged(flagData.isFlagged)
          }
        } catch (e) {
          console.error('Error loading flag status:', e)
        }
      }
    } catch (error) {
      console.error('Error loading question:', error)
    } finally {
      setLoadingQuestion(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!fullQuestion || !selectedAnswer || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(
        `/api/chapters/${chapterId}/questions/${fullQuestion.id}/answer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedAnswer })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setAnswered(true)
        setAnswerResult({
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation
        })
        
        // Refresh analytics after answering
        await loadAnalytics()
      } else {
        alert(data.error || 'Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleFlag = async () => {
    if (!fullQuestion || flagging) return

    setFlagging(true)
    try {
      if (isFlagged) {
        const response = await fetch('/api/questions/unflag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: fullQuestion.id })
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setIsFlagged(false)
        }
      } else {
        const response = await fetch('/api/questions/flag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: fullQuestion.id,
            flaggedFrom: 'CHAPTER'
          })
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setIsFlagged(true)
        }
      }
    } catch (error) {
      console.error('Error toggling flag:', error)
    } finally {
      setFlagging(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBarChart2 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">No analytics data available yet.</p>
          <Link 
            href={`/dashboard/chapters/${chapterSlug}`} 
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Start practicing to see your stats →
          </Link>
        </div>
      </div>
    )
  }

  const { overview, questionStats, weakestQuestions, strongestQuestions } = analytics

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/chapters/${chapterSlug}`}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-gray-900 truncate">Analytics</h1>
              <p className="text-sm text-gray-500 truncate">{chapterTitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-24">
        {/* Overview Stats - 2x2 grid on mobile */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <FiTarget className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500">Progress</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.progressPercentage}%</p>
            <p className="text-xs text-gray-400">{overview.questionsAttempted}/{overview.totalQuestions} done</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-500">Success</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.overallSuccessRate}%</p>
            <p className="text-xs text-gray-400">All attempts</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <FiBarChart2 className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-500">Attempts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.totalAttempts}</p>
            <p className="text-xs text-gray-400">Avg: {overview.averageAttemptsPerQuestion}/Q</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <FiClock className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-500">Study Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overview.studyDuration}</p>
            <p className="text-xs text-gray-400">days</p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-3">Performance</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-emerald-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-600">{overview.questionsMastered}</p>
              <p className="text-xs text-emerald-700">Mastered</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-amber-600">{overview.questionsNeedReview}</p>
              <p className="text-xs text-amber-700">Review</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-600">{overview.questionsNotAttempted}</p>
              <p className="text-xs text-gray-600">New</p>
            </div>
          </div>
        </div>

        {/* Weakest Questions */}
        {weakestQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <FiTrendingDown className="w-4 h-4 text-red-500" />
              <h2 className="text-base font-bold text-gray-900">Need Attention</h2>
            </div>
            <div className="space-y-2">
              {weakestQuestions.slice(0, 3).map((q) => (
                <div key={q.questionId} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">Q{q.questionNumber}</p>
                    <p className="text-sm text-gray-700 line-clamp-1">{q.questionText}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-red-600">{q.successRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Questions Statistics */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-3">All Questions</h2>
          <p className="text-xs text-gray-500 mb-4">Tap a question to practice it</p>
          
          <div className="space-y-2">
            {questionStats.map((q) => {
              const isExpanded = expandedQuestionId === q.questionId
              
              return (
                <div 
                  key={q.questionId} 
                  className={`rounded-xl border-2 overflow-hidden transition-all ${
                    q.status === 'mastered' 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : q.status === 'needs_review'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Question Header - Clickable */}
                  <button
                    onClick={() => handleExpandQuestion(q.questionId)}
                    className="w-full p-3 text-left"
                  >
                    <div className="flex items-start gap-3">
                      {/* Question Number */}
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                        q.status === 'mastered' 
                          ? 'bg-emerald-200 text-emerald-800' 
                          : q.status === 'needs_review'
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        Q{q.questionNumber}
                      </span>
                      
                      {/* Question Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-gray-800 ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {q.questionText}
                        </p>
                      </div>

                      {/* Stats & Expand Icon */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {q.attemptCount > 0 ? (
                          <div className="text-right">
                            <p className={`text-sm font-bold ${
                              q.successRate >= 80 ? 'text-emerald-600' : 
                              q.successRate >= 50 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {q.successRate}%
                            </p>
                            <p className="text-xs text-gray-400">{q.attemptCount}x</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">New</span>
                        )}
                        {isExpanded ? (
                          <FiChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Question Content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-gray-200/50">
                      {loadingQuestion ? (
                        <div className="py-8 text-center">
                          <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                        </div>
                      ) : fullQuestion ? (
                        <div className="pt-3">
                          {/* Full Question Text */}
                          <p className="text-base font-medium text-gray-900 mb-4">
                            {fullQuestion.questionText}
                          </p>

                          {/* Flag Button */}
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={handleToggleFlag}
                              disabled={flagging}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                isFlagged
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              } ${flagging ? 'opacity-50' : ''}`}
                            >
                              {isFlagged ? <FaFlag className="w-4 h-4" /> : <FaRegFlag className="w-4 h-4" />}
                              {isFlagged ? 'Flagged' : 'Flag'}
                            </button>
                            
                            {answered && answerResult && (
                              <span className={`text-sm font-bold ${answerResult.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                {answerResult.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                              </span>
                            )}
                          </div>

                          {/* Options */}
                          <div className="space-y-2 mb-4">
                            {fullQuestion.options.map((option) => {
                              const isSelected = selectedAnswer === option.id
                              const isCorrectAnswer = answered && answerResult?.correctAnswer === option.id
                              const isWrongSelection = answered && isSelected && !answerResult?.isCorrect
                              
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => !answered && setSelectedAnswer(option.id)}
                                  disabled={answered}
                                  className={`w-full p-4 rounded-xl text-left transition-all ${
                                    isCorrectAnswer
                                      ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900'
                                      : isWrongSelection
                                      ? 'bg-red-100 border-2 border-red-500 text-red-900'
                                      : isSelected
                                      ? 'bg-emerald-50 border-2 border-emerald-400'
                                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                                  } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                      isCorrectAnswer
                                        ? 'bg-emerald-500 text-white'
                                        : isWrongSelection
                                        ? 'bg-red-500 text-white'
                                        : isSelected
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {isCorrectAnswer ? '✓' : isWrongSelection ? '✗' : option.id.toUpperCase()}
                                    </div>
                                    <span className="text-sm">{option.text}</span>
                                  </div>
                                </button>
                              )
                            })}
                          </div>

                          {/* Submit / Explanation */}
                          {!answered ? (
                            <button
                              onClick={handleSubmitAnswer}
                              disabled={!selectedAnswer || submitting}
                              className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
                                selectedAnswer && !submitting
                                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg'
                                  : 'bg-gray-300 cursor-not-allowed'
                              }`}
                            >
                              {submitting ? 'Submitting...' : 'Submit Answer'}
                            </button>
                          ) : answerResult?.explanation && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                              <p className="text-xs font-bold text-blue-800 mb-1">Explanation</p>
                              <p className="text-sm text-blue-700">{answerResult.explanation}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-gray-500 text-sm">
                          Failed to load question
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
