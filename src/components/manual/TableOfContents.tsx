'use client';

import React from 'react';
import { FaBook, FaChevronRight } from 'react-icons/fa';

interface Chapter {
  id: string;
  title: string;
  pageRange: { start: number; end: number };
  answeredCount: number;
  totalQuestions: number;
}

interface TableOfContentsProps {
  chapters: Chapter[];
  activeChapter: string | null;
  onChapterClick: (chapterId: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  activeChapter,
  onChapterClick,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaBook className="text-green-600" />
        Table of Contents
      </h3>
      <nav className="space-y-2">
        {chapters.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          const isComplete = chapter.answeredCount === chapter.totalQuestions;

          return (
            <button
              key={chapter.id}
              onClick={() => onChapterClick(chapter.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between group ${
                isActive
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'hover:bg-gray-50 border-2 border-transparent'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${
                    isActive ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {chapter.title}
                  </span>
                  {isComplete && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Pages {chapter.pageRange.start}-{chapter.pageRange.end} • {chapter.answeredCount}/{chapter.totalQuestions} answered
                </div>
              </div>
              <FaChevronRight className={`text-gray-400 group-hover:text-gray-600 transition-colors ${
                isActive ? 'text-green-600' : ''
              }`} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};
