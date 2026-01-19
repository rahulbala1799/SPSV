'use client'

import { useState } from 'react'
import { ChapterProgress } from '@/types'

interface Chapter {
  id: string
  title: string
  summary?: string
}

interface ChapterSectionProps {
  chapter: Chapter
  progress?: ChapterProgress | null
}

export function ChapterSection({ chapter, progress }: ChapterSectionProps) {
  const [isCompleted, setIsCompleted] = useState(progress?.isCompleted || false)
  const [notes, setNotes] = useState(progress?.notes || '')

  // Update progress when completed
  const handleComplete = async () => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          isCompleted: !isCompleted,
        }),
      })

      if (response.ok) {
        setIsCompleted(!isCompleted)
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  // Save notes
  const handleSaveNotes = async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          notes,
        }),
      })
    } catch (error) {
      console.error('Failed to save notes:', error)
    }
  }

  return (
    <div className="space-y-6">
      {chapter.summary && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-gray-700">{chapter.summary}</p>
        </div>
      )}

      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">
          This chapter content is available in the full manual. Please refer to the SPSV Official Manual page for complete chapter content.
        </p>
        <p className="text-gray-600 text-sm mt-4">
          <a href="/spsv-manual" className="text-green-600 hover:underline">
            View Full Manual →
          </a>
        </p>
      </div>

      {/* Notes Section */}
      <div className="border-t pt-6 mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSaveNotes}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Add your notes here..."
        />
      </div>

      {/* Complete Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleComplete}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isCompleted
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  )
}
