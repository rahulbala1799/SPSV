'use client';

import Image from 'next/image';
import { FaChalkboardTeacher, FaBook, FaBullseye, FaBuilding, FaMapMarkedAlt, FaBookOpen } from 'react-icons/fa';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Form, FormField } from '@/components/Form';
import { CourseFeature, Feature } from '@/components/CourseFeature';
import { Testimonial, TestimonialItem } from '@/components/Testimonial';
import { Button } from '@/components/Button';

export default function Home() {
  const handleEnrollment = (data: Record<string, string>) => {
    console.log('Enrollment data:', data);
    // Handle enrollment submission
  };

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
      placeholder: '+353 89 210 0704',
      required: true,
    },
  ];

  const features: Feature[] = [
    {
      icon: <FaChalkboardTeacher />,
      title: 'Expert Tutors',
      description: 'Learn from experienced instructors who know the SPSV test inside out. Our tutors have helped hundreds pass on their first attempt.',
    },
    {
      icon: <FaBook />,
      title: 'Comprehensive Materials',
      description: 'Complete study guides, practice questions, and mock tests covering both Industry Knowledge and Area Knowledge sections.',
    },
    {
      icon: <FaBullseye />,
      title: '95% Pass Rate',
      description: 'Our students consistently achieve a 95% first-time pass rate - significantly higher than the national average.',
    },
    {
      icon: <FaBuilding />,
      title: 'Central Location',
      description: 'Conveniently located classroom in Dublin 15, Blanchardstown with easy access via public transport.',
    },
    {
      icon: <FaMapMarkedAlt />,
      title: 'Dublin Area Expertise',
      description: 'Master Dublin routes, one-way streets, landmarks, and navigation with our local area specialists.',
    },
    {
      icon: <FaBookOpen />,
      title: 'Complete Materials',
      description: 'All study materials, practice tests, and resources provided as part of your course enrollment.',
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
      icon: '🏫',
      title: 'Professional Classroom',
      description: 'Learn in our modern, fully-equipped classroom in Dublin 15, Blanchardstown with interactive learning tools.',
    },
    {
      icon: '👥',
      title: 'Small Class Sizes',
      description: 'Maximum 12 students per class ensuring personalized attention and interactive learning.',
    },
    {
      icon: '📅',
      title: 'Flexible Scheduling',
      description: 'Multiple class times available throughout the week including evenings and weekends.',
    },
    {
      icon: '🎓',
      title: 'Structured Curriculum',
      description: 'Proven teaching methodology covering both Industry and Area Knowledge systematically.',
    },
    {
      icon: '🚗',
      title: 'Practical Training',
      description: 'Real Dublin route practice sessions and hands-on navigation exercises included.',
    },
    {
      icon: '💼',
      title: 'Career Support',
      description: 'Job placement assistance and industry connections to help you start driving immediately.',
    },
  ];

  const preparationFeatures = [
    {
      icon: '📚',
      title: 'Structured Lessons',
      description: 'Our carefully designed curriculum breaks down complex topics into easy-to-understand lessons that build on each other.',
    },
    {
      icon: '📖',
      title: 'Easy-to-Grasp Materials',
      description: 'Study materials designed for clarity - no jargon, no confusion. Everything explained in simple, practical terms.',
    },
    {
      icon: '🎯',
      title: 'Focused Preparation',
      description: 'We focus specifically on what you need to pass the SPSV test - no unnecessary information, just what matters.',
    },
    {
      icon: '💡',
      title: 'Interactive Learning',
      description: 'Engage with the material through discussions, practice questions, and real-world examples that make learning stick.',
    },
    {
      icon: '✅',
      title: 'Progress Tracking',
      description: 'Regular assessments and feedback help you identify areas for improvement and track your readiness for the test.',
    },
    {
      icon: '🤝',
      title: 'Personalized Support',
      description: 'Get help when you need it. Our tutors are available to answer questions and provide guidance throughout your journey.',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero
        title="Master the SPSV Test with Dublin's #1 Tutoring School"
        subtitle="Join SPSV Mastery Class Dublin and pass your taxi driver test with confidence. Expert tutors, proven methods, 95% pass rate."
        primaryCTA="Enroll Now"
        secondaryCTA="View Courses"
      />

      {/* Preparation Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How We Help You Achieve Your Pass
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven approach combines structured lessons, easy-to-grasp study materials, and comprehensive support to ensure you&apos;re fully prepared for success.
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
          title="Why Choose SPSV Mastery Class Dublin?"
          subtitle="We don't just give you materials - we teach you how to pass. Our expert tutors provide personalized guidance every step of the way."
          features={features}
        />
      </div>

      {/* What You'll Learn Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-900 to-green-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What You&apos;ll Learn
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Our comprehensive curriculum covers everything you need to ace both sections of the SPSV test.
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

      {/* Course Highlights */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Our Classroom Experience
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12">
            Professional training in a dedicated learning environment
          </p>
          
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
      <section id="enrollment" className="py-20 px-4 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Join Our Next Class?
              </h2>
              <p className="text-2xl mb-8 text-green-100">
                Register your interest and we&apos;ll contact you with class schedules and details.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">Classes starting soon</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">Multiple time slots available</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">No obligation consultation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">All materials included</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-6">
                <p className="text-sm text-green-100 mb-2">Contact us now:</p>
                <a 
                  href="tel:+353892100704" 
                  className="text-xl font-bold text-white hover:text-green-100 transition-colors block mb-2"
                >
                  +353 89 210 0704
                </a>
                <a 
                  href="https://wa.me/353892100704" 
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
                title="Register Your Interest"
                fields={enrollmentFields}
                submitLabel="Contact Me About Classes"
                onSubmit={handleEnrollment}
              />
            </div>
          </div>
        </div>
      </section>

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
                <a href="tel:+353892100704" className="hover:text-white transition-colors">
                  +353 89 210 0704
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
                  href="https://wa.me/353892100704" 
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
      <section className="py-12 px-4 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don&apos;t Wait - Classes Fill Up Fast!
          </h2>
          <p className="text-xl mb-6">
            Contact us today to learn about upcoming class schedules
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+353892100704"
              className="bg-white text-green-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-colors text-lg text-center"
            >
              Get Class Information
            </a>
            <a
              href="https://wa.me/353892100704"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors text-lg text-center"
            >
              Book Free Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
