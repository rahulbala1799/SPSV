'use client'

import Link from 'next/link'
import { FaBook, FaCheckCircle, FaClock } from 'react-icons/fa'

interface ChapterProgress {
  id: string
  chapterId: string
  isCompleted: boolean
  lastAccessed: Date
  notes?: string | null
}

interface Chapter {
  id: string
  title: string
  pageRange?: { start: number; end: number }
}

interface ChapterCardProps {
  chapter: Chapter
  progress?: ChapterProgress
}

export function ChapterCard({ chapter, progress }: ChapterCardProps) {
  const isCompleted = progress?.isCompleted || false
  const lastAccessed = progress?.lastAccessed
    ? new Date(progress.lastAccessed).toLocaleDateString()
    : null

  return (
    <Link href={`/dashboard/chapters/${chapter.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-green-500 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
              <FaBook className={isCompleted ? 'text-green-600' : 'text-blue-600'} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{chapter.title}</h3>
              {chapter.pageRange && (
                <p className="text-sm text-gray-500">
                  Pages {chapter.pageRange.start}-{chapter.pageRange.end}
                </p>
              )}
            </div>
          </div>
          {isCompleted && (
            <FaCheckCircle className="text-green-500 text-xl" />
          )}
        </div>

        <div className="space-y-2">
          {lastAccessed && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-xs" />
              <span>Last accessed: {lastAccessed}</span>
            </div>
          )}

          {progress?.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <p className="font-medium mb-1">Your Notes:</p>
              <p className="text-xs">{progress.notes.substring(0, 100)}...</p>
            </div>
          )}

          <div className="pt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              isCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
