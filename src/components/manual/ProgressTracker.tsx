'use client';

import React from 'react';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';

interface ProgressTrackerProps {
  chapters: Array<{
    id: string;
    title: string;
    answeredCount: number;
    totalQuestions: number;
  }>;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ chapters }) => {
  const totalQuestions = chapters.reduce((sum, ch) => sum + ch.totalQuestions, 0);
  const answeredQuestions = chapters.reduce((sum, ch) => sum + ch.answeredCount, 0);
  const completedChapters = chapters.filter(ch => ch.answeredCount === ch.totalQuestions).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Progress</h3>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">Overall Progress</span>
          <span className="text-green-700 font-bold text-lg">
            {answeredQuestions}/{totalQuestions} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-600 to-emerald-600 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && (
              <span className="text-white text-xs font-semibold">
                {Math.round(progressPercentage)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chapters Progress */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 mb-3">Chapters Completed: {completedChapters}/{chapters.length}</h4>
        {chapters.map((chapter) => {
          const chapterProgress = chapter.totalQuestions > 0 
            ? (chapter.answeredCount / chapter.totalQuestions) * 100 
            : 0;
          const isComplete = chapter.answeredCount === chapter.totalQuestions;

          return (
            <div key={chapter.id} className="flex items-center gap-3">
              {isComplete ? (
                <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
              ) : (
                <FaCircle className="text-gray-300 text-lg flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isComplete ? 'font-semibold text-green-700' : 'text-gray-700'}`}>
                    {chapter.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {chapter.answeredCount}/{chapter.totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isComplete ? 'bg-green-600' : 'bg-blue-500'
                    }`}
                    style={{ width: `${chapterProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
