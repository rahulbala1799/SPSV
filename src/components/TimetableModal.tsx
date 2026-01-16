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
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of next month (enrollment date)
    const enrollmentDate = new Date(currentYear, currentMonth + 1, 1);
    const startDate = new Date(enrollmentDate);
    const endDate = new Date(enrollmentDate.getFullYear(), enrollmentDate.getMonth() + 1, 0);
    
    const days: Array<{
      date: Date;
      day: number;
      type: 'industry' | 'area' | 'questions' | 'weekend';
      label: string;
    }> = [];

    let dayCount = 0;
    let weekCount = 0;
    const totalDays = endDate.getDate();
    const lastWeekStart = Math.floor(totalDays * 0.7); // Last 30% of days

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      const dayOfWeek = date.getDay();

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        days.push({
          date,
          day: i,
          type: 'weekend',
          label: 'Weekend',
        });
        continue;
      }

      weekCount++;
      dayCount++;

      // Last 30% of course days: Questions and Area Knowledge
      if (weekCount > lastWeekStart) {
        if (weekCount % 2 === 0) {
          days.push({
            date,
            day: i,
            type: 'questions',
            label: 'Practice Questions',
          });
        } else {
          days.push({
            date,
            day: i,
            type: 'area',
            label: 'Area Knowledge',
          });
        }
      } else {
        // First 70%: Alternate between Industry and Area Knowledge
        if (dayCount % 2 === 1) {
          days.push({
            date,
            day: i,
            type: 'industry',
            label: 'Industry Knowledge',
          });
        } else {
          days.push({
            date,
            day: i,
            type: 'area',
            label: 'Area Knowledge',
          });
        }
      }
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
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{timeSlot.label}</h2>
              <p className="text-green-100">{timeSlot.time}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Enrollment Date */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enrollment Date</h3>
              <p className="text-2xl font-semibold text-green-700">
                {enrollmentDate.toLocaleDateString('en-IE', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Course runs for 1 month from this date
              </p>
            </div>

            {/* Timetable Calendar */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Timetable</h3>
              
              {/* Calendar Header - Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const calendarDays: Array<{
                    date: Date | null;
                    day: number | null;
                    type: 'industry' | 'area' | 'questions' | 'weekend' | 'empty';
                    label: string;
                  }> = [];

                  // Get first day of month and what day of week it falls on
                  const firstDay = new Date(enrollmentDate.getFullYear(), enrollmentDate.getMonth(), 1);
                  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
                  
                  // Adjust to Monday = 0
                  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

                  // Add empty cells for days before the first day of month
                  for (let i = 0; i < startOffset; i++) {
                    calendarDays.push({
                      date: null,
                      day: null,
                      type: 'empty',
                      label: '',
                    });
                  }

                  // Add all days from the month
                  const lastDay = new Date(enrollmentDate.getFullYear(), enrollmentDate.getMonth() + 1, 0);
                  let dayCount = 0;
                  let weekCount = 0;
                  const totalDays = lastDay.getDate();
                  const lastWeekStart = Math.floor(totalDays * 0.7);

                  for (let i = 1; i <= totalDays; i++) {
                    const date = new Date(enrollmentDate.getFullYear(), enrollmentDate.getMonth(), i);
                    const dayOfWeek = date.getDay();

                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                      // Weekend
                      calendarDays.push({
                        date,
                        day: i,
                        type: 'weekend',
                        label: 'Weekend',
                      });
                    } else {
                      weekCount++;
                      dayCount++;

                      if (weekCount > lastWeekStart) {
                        // Last 30%: Questions and Area Knowledge
                        if (weekCount % 2 === 0) {
                          calendarDays.push({
                            date,
                            day: i,
                            type: 'questions',
                            label: 'Practice Questions',
                          });
                        } else {
                          calendarDays.push({
                            date,
                            day: i,
                            type: 'area',
                            label: 'Area Knowledge',
                          });
                        }
                      } else {
                        // First 70%: Alternate Industry and Area Knowledge
                        if (dayCount % 2 === 1) {
                          calendarDays.push({
                            date,
                            day: i,
                            type: 'industry',
                            label: 'Industry Knowledge',
                          });
                        } else {
                          calendarDays.push({
                            date,
                            day: i,
                            type: 'area',
                            label: 'Area Knowledge',
                          });
                        }
                      }
                    }
                  }

                  return calendarDays.map((day, index) => {
                    if (day.type === 'empty') {
                      return <div key={index} className="aspect-square"></div>;
                    }

                    return (
                      <div
                        key={index}
                        className={`aspect-square p-2 rounded-lg border-2 ${
                          day.type === 'weekend' 
                            ? 'bg-gray-50 border-gray-200 opacity-50' 
                            : getTypeColor(day.type)
                        } flex flex-col items-center justify-center text-center`}
                      >
                        <div className="font-bold text-lg mb-1">{day.day}</div>
                        <div className="mb-1">{getTypeIcon(day.type)}</div>
                        <p className="text-xs font-medium leading-tight">
                          {day.type === 'weekend' ? 'Weekend' : day.label.split(' ')[0]}
                        </p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Legend</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center">
                    <FaBook className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Industry Knowledge</p>
                    <p className="text-sm text-gray-600">Regulations, licensing, fares</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center">
                    <FaMapMarkedAlt className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Area Knowledge</p>
                    <p className="text-sm text-gray-600">Dublin routes, landmarks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 border-2 border-purple-200 rounded-lg flex items-center justify-center">
                    <FaQuestionCircle className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Practice Questions</p>
                    <p className="text-sm text-gray-600">Mock tests & quizzes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Contact us to enroll:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="tel:+353892100704"
                  className="text-lg font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  +353 89 210 0704
                </a>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a
                  href="https://wa.me/353892100704"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-700 transition-colors underline"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <a
                href="tel:+353892100704"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
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
