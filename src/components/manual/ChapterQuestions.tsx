'use client';

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export interface Question {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  correctAnswer: string;
  explanation: string;
}

interface ChapterQuestionsProps {
  chapterId: string;
  questions: Question[];
}

const STORAGE_KEY = 'spsv-manual-progress-v1';

export const ChapterQuestions: React.FC<ChapterQuestionsProps> = ({
  chapterId,
  questions,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Load saved answers from localStorage
  useEffect(() => {
    const saved = loadProgress();
    if (saved.chapters[chapterId]?.questions) {
      const savedAnswers: Record<string, string> = {};
      Object.entries(saved.chapters[chapterId].questions).forEach(([qId, data]: [string, any]) => {
        savedAnswers[qId] = data.selectedAnswer;
      });
      setAnswers(savedAnswers);
    }
  }, [chapterId]);

  const loadProgress = () => {
    if (typeof window === 'undefined') return { chapters: {} };
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { chapters: {} };
  };

  const saveProgress = (questionId: string, answer: string) => {
    if (typeof window === 'undefined') return;
    
    const progress = loadProgress();
    if (!progress.chapters[chapterId]) {
      progress.chapters[chapterId] = { expanded: false, questions: {} };
    }
    progress.chapters[chapterId].questions[questionId] = {
      selectedAnswer: answer,
      answeredAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    
    // Dispatch custom event to notify parent component
    window.dispatchEvent(new CustomEvent('questionAnswered', { 
      detail: { chapterId, questionId } 
    }));
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    saveProgress(questionId, answer);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Progress</span>
          <span className="text-blue-700 font-bold text-lg">
            {getAnsweredCount()}/{questions.length} answered
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      {questions.map((question, index) => {
        const userAnswer = answers[question.id];
        const isCorrect = submitted && userAnswer === question.correctAnswer;
        const isIncorrect = submitted && userAnswer && userAnswer !== question.correctAnswer;

        return (
          <div
            key={question.id}
            className={`border-2 rounded-xl p-6 ${
              isCorrect
                ? 'border-green-500 bg-green-50'
                : isIncorrect
                ? 'border-red-500 bg-red-50'
                : userAnswer
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="font-bold text-lg text-gray-700">Q{index + 1}</span>
              <h4 className="text-lg font-semibold text-gray-900 flex-1">{question.question}</h4>
              {submitted && userAnswer && (
                <div className="flex-shrink-0">
                  {isCorrect ? (
                    <FaCheckCircle className="text-green-600 text-2xl" />
                  ) : (
                    <FaTimesCircle className="text-red-600 text-2xl" />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 ml-8">
              {question.options.map((option) => {
                const isSelected = userAnswer === option.id;
                const isCorrectOption = option.id === question.correctAnswer;
                const showCorrect = submitted && isCorrectOption;

                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      showCorrect
                        ? 'bg-green-100 border-2 border-green-500'
                        : isSelected && submitted && !isCorrect
                        ? 'bg-red-100 border-2 border-red-500'
                        : isSelected
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={submitted}
                      className="w-5 h-5 text-green-600"
                    />
                    <span className="flex-1 text-gray-900">{option.label}</span>
                    {showCorrect && (
                      <FaCheckCircle className="text-green-600 text-xl" />
                    )}
                  </label>
                );
              })}
            </div>

            {submitted && userAnswer && (
              <div className={`mt-4 p-4 rounded-lg ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <p className={`font-semibold mb-2 ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-gray-700 text-sm">{question.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Submit Button */}
      {!submitted && getAnsweredCount() === questions.length && (
        <div className="text-center pt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
          >
            Check Answers
          </button>
        </div>
      )}

      {submitted && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">Quiz Complete!</p>
          <p className="text-gray-700">
            You answered {Object.values(answers).filter((ans, idx) => 
              ans === questions[idx].correctAnswer
            ).length} out of {questions.length} questions correctly.
          </p>
        </div>
      )}
    </div>
  );
};
