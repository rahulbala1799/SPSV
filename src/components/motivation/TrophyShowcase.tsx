'use client'

import { FiLock, FiChevronRight, FiStar } from 'react-icons/fi'

interface EarnedTrophy {
  id: string
  code: string
  name: string
  description: string
  icon: string
  earnedAt: string
  isNew?: boolean
  pointsValue: number
}

interface TrophyShowcaseProps {
  earnedTrophies: EarnedTrophy[]
  allTrophies?: { code: string; name: string; description: string; icon: string }[]
  className?: string
  onViewAll?: () => void
}

function TrophyCard({ trophy, index }: { trophy: EarnedTrophy; index: number }) {
  return (
    <div
      className="relative group"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* New badge */}
      {trophy.isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="relative inline-flex rounded-full h-6 w-6 bg-gradient-to-br from-yellow-400 to-amber-500 text-white text-xs font-bold items-center justify-center shadow-md">
            ✨
          </span>
        </div>
      )}

      {/* Trophy container */}
      <div className="relative w-28 h-36 md:w-32 md:h-40 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 p-1 shadow-xl shadow-amber-500/30 transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 cursor-pointer">
        {/* Inner glass */}
        <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-[14px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          {/* Trophy icon */}
          <div className="relative z-10">
            <span className="text-5xl md:text-6xl drop-shadow-lg">{trophy.icon}</span>
          </div>
          
          {/* Trophy name */}
          <div className="mt-2 text-center z-10">
            <p className="text-xs md:text-sm font-bold text-white drop-shadow-md leading-tight">
              {trophy.name}
            </p>
          </div>

          {/* Stars decoration */}
          <div className="absolute top-2 left-2">
            <FiStar className="w-3 h-3 text-yellow-200 animate-pulse" />
          </div>
          <div className="absolute top-2 right-2">
            <FiStar className="w-3 h-3 text-yellow-200 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <FiStar className="w-3 h-3 text-yellow-200 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 w-48">
        <div className="bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl text-center">
          <p className="font-bold text-sm">{trophy.name}</p>
          <p className="text-gray-400 mt-1">{trophy.description}</p>
          <p className="text-yellow-400 font-semibold mt-2">+{trophy.pointsValue} points</p>
        </div>
      </div>
    </div>
  )
}

function LockedTrophyCard({ trophy, index }: { trophy: { code: string; name: string; description: string; icon: string }; index: number }) {
  return (
    <div
      className="relative group"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="w-28 h-36 md:w-32 md:h-40 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 p-1 shadow-lg opacity-60 cursor-pointer">
        <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-[14px] flex flex-col items-center justify-center p-3 relative">
          {/* Locked icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-500/30 flex items-center justify-center">
              <FiLock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          
          {/* Faded trophy */}
          <span className="text-4xl opacity-20">{trophy.icon}</span>
          
          {/* Name */}
          <p className="text-xs font-medium text-gray-600 mt-2 text-center">
            {trophy.name}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 w-44">
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl text-center">
          <p className="font-bold">{trophy.name}</p>
          <p className="text-gray-400 mt-1">{trophy.description}</p>
        </div>
      </div>
    </div>
  )
}

export function TrophyShowcase({ earnedTrophies, allTrophies = [], className = '', onViewAll }: TrophyShowcaseProps) {
  const earnedCodes = new Set(earnedTrophies.map(t => t.code))
  const lockedTrophies = allTrophies.filter(t => !earnedCodes.has(t.code)).slice(0, 3)
  const displayEarned = earnedTrophies.slice(0, 3)

  return (
    <div className={`bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-xl p-5 md:p-6 relative overflow-hidden border border-amber-100 ${className}`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-300/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-400/30">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Trophy Cabinet</h3>
            <p className="text-sm text-gray-600">
              {earnedTrophies.length} of {earnedTrophies.length + allTrophies.filter(t => !earnedCodes.has(t.code)).length} unlocked
            </p>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            View All <FiChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Trophies Display */}
      {earnedTrophies.length > 0 || lockedTrophies.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center md:justify-start relative z-10">
          {displayEarned.map((trophy, index) => (
            <TrophyCard key={trophy.id} trophy={trophy} index={index} />
          ))}
          {lockedTrophies.map((trophy, index) => (
            <LockedTrophyCard key={trophy.code} trophy={trophy} index={displayEarned.length + index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mb-4">
            <span className="text-4xl opacity-30">🏆</span>
          </div>
          <p className="text-gray-700 font-semibold">No trophies yet</p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">
            Complete major milestones to earn prestigious trophies!
          </p>
        </div>
      )}

      {/* More indicator */}
      {earnedTrophies.length > 3 && (
        <div className="mt-4 text-center relative z-10">
          <span className="text-sm text-amber-600 font-medium">
            +{earnedTrophies.length - 3} more trophies
          </span>
        </div>
      )}
    </div>
  )
}

// Single featured trophy display
export function FeaturedTrophy({ trophy }: { trophy: EarnedTrophy }) {
  return (
    <div className="relative inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border border-amber-200">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
        <span className="text-2xl">{trophy.icon}</span>
      </div>
      <div>
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Latest Trophy</p>
        <p className="text-sm font-bold text-gray-900">{trophy.name}</p>
      </div>
    </div>
  )
}
