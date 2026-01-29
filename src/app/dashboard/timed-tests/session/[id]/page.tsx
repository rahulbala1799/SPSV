'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClock } from 'react-icons/fi'
import { FaRegFlag } from 'react-icons/fa'
import Timer from '@/components/timed-tests/Timer'

interface Question {
  id: string
  questionBankId?: string
  orderNumber: number
  questionText: string
  options: { A: string; B: string; C: string; D: string }
  category: string
  selectedAnswer?: string | null
}

export default function TestSessionPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [warning, setWarning] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [pausing, setPausing] = useState(false)
  const [flagging, setFlagging] = useState(false)

  useEffect(() => {
    loadSession()
    
    // Load from localStorage
    const saved = localStorage.getItem(`test-session-${params.id}`)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setAnswers(data.answers || {})
        setTimeRemaining(data.timeRemaining || 0)
      } catch (e) {
        console.error('Error loading from localStorage:', e)
      }
    }
  }, [params.id])

  useEffect(() => {
    // Save to localStorage
    if (session) {
      localStorage.setItem(`test-session-${params.id}`, JSON.stringify({
        answers,
        timeRemaining,
        timestamp: Date.now()
      }))
    }
  }, [answers, timeRemaining, session, params.id])

  async function loadSession() {
    try {
      const res = await fetch(`/api/tests/sessions/${params.id}`)
      const data = await res.json()
      if (res.ok) {
        // Check if session is completed or abandoned
        if (data.session.status === 'COMPLETED' || data.session.status === 'ABANDONED') {
          router.push(`/dashboard/timed-tests/results/${params.id}`)
          return
        }

        // Check if session is paused
        if (data.session.status === 'PAUSED') {
          setIsPaused(true)
        }

        setSession(data.session)
        setQuestions(data.questions)
        const remainingTime = Math.max(0, data.session.timeRemaining)
        setTimeRemaining(remainingTime)
        
        // Restore answers
        const savedAnswers: Record<string, string> = {}
        data.answers.forEach((a: any) => {
          savedAnswers[a.questionId] = a.selectedAnswer
        })
        setAnswers(savedAnswers)

        // Check if time has expired after loading data (only if not paused)
        if (remainingTime <= 0 && data.session.status === 'IN_PROGRESS') {
          // Time expired, auto-submit
          setTimeout(() => handleSubmit(true), 100)
        }
      } else {
        alert('Error loading session: ' + data.error)
        router.push('/dashboard/timed-tests')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to load session')
    } finally {
      setLoading(false)
    }
  }

  async function saveAnswer(questionId: string, selectedAnswer: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/tests/sessions/${params.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          selectedAnswer,
          timeSpent: 0 // TODO: Track actual time spent
        })
      })
      
      if (res.ok) {
        setAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }))
      }
    } catch (error) {
      console.error('Error saving answer:', error)
    } finally {
      setSaving(false)
    }
  }

  function handleAnswerSelect(answer: string) {
    const question = questions[currentIndex]
    if (!question) return
    
    setAnswers(prev => ({ ...prev, [question.id]: answer }))
    
    // Debounced save
    setTimeout(() => {
      saveAnswer(question.id, answer)
    }, 500)
  }

  function handleTimerExpire() {
    handleSubmit(true)
  }

  function handleWarning(minutes: number) {
    setWarning(minutes)
    setTimeout(() => setWarning(null), 5000)
  }

  async function handlePause() {
    if (!confirm('Save progress and pause this test? You can resume it later from the Timed Tests page.')) {
      return
    }

    setPausing(true)
    try {
      const res = await fetch(`/api/tests/sessions/${params.id}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeRemaining
        })
      })

      const data = await res.json()
      if (res.ok) {
        setIsPaused(true)
        setSession((prev: any) => ({ ...prev, status: 'PAUSED' }))
        alert('Test paused successfully! You can resume it later from the Timed Tests page.')
        router.push('/dashboard/timed-tests')
      } else {
        alert('Error pausing test: ' + data.error)
      }
    } catch (error) {
      console.error('Error pausing test:', error)
      alert('Failed to pause test')
    } finally {
      setPausing(false)
    }
  }

  async function handleResume() {
    setPausing(true)
    try {
      const res = await fetch(`/api/tests/sessions/${params.id}/resume`, {
        method: 'POST'
      })

      const data = await res.json()
      if (res.ok) {
        setIsPaused(false)
        setSession((prev: any) => ({ ...prev, status: 'IN_PROGRESS' }))
      } else {
        alert('Error resuming test: ' + data.error)
      }
    } catch (error) {
      console.error('Error resuming test:', error)
      alert('Failed to resume test')
    } finally {
      setPausing(false)
    }
  }

  async function handleFlagQuestion(questionBankId: string) {
    if (flagging) return
    
    setFlagging(true)
    try {
      const res = await fetch('/api/questions/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionBankId,
          flaggedFrom: 'TIMED_TEST'
        })
      })
      
      if (res.ok) {
        // Silent success - don't show the user if it was already flagged
      }
    } catch (error) {
      console.error('Error flagging question:', error)
    } finally {
      setFlagging(false)
    }
  }

  async function handleSubmit(autoSubmit = false) {
    if (!autoSubmit) {
      const unanswered = questions.filter(q => !answers[q.id])
      if (unanswered.length > 0) {
        if (!confirm(`You have ${unanswered.length} unanswered questions. Submit anyway?`)) {
          return
        }
      } else {
        if (!confirm('Are you sure you want to submit?')) {
          return
        }
      }
    }

    try {
      const res = await fetch(`/api/tests/sessions/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeRemaining
        })
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.removeItem(`test-session-${params.id}`)
        router.push(`/dashboard/timed-tests/results/${params.id}`)
      } else {
        alert('Error submitting: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit test')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Session not found</p>
          <Link href="/dashboard/timed-tests" className="text-blue-600 hover:underline mt-2 inline-block">
            Return to Timed Tests
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/timed-tests"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">
                    {answeredCount} / {questions.length} answered
                  </span>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-5 h-5 text-gray-600" />
                    <Timer
                      timeRemaining={timeRemaining}
                      onExpire={handleTimerExpire}
                      onWarning={handleWarning}
                      paused={isPaused}
                    />
                  </div>
                  {!isPaused && (
                    <button
                      onClick={handlePause}
                      disabled={pausing}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pausing ? 'Pausing...' : 'Save & Continue Later'}
                    </button>
                  )}
                  {isPaused && (
                    <button
                      onClick={handleResume}
                      disabled={pausing}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pausing ? 'Resuming...' : 'Resume Test'}
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Warning Modal */}
      {warning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <FiClock className="w-8 h-8 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Time Warning</h2>
            </div>
            <p className="text-gray-700 mb-6">
              {warning === 1 
                ? '⏰ Only 1 minute remaining!'
                : `⏰ ${warning} minutes remaining!`
              }
            </p>
            <button
              onClick={() => setWarning(null)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              Continue Test
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {saving && (
          <div className="mb-4 text-center text-sm text-gray-600">
            💾 Saving...
          </div>
        )}

        {/* Question Display */}
        {currentQuestion && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Question {currentQuestion.orderNumber}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    currentQuestion.category === 'INDUSTRY' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentQuestion.category === 'INDUSTRY' ? 'Industry Knowledge' : 'Area Knowledge'}
                  </span>
                </div>
                {currentQuestion.questionBankId && (
                  <button
                    onClick={() => handleFlagQuestion(currentQuestion.questionBankId!)}
                    disabled={flagging}
                    className={`p-2 rounded-lg transition-all text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${flagging ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Flag for review"
                  >
                    <FaRegFlag className="w-5 h-5" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {['A', 'B', 'C', 'D'].map(option => {
                const isSelected = answers[currentQuestion.id] === option
                return (
                  <label
                    key={option}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(option)}
                      className="w-5 h-5 mr-4"
                    />
                    <span className="text-gray-900">
                      <strong className="font-semibold">{option}.</strong> {currentQuestion.options[option as keyof typeof currentQuestion.options]}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            disabled={currentIndex === questions.length - 1}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-colors"
          >
            Next
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          {!isPaused && (
            <button
              onClick={handlePause}
              disabled={pausing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pausing ? 'Pausing...' : '💾 Save & Continue Later'}
            </button>
          )}
          {isPaused && (
            <button
              onClick={handleResume}
              disabled={pausing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pausing ? 'Resuming...' : '▶️ Resume Test'}
            </button>
          )}
          <button
            onClick={() => setShowReview(true)}
            disabled={isPaused}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review & Submit Test
          </button>
        </div>
      </main>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit Test</h2>
            
            <div className="mb-6 space-y-3 text-gray-700">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Questions:</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Answered:</span>
                <span className="font-bold text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">Unanswered:</span>
                <span className="font-bold text-orange-600">{questions.length - answeredCount}</span>
              </div>
            </div>

            {questions.length - answeredCount > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="font-semibold text-yellow-900 mb-3">⚠️ Unanswered Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {questions
                    .filter(q => !answers[q.id])
                    .map(q => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentIndex(q.orderNumber - 1)
                          setShowReview(false)
                        }}
                        className="px-3 py-2 bg-yellow-200 hover:bg-yellow-300 rounded-lg text-sm font-semibold text-yellow-900 transition-colors"
                      >
                        Q{q.orderNumber}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <p className="text-sm text-red-900 font-medium">
                ⚠️ Once submitted, you cannot change your answers. Make sure you&apos;ve reviewed all questions.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowReview(false)}
                className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
