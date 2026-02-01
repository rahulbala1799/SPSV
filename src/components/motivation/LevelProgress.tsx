'use client'

import { calculateLevel, getLevelTitle } from '@/data/achievements'
import { FiStar, FiZap, FiTrendingUp } from 'react-icons/fi'

interface LevelProgressProps {
  totalPoints: number
  currentStreak?: number
  className?: string
}

export function LevelProgress({ totalPoints, currentStreak = 0, className = '' }: LevelProgressProps) {
  const { level, currentXP, nextLevelXP, progress } = calculateLevel(totalPoints)
  const levelTitle = getLevelTitle(level)

  // Level color based on level number - using emerald/cyan theme
  const getLevelColors = (lvl: number) => {
    if (lvl <= 5) return { bg: 'from-emerald-500 to-cyan-600', text: 'text-emerald-600', light: 'bg-emerald-100' }
    if (lvl <= 10) return { bg: 'from-cyan-500 to-blue-600', text: 'text-cyan-600', light: 'bg-cyan-100' }
    if (lvl <= 15) return { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-600', light: 'bg-blue-100' }
    if (lvl <= 20) return { bg: 'from-purple-500 to-violet-600', text: 'text-purple-600', light: 'bg-purple-100' }
    return { bg: 'from-rose-500 to-pink-600', text: 'text-rose-600', light: 'bg-rose-100' }
  }

  const colors = getLevelColors(level)

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ${className}`}>
      {/* Level Header */}
      <div className={`bg-gradient-to-r ${colors.bg} p-5 md:p-6 text-white relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">Your Level</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl md:text-5xl font-bold">{level}</span>
              <span className="text-lg font-semibold text-white/90">{levelTitle}</span>
            </div>
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <FiStar className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4 relative z-10">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>{currentXP.toLocaleString()} XP</span>
            <span>{nextLevelXP.toLocaleString()} XP to Level {level + 1}</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 md:p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Points */}
          <div className={`${colors.light} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <FiZap className={`w-5 h-5 ${colors.text}`} />
              <span className="text-sm text-gray-600">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalPoints.toLocaleString()}
            </p>
          </div>

          {/* Streak */}
          <div className={`${currentStreak >= 7 ? 'bg-orange-100' : 'bg-gray-100'} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{currentStreak >= 7 ? '🔥' : '📅'}</span>
              <span className="text-sm text-gray-600">Day Streak</span>
            </div>
            <p className={`text-2xl font-bold ${currentStreak >= 7 ? 'text-orange-600' : 'text-gray-900'}`}>
              {currentStreak}
            </p>
          </div>
        </div>

        {/* Level milestones hint */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiTrendingUp className="w-4 h-4" />
            <span>
              {progress >= 75 
                ? `Almost there! ${nextLevelXP - currentXP} XP to level up!`
                : progress >= 50
                ? 'Halfway to the next level!'
                : 'Keep learning to level up!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for header/navbar
export function LevelBadge({ totalPoints, className = '' }: { totalPoints: number; className?: string }) {
  const { level, progress } = calculateLevel(totalPoints)

  const getLevelColor = (lvl: number) => {
    if (lvl <= 5) return 'from-emerald-500 to-cyan-600'
    if (lvl <= 10) return 'from-cyan-500 to-blue-600'
    if (lvl <= 15) return 'from-blue-500 to-indigo-600'
    if (lvl <= 20) return 'from-purple-500 to-violet-600'
    return 'from-rose-500 to-pink-600'
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${getLevelColor(level)} flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-sm">{level}</span>
        {/* Mini progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.2"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray={`${(progress / 100) * 113} 113`}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="hidden md:block">
        <p className="text-xs text-gray-500">Level</p>
        <p className="text-sm font-bold text-gray-900">{level}</p>
      </div>
    </div>
  )
}
