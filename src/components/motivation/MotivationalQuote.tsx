'use client'

import { useState, useEffect } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { getRandomQuote, type MotivationalQuote as Quote } from '@/data/motivationalQuotes'

interface MotivationalQuoteProps {
  className?: string
}

export function MotivationalQuote({ className = '' }: MotivationalQuoteProps) {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  const refreshQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setQuote(getRandomQuote())
      setIsAnimating(false)
    }, 300)
  }

  if (!quote) return null

  const gradientByCategory = {
    persistence: 'from-violet-500 via-purple-500 to-fuchsia-500',
    success: 'from-amber-500 via-orange-500 to-red-500',
    learning: 'from-cyan-500 via-blue-500 to-indigo-500',
    confidence: 'from-emerald-500 via-teal-500 to-cyan-500',
    action: 'from-rose-500 via-pink-500 to-fuchsia-500',
  }

  const iconByCategory = {
    persistence: '💪',
    success: '🌟',
    learning: '📚',
    confidence: '🚀',
    action: '⚡',
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientByCategory[quote.category]} p-1 shadow-xl border border-gray-100 ${className}`}
    >
      {/* Inner card with glass effect */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-5 md:p-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Quote icon */}
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradientByCategory[quote.category]} flex items-center justify-center text-2xl shadow-lg`}>
            {iconByCategory[quote.category]}
          </div>
          
          <div className="flex-1 min-w-0">
            <p
              className={`text-gray-800 text-base md:text-lg font-medium leading-relaxed transition-all duration-300 ${
                isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
              }`}
            >
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p
              className={`text-gray-500 text-sm mt-2 transition-all duration-300 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
            >
              — {quote.author}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Daily Motivation
          </span>
          <button
            onClick={refreshQuote}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${gradientByCategory[quote.category]} text-white text-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50`}
          >
            <FiRefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
            New Quote
          </button>
        </div>
      </div>
    </div>
  )
}

// Compact version for smaller spaces
export function MotivationalQuoteCompact({ className = '' }: MotivationalQuoteProps) {
  const [quote, setQuote] = useState<Quote | null>(null)

  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  if (!quote) return null

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 ${className}`}>
      <div className="text-2xl">💡</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 line-clamp-2">&ldquo;{quote.quote}&rdquo;</p>
        <p className="text-xs text-gray-500 mt-1">— {quote.author}</p>
      </div>
    </div>
  )
}
