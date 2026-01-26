'use client'

import React from 'react'
import { MCQOption } from './MCQOption'

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
}

export function MCQQuestion({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onSelectAnswer,
  onSubmitAnswer,
  submitting = false
}: MCQQuestionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Question {question.questionNumber}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {question.points} point{question.points !== 1 ? 's' : ''}
          </span>
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
