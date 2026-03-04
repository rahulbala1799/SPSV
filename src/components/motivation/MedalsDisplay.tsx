'use client'

import { FiLock, FiCheck, FiChevronRight } from 'react-icons/fi'

interface EarnedAchievement {
  id: string
  code: string
  name: string
  description: string
  type: 'MEDAL' | 'TROPHY' | 'BADGE'
  tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  icon: string
  earnedAt: string
  isNew?: boolean
}

interface MedalsDisplayProps {
  earnedAchievements: EarnedAchievement[]
  totalMedals?: number
  className?: string
  onViewAll?: () => void
}

// Medal tier colors and styles - matching emerald/cyan theme
const tierStyles = {
  BRONZE: {
    bg: 'bg-gradient-to-br from-amber-600 to-amber-800',
    border: 'border-amber-500',
    glow: 'shadow-amber-500/30',
    text: 'text-amber-600',
    label: 'Bronze',
  },
  SILVER: {
    bg: 'bg-gradient-to-br from-slate-300 to-slate-500',
    border: 'border-slate-400',
    glow: 'shadow-slate-400/30',
    text: 'text-slate-500',
    label: 'Silver',
  },
  GOLD: {
    bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    border: 'border-yellow-400',
    glow: 'shadow-yellow-400/40',
    text: 'text-yellow-600',
    label: 'Gold',
  },
  PLATINUM: {
    bg: 'bg-gradient-to-br from-cyan-300 to-blue-400',
    border: 'border-cyan-400',
    glow: 'shadow-cyan-400/40',
    text: 'text-cyan-500',
    label: 'Platinum',
  },
  DIAMOND: {
    bg: 'bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500',
    border: 'border-violet-400',
    glow: 'shadow-violet-400/50',
    text: 'text-violet-500',
    label: 'Diamond',
  },
}

function MedalCard({ achievement, index }: { achievement: EarnedAchievement; index: number }) {
  const tier = achievement.tier || 'BRONZE'
  const style = tierStyles[tier]

  return (
    <div
      className={`relative group`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* New badge */}
      {achievement.isNew && (
        <div className="absolute -top-1 -right-1 z-10">
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center shadow-md">
            !
          </span>
        </div>
      )}
      
      {/* Medal container */}
      <div className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl ${style.bg} p-0.5 shadow-lg ${style.glow} transform group-hover:scale-110 transition-all duration-300 cursor-pointer`}>
        <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-[14px] flex flex-col items-center justify-center p-2">
          {/* Icon */}
          <span className="text-3xl md:text-4xl mb-1 drop-shadow-lg">{achievement.icon}</span>
          
          {/* Tier label */}
          <span className="text-[10px] md:text-xs text-white/90 font-semibold uppercase tracking-wide">
            {style.label}
          </span>
          
          {/* Checkmark */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md">
            <FiCheck className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
      
      {/* Tooltip on hover */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20">
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
          <p className="font-semibold">{achievement.name}</p>
          <p className="text-gray-400">{achievement.description}</p>
        </div>
      </div>
    </div>
  )
}

function LockedMedalPlaceholder({ index }: { index: number }) {
  return (
    <div
      className="w-20 h-24 md:w-24 md:h-28 rounded-2xl bg-gray-200 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center opacity-50"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <FiLock className="w-6 h-6 text-gray-400" />
      <span className="text-[10px] text-gray-400 mt-1">Locked</span>
    </div>
  )
}

export function MedalsDisplay({ earnedAchievements, totalMedals = 12, className = '', onViewAll }: MedalsDisplayProps) {
  const medals = earnedAchievements.filter(a => a.type === 'MEDAL')
  const displayMedals = medals.slice(0, 6)
  const lockedCount = Math.max(0, Math.min(6, totalMedals - displayMedals.length))
  const remaining = medals.length - 6

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-5 md:p-6 border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-xl">🏅</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Medals</h3>
            <p className="text-sm text-gray-500">{medals.length} earned</p>
          </div>
        </div>
        {onViewAll && medals.length > 0 && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            View All <FiChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Medals Grid */}
      {medals.length > 0 ? (
        <div className="flex flex-wrap gap-3 justify-start">
          {displayMedals.map((medal, index) => (
            <MedalCard key={medal.id} achievement={medal} index={index} />
          ))}
          {Array.from({ length: lockedCount }).map((_, index) => (
            <LockedMedalPlaceholder key={`locked-${index}`} index={displayMedals.length + index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <span className="text-3xl opacity-50">🏅</span>
          </div>
          <p className="text-gray-600 font-medium">No medals yet</p>
          <p className="text-sm text-gray-400 mt-1">Complete chapters and tests to earn medals!</p>
        </div>
      )}

      {/* Show more indicator */}
      {remaining > 0 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">+{remaining} more medals</span>
        </div>
      )}
    </div>
  )
}

// Compact horizontal medal display
export function MedalsDisplayCompact({ earnedAchievements, className = '' }: MedalsDisplayProps) {
  const medals = earnedAchievements.filter(a => a.type === 'MEDAL').slice(0, 4)

  if (medals.length === 0) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500 mr-1">🏅</span>
      <div className="flex -space-x-3">
        {medals.map((medal) => {
          const tier = medal.tier || 'BRONZE'
          const style = tierStyles[tier]
          return (
            <div
              key={medal.id}
              className={`w-10 h-10 rounded-full ${style.bg} border-2 border-white flex items-center justify-center shadow-md`}
              title={medal.name}
            >
              <span className="text-lg">{medal.icon}</span>
            </div>
          )
        })}
      </div>
      <span className="text-sm font-medium text-gray-700">{medals.length}</span>
    </div>
  )
}
