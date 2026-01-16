'use client';

import React from 'react';
import { FaChevronDown, FaChevronUp, FaBook, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
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
    // Clean up the text and format it with better structure
    const lines = text.split('\n').filter(line => line.trim());
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip page headers/footers
      if (trimmed.includes('The Official Manual for Operating') || 
          trimmed.includes('Edition 8.0') ||
          (trimmed.includes('pg.') && trimmed.length < 50)) {
        return;
      }

      // Major headings (all caps, short, no periods)
      if (trimmed.toUpperCase() === trimmed && 
          trimmed.length > 3 && 
          trimmed.length < 60 && 
          !trimmed.includes('.') &&
          !trimmed.match(/^\d/)) {
        // Close any open paragraph or list
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${index}`} className="mb-5 text-gray-800 leading-relaxed text-base">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-none space-y-3 mb-6 ml-0">
              {listItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1 flex-shrink-0 text-lg">›</span>
                  <span className="text-gray-800 leading-relaxed flex-1">{item}</span>
                </li>
              ))}
            </ul>
          );
          listItems = [];
        }
        elements.push(
          <h3 key={`heading-${index}`} className="text-2xl font-bold text-gray-900 mt-8 mb-5 pb-3 border-b-2 border-green-300 first:mt-0">
            {trimmed}
          </h3>
        );
        return;
      }

      // Subheadings (section numbers like "1.1", "2.3", etc.)
      if (trimmed.match(/^\d+\.\d+\s+[A-Z]/)) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${index}`} className="mb-5 text-gray-800 leading-relaxed text-base">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-none space-y-3 mb-6 ml-0">
              {listItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1 flex-shrink-0 text-lg">›</span>
                  <span className="text-gray-800 leading-relaxed flex-1">{item}</span>
                </li>
              ))}
            </ul>
          );
          listItems = [];
        }
        const headingText = trimmed.replace(/^\d+\.\d+\s+/, '');
        elements.push(
          <h4 key={`subheading-${index}`} className="text-xl font-semibold text-gray-900 mt-6 mb-4 text-green-700 flex items-center gap-2">
            <FaInfoCircle className="text-green-600" />
            {headingText}
          </h4>
        );
        return;
      }

      // Bullet points
      if (trimmed.startsWith('›') || trimmed.startsWith('•') || trimmed.startsWith('-')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${index}`} className="mb-5 text-gray-800 leading-relaxed text-base">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        const listItem = trimmed.substring(1).trim();
        listItems.push(listItem);
        return;
      }

      // Checkboxes/Ticks (✓)
      if (trimmed.startsWith('✓')) {
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-none space-y-3 mb-6 ml-0">
              {listItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1 flex-shrink-0 text-lg">›</span>
                  <span className="text-gray-800 leading-relaxed flex-1">{item}</span>
                </li>
              ))}
            </ul>
          );
          listItems = [];
        }
        const checkItem = trimmed.substring(1).trim();
        elements.push(
          <div key={`check-${index}`} className="flex items-start gap-3 mb-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-800 leading-relaxed flex-1">{checkItem}</span>
          </div>
        );
        return;
      }

      // NOTE sections
      if (trimmed.startsWith('NOTE') || trimmed.startsWith('TIP') || trimmed.startsWith('IMPORTANT')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${index}`} className="mb-5 text-gray-800 leading-relaxed text-base">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-none space-y-3 mb-6 ml-0">
              {listItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1 flex-shrink-0 text-lg">›</span>
                  <span className="text-gray-800 leading-relaxed flex-1">{item}</span>
                </li>
              ))}
            </ul>
          );
          listItems = [];
        }
        // Get the note content from next lines
        let noteContent = '';
        let noteIndex = index + 1;
        while (noteIndex < lines.length && !lines[noteIndex].trim().match(/^[A-Z]{3,}/)) {
          noteContent += lines[noteIndex].trim() + ' ';
          noteIndex++;
        }
        elements.push(
          <div key={`note-${index}`} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">{trimmed}</p>
                <p className="text-blue-800 leading-relaxed text-sm">{noteContent.trim()}</p>
              </div>
            </div>
          </div>
        );
        return;
      }

      // Regular text - accumulate into paragraphs
      if (trimmed.length > 0 && trimmed.length > 10) {
        currentParagraph.push(trimmed);
      }
    });

    // Close any remaining paragraph
    if (currentParagraph.length > 0) {
      elements.push(
        <p key="final-para" className="mb-5 text-gray-800 leading-relaxed text-base">
          {currentParagraph.join(' ')}
        </p>
      );
    }

    // Close any remaining list
    if (listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="list-none space-y-3 mb-6 ml-0">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1 flex-shrink-0 text-lg">›</span>
              <span className="text-gray-800 leading-relaxed flex-1">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return elements;
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
        <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
          {/* Content */}
          <div className="max-w-none mb-8">
            {content.map((page, index) => (
              <div key={index} className="mb-8 last:mb-0">
                {/* Page Header */}
                <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-gray-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                    Page {page.pageNumber}
                  </span>
                </div>
                
                {/* Page Content */}
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100">
                  <div className="space-y-4 text-gray-800 leading-relaxed">
                    {formatContent(page.content)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Questions Section */}
          <div className="border-t-4 border-green-200 pt-8 mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 -mx-6 md:-mx-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                <FaBook className="text-white text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Test Your Knowledge
              </h3>
            </div>
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
