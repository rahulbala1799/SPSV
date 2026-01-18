'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { TimetableModal } from '@/components/TimetableModal';
import { FaClock, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

interface TimeSlot {
  id: string;
  time: string;
  label: string;
  startDate: string;
  endDate: string;
  status: 'available' | 'full';
}

export default function TimetablePage() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateTimeSlots = (): TimeSlot[] => {
    const today = new Date();
    const currentYear = today.getFullYear();
    // If we're past February 1st this year, use next year
    const enrollmentYear = (today.getMonth() > 1 || (today.getMonth() === 1 && today.getDate() > 1)) 
      ? currentYear + 1 
      : currentYear;
    
    // Enrollment date is 1st February
    const enrollmentDate = new Date(enrollmentYear, 1, 1); // February is month 1 (0-indexed)
    const endDate = new Date(enrollmentYear, 2, 0); // Last day of February (month 2, day 0 = last day of previous month)
    
    const slots: TimeSlot[] = [];
    
    slots.push({
      id: 'morning',
      time: '09:30 - 12:30',
      label: 'Morning Class',
      startDate: enrollmentDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
      endDate: endDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'available',
    });

    slots.push({
      id: 'afternoon',
      time: '14:30 - 17:00',
      label: 'Afternoon Class',
      startDate: enrollmentDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
      endDate: endDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'available',
    });

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Course Timetable</h1>
          <p className="text-xl text-green-100">
            Choose your preferred class time and start your journey to becoming a licensed taxi driver
          </p>
        </div>
      </section>

      {/* Timetable Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Class Times</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All courses run for 1 month, Monday to Thursday. Maximum 6 people per batch. Select the time slot that works best for your schedule.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <FaClock className="text-3xl opacity-90" />
                    {slot.status === 'available' && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                        Available
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{slot.label}</h3>
                  <p className="text-green-100 text-lg font-medium">{slot.time}</p>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCalendarAlt className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Start Date</p>
                        <p className="text-lg font-semibold text-gray-900">{slot.startDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">End Date</p>
                        <p className="text-lg font-semibold text-gray-900">{slot.endDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaMapMarkerAlt className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="text-lg font-semibold text-gray-900">Dublin 15, Blanchardstown</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      Course Duration: <span className="font-semibold text-gray-900">1 Month</span>
                    </p>
                    {slot.status === 'available' ? (
                      <Button
                        variant="primary"
                        size="large"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setIsModalOpen(true);
                        }}
                        className="w-full"
                      >
                        View Timetable
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="large"
                        disabled
                        className="w-full opacity-50 cursor-not-allowed"
                      >
                        Fully Booked
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Schedule</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Morning: 09:30 - 12:30 (Mon-Thu)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Afternoon: 14:30 - 17:00 (Mon-Thu)</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Batch Size:</strong> Maximum 6 people per batch
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-gray-700">All study materials</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-gray-700">Practice tests and quizzes</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-gray-700">Expert tutor guidance</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-gray-700">1 month comprehensive course</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timetable Modal */}
      {selectedSlot && (
        <TimetableModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSlot(null);
          }}
          timeSlot={selectedSlot}
        />
      )}

      {/* CTA Section */}
      <section id="enrollment" className="py-20 px-4 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Enroll?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Contact us to secure your spot in your preferred time slot
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+353894934222"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors text-lg"
            >
              Call Us: +353 89 493 4222
            </a>
            <a
              href="https://wa.me/353894934222"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-lg"
            >
              WhatsApp Us
            </a>
            <a
              href="/"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors text-lg"
            >
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
