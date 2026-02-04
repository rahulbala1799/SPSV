'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TimetableModal } from '@/components/TimetableModal';
import { FiClock, FiCalendar, FiMapPin, FiCheck, FiUsers, FiArrowRight, FiStar } from 'react-icons/fi';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateTimeSlots = (): TimeSlot[] => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const enrollmentYear = (today.getMonth() > 1 || (today.getMonth() === 1 && today.getDate() > 1)) 
      ? currentYear + 1 
      : currentYear;
    
    const enrollmentDate = new Date(enrollmentYear, 1, 10);
    const endDate = new Date(enrollmentDate);
    endDate.setDate(endDate.getDate() + 15);
    
    return [
      {
        id: 'morning',
        time: '09:30 - 12:30',
        label: 'Morning Class',
        startDate: enrollmentDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
        endDate: endDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'available',
      },
      {
        id: 'afternoon',
        time: '14:30 - 17:00',
        label: 'Afternoon Class',
        startDate: enrollmentDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
        endDate: endDate.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'available',
      },
    ];
  };

  const timeSlots = generateTimeSlots();

  const courseFeatures = [
    { icon: <FiUsers className="w-5 h-5" />, text: 'Small batches (max 6 students)' },
    { icon: <FiCalendar className="w-5 h-5" />, text: '16 days comprehensive course' },
    { icon: <FiClock className="w-5 h-5" />, text: 'Monday to Thursday classes' },
    { icon: <FiStar className="w-5 h-5" />, text: 'Practice app included' },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <FiCalendar className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Taxi Driver Test Classes</span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Course{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Timetable
            </span>
          </h1>
          
          <p className={`text-xl text-gray-300 max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Choose your preferred class time and begin your journey to becoming a licensed taxi driver in Dublin
          </p>

          <div className={`flex flex-wrap justify-center gap-4 md:gap-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {courseFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <span className="text-emerald-400">{feature.icon}</span>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Time Slots Section */}
      <section className="py-20 px-4 -mt-16 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {timeSlots.map((slot, index) => (
              <div
                key={slot.id}
                className={`group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-200 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Card Header */}
                <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600 p-8 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <FiClock className="w-7 h-7" />
                      </div>
                      {slot.status === 'available' && (
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                          Available
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{slot.label}</h3>
                    <p className="text-emerald-100 text-xl font-medium">{slot.time}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group-hover:bg-emerald-50/50 transition-colors">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Start Date</p>
                        <p className="text-lg font-bold text-gray-900">{slot.startDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group-hover:bg-emerald-50/50 transition-colors">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">End Date</p>
                        <p className="text-lg font-bold text-gray-900">{slot.endDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group-hover:bg-emerald-50/50 transition-colors">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Location</p>
                        <p className="text-lg font-bold text-gray-900">Dublin</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Course Duration: <span className="font-bold text-gray-900">16 Days</span> • 
                      Max <span className="font-bold text-gray-900">6 Students</span>
                    </p>
                    {slot.status === 'available' ? (
                      <button
                        onClick={() => {
                          setSelectedSlot(slot);
                          setIsModalOpen(true);
                        }}
                        className="w-full group/btn px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        View Full Timetable
                        <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full px-6 py-4 bg-gray-200 rounded-xl font-bold text-gray-400 cursor-not-allowed"
                      >
                        Fully Booked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Schedule Info */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <FiClock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-gray-700"><strong>Morning:</strong> 09:30 - 12:30 (Mon-Thu)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span className="text-gray-700"><strong>Afternoon:</strong> 14:30 - 17:00 (Mon-Thu)</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 p-3 bg-emerald-50 rounded-lg">
                <strong className="text-emerald-700">Batch Size:</strong> Maximum 6 students per batch for personalized attention
              </p>
            </div>

            {/* What&apos;s Included */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <FiStar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included</h3>
              <ul className="space-y-3">
                {[
                  'All taxi test study materials',
                  'Practice tests and quizzes',
                  'Expert tutor guidance',
                  'Taxi exam practice app access',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Taxi Career?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us today to secure your spot in your preferred time slot
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@spsvmastery.ie"
              className="group px-8 py-4 bg-white rounded-xl font-bold text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
            >
              Email Us
            </a>
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
    </main>
  );
}
