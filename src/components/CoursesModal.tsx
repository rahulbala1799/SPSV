'use client';

import React from 'react';
import { FaTimes, FaBook, FaMapMarkedAlt, FaQuestionCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';

interface CoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoursesModal: React.FC<CoursesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">SPSV Driving Test Classes</h2>
              <p className="text-green-100">Comprehensive training to help you pass your test</p>
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
            {/* Course Overview */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our <strong>SPSV Driving Test Classes</strong> are designed to prepare you for the SPSV Driver Entry Test. 
                This comprehensive course covers everything you need to pass both sections of the test with confidence.
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What You&apos;ll Learn</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaBook className="text-blue-600 text-2xl" />
                    <h4 className="text-lg font-bold text-gray-900">Industry Knowledge</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Regulations and licensing requirements</li>
                    <li>• Fare structures and pricing</li>
                    <li>• SPSV business operations</li>
                    <li>• Customer service standards</li>
                    <li>• Safety and compliance</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaMapMarkedAlt className="text-green-600 text-2xl" />
                    <h4 className="text-lg font-bold text-gray-900">Area Knowledge</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Dublin routes and navigation</li>
                    <li>• One-way streets and traffic patterns</li>
                    <li>• Landmarks and places of interest</li>
                    <li>• Efficient route planning</li>
                    <li>• Local geography mastery</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Course Structure */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Structure</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <FaClock className="text-green-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Duration</h4>
                    <p className="text-gray-700">16 days comprehensive course</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <FaCalendarAlt className="text-green-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Schedule</h4>
                    <p className="text-gray-700">4 days per week (Monday to Thursday)</p>
                    <p className="text-sm text-gray-600 mt-1">Morning: 09:30 - 12:30 | Afternoon: 14:30 - 17:00</p>
                    <p className="text-sm text-gray-600 mt-1"><strong>Batch Size:</strong> Maximum 6 people per batch</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <FaBook className="text-green-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Curriculum</h4>
                    <p className="text-gray-700">Alternating Industry and Area Knowledge lessons, with practice questions and area knowledge focus in the final weeks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-bold text-gray-900 mb-2">Enrollment Information</h4>
              <p className="text-gray-700 text-sm mb-3">
                Course starts on <strong>1st February</strong>. Maximum 6 people per batch.
              </p>
              <p className="text-gray-700 text-sm">
                Contact us by email at <a href="mailto:info@spsvmastery.ie" className="text-green-600 font-semibold hover:underline">info@spsvmastery.ie</a> or use the enquiry form to enroll.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                // Trigger enrollment modal - you'll need to handle this in parent
                const event = new CustomEvent('openEnrollment');
                window.dispatchEvent(event);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
