'use client'

import { FiX, FiShuffle, FiTarget, FiTrendingUp } from 'react-icons/fi'

interface QuestionSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number | 'all'
  totalQuestions: number
  unattemptedCount: number
  onConfirm: (strategy: 'mix' | 'new_only' | 'prioritize_new') => void
}

export function QuestionSelectionModal({
  isOpen,
  onClose,
  selectedCount,
  totalQuestions,
  unattemptedCount,
  onConfirm
}: QuestionSelectionModalProps) {
  if (!isOpen) return null

  const countText = selectedCount === 'all' ? totalQuestions : selectedCount
  const hasUnattempted = unattemptedCount > 0
  const allUnattempted = unattemptedCount === totalQuestions

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Question Strategy</h2>
            <p className="text-sm text-gray-600">Choose {countText} questions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Status Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FiTarget className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Question Status</span>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Total questions: {totalQuestions}</p>
              <p>• Not attempted: {unattemptedCount}</p>
              <p>• Already attempted: {totalQuestions - unattemptedCount}</p>
            </div>
          </div>

          {/* Mix and Match */}
          <button
            onClick={() => onConfirm('mix')}
            className="w-full p-4 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <FiShuffle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Mix & Match</h3>
                <p className="text-sm text-gray-600">
                  Random selection from all {totalQuestions} questions (attempted & unattempted)
                </p>
              </div>
            </div>
          </button>

          {/* Only New Questions */}
          {hasUnattempted && !allUnattempted && (
            <button
              onClick={() => onConfirm('new_only')}
              className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <FiTarget className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">New Questions Only</h3>
                  <p className="text-sm text-gray-600">
                    {unattemptedCount < countText 
                      ? `Only ${unattemptedCount} unattempted questions available (fewer than ${countText})`
                      : `Practice only unattempted questions (${Math.min(unattemptedCount, countText as number)} questions)`
                    }
                  </p>
                  {unattemptedCount < countText && (
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ You&apos;ll get {unattemptedCount} questions instead of {countText}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )}

          {/* Prioritize New (Recommended) */}
          {hasUnattempted && !allUnattempted && (
            <button
              onClick={() => onConfirm('prioritize_new')}
              className="w-full p-4 border-2 border-green-500 bg-green-50 hover:bg-green-100 rounded-xl transition-all text-left group relative"
            >
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-semibold">
                  Recommended
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <FiTrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 pr-20">
                  <h3 className="font-bold text-gray-900 mb-1">Prioritize New Questions</h3>
                  <p className="text-sm text-gray-600">
                    {unattemptedCount >= countText 
                      ? `All ${countText} unattempted questions`
                      : `${unattemptedCount} unattempted + ${(countText as number) - unattemptedCount} random from attempted`
                    }
                  </p>
                  <p className="text-xs text-green-700 font-medium mt-1">
                    ✓ Best for comprehensive learning
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* All unattempted message */}
          {allUnattempted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                🎉 All questions are new! You&apos;ll get a random selection of {countText} questions.
              </p>
            </div>
          )}

          {/* No unattempted message */}
          {!hasUnattempted && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ✅ You&apos;ve attempted all questions! You&apos;ll get a random selection for practice.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
