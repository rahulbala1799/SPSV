'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheck, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiUsers,
  FiSmartphone,
  FiClock,
  FiMapPin,
  FiBook,
  FiArrowRight,
  FiCheckCircle,
  FiStar
} from 'react-icons/fi';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EnrollmentType = 'classroom' | 'app-only' | null;

interface FormData {
  enrollmentType: EnrollmentType;
  fullName: string;
  email: string;
  hasAppliedForTest: boolean;
  testDate: string;
  preferredSchedule: 'morning' | 'afternoon' | 'flexible';
  howDidYouHear: string;
  additionalNotes: string;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    enrollmentType: null,
    fullName: '',
    email: '',
    hasAppliedForTest: false,
    testDate: '',
    preferredSchedule: 'flexible',
    howDidYouHear: '',
    additionalNotes: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsSubmitting(false);
      setIsSubmitted(false);
      setFormData({
        enrollmentType: null,
        fullName: '',
        email: '',
        hasAppliedForTest: false,
        testDate: '',
        preferredSchedule: 'flexible',
        howDidYouHear: '',
        additionalNotes: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    { id: 'plan', title: 'Choose Plan', icon: <FiStar /> },
    { id: 'details', title: 'Your Details', icon: <FiUser /> },
    { id: 'schedule', title: 'Schedule', icon: <FiCalendar /> },
    { id: 'confirm', title: 'Confirm', icon: <FiCheckCircle /> },
  ];

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.enrollmentType !== null;
      case 1:
        return formData.fullName.trim() !== '' && 
               formData.email.trim() !== '';
      case 2:
        return true; // Optional fields
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Enrollment submitted:', formData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const renderStepContent = () => {
    if (isSubmitted) {
  return (
        <div className="text-center py-12 px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center animate-scale-in">
            <FiCheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Enrollment Request Sent!</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Thank you for your interest! We&apos;ll contact you by email within 24 hours to confirm your enrollment and discuss next steps.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Learning Plan</h3>
              <p className="text-gray-600">Select the option that works best for you</p>
            </div>

            <div className="space-y-4">
              {/* Classroom + App Option */}
              <button
                onClick={() => handleInputChange('enrollmentType', 'classroom')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  formData.enrollmentType === 'classroom'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-cyan-50 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    formData.enrollmentType === 'classroom'
                      ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FiUsers className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-gray-900">Classroom + App</h4>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Complete preparation with expert in-person instruction and full app access
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: <FiUsers className="w-4 h-4" />, text: 'In-person classes' },
                        { icon: <FiSmartphone className="w-4 h-4" />, text: 'Full app access' },
                        { icon: <FiMapPin className="w-4 h-4" />, text: 'Dublin location' },
                        { icon: <FiBook className="w-4 h-4" />, text: '500+ questions' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-emerald-500">{item.icon}</span>
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    formData.enrollmentType === 'classroom'
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {formData.enrollmentType === 'classroom' && <FiCheck className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* App Only Option */}
              <button
                onClick={() => handleInputChange('enrollmentType', 'app-only')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  formData.enrollmentType === 'app-only'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    formData.enrollmentType === 'app-only'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FiSmartphone className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">App Only</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Self-paced learning with full access to our practice platform
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: <FiSmartphone className="w-4 h-4" />, text: '24/7 app access' },
                        { icon: <FiBook className="w-4 h-4" />, text: '500+ questions' },
                        { icon: <FiClock className="w-4 h-4" />, text: 'Learn at your pace' },
                        { icon: <FiCheckCircle className="w-4 h-4" />, text: 'Progress tracking' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-blue-500">{item.icon}</span>
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    formData.enrollmentType === 'app-only'
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {formData.enrollmentType === 'app-only' && <FiCheck className="w-4 h-4" />}
                  </div>
                </div>
            </button>
          </div>

            {formData.enrollmentType === 'classroom' && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold text-emerald-800">Classes held in Dublin</p>
                    <p className="text-sm text-emerald-700">Small batch sizes (max 6 students) for personalized attention</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your Contact Details</h3>
              <p className="text-gray-600">We&apos;ll use this to get in touch with you</p>
              </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* How did you hear */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How did you hear about us?
                </label>
                <select
                  value={formData.howDidYouHear}
                  onChange={(e) => handleInputChange('howDidYouHear', e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-gray-900 bg-white"
                >
                  <option value="">Select an option</option>
                  <option value="google">Google Search</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="friend">Friend/Family Referral</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Test & Schedule Preferences</h3>
              <p className="text-gray-600">Help us plan your learning journey</p>
            </div>

            <div className="space-y-6">
              {/* Test Application Status */}
              <div className="bg-gray-50 rounded-xl p-5">
                <label className="flex items-start gap-4 cursor-pointer">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    formData.hasAppliedForTest
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {formData.hasAppliedForTest && <FiCheck className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <input
                      type="checkbox"
                      checked={formData.hasAppliedForTest}
                      onChange={(e) => handleInputChange('hasAppliedForTest', e.target.checked)}
                      className="sr-only"
                    />
                    <span className="font-semibold text-gray-900">I have already applied for my SPSV test</span>
                      <p className="text-sm text-gray-500 mt-1">
                      Check this if you&apos;ve submitted your test application to the NTA
                      </p>
                    </div>
                  </label>

                {formData.hasAppliedForTest && (
                  <div className="mt-4 pl-10 animate-fade-in">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Test Date (if scheduled)
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiCalendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={formData.testDate}
                        onChange={(e) => handleInputChange('testDate', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-gray-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule Preference - Only for classroom */}
              {formData.enrollmentType === 'classroom' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Preferred Class Schedule
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'morning', label: 'Morning', time: '09:30 - 12:30', icon: '🌅' },
                      { value: 'afternoon', label: 'Afternoon', time: '14:30 - 17:00', icon: '☀️' },
                      { value: 'flexible', label: 'Flexible', time: 'Either works', icon: '🔄' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('preferredSchedule', option.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          formData.preferredSchedule === option.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{option.icon}</span>
                        <span className="font-semibold text-gray-900 block">{option.label}</span>
                        <span className="text-xs text-gray-500">{option.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any questions or special requirements?"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-gray-900 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Review Your Enrollment</h3>
              <p className="text-gray-600">Please confirm your details are correct</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              {/* Plan Header */}
              <div className={`p-5 ${
                formData.enrollmentType === 'classroom'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              } text-white`}>
                <div className="flex items-center gap-3">
                  {formData.enrollmentType === 'classroom' ? (
                    <FiUsers className="w-6 h-6" />
                  ) : (
                    <FiSmartphone className="w-6 h-6" />
                  )}
                  <div>
                    <h4 className="font-bold text-lg">
                      {formData.enrollmentType === 'classroom' ? 'Classroom + App' : 'App Only'}
                    </h4>
                    <p className="text-sm opacity-90">
                      {formData.enrollmentType === 'classroom' 
                        ? 'In-person classes with full app access' 
                        : 'Self-paced digital learning'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-900">{formData.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{formData.email}</p>
                  </div>
                </div>

                {formData.enrollmentType === 'classroom' && (
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <FiClock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Preferred Schedule</p>
                      <p className="font-semibold text-gray-900 capitalize">{formData.preferredSchedule}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Test Status</p>
                    <p className="font-semibold text-gray-900">
                      {formData.hasAppliedForTest 
                        ? `Applied${formData.testDate ? ` - ${new Date(formData.testDate).toLocaleDateString('en-IE')}` : ''}`
                        : 'Not yet applied'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <span>📞</span> What happens next?
              </h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  We&apos;ll contact you by email within 24 hours to confirm your enrollment
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {formData.enrollmentType === 'classroom' 
                    ? 'We\'ll email you available class dates and batch timings'
                    : 'We\'ll send you app login credentials'}
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Payment details will be shared via email
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isSubmitted ? 'Enrollment Complete' : 'Start Your Enrollment'}
              </h2>
              {!isSubmitted && (
                <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
              )}
            </div>
            <button 
                  onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Progress Steps */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 mt-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                    i < currentStep
                      ? 'bg-emerald-500 text-white'
                      : i === currentStep
                      ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < currentStep ? <FiCheck className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      i < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {renderStepContent()}
        </div>

        {/* Footer Navigation */}
        {!isSubmitted && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                currentStep === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <FiChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Enrollment
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
