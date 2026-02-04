'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiArrowLeft, FiTrendingUp, FiTrendingDown, FiTarget, FiCheckCircle, 
  FiAlertCircle, FiClock, FiBarChart2, FiChevronDown,
  FiZap, FiAward
} from 'react-icons/fi'
import { FaFlag, FaRegFlag } from 'react-icons/fa'
import { getShuffledOptions, getOrCreateChapterSessionId } from '@/lib/quizUtils'

interface QuestionOption {
  id: string
  text: string
}

interface FullQuestion {
  id: string
  questionText: string
  questionNumber: number
  options: QuestionOption[]
  correctAnswer?: string
  explanation?: string
  points: number
  difficulty: string
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

interface ChapterAnalyticsProps {
  chapterId: string
  chapterSlug: string
  chapterTitle: string
}

export function ChapterAnalytics({ chapterId, chapterSlug, chapterTitle }: ChapterAnalyticsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [allQuestions, setAllQuestions] = useState<Record<string, FullQuestion>>({})
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation?: string } | null>(null)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [flagging, setFlagging] = useState(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const chapterSessionId = typeof window !== 'undefined' ? getOrCreateChapterSessionId(chapterId) : chapterId

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

      await Promise.all([
        loadAnalytics(),
        loadAllQuestions()
      ])
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

  // Preload ALL questions at once for instant access
  const loadAllQuestions = async () => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}/questions`)
      const data = await response.json()

      if (response.ok && data.questions) {
        const questionsMap: Record<string, FullQuestion> = {}
        data.questions.forEach((q: FullQuestion) => {
          questionsMap[q.id] = q
        })
        setAllQuestions(questionsMap)
        
        // Also load flag statuses for all questions
        const flagStatuses = await Promise.all(
          data.questions.map(async (q: FullQuestion) => {
            try {
              const res = await fetch(`/api/questions/${q.id}/flag-status`)
              const flagData = await res.json()
              return { id: q.id, isFlagged: flagData.isFlagged }
            } catch {
              return { id: q.id, isFlagged: false }
            }
          })
        )
        
        const flaggedSet = new Set<string>()
        flagStatuses.forEach(({ id, isFlagged }) => {
          if (isFlagged) flaggedSet.add(id)
        })
        setFlaggedQuestions(flaggedSet)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setQuestionsLoaded(true)
    }
  }

  const handleExpandQuestion = (questionId: string) => {
    if (expandedQuestionId === questionId) {
      // Collapse with animation
      setExpandedQuestionId(null)
      setSelectedAnswer(null)
      setAnswered(false)
      setAnswerResult(null)
      return
    }

    // Expand - questions already loaded!
    setExpandedQuestionId(questionId)
    setSelectedAnswer(null)
    setAnswered(false)
    setAnswerResult(null)
    
    // Scroll to expanded question after a brief delay
    setTimeout(() => {
      expandedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleSubmitAnswer = async () => {
    if (!expandedQuestionId || !selectedAnswer || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(
        `/api/chapters/${chapterId}/questions/${expandedQuestionId}/answer`,
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
        loadAnalytics()
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

  const handleToggleFlag = async (questionId: string) => {
    if (flagging) return

    setFlagging(true)
    const isFlagged = flaggedQuestions.has(questionId)
    
    try {
      if (isFlagged) {
        const response = await fetch('/api/questions/unflag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId })
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setFlaggedQuestions(prev => {
            const next = new Set(prev)
            next.delete(questionId)
            return next
          })
        }
      } else {
        const response = await fetch('/api/questions/flag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId,
            flaggedFrom: 'CHAPTER'
          })
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setFlaggedQuestions(prev => new Set(prev).add(questionId))
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <FiBarChart2 className="w-10 h-10 text-slate-500" />
          </div>
          <p className="text-slate-400 mb-4">No analytics data yet</p>
          <Link 
            href={`/dashboard/chapters/${chapterSlug}`} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Start practicing →
          </Link>
        </div>
      </div>
    )
  }

  const { overview, questionStats } = analytics

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/chapters/${chapterSlug}`}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-white truncate">{chapterTitle}</h1>
              <p className="text-sm text-slate-400">Analytics & Practice</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-5 max-w-2xl mx-auto pb-24">
        
        {/* Hero Stats Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Your Progress</p>
                <p className="text-4xl font-bold text-white">{overview.progressPercentage}%</p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <FiZap className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/90">
                <span className="font-bold">{overview.questionsAttempted}</span>/{overview.totalQuestions} questions
              </span>
              <span className="text-white/90">
                <span className="font-bold">{overview.overallSuccessRate}%</span> success
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <FiCheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{overview.questionsMastered}</p>
            <p className="text-xs text-slate-400">Mastered</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <FiAlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">{overview.questionsNeedReview}</p>
            <p className="text-xs text-slate-400">Review</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-slate-600/50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <FiTarget className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-white">{overview.questionsNotAttempted}</p>
            <p className="text-xs text-slate-400">New</p>
          </div>
        </div>

        {/* More Stats */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <FiBarChart2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Total Attempts</span>
            </div>
            <p className="text-xl font-bold text-white">{overview.totalAttempts}</p>
          </div>
          
          <div className="flex-1 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <FiClock className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Study Time</span>
            </div>
            <p className="text-xl font-bold text-white">{overview.studyDuration} <span className="text-sm font-normal text-slate-400">days</span></p>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">All Questions</h2>
            {!questionsLoaded && (
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                Loading...
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-4">Tap any question to practice</p>
        </div>

        {/* Question Cards */}
        <div className="space-y-3">
          {questionStats.map((q) => {
            const isExpanded = expandedQuestionId === q.questionId
            const fullQuestion = allQuestions[q.questionId]
            const isFlagged = flaggedQuestions.has(q.questionId)
            
            return (
              <div 
                key={q.questionId}
                ref={isExpanded ? expandedRef : null}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded 
                    ? 'bg-slate-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => handleExpandQuestion(q.questionId)}
                  className="w-full p-4 text-left"
                  disabled={!questionsLoaded}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Indicator */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      q.status === 'mastered' 
                        ? 'bg-emerald-500/20' 
                        : q.status === 'needs_review'
                        ? 'bg-amber-500/20'
                        : 'bg-slate-700/50'
                    }`}>
                      {q.status === 'mastered' ? (
                        <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : q.status === 'needs_review' ? (
                        <FiAlertCircle className="w-5 h-5 text-amber-400" />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">{q.questionNumber}</span>
                      )}
                    </div>
                    
                    {/* Question Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-500">Q{q.questionNumber}</span>
                        {isFlagged && (
                          <FaFlag className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                      <p className={`text-sm text-slate-200 ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {q.questionText}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {q.attemptCount > 0 && (
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          q.successRate >= 80 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : q.successRate >= 50 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {q.successRate}%
                        </div>
                      )}
                      <FiChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {isExpanded && fullQuestion && (
                    <div className="px-4 pb-4 border-t border-slate-700/50">
                      {/* Full Question */}
                      <div className="pt-4 pb-3">
                        <p className="text-base text-white font-medium leading-relaxed">
                          {fullQuestion.questionText}
                        </p>
                      </div>

                      {/* Flag Button */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => handleToggleFlag(q.questionId)}
                          disabled={flagging}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            isFlagged
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700'
                          } ${flagging ? 'opacity-50' : ''}`}
                        >
                          {isFlagged ? <FaFlag className="w-4 h-4" /> : <FaRegFlag className="w-4 h-4" />}
                          {isFlagged ? 'Flagged' : 'Flag'}
                        </button>
                        
                        {answered && answerResult && (
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                            answerResult.isCorrect 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {answerResult.isCorrect ? (
                              <><FiCheckCircle className="w-4 h-4" /> Correct!</>
                            ) : (
                              <><FiAlertCircle className="w-4 h-4" /> Incorrect</>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Options - shuffled per question, positional labels (A=1st, B=2nd, …) */}
                      <div className="space-y-2 mb-4">
                        {getShuffledOptions(fullQuestion.options, `${chapterSessionId}-${fullQuestion.id}`).map((option, idx) => {
                          const isSelected = selectedAnswer === option.id
                          const isCorrectAnswer = answered && answerResult?.correctAnswer === option.id
                          const isWrongSelection = answered && isSelected && !answerResult?.isCorrect
                          const optionLetter = String.fromCharCode(65 + idx)
                          
                          return (
                            <button
                              key={option.id}
                              onClick={() => !answered && setSelectedAnswer(option.id)}
                              disabled={answered}
                              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                                isCorrectAnswer
                                  ? 'bg-emerald-500/20 border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                                  : isWrongSelection
                                  ? 'bg-red-500/20 border-2 border-red-500 ring-2 ring-red-500/20'
                                  : isSelected
                                  ? 'bg-emerald-500/10 border-2 border-emerald-500/50'
                                  : 'bg-slate-700/30 border-2 border-slate-600/50 hover:border-slate-500'
                              } ${answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors ${
                                  isCorrectAnswer
                                    ? 'bg-emerald-500 text-white'
                                    : isWrongSelection
                                    ? 'bg-red-500 text-white'
                                    : isSelected
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-600 text-slate-300'
                                }`}>
                                  {isCorrectAnswer ? '✓' : isWrongSelection ? '✗' : optionLetter}
                                </div>
                                <span className={`text-sm pt-1 ${
                                  isCorrectAnswer || isWrongSelection || isSelected
                                    ? 'text-white'
                                    : 'text-slate-300'
                                }`}>
                                  {option.text}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Submit / Result */}
                      {!answered ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!selectedAnswer || submitting}
                          className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all ${
                            selectedAnswer && !submitting
                              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]'
                              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Checking...
                            </span>
                          ) : 'Submit Answer'}
                        </button>
                      ) : answerResult?.explanation && (
                        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                          <p className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1">
                            <FiAward className="w-3 h-3" /> Explanation
                          </p>
                          <p className="text-sm text-blue-200">{answerResult.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
