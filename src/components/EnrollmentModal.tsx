'use client';

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Form, FormField } from './Form';
import { Input } from './Input';
import { Button } from './Button';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
  const [hasAppliedForTest, setHasAppliedForTest] = useState(false);
  const [testDate, setTestDate] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  if (!isOpen) return null;

  // Get enrollment date (1st February)
  const getNextEnrollmentDate = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    // If we're past February 1st this year, use next year
    const enrollmentYear = (today.getMonth() > 1 || (today.getMonth() === 1 && today.getDate() > 1)) 
      ? currentYear + 1 
      : currentYear;
    const enrollmentDate = new Date(enrollmentYear, 1, 1); // February is month 1 (0-indexed)
    return enrollmentDate.toLocaleDateString('en-IE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enrollment data:', {
      ...formData,
      hasAppliedForTest,
      testDate: hasAppliedForTest ? testDate : null,
      enrollmentDate: getNextEnrollmentDate(),
    });
    // Handle form submission (e.g., send to API)
    onClose();
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Enroll in SPSV Driving Test Classes</h2>
              <p className="text-green-100">Complete the form below to register</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enrollment Date Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Next Enrollment Date</p>
                <p className="text-xl font-bold text-green-700">{getNextEnrollmentDate()}</p>
                <p className="text-xs text-gray-500 mt-1">Course starts on 1st February</p>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+353 89 403 4222"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Test Application Status */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Test Application Status</h3>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={hasAppliedForTest}
                      onChange={(e) => setHasAppliedForTest(e.target.checked)}
                      className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div>
                      <span className="text-gray-900 font-medium group-hover:text-green-600 transition-colors">
                        Have you applied for the SPSV test?
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Check this box if you have already submitted your test application
                      </p>
                    </div>
                  </label>

                  {hasAppliedForTest && (
                    <div className="ml-8 mt-2 animate-in fade-in slide-in-from-top-2">
                      <Input
                        label="Test Date"
                        type="date"
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        required={hasAppliedForTest}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Please provide the date you applied for or scheduled your test
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Information */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Course Information</h4>
                <p className="text-sm text-gray-700">
                  You are enrolling in <strong>SPSV Driving Test Classes</strong>. This comprehensive course will prepare you for both the Industry Knowledge and Area Knowledge sections of the SPSV test.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="large"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  className="flex-1"
                >
                  Submit Enrollment
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
