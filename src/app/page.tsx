'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FiCheck, 
  FiArrowRight,
  FiPlay,
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiBook,
  FiAward,
  FiZap,
  FiSmartphone,
  FiShield,
  FiUsers,
  FiFlag,
  FiRefreshCw,
  FiMessageCircle,
  FiCalendar
} from 'react-icons/fi';
import { Header } from '@/components/Header';
import { SaaSHero } from '@/components/SaaSHero';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { CoursesModal } from '@/components/CoursesModal';
import { StudentDashboardDemo } from '@/components/demos/StudentDashboardDemo';
import { QuizInterfaceDemo } from '@/components/demos/QuizInterfaceDemo';
import { 
  ChapterProgressPreview, 
  ScoreCardPreview,
  FlaggedQuestionsPreview,
  PracticeSessionPreview,
  SpacedRepetitionPreview,
  ClassroomAppPreview,
  MiniProgressRing 
} from '@/components/demos/FeatureShowcase';

export default function Home() {
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for enrollment modal trigger from courses modal and header
  React.useEffect(() => {
    const handleOpenEnrollment = () => {
      setIsCoursesModalOpen(false);
      setIsEnrollmentModalOpen(true);
    };
    const handleOpenEnrollmentFromHeader = () => {
      setIsEnrollmentModalOpen(true);
    };
    window.addEventListener('openEnrollment', handleOpenEnrollment);
    window.addEventListener('openEnrollmentFromHeader', handleOpenEnrollmentFromHeader);
    return () => {
      window.removeEventListener('openEnrollment', handleOpenEnrollment);
      window.removeEventListener('openEnrollmentFromHeader', handleOpenEnrollmentFromHeader);
    };
  }, []);

  const platformFeatures = [
    {
      icon: <FiFlag className="w-6 h-6" />,
      title: 'Flag Difficult Questions',
      description: 'Mark challenging questions for later review. Our system tracks which topics need more attention and brings them back at the right time.',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: 'Track Your Practice',
      description: 'See exactly how many questions you&apos;ve answered, your accuracy rate, and which chapters you&apos;ve mastered. No guessing where you stand.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <FiRefreshCw className="w-6 h-6" />,
      title: 'Spaced Repetition',
      description: 'Questions resurface at scientifically-optimized intervals. This proven learning method helps you remember what you&apos;ve studied for the actual exam.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: 'Expert Classroom Instruction',
      description: 'Learn directly from experienced instructors in our Dublin 15 classroom. Ask questions, get instant feedback, and learn from others&apos; experiences.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FiSmartphone className="w-6 h-6" />,
      title: 'Practice On-The-Go',
      description: 'Continue your learning outside the classroom. Practice on your phone during commutes, breaks, or whenever you have 5 minutes spare.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: 'Exam-Style Mock Tests',
      description: 'Practice with timed tests that mirror the real SPSV exam. Get comfortable with the format and timing before test day.',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  const methodBenefits = [
    { icon: <FiBook />, label: 'Structured Curriculum' },
    { icon: <FiRefreshCw />, label: 'Proven Learning Methods' },
    { icon: <FiTarget />, label: 'Progress Tracking' },
    { icon: <FiUsers />, label: 'Expert Instructors' },
  ];

  const classroomBenefits = [
    {
      icon: '👨‍🏫',
      title: 'Expert Instructors',
      description: 'Our tutors have years of experience helping students pass. They know exactly what the exam requires.',
    },
    {
      icon: '🗣️',
      title: 'Ask Questions Anytime',
      description: 'Stuck on something? Get immediate answers in class. No waiting for email replies.',
    },
    {
      icon: '👥',
      title: 'Learn with Others',
      description: 'Study alongside fellow students. Learn from their questions and share the journey.',
    },
    {
      icon: '📍',
      title: 'Dublin 15 Location',
      description: 'Conveniently located in Blanchardstown. Easy access for students across Dublin.',
    },
  ];

  const appBenefits = [
    {
      icon: '📱',
      title: 'Practice Anytime',
      description: 'The app is available 24/7. Practice during lunch breaks, on the bus, or before bed.',
    },
    {
      icon: '🚩',
      title: 'Flag for Review',
      description: 'Mark difficult questions and come back to them. The system remembers what you struggle with.',
    },
    {
      icon: '📊',
      title: 'See Your Progress',
      description: 'Know exactly where you stand. Track accuracy, completed chapters, and time spent studying.',
    },
    {
      icon: '🔄',
      title: 'Smart Repetition',
      description: 'Questions you got wrong come back at optimal intervals so you actually remember them.',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* SaaS Hero Section */}
      <SaaSHero
        onGetStarted={() => setIsEnrollmentModalOpen(true)}
        onWatchDemo={() => setIsCoursesModalOpen(true)}
      />

      {/* Method Benefits Bar */}
      <section className="py-12 px-4 bg-white relative -mt-16 z-30">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {methodBenefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
                    {benefit.icon}
                  </div>
                  <span className="font-semibold text-gray-800">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Combined Approach Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
              <FiZap className="w-4 h-4" />
              The Best of Both Worlds
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Classroom Learning{' '}
              <span className="text-gradient">+ Digital Practice</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine expert in-person instruction with a powerful practice app. Learn the material in class, then reinforce it through structured practice at your own pace.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Classroom Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FiUsers className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">In-Person Classes</h3>
                    <p className="text-emerald-100">Dublin 15, Blanchardstown</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {classroomBenefits.map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-2xl">{benefit.icon}</span>
                      <div>
                        <h4 className="font-bold mb-1">{benefit.title}</h4>
                        <p className="text-emerald-100 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* App Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FiSmartphone className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Practice App</h3>
                    <p className="text-blue-100">Available 24/7 on any device</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {appBenefits.map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-2xl">{benefit.icon}</span>
                      <div>
                        <h4 className="font-bold mb-1">{benefit.title}</h4>
                        <p className="text-blue-100 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Combined Preview */}
          <div className="flex justify-center">
            <ClassroomAppPreview />
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
              <FiTarget className="w-4 h-4" />
              Study Smarter, Not Harder
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Features That Help You{' '}
              <span className="text-gradient">Actually Learn</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is built around proven learning methods. Every feature is designed to help you remember what you study and pass the exam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 card-hover ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagging Feature Deep Dive */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold mb-6">
                <FiFlag className="w-4 h-4" />
                Smart Review System
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Never Forget a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  Difficult Question
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                When you come across a tricky question, flag it with one tap. Our system keeps track of all your flagged questions so you can review them before the exam.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Flag any question with one tap while practicing',
                  'Review all flagged questions in a dedicated section',
                  'Track which topics give you the most trouble',
                  'Clear flags once you&apos;ve mastered the question',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsEnrollmentModalOpen(true)}
                className="group px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-red-500/25 transition-all hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Start Learning
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <FlaggedQuestionsPreview />
              <SpacedRepetitionPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <StudentDashboardDemo />
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 hidden lg:block">
                <ScoreCardPreview />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                <FiTrendingUp className="w-4 h-4" />
                Know Where You Stand
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Track Every Step of Your{' '}
                <span className="text-gradient">Learning Journey</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                No more guessing if you&apos;re ready. Our dashboard shows you exactly how many questions you&apos;ve practiced, your accuracy across topics, and which chapters need more work.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-emerald-600">18</div>
                  <div className="text-sm text-gray-500">Chapters to Master</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-500">Practice Questions</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-500">Syllabus Covered</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-3xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-500">Practice Access</div>
                </div>
              </div>
              <button
                onClick={() => setIsCoursesModalOpen(true)}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  See How It Works
                  <FiPlay className="w-5 h-5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Interface Demo */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
                <FiRefreshCw className="w-4 h-4" />
                Practice Makes Perfect
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Reinforce What You Learn{' '}
                <span className="text-gradient">In Class</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                After each classroom session, use the app to practice what you&apos;ve learned. The questions match what&apos;s covered in class, so you reinforce the material while it&apos;s fresh.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: '📚', text: 'Questions organized by chapter, matching classroom lessons' },
                  { icon: '💡', text: 'Instant explanations for every answer' },
                  { icon: '⏱️', text: 'Timed mock tests to simulate exam conditions' },
                  { icon: '📈', text: 'See your improvement over time' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <QuizInterfaceDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                <FiBook className="w-4 h-4" />
                Complete Preparation
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Know
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our curriculum covers the complete SPSV exam syllabus. Every topic, every regulation, every route you need to know.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: '📋',
                    title: 'Industry Knowledge',
                    desc: 'Regulations, licensing, fares, customer service, safety protocols.',
                  },
                  {
                    icon: '🗺️',
                    title: 'Dublin Area Knowledge',
                    desc: 'Routes, landmarks, one-way streets, efficient navigation.',
                  },
                  {
                    icon: '🎓',
                    title: 'Test-Taking Strategies',
                    desc: 'Time management, question analysis, proven techniques.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Pass Requirements</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                    <div className="text-5xl font-bold text-emerald-200 mb-2">75%</div>
                    <div className="text-emerald-100">Minimum score required in each section</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-200">€90</div>
                      <div className="text-sm text-emerald-100">Official test fee</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-200">2</div>
                      <div className="text-sm text-emerald-100">Sections to pass</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-200 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-cyan-200 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold mb-6">
            <FiCalendar className="w-4 h-4" />
            Classes Available Now
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              SPSV Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our next class in Dublin 15 and get full access to the practice platform. The combination of expert instruction and structured practice is the fastest way to pass.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setIsEnrollmentModalOpen(true)}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Enquire About Classes
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <a
              href="https://wa.me/353894034222"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white/30 hover:border-emerald-500/50 rounded-xl font-semibold text-white hover:bg-emerald-500/10 transition-all text-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <FiMessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </span>
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <span className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              Expert instructors
            </span>
            <span className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              Full app access included
            </span>
            <span className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              Dublin 15 location
            </span>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Image
              src="/logo.png"
              alt="SPSV Mastery Class Dublin"
              width={100}
              height={100}
              className="object-contain mx-auto mb-4 brightness-0 invert"
            />
            <h2 className="text-3xl font-bold mb-2">SPSV Mastery Class Dublin</h2>
            <p className="text-gray-400">Classroom instruction + digital practice for SPSV success</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-bold mb-2">Visit Us</h3>
              <p className="text-gray-400 text-sm">
                Dublin 15, Blanchardstown
              </p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-bold mb-2">Call Us</h3>
              <p className="text-gray-400 text-sm">
                <a href="tel:+353894034222" className="hover:text-emerald-400 transition-colors">
                  +353 89 403 4222
                </a>
              </p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-bold mb-2">WhatsApp</h3>
              <p className="text-gray-400 text-sm">
                <a 
                  href="https://wa.me/353894034222" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Quick Response
                </a>
              </p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-400 text-sm">
                <a href="mailto:info@spsvmastery.ie" className="hover:text-emerald-400 transition-colors">
                  info@spsvmastery.ie
                </a>
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SPSV Mastery Class Dublin. All rights reserved.
          </div>
        </div>
      </section>

      {/* Modals */}
      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
      />
      <CoursesModal
        isOpen={isCoursesModalOpen}
        onClose={() => setIsCoursesModalOpen(false)}
      />
    </main>
  );
}
