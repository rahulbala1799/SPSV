'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Timer from '@/components/timed-tests/Timer'
import QuestionGrid from '@/components/timed-tests/QuestionGrid'

interface Question {
  id: string
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
        setSession(data.session)
        setQuestions(data.questions)
        setTimeRemaining(data.session.timeRemaining)
        
        // Restore answers
        const savedAnswers: Record<string, string> = {}
        data.answers.forEach((a: any) => {
          savedAnswers[a.questionId] = a.selectedAnswer
        })
        setAnswers(savedAnswers)
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
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!session || questions.length === 0) {
    return <div className="container mx-auto px-4 py-8">Session not found</div>
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const answeredQuestions = new Set(
    questions.filter(q => answers[q.id]).map(q => q.orderNumber)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Timer and Header */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-4 border-b">
        <div>
          <h1 className="text-xl font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </h1>
          <p className="text-sm text-gray-600">
            {answeredCount} / {questions.length} answered
          </p>
        </div>
        <div className="text-right">
          <Timer
            timeRemaining={timeRemaining}
            onExpire={handleTimerExpire}
            onWarning={handleWarning}
          />
          {saving && <div className="text-xs text-gray-500">Saving...</div>}
        </div>
      </div>

      {/* Warning Modal */}
      {warning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4">Time Warning</h2>
            <p className="mb-4">
              {warning === 1 
                ? '1 minute remaining!'
                : `${warning} minutes remaining!`
              }
            </p>
            <button
              onClick={() => setWarning(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Question Grid */}
      <div className="mb-6">
        <QuestionGrid
          totalQuestions={questions.length}
          currentIndex={currentIndex}
          answeredQuestions={answeredQuestions}
          onQuestionClick={setCurrentIndex}
        />
      </div>

      {/* Question Display */}
      {currentQuestion && (
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 rounded text-xs ${
              currentQuestion.category === 'INDUSTRY' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {currentQuestion.category}
            </span>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">{currentQuestion.questionText}</h2>
          
          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map(option => (
              <label
                key={option}
                className={`flex items-center p-3 border-2 rounded cursor-pointer ${
                  answers[currentQuestion.id] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-3"
                />
                <span><strong>{option}.</strong> {currentQuestion.options[option as keyof typeof currentQuestion.options]}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setShowReview(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Review & Submit
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
            
            <div className="mb-4 space-y-2">
              <p><strong>Total Questions:</strong> {questions.length}</p>
              <p><strong>Answered:</strong> {answeredCount}</p>
              <p><strong>Unanswered:</strong> {questions.length - answeredCount}</p>
            </div>

            {questions.length - answeredCount > 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold mb-2">Unanswered Questions:</p>
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
                        className="px-2 py-1 bg-yellow-200 rounded text-sm"
                      >
                        {q.orderNumber}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowReview(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded"
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
