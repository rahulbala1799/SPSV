'use client'

import React from 'react'
import { FiCheck, FiX } from 'react-icons/fi'

interface MCQOptionProps {
  option: {
    id: string
    text: string
  }
  isSelected: boolean
  isCorrect: boolean | null // null = not answered yet, true/false = answer submitted
  isCorrectAnswer: boolean // Whether this is the correct answer
  onClick: () => void
  disabled?: boolean
}

export function MCQOption({
  option,
  isSelected,
  isCorrect,
  isCorrectAnswer,
  onClick,
  disabled = false
}: MCQOptionProps) {
  const getOptionStyles = () => {
    if (disabled && isCorrectAnswer) {
      // Show correct answer in green
      return 'bg-green-50 border-2 border-green-500 text-green-900'
    }
    if (disabled && isSelected && isCorrect === false) {
      // Show wrong selected answer in red
      return 'bg-red-50 border-2 border-red-500 text-red-900'
    }
    if (disabled && isSelected && isCorrect === true) {
      // Show correct selected answer in green
      return 'bg-green-50 border-2 border-green-500 text-green-900'
    }
    if (isSelected) {
      // Selected but not answered yet
      return 'bg-blue-50 border-2 border-blue-500 text-blue-900'
    }
    // Default
    return 'bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-300'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 rounded-xl text-left transition-all
        ${getOptionStyles()}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
        flex items-center justify-between gap-3
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
            ${
              disabled && isCorrectAnswer
                ? 'bg-green-500 text-white'
                : disabled && isSelected && isCorrect === false
                ? 'bg-red-500 text-white'
                : disabled && isSelected && isCorrect === true
                ? 'bg-green-500 text-white'
                : isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }
          `}
        >
          {option.id}
        </div>
        <span className="font-medium">{option.text}</span>
      </div>
      
      {/* Icons */}
      {disabled && isCorrectAnswer && (
        <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
      )}
      {disabled && isSelected && isCorrect === false && (
        <FiX className="w-5 h-5 text-red-600 flex-shrink-0" />
      )}
      {disabled && isSelected && isCorrect === true && (
        <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
      )}
    </button>
  )
}
