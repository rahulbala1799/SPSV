'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaBook } from 'react-icons/fa';
import { ChapterQuestions } from './ChapterQuestions';

export interface ChapterContent {
  pageNumber: number;
  content: string;
}

export interface ChapterSectionProps {
  chapterId: string;
  title: string;
  pageRange: { start: number; end: number };
  content: ChapterContent[];
  questions: any[];
  isExpanded: boolean;
  onToggle: (chapterId: string) => void;
  answeredCount: number;
}

export const ChapterSection: React.FC<ChapterSectionProps> = ({
  chapterId,
  title,
  pageRange,
  content,
  questions,
  isExpanded,
  onToggle,
  answeredCount,
}) => {
  const formatContent = (text: string) => {
    // Clean up the text and format it
    return text
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        // Format headings (all caps lines)
        if (line.trim().toUpperCase() === line.trim() && line.trim().length > 3 && line.trim().length < 50) {
          return <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.trim()}</h3>;
        }
        // Format bullet points
        if (line.trim().startsWith('›') || line.trim().startsWith('•')) {
          return <li key={index} className="ml-6 mb-2 text-gray-700">{line.trim().substring(1).trim()}</li>;
        }
        // Regular paragraphs
        if (line.trim().length > 0) {
          return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{line.trim()}</p>;
        }
        return null;
      });
  };

  return (
    <div id={chapterId} className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
      {/* Chapter Header */}
      <button
        onClick={() => onToggle(chapterId)}
        className="w-full bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between hover:from-green-700 hover:to-emerald-700 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 text-left">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <FaBook className="text-xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{title}</h2>
            <p className="text-green-100 text-sm">
              Pages {pageRange.start}-{pageRange.end} • {answeredCount}/4 questions answered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <FaChevronUp className="text-2xl" />
          ) : (
            <FaChevronDown className="text-2xl" />
          )}
        </div>
      </button>

      {/* Chapter Content */}
      {isExpanded && (
        <div className="p-6 md:p-8">
          {/* Content */}
          <div className="prose max-w-none mb-8">
            {content.map((page, index) => (
              <div key={index} className="mb-6">
                <div className="text-sm text-gray-500 mb-2 font-semibold">Page {page.pageNumber}</div>
                <div className="text-gray-800">
                  {formatContent(page.content)}
                </div>
              </div>
            ))}
          </div>

          {/* Questions Section */}
          <div className="border-t-2 border-gray-200 pt-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaBook className="text-green-600" />
              Test Your Knowledge
            </h3>
            <ChapterQuestions
              chapterId={chapterId}
              questions={questions}
            />
          </div>
        </div>
      )}
    </div>
  );
};
