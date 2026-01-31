'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChalkboardTeacher, FaBook, FaBullseye, FaBuilding, FaMapMarkedAlt, FaBookOpen } from 'react-icons/fa';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Form, FormField } from '@/components/Form';
import { CourseFeature, Feature } from '@/components/CourseFeature';
import { Testimonial, TestimonialItem } from '@/components/Testimonial';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { CoursesModal } from '@/components/CoursesModal';
import { Button } from '@/components/Button';
import { StudentDashboardDemo } from '@/components/demos/StudentDashboardDemo';
import { QuizInterfaceDemo } from '@/components/demos/QuizInterfaceDemo';

export default function Home() {
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);

  const handleEnrollment = (data: Record<string, string>) => {
    console.log('Enrollment data:', data);
    // Handle enrollment submission
  };

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

  const enrollmentFields: FormField[] = [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'John Doe',
      required: true,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@example.com',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+353 89 403 4222',
      required: true,
    },
  ];

  const features: Feature[] = [
    {
      icon: <FaChalkboardTeacher />,
      title: 'Smart Learning Platform',
      description: 'AI-powered adaptive learning that identifies your weak areas and creates a personalized study plan for maximum efficiency.',
    },
    {
      icon: <FaBook />,
      title: '500+ Practice Questions',
      description: 'Comprehensive question bank covering every topic. New questions added monthly based on latest exam patterns.',
    },
    {
      icon: <FaBullseye />,
      title: 'Real-Time Progress Tracking',
      description: 'Advanced analytics dashboard shows your performance, accuracy, and readiness across all topics with AI predictions.',
    },
    {
      icon: <FaBuilding />,
      title: 'Learn Anywhere, Anytime',
      description: 'Access the platform 24/7 from any device - phone, tablet, or computer. Learn at your own pace, on your schedule.',
    },
    {
      icon: <FaMapMarkedAlt />,
      title: 'Interactive Dublin Maps',
      description: 'Digital route visualization, landmark quizzes, and street-view integration for mastering Area Knowledge.',
    },
    {
      icon: <FaBookOpen />,
      title: 'Expert Support + Classes',
      description: 'Platform access PLUS optional in-person classes in Dublin 15. Best of both worlds - digital efficiency meets human expertise.',
    },
  ];

  const testimonials: TestimonialItem[] = [
    {
      name: 'Michael O&apos;Brien',
      role: 'Passed First Attempt',
      content: 'The tutors at SPSV Mastery Class made all the difference. I passed both sections with 92% on my first try. Worth every penny!',
      rating: 5,
    },
    {
      name: 'Sarah Murphy',
      role: 'Now Full-Time Driver',
      content: 'I failed twice before finding this school. Their Dublin area knowledge training is unmatched. Passed easily the third time!',
      rating: 5,
    },
    {
      name: 'David Chen',
      role: 'Passed First Attempt',
      content: 'The mock tests were incredibly similar to the real exam. I felt so prepared. Highly recommend the intensive course!',
      rating: 5,
    },
  ];

  const courseHighlights = [
    {
      icon: '💻',
      title: '24/7 Platform Access',
      description: 'Learn anytime, anywhere. Your personal learning environment is always available on any device.',
    },
    {
      icon: '📈',
      title: 'AI Performance Tracking',
      description: 'Advanced analytics predict your pass probability and recommend exactly what to study next.',
    },
    {
      icon: '⚡',
      title: 'Instant Progress Updates',
      description: 'See your improvement in real-time. Every question answered updates your readiness score immediately.',
    },
    {
      icon: '🎯',
      title: 'Personalized Study Plans',
      description: 'AI creates custom learning paths based on your progress, learning speed, and knowledge gaps.',
    },
    {
      icon: '🏫',
      title: 'Optional Live Classes',
      description: 'Platform access PLUS in-person sessions in Dublin 15 for those who want classroom interaction.',
    },
    {
      icon: '🔄',
      title: 'Lifetime Updates',
      description: 'New questions, updated content, and platform improvements included at no extra cost.',
    },
  ];

  const preparationFeatures = [
    {
      icon: '🎯',
      title: 'Adaptive Learning Engine',
      description: 'AI identifies your knowledge gaps and automatically adjusts difficulty, focusing study time where you need it most.',
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Real-time dashboards show accuracy rates, time spent, and predicted pass probability across all exam topics.',
    },
    {
      icon: '🔄',
      title: 'Spaced Repetition System',
      description: 'Questions resurface at scientifically-optimized intervals to maximize long-term retention and exam readiness.',
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Study on the go with our mobile-optimized platform. Practice during breaks, commutes, or anywhere you have 5 minutes.',
    },
    {
      icon: '⚡',
      title: 'Instant Feedback Loop',
      description: 'Get immediate explanations for every answer. Learn from mistakes instantly rather than waiting for class corrections.',
    },
    {
      icon: '👥',
      title: 'Expert Support Available',
      description: 'Platform includes direct access to instructors via chat. Optional in-person classes in Dublin 15 for hands-on learning.',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero
        title="Ireland's Most Advanced SPSV Learning Platform"
        subtitle="Master the taxi driver test with our intelligent learning platform. 500+ practice questions, AI-powered progress tracking, and expert guidance. Join 1000+ successful students."
        primaryCTA="Start Free Trial"
        secondaryCTA="See Platform Demo"
        onPrimaryClick={() => setIsEnrollmentModalOpen(true)}
        onSecondaryClick={() => setIsCoursesModalOpen(true)}
      />

      {/* Platform Features Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-full font-semibold text-sm mb-4">
              💻 Intelligent Platform
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4">
              Everything You Need to Pass in One Platform
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our cutting-edge learning platform combines AI-powered study tools, comprehensive content, and expert instruction to guarantee your success.
            </p>
          </div>
          
          {/* Taxis Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/Taxis.png"
              alt="Dublin Taxis - SPSV Training"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {preparationFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <div id="features">
        <CourseFeature
          title="Why Choose SPSV Mastery Platform?"
          subtitle="More than just study materials - a complete intelligent learning system that adapts to you. Technology meets expert instruction for guaranteed results."
          features={features}
        />
      </div>

      {/* What's Included Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-emerald-900 to-green-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left px-4">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-sm text-emerald-200 mb-4">
                📚 Complete Coverage
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Master Every Topic
              </h2>
              <p className="text-lg md:text-xl text-green-100 mb-6 md:mb-8">
                Our intelligent platform covers 100% of the SPSV exam syllabus with adaptive learning technology.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                    📋
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Industry Knowledge</h3>
                    <p className="text-green-100">Regulations, licensing, fares, customer service, safety protocols, and business operations.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                    🗺️
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Dublin Area Knowledge</h3>
                    <p className="text-green-100">Routes, landmarks, one-way streets, efficient navigation, and local geography mastery.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                    🎓
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Test-Taking Strategies</h3>
                    <p className="text-green-100">Time management, question analysis, and proven techniques to maximize your score.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4">Pass Requirements</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-300">75%</div>
                  <div className="text-sm">Minimum score required in each section</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-300">€90</div>
                  <div className="text-sm">Official test fee</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-300">2 Sections</div>
                  <div className="text-sm">Must pass both to get licensed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Dashboard Demo Section */}
      <section className="py-12 md:py-16 lg:py-20 px-3 md:px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-2">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-xs md:text-sm mb-4">
              📱 Live Interactive Demo
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Your Personal Learning Dashboard
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Track your progress, monitor your performance, and stay motivated with our interactive student dashboard. See exactly what you get when you enroll!
            </p>
          </div>
          
          <div className="mb-6 md:mb-8">
            <StudentDashboardDemo />
          </div>

          <div className="text-center px-2">
            <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-emerald-50 text-emerald-700 rounded-full font-medium text-xs md:text-sm lg:text-base flex-wrap justify-center">
              <span className="hidden sm:inline">✨</span>
              <span className="text-center">This is a live, interactive preview of the actual student dashboard</span>
              <span className="hidden sm:inline">✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Interface Demo Section */}
      <section className="py-12 md:py-16 lg:py-20 px-3 md:px-4 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 text-white px-2">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold text-xs md:text-sm mb-4">
              🎯 Try It Yourself - Live Demo
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">
              Interactive Quiz Platform
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-emerald-100 max-w-3xl mx-auto">
              Practice with hundreds of real exam-style questions. Get instant feedback, detailed explanations, and track your accuracy across all topics.
            </p>
          </div>
          
          <div className="mb-6 md:mb-8">
            <QuizInterfaceDemo />
          </div>

          <div className="text-center px-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                What Makes Our Platform Special?
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 md:gap-6 text-white">
                <div className="text-center p-3 md:p-0">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">📚</div>
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">500+ Questions</h4>
                  <p className="text-emerald-100 text-xs md:text-sm">
                    Comprehensive bank covering all exam topics
                  </p>
                </div>
                <div className="text-center p-3 md:p-0">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">💡</div>
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Detailed Explanations</h4>
                  <p className="text-emerald-100 text-xs md:text-sm">
                    Learn from mistakes with in-depth explanations
                  </p>
                </div>
                <div className="text-center p-3 md:p-0">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">📊</div>
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Progress Tracking</h4>
                  <p className="text-emerald-100 text-xs md:text-sm">
                    Monitor performance and identify weak areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div id="testimonials" className="relative">
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/spsv passing.png"
              alt="Successful SPSV students"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        <Testimonial
          title="Success Stories from Our Students"
          testimonials={testimonials}
        />
      </div>

      {/* Platform Benefits */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full font-semibold text-sm text-emerald-300 mb-4">
              🚀 Platform Features
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4">
              Everything You Need, All in One Place
            </h2>
            <p className="text-lg md:text-xl text-gray-300 px-4">
              A complete learning ecosystem designed for SPSV success
            </p>
          </div>
          
          {/* Classroom Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/spsv classroom.png"
              alt="SPSV Mastery Class Dublin Classroom"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseHighlights.map((highlight, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl bg-gray-800 hover:bg-gray-750 transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-5xl mb-4">{highlight.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{highlight.title}</h3>
                <p className="text-gray-300 leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment CTA Section */}
      <section id="enrollment" className="py-16 md:py-20 px-4 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-white text-center md:text-left px-4">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold text-sm mb-4">
                🎓 Get Started Today
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Start Your Free Trial
              </h2>
              <p className="text-xl md:text-2xl mb-6 md:mb-8 text-green-100">
                Get instant platform access. No credit card required. Start learning in 60 seconds.
              </p>
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl">✓</span>
                  <span className="text-base md:text-lg">Instant platform access - start immediately</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl">✓</span>
                  <span className="text-base md:text-lg">500+ practice questions unlocked</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl">✓</span>
                  <span className="text-base md:text-lg">AI progress tracking from day one</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl">✓</span>
                  <span className="text-base md:text-lg">Optional in-person classes available</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-6">
                <p className="text-sm text-green-100 mb-2">Contact us now:</p>
                <a 
                  href="tel:+353894034222" 
                  className="text-xl font-bold text-white hover:text-green-100 transition-colors block mb-2"
                >
                  +353 89 403 4222
                </a>
                <a 
                  href="https://wa.me/353894034222" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-green-100 hover:text-white transition-colors underline"
                >
                  Or message us on WhatsApp
                </a>
              </div>
            </div>
            <div>
              <Form
                title="Start Your Free Trial"
                fields={enrollmentFields}
                submitLabel="Get Instant Access"
                onSubmit={handleEnrollment}
              />
            </div>
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

      {/* Contact & Location */}
      <section id="contact" className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Image
              src="/logo.png"
              alt="SPSV Mastery Class Dublin"
              width={100}
              height={100}
              className="object-contain mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold mb-2">SPSV Mastery Class Dublin</h2>
            <p className="text-gray-400">Your trusted partner for SPSV test success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-400">
                Dublin 15, Blanchardstown
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-400">
                <a href="tel:+353894034222" className="hover:text-white transition-colors">
                  +353 89 403 4222
                </a>
                <br />
                Mon-Fri: 9AM-6PM
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">WhatsApp Us</h3>
              <p className="text-gray-400">
                <a 
                  href="https://wa.me/353894034222" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Message on WhatsApp
                </a>
                <br />
                Quick response guaranteed
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-400">
                <a href="mailto:info@spsvmastery.ie" className="hover:text-white transition-colors">
                  info@spsvmastery.ie
                </a>
                <br />
                24-hour response time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold text-sm mb-4">
            🚀 Limited Time Offer
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 px-4">
            Join 1000+ Students Who Passed with SPSV Mastery
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 px-4">
            Start your free trial today - no credit card, no commitment, just results
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <a
              href="tel:+353894034222"
              className="bg-white text-emerald-700 hover:bg-gray-100 font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-base md:text-lg text-center"
            >
              📞 Start Free Trial
            </a>
            <a 
              href="https://wa.me/353894034222"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-white hover:text-emerald-700 transition-all text-base md:text-lg text-center"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm md:text-base text-emerald-100 px-4">
            ⚡ Setup takes less than 60 seconds • 💳 No credit card required • 🎯 Cancel anytime
          </p>
        </div>
      </section>
    </main>
  );
}
