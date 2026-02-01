'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  FiCheckCircle, FiAlertCircle, FiTarget, FiChevronDown,
  FiZap, FiAward, FiBook
} from 'react-icons/fi'
import { FaFlag, FaRegFlag } from 'react-icons/fa'

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

interface AttemptStats {
  questionId: string
  totalAttempts: number
  correctAttempts: number
  incorrectAttempts: number
  successRate: number
  attemptsByContext: Record<string, { total: number; correct: number; incorrect: number }>
  latestAttempt: {
    attemptedAt: string
    isCorrect: boolean
    testType: string | null
  } | null
  isLearned: boolean
  firstAttemptedAt: string | null
  lastCorrectAt: string | null
}

interface ChapterModeSectionProps {
  chapterId: string
  chapterTitle: string
}

export function ChapterModeSection({ chapterId, chapterTitle }: ChapterModeSectionProps) {
  const [loading, setLoading] = useState(true)
  
  // Debug logging
  useEffect(() => {
    console.log('[ChapterMode] Component mounted with chapterId:', chapterId)
  }, [chapterId])
  const [allQuestions, setAllQuestions] = useState<Record<string, FullQuestion>>({})
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [attemptStats, setAttemptStats] = useState<Record<string, AttemptStats>>({})
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation?: string } | null>(null)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [flagging, setFlagging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const expandedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chapterId) {
      loadAllQuestions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId])

  // Load all questions and attempt stats
  const loadAllQuestions = async () => {
    try {
      setError(null)
      console.log('[ChapterMode] Loading questions for chapterId:', chapterId)
      // For Chapter Mode (learning mode), fetch with learningMode=true to get correct answers
      const response = await fetch(`/api/chapters/${chapterId}/questions?learningMode=true`)
      const data = await response.json()
      console.log('[ChapterMode] Questions response:', { ok: response.ok, questionCount: data.questions?.length })

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load questions')
      }

      if (data.questions && Array.isArray(data.questions)) {
        const questionsMap: Record<string, FullQuestion> = {}
        data.questions.forEach((q: FullQuestion) => {
          questionsMap[q.id] = q
        })
        setAllQuestions(questionsMap)
        
        // Load attempt stats for all questions (non-blocking)
        const statsPromises = data.questions.map(async (q: FullQuestion) => {
          try {
            const statsResponse = await fetch(`/api/questions/${q.id}/attempt-stats`)
            if (statsResponse.ok) {
              const statsData = await statsResponse.json()
              return { questionId: q.id, stats: statsData }
            }
            return { questionId: q.id, stats: null }
          } catch {
            return { questionId: q.id, stats: null }
          }
        })
        
        const statsResults = await Promise.all(statsPromises)
        const statsMap: Record<string, AttemptStats> = {}
        statsResults.forEach(({ questionId, stats }) => {
          if (stats) {
            statsMap[questionId] = stats
          }
        })
        setAttemptStats(statsMap)
        
        // Load flag statuses (non-blocking)
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
      } else {
        throw new Error('Invalid questions data format')
      }
    } catch (error: any) {
      console.error('Error loading questions:', error)
      setError(error.message || 'Failed to load questions')
    } finally {
      setLoading(false)
      setQuestionsLoaded(true)
    }
  }

  const handleExpandQuestion = (questionId: string) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null)
      setSelectedAnswer(null)
      setAnswered(false)
      setAnswerResult(null)
      return
    }

    setExpandedQuestionId(questionId)
    setSelectedAnswer(null)
    setAnswered(false)
    setAnswerResult(null)
    
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
        
        // Refresh attempt stats after answering
        try {
          const statsResponse = await fetch(`/api/questions/${expandedQuestionId}/attempt-stats`)
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setAttemptStats(prev => ({
              ...prev,
              [expandedQuestionId]: statsData
            }))
          }
        } catch (error) {
          console.error('Error refreshing stats:', error)
        }
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
            flaggedFrom: 'CHAPTER_MODE'
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

  const getQuestionStatus = (question: FullQuestion, stats: AttemptStats | undefined): 'mastered' | 'needs_review' | 'not_attempted' => {
    if (!stats || stats.totalAttempts === 0) return 'not_attempted'
    if (stats.isLearned) return 'mastered'
    return 'needs_review'
  }

  const getContextLabel = (testType: string | null): string => {
    switch (testType) {
      case 'chapter': return 'Chapters'
      case 'untimed': return 'Tests'
      case 'assigned': return 'Assigned'
      case 'timed': return 'Timed'
      default: return 'Other'
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <FiBook className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Chapter Mode</h3>
            <p className="text-sm text-slate-400">Loading questions...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-4">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const questions = Object.values(allQuestions).sort((a, b) => a.questionNumber - b.questionNumber)

  // Show error state
  if (error) {
    return (
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 border border-red-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <FiAlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Chapter Mode</h3>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state if no questions
  if (questions.length === 0 && !loading) {
    return (
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center">
            <FiBook className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Chapter Mode</h3>
            <p className="text-sm text-slate-400">No questions available for this chapter yet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 rounded-2xl p-5 mb-6 border border-slate-700/50">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <FiBook className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Chapter Mode</h3>
            <p className="text-sm text-slate-400">Study questions and answers at your own pace</p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-bold text-white">All Questions</h4>
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
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {questions.map((question) => {
          const isExpanded = expandedQuestionId === question.id
          const stats = attemptStats[question.id]
          const status = getQuestionStatus(question, stats)
          const isFlagged = flaggedQuestions.has(question.id)
          
          return (
            <div 
              key={question.id}
              ref={isExpanded ? expandedRef : null}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isExpanded 
                  ? 'bg-slate-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => handleExpandQuestion(question.id)}
                className="w-full p-4 text-left"
                disabled={!questionsLoaded}
              >
                <div className="flex items-start gap-3">
                  {/* Status Indicator */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    status === 'mastered' 
                      ? 'bg-emerald-500/20' 
                      : status === 'needs_review'
                      ? 'bg-amber-500/20'
                      : 'bg-slate-700/50'
                  }`}>
                    {status === 'mastered' ? (
                      <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : status === 'needs_review' ? (
                      <FiAlertCircle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">{question.questionNumber}</span>
                    )}
                  </div>
                  
                  {/* Question Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-500">Q{question.questionNumber}</span>
                      {isFlagged && (
                        <FaFlag className="w-3 h-3 text-red-400" />
                      )}
                      {stats && stats.totalAttempts > 0 && (
                        <span className="text-xs text-slate-500">
                          {stats.totalAttempts} attempt{stats.totalAttempts !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm text-slate-200 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {question.questionText}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {stats && stats.totalAttempts > 0 && (
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        stats.successRate >= 80 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : stats.successRate >= 50 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {stats.successRate}%
                      </div>
                    )}
                    <FiChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-700/50">
                    {/* Full Question */}
                    <div className="pt-4 pb-3">
                      <p className="text-base text-white font-medium leading-relaxed">
                        {question.questionText}
                      </p>
                    </div>

                    {/* Attempt Statistics */}
                    {stats && stats.totalAttempts > 0 && (
                      <div className="mb-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/50">
                        <div className="flex items-center gap-2 mb-2">
                          <FiTarget className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-bold text-slate-300">Attempt Statistics</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400">Total: </span>
                            <span className="text-white font-bold">{stats.totalAttempts}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Success: </span>
                            <span className="text-emerald-400 font-bold">{stats.successRate}%</span>
                          </div>
                        </div>
                        {Object.keys(stats.attemptsByContext).length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-600/50">
                            <p className="text-xs text-slate-400 mb-1">By Context:</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(stats.attemptsByContext).map(([type, data]) => (
                                <div key={type} className="px-2 py-1 bg-slate-600/50 rounded text-xs">
                                  <span className="text-slate-300">{getContextLabel(type)}: </span>
                                  <span className="text-white font-bold">{data.correct}/{data.total}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {stats.isLearned && (
                          <div className="mt-2 pt-2 border-t border-slate-600/50">
                            <div className="flex items-center gap-2 text-xs">
                              <FiCheckCircle className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Learned</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Flag Button */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => handleToggleFlag(question.id)}
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

                    {/* Correct Answer Indicator (Learning Mode) */}
                    {question.correctAnswer && !answered && (
                      <div className="mb-4 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        <p className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                          <FiCheckCircle className="w-3 h-3" /> Correct Answer
                        </p>
                        <p className="text-sm text-emerald-200">
                          {String.fromCharCode(65 + question.options.findIndex((o: QuestionOption) => o.id === question.correctAnswer))}: {
                            question.options.find((o: QuestionOption) => o.id === question.correctAnswer)?.text
                          }
                        </p>
                      </div>
                    )}

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option.id
                        const isCorrectAnswer = question.correctAnswer === option.id // Show correct answer in learning mode
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
                            title={isCorrectAnswer ? 'Correct Answer' : ''}
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
    </div>
  )
}
