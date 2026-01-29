'use client'

import React, { useState, useEffect } from 'react'
import { MCQOption } from './MCQOption'
import { FaFlag, FaRegFlag } from 'react-icons/fa'

interface Option {
  id: string
  text: string
}

interface MCQQuestionProps {
  question: {
    id: string
    questionText: string
    questionNumber: number
    options: Option[]
    correctAnswer?: string
    explanation?: string
    points: number
  }
  selectedAnswer: string | null
  isAnswered: boolean
  isCorrect: boolean | null
  onSelectAnswer: (answerId: string) => void
  onSubmitAnswer: () => void
  submitting?: boolean
  showFlagOption?: boolean // Show flag/unflag buttons (chapter context only)
}

export function MCQQuestion({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onSelectAnswer,
  onSubmitAnswer,
  submitting = false,
  showFlagOption = false
}: MCQQuestionProps) {
  const [isFlagged, setIsFlagged] = useState(false)
  const [flagging, setFlagging] = useState(false)
  const [flagStatusLoaded, setFlagStatusLoaded] = useState(false)

  // Load flag status for chapter context
  useEffect(() => {
    if (showFlagOption) {
      setFlagStatusLoaded(false) // Reset when question changes
      loadFlagStatus()
    } else {
      // Reset when not showing flag option
      setIsFlagged(false)
      setFlagStatusLoaded(false)
    }
  }, [question.id, showFlagOption])

  const loadFlagStatus = async () => {
    try {
      const response = await fetch(`/api/questions/${question.id}/flag-status`)
      const data = await response.json()
      if (response.ok) {
        setIsFlagged(data.isFlagged)
      }
    } catch (error) {
      console.error('Error loading flag status:', error)
    } finally {
      setFlagStatusLoaded(true) // Always set to true so button shows
    }
  }

  const handleToggleFlag = async () => {
    if (flagging) return

    setFlagging(true)
    try {
      if (isFlagged) {
        // Unflag
        const response = await fetch('/api/questions/unflag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: question.id })
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setIsFlagged(false)
        }
      } else {
        // Flag
        const response = await fetch('/api/questions/flag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: question.id,
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Question {question.questionNumber}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {question.points} point{question.points !== 1 ? 's' : ''}
            </span>
            {isFlagged && showFlagOption && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <FaFlag className="w-3 h-3" />
                Flagged
              </span>
            )}
          </div>
          {showFlagOption && (
            <button
              onClick={handleToggleFlag}
              disabled={flagging}
              className={`p-2 rounded-lg transition-all ${
                isFlagged
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              } ${flagging ? 'opacity-50 cursor-not-allowed' : ''} ${!flagStatusLoaded ? 'opacity-50' : ''}`}
              title={isFlagged ? 'Unflag question' : 'Flag for review'}
            >
              {isFlagged ? <FaFlag className="w-5 h-5" /> : <FaRegFlag className="w-5 h-5" />}
            </button>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {question.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => (
          <MCQOption
            key={option.id}
            option={option}
            isSelected={selectedAnswer === option.id}
            isCorrect={isCorrect}
            isCorrectAnswer={isAnswered && question.correctAnswer === option.id}
            onClick={() => !isAnswered && onSelectAnswer(option.id)}
            disabled={isAnswered}
          />
        ))}
      </div>

      {/* Submit Button */}
      {!isAnswered && (
        <button
          onClick={onSubmitAnswer}
          disabled={!selectedAnswer || submitting}
          className={`
            w-full py-3 px-6 rounded-xl font-semibold text-white
            transition-all
            ${
              selectedAnswer && !submitting
                ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      )}

      {/* Explanation */}
      {isAnswered && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-900 mb-2">Explanation:</p>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
