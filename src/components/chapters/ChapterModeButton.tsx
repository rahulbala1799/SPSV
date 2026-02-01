'use client'

import Link from 'next/link'
import { FiBookOpen } from 'react-icons/fi'

interface ChapterModeButtonProps {
  chapterSlug: string
}

export function ChapterModeButton({ chapterSlug }: ChapterModeButtonProps) {
  return (
    <Link
      href={`/dashboard/chapters/${chapterSlug}/chapter-mode`}
      className="block bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 mb-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
          <FiBookOpen className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">Chapter Mode</h3>
          <p className="text-sm text-slate-400">Study questions and answers at your own pace</p>
        </div>
        <div className="text-emerald-400 group-hover:translate-x-1 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
