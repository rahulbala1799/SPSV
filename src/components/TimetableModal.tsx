'use client';

import React from 'react';
import { FaTimes, FaBook, FaMapMarkedAlt, FaQuestionCircle } from 'react-icons/fa';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeSlot: {
    id: string;
    time: string;
    label: string;
    startDate: string;
    endDate: string;
  };
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ isOpen, onClose, timeSlot }) => {
  if (!isOpen) return null;

  // Generate calendar for the month
  const generateCalendar = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    // If we're past February 1st this year, use next year
    const enrollmentYear = (today.getMonth() > 1 || (today.getMonth() === 1 && today.getDate() > 1)) 
      ? currentYear + 1 
      : currentYear;
    
    // Enrollment date is 1st February
    const enrollmentDate = new Date(enrollmentYear, 1, 1); // February is month 1 (0-indexed)
    const startDate = new Date(enrollmentDate);
    // Course runs for 16 days (Monday-Thursday only)
    // Calculate end date: start date + 15 days (since start date is day 1)
    const endDate = new Date(enrollmentDate);
    endDate.setDate(endDate.getDate() + 15);
    
    const days: Array<{
      date: Date;
      day: number;
      type: 'industry' | 'area' | 'questions' | 'weekend';
      label: string;
    }> = [];

    let dayCount = 0;
    let weekCount = 0;
    const courseDays = 16; // Total course days (Monday-Thursday only)
    const lastWeekStart = Math.floor(courseDays * 0.7); // Last 30% of days

    // Generate 16 days starting from enrollment date (Monday-Thursday only)
    let currentDate = new Date(enrollmentDate);
    let daysAdded = 0;
    
    while (daysAdded < courseDays) {
      const dayOfWeek = currentDate.getDay();

      // Skip weekends (Saturday = 6, Sunday = 0) and Fridays (5)
      if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // This is a class day (Monday-Thursday)
      weekCount++;
      dayCount++;
      daysAdded++;

      // Last 30% of course days: Questions and Area Knowledge
      if (weekCount > lastWeekStart) {
        if (weekCount % 2 === 0) {
          days.push({
            date: new Date(currentDate),
            day: currentDate.getDate(),
            type: 'questions',
            label: 'Practice Questions',
          });
        } else {
          days.push({
            date: new Date(currentDate),
            day: currentDate.getDate(),
            type: 'area',
            label: 'Area Knowledge',
          });
        }
      } else {
        // First 70%: Alternate between Industry and Area Knowledge
        if (dayCount % 2 === 1) {
          days.push({
            date: new Date(currentDate),
            day: currentDate.getDate(),
            type: 'industry',
            label: 'Industry Knowledge',
          });
        } else {
          days.push({
            date: new Date(currentDate),
            day: currentDate.getDate(),
            type: 'area',
            label: 'Area Knowledge',
          });
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { days, enrollmentDate, startDate, endDate };
  };

  const { days, enrollmentDate } = generateCalendar();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'industry':
        return <FaBook className="text-blue-600" />;
      case 'area':
        return <FaMapMarkedAlt className="text-green-600" />;
      case 'questions':
        return <FaQuestionCircle className="text-purple-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'industry':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'area':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'questions':
        return 'bg-purple-50 border-purple-200 text-purple-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-4 sm:p-6 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 truncate">{timeSlot.label}</h2>
              <p className="text-green-100 text-sm sm:text-base">{timeSlot.time}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
            >
              <FaTimes size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Enrollment Date */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-green-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Enrollment Date</h3>
              <p className="text-xl sm:text-2xl font-semibold text-green-700">
                {enrollmentDate.toLocaleDateString('en-IE', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                Course runs for 16 days (Monday-Thursday) from this date
              </p>
            </div>

            {/* Timetable Calendar */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Timetable (16 Days)</h3>
              
              {/* Calendar Header - Days of Week */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-xs sm:text-sm py-1 sm:py-2">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.substring(0, 1)}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {(() => {
                  const calendarDays: Array<{
                    date: Date | null;
                    day: number | null;
                    type: 'industry' | 'area' | 'questions' | 'weekend' | 'empty';
                    label: string;
                  }> = [];

                  // Get first day of course and what day of week it falls on
                  const firstDay = new Date(enrollmentDate);
                  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
                  
                  // Adjust to Monday = 0
                  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

                  // Add empty cells for days before the first day of course
                  for (let i = 0; i < startOffset; i++) {
                    calendarDays.push({
                      date: null,
                      day: null,
                      type: 'empty',
                      label: '',
                    });
                  }

                  // Add all 16 course days (Monday-Thursday only)
                  const courseDays = 16;
                  let dayCount = 0;
                  let weekCount = 0;
                  const lastWeekStart = Math.floor(courseDays * 0.7);
                  
                  let currentDate = new Date(enrollmentDate);
                  let daysAdded = 0;

                  while (daysAdded < courseDays) {
                    const dayOfWeek = currentDate.getDay();

                    // Skip weekends and Fridays
                    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
                      currentDate.setDate(currentDate.getDate() + 1);
                      // Add empty cell for skipped days
                      calendarDays.push({
                        date: null,
                        day: null,
                        type: 'empty',
                        label: '',
                      });
                      continue;
                    }

                    // This is a class day (Monday-Thursday)
                    weekCount++;
                    dayCount++;
                    daysAdded++;

                    if (weekCount > lastWeekStart) {
                      // Last 30%: Questions and Area Knowledge
                      if (weekCount % 2 === 0) {
                        calendarDays.push({
                          date: new Date(currentDate),
                          day: currentDate.getDate(),
                          type: 'questions',
                          label: 'Practice Questions',
                        });
                      } else {
                        calendarDays.push({
                          date: new Date(currentDate),
                          day: currentDate.getDate(),
                          type: 'area',
                          label: 'Area Knowledge',
                        });
                      }
                    } else {
                      // First 70%: Alternate Industry and Area Knowledge
                      if (dayCount % 2 === 1) {
                        calendarDays.push({
                          date: new Date(currentDate),
                          day: currentDate.getDate(),
                          type: 'industry',
                          label: 'Industry Knowledge',
                        });
                      } else {
                        calendarDays.push({
                          date: new Date(currentDate),
                          day: currentDate.getDate(),
                          type: 'area',
                          label: 'Area Knowledge',
                        });
                      }
                    }

                    // Move to next day
                    currentDate.setDate(currentDate.getDate() + 1);
                  }

                  return calendarDays.map((day, index) => {
                    if (day.type === 'empty') {
                      return <div key={index} className="aspect-square min-h-[40px] sm:min-h-[60px]"></div>;
                    }

                    return (
                      <div
                        key={index}
                        className={`aspect-square min-h-[40px] sm:min-h-[60px] p-1 sm:p-2 rounded sm:rounded-lg border border-gray-300 sm:border-2 ${
                          day.type === 'weekend' 
                            ? 'bg-gray-50 border-gray-200 opacity-50' 
                            : getTypeColor(day.type)
                        } flex flex-col items-center justify-center text-center overflow-hidden`}
                      >
                        <div className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 leading-none">{day.day}</div>
                        <div className="mb-0.5 sm:mb-1 scale-75 sm:scale-100">{getTypeIcon(day.type)}</div>
                        <p className="text-[9px] sm:text-xs font-medium leading-tight px-0.5 break-words">
                          {day.type === 'weekend' ? (
                            <span className="hidden sm:inline">Weekend</span>
                          ) : (
                            <>
                              <span className="hidden sm:inline">{day.label.split(' ')[0]}</span>
                              <span className="sm:hidden">{day.label.split(' ')[0].substring(0, 3)}</span>
                            </>
                          )}
                        </p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Legend</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaBook className="text-blue-600 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Industry Knowledge</p>
                    <p className="text-xs sm:text-sm text-gray-600">Regulations, licensing, fares</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkedAlt className="text-green-600 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Area Knowledge</p>
                    <p className="text-xs sm:text-sm text-gray-600">Dublin routes, landmarks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 border-2 border-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaQuestionCircle className="text-purple-600 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Practice Questions</p>
                    <p className="text-xs sm:text-sm text-gray-600">Mock tests & quizzes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
            <div className="mb-3 sm:mb-4 text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Contact us to enroll:</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
                <a
                  href="tel:+353894034222"
                  className="text-base sm:text-lg font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  +353 89 403 4222
                </a>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a
                  href="https://wa.me/353894034222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-green-600 hover:text-green-700 transition-colors underline"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
              <a
                href="tel:+353894034222"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center text-sm sm:text-base"
              >
                Call to Enroll
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
