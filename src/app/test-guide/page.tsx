'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { 
  FiPhone, FiCreditCard, FiFileText, FiCheck, FiBook, FiMapPin, 
  FiClock, FiDollarSign, FiCalendar, FiAward, FiAlertCircle,
  FiArrowRight, FiUser, FiMessageCircle
} from 'react-icons/fi';

export default function TestGuidePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const areaKnowledgeTopics = [
    { title: 'Main Routes to Dublin City', questions: 11, hasMap: true },
    { title: 'Interesting Places in Dublin', questions: 90, hasMap: true },
    { title: 'Road Markings', questions: 8, hasMap: false },
    { title: 'Places on Squares', questions: 13, hasMap: false },
    { title: 'North & South Circular Roads', questions: 28, hasMap: true },
    { title: 'Train Stations', questions: 7, hasMap: false },
    { title: 'Residential Areas', questions: 63, hasMap: false },
    { title: 'Dublin Hotels', questions: 192, hasMap: true },
    { title: 'Dublin Hospitals', questions: 52, hasMap: true },
    { title: 'Other Known Places', questions: 32, hasMap: false },
    { title: 'Churches & Cathedrals', questions: 15, hasMap: true },
    { title: 'Libraries', questions: 19, hasMap: false },
    { title: 'Art Galleries', questions: 21, hasMap: false },
    { title: 'Museums', questions: 28, hasMap: false },
    { title: 'Schools', questions: 60, hasMap: false },
    { title: 'Parks, Gardens & Cemeteries', questions: 30, hasMap: false },
    { title: 'Embassies', questions: 15, hasMap: false },
    { title: 'Sports Grounds', questions: 33, hasMap: false },
    { title: 'Night Clubs & Pubs', questions: 96, hasMap: false },
    { title: 'Restaurants', questions: 55, hasMap: false },
    { title: 'Cinemas', questions: 12, hasMap: false },
    { title: 'Casinos', questions: 23, hasMap: false },
    { title: 'One Way Streets', questions: 127, hasMap: false },
    { title: 'DART Stations', questions: 26, hasMap: false },
    { title: 'Pedestrianised Streets', questions: 37, hasMap: false },
  ];

  const industryKnowledgeTopics = [
    { title: 'Basic SPSV Industry Knowledge', questions: 98 },
    { title: 'Vehicle', questions: 52 },
    { title: 'Hire & Fares', questions: 54 },
    { title: 'Customer Satisfaction', questions: 66 },
    { title: 'Business', questions: 17 },
    { title: 'Health and Safety', questions: 41 },
  ];

  const requiredDocuments = [
    { title: 'FORM 15/18 Application Form', desc: 'Available from your local Garda station or can be printed online' },
    { title: 'SPSV Driver&apos;s License Fee Payment', desc: 'Pay fees to NTA after passing. Receipt must be attached.' },
    { title: 'Tax Clearance Certificate', desc: 'Arrange this certificate in advance from Revenue' },
    { title: 'SPSV Skills Certificate', desc: 'Certificate received after passing the SPSV Skills Test' },
    { title: 'Full Irish Licence Copy', desc: 'Class B minimum, must be at least one year old' },
    { title: 'Police Clearance Certificate', desc: 'Required if you lived outside Ireland for more than one year' },
    { title: 'NDLS Driving History', desc: 'Attach your NDLS driving history with the application' },
    { title: 'Three Identical Photographs', desc: 'Size: 10cm by 7cm (passport-style photos)' },
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

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <FiBook className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">Complete Taxi Driver Test Guide</span>
              </div>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                SPSV{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Test Guide
                </span>
              </h1>
              
              <p className={`text-xl text-gray-300 mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Everything you need to know about the Taxi Driver Test - booking, requirements, course contents, and what to expect
              </p>
            </div>
            
            <div className={`relative transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20">
            <Image
              src="/testguide.png"
                  alt="SPSV Taxi Driver Test Guide"
              width={600}
              height={400}
                  className="w-full object-contain"
              priority
            />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-cyan-500/20 rounded-xl -z-10" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto space-y-12">

      {/* Booking Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiPhone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Booking the SPSV Skills Test</h2>
                <p className="text-gray-500 mt-1">How to register for your taxi driver test</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Contact NTA</h3>
                    <p className="text-gray-600 mb-3">Call the National Transport Authority to book your taxi driver test:</p>
                    <a 
                      href="tel:0818064000" 
                      className="text-3xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      0818 064 000
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiCreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Taxi Test Fee</h3>
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mb-2">€90</p>
                  <p className="text-sm text-gray-500">Payable by card or postal order</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Required Information</h3>
                  </div>
                  <p className="text-gray-700">You need your <strong>PPS Number</strong> when booking</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Test Centres</h3>
                    <p className="text-gray-700">
                      <strong>5 test centres</strong> across Ireland. Choose any location convenient for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Overview */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Taxi Driver Test Overview
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white text-center">
                <div className="text-5xl font-bold mb-2">90</div>
                <p className="font-semibold opacity-90">Total Questions</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white text-center">
                <div className="text-5xl font-bold mb-2">90</div>
                <p className="font-semibold opacity-90">Minutes Duration</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
                <div className="text-5xl font-bold mb-2">75%</div>
                <p className="font-semibold opacity-90">Pass Rate Required</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Important: Partial Pass</h3>
                  <p className="text-gray-700">
                    If you pass one module and fail the other, you have <strong>ONE YEAR</strong> to pass the remaining module. 
                    You only need to retake the module you failed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Industry Knowledge */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiBook className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Section 1: Industry Knowledge</h2>
                <p className="text-gray-500 mt-1">Taxi regulations, licensing, and business operations</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiFileText className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-gray-900">Questions</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">54 Questions</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-gray-900">Pass Requirement</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600">75%</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {industryKnowledgeTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <span className="text-gray-700 font-medium">{topic.title}</span>
                  <span className="text-blue-600 font-bold">{topic.questions}</span>
                </div>
              ))}
              </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <a
                  href="/spsv-manual"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                <FiBook className="w-5 h-5" />
                View Official SPSV Manual
                <FiArrowRight className="w-4 h-4" />
                </a>
            </div>
          </div>

          {/* Section 2: Area Knowledge */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Section 2: Area Knowledge</h2>
                <p className="text-gray-500 mt-1">Dublin routes, landmarks, and local geography</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiFileText className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-gray-900">Questions</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600">36 Questions</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-gray-900">Pass Requirement</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">75%</p>
              </div>
            </div>
          </div>

          {/* Course Contents Image */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/course-content.png"
                alt="Taxi Driver Test Course Content"
                width={800}
                height={400}
                className="w-full object-contain"
              />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">Area Knowledge Topics Covered</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {areaKnowledgeTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium text-sm">{topic.title}</span>
                    {topic.hasMap && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">+map</span>
                    )}
                </div>
                  <span className="text-emerald-600 font-bold">{topic.questions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* At the Test Centre */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiCalendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">At the Test Centre</h2>
                <p className="text-gray-500 mt-1">What to bring and when to arrive</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <FiClock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Arrival Time</h3>
                </div>
                <p className="text-gray-700">
                  Arrive <strong>30 minutes prior</strong> to your scheduled test time
                </p>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Required ID</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span><strong>Full Irish Driving Licence</strong> (Class B or higher)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span><strong>European Licence</strong> accepted by NTA</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Documents Needed After Passing */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiFileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Documents Needed After Passing</h2>
                <p className="text-gray-500 mt-1">Prepare these to complete your SPSV driver application</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6">
              <p className="text-gray-700">
                <strong className="text-blue-700">Pro Tip:</strong> Arrange these documents in advance so that after passing, 
                you can submit your application immediately.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {requiredDocuments.map((doc, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors border border-gray-100 hover:border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiCheck className="w-4 h-4 text-emerald-600" />
              </div>
                  <div>
                      <h3 className="font-bold text-gray-900 mb-1">{doc.title}</h3>
                      <p className="text-sm text-gray-500">{doc.desc}</p>
              </div>
                  </div>
                </div>
              ))}
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
              Taxi Driver Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join SPSV Mastery Class Dublin for comprehensive taxi test preparation
          </p>
          
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openEnrollment', { detail: { source: 'test-guide' } }))}
                className="group px-8 py-4 bg-white rounded-xl font-bold text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
              >
                View Our Courses
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openEnrollment', { detail: { source: 'test-guide' } }))}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-3"
              >
                Enquire Now
                <FiArrowRight className="w-5 h-5" />
              </button>
          </div>
        </div>
      </section>
    </main>
  );
}
