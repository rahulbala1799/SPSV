'use client'

import { FiCheckCircle, FiX, FiAward } from 'react-icons/fi'

export interface ChapterResultsScoreCardProps {
  /** Aggregate (all-time) score for the chapter: 0–100 */
  aggregateScore: number
  /** Number of correct answers in aggregate (unique questions, latest answer) */
  aggregateCorrect: number
  /** Total unique questions answered in chapter (aggregate) */
  aggregateTotal: number
  /** This run: correct count (from quiz redirect params). If set, session is shown. */
  sessionCorrect?: number | null
  /** This run: total questions (from quiz redirect params) */
  sessionTotal?: number | null
  /** Passing threshold percentage (default 80). Pass/fail uses session when available, else aggregate. */
  passThreshold?: number
}

export function ChapterResultsScoreCard({
  aggregateScore,
  aggregateCorrect,
  aggregateTotal,
  sessionCorrect,
  sessionTotal,
  passThreshold = 80,
}: ChapterResultsScoreCardProps) {
  const hasSession = sessionCorrect != null && sessionTotal != null && sessionTotal > 0
  const sessionScore = hasSession
    ? Math.round((sessionCorrect / sessionTotal) * 100)
    : null
  const isPassed = hasSession
    ? sessionScore! >= passThreshold
    : aggregateScore >= passThreshold

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 mb-6 text-center ${
        isPassed ? 'border-2 border-green-500' : 'border-2 border-orange-500'
      }`}
    >
      <div
        className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
          isPassed ? 'bg-green-100' : 'bg-orange-100'
        }`}
      >
        {isPassed ? (
          <FiAward className="w-12 h-12 text-green-600" />
        ) : (
          <FiX className="w-12 h-12 text-orange-600" />
        )}
      </div>

      <p
        className={`text-lg font-semibold mb-4 ${
          isPassed ? 'text-green-600' : 'text-orange-600'
        }`}
      >
        {isPassed ? 'Congratulations! You passed!' : 'Keep practicing!'}
      </p>

      {/* Session score (this run) + Aggregate (chapter total) */}
      <div className="space-y-4">
        {hasSession && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-500 mb-1">This run</p>
            <p className="text-2xl font-bold text-gray-900">
              {sessionScore}% <span className="text-base font-normal text-gray-600">({sessionCorrect}/{sessionTotal})</span>
            </p>
          </div>
        )}
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500 mb-1">Chapter total</p>
          <p className="text-2xl font-bold text-gray-900">
            {aggregateScore}% <span className="text-base font-normal text-gray-600">({aggregateCorrect}/{aggregateTotal})</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">All-time: latest answer per question</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mt-4">
        <div>
          <span className="font-semibold text-gray-900">{aggregateCorrect}</span> correct
        </div>
        <div>
          <span className="font-semibold text-gray-900">{aggregateTotal - aggregateCorrect}</span> incorrect
        </div>
        <div>
          <span className="font-semibold text-gray-900">{aggregateTotal}</span> total
        </div>
      </div>
    </div>
  )
}
