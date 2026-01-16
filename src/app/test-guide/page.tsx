'use client';

import Image from 'next/image';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { FaPhone, FaCreditCard, FaIdCard, FaFileAlt, FaCheckCircle, FaBook, FaMapMarkedAlt, FaClock, FaEuroSign, FaCalendarAlt, FaCertificate } from 'react-icons/fa';

export default function TestGuidePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/testguide.png"
              alt="SPSV Test Guide"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SPSV Test Guide</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Everything you need to know about the SPSV Skills Test, course contents, and requirements
          </p>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Booking the SPSV Skills Test</h2>
                <p className="text-gray-600 mt-2">How to register for your test</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start gap-4">
                  <FaPhone className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Contact NTA</h3>
                    <p className="text-gray-700 mb-3">
                      Call the National Transport Authority (NTA) to book your test:
                    </p>
                    <a 
                      href="tel:0818064000" 
                      className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors inline-block"
                    >
                      0818 064 000
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaCreditCard className="text-blue-600 text-xl" />
                    <h3 className="font-bold text-gray-900">Test Fee</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-700 mb-2">€90</p>
                  <p className="text-gray-700 text-sm">
                    Payable by credit or debit card over the phone, or by postal order
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaIdCard className="text-purple-600 text-xl" />
                    <h3 className="font-bold text-gray-900">Required Information</h3>
                  </div>
                  <p className="text-gray-700">
                    You will need to provide your <strong>PPS Number</strong> when booking
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-start gap-4">
                  <FaMapMarkedAlt className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Test Centres</h3>
                    <p className="text-gray-700">
                      There are <strong>FIVE test centres</strong> located across Ireland. 
                      You can choose any centre according to your convenience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Overview */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">SPSV Skills Test Overview</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                <div className="text-4xl font-bold text-green-700 mb-2">90</div>
                <p className="text-gray-700 font-semibold">Total Questions</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-center">
                <div className="text-4xl font-bold text-blue-700 mb-2">90</div>
                <p className="text-gray-700 font-semibold">Minutes Duration</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 text-center">
                <div className="text-4xl font-bold text-purple-700 mb-2">75%</div>
                <p className="text-gray-700 font-semibold">Pass Rate Required</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-red-600 text-xl mt-1 flex-shrink-0" />
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
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaBook className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Section 1: Industry Knowledge</h2>
                <p className="text-gray-600 mt-2">Regulations, licensing, and business operations</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" />
                    Questions
                  </h3>
                  <p className="text-3xl font-bold text-blue-700">54 Questions</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    Pass Requirement
                  </h3>
                  <p className="text-3xl font-bold text-green-700">75%</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3">Study Material</h3>
                <p className="text-gray-700 mb-4">
                  Candidates should study the official manual for industry knowledge:
                </p>
                <a
                  href="https://www.nationaltransport.ie/wp-content/uploads/2022/12/SPSV-Official-Manual-Edition-7.6.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <FaBook className="text-lg" />
                  Download Official Manual (PDF)
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Area Knowledge */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaMapMarkedAlt className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Section 2: Area Knowledge</h2>
                <p className="text-gray-600 mt-2">Routes, landmarks, and local geography</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-green-600" />
                    Questions
                  </h3>
                  <p className="text-3xl font-bold text-green-700">36 Questions</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-blue-600" />
                    Pass Requirement
                  </h3>
                  <p className="text-3xl font-bold text-blue-700">75%</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3">What You Need to Know</h3>
                <p className="text-gray-700">
                  Candidates should have comprehensive knowledge of the relevant county in which they are appearing for the test. 
                  This includes routes, one-way streets, landmarks, and navigation.
                </p>
              </div>
            </div>
          </div>

          {/* Course Contents - Area Knowledge */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaMapMarkedAlt className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Area Knowledge Course Contents</h2>
                <p className="text-gray-600 mt-2">Comprehensive Dublin area knowledge topics covered in our course</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Routes */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Main Routes to Dublin City</h3>
                <p className="text-sm text-gray-600 mb-2">10 routes to Dublin city centre + street names</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">11</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">+ maps included</p>
              </div>

              {/* Places of Interest */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Interesting Places in Dublin</h3>
                <p className="text-sm text-gray-600 mb-2">Hotels, pubs, restaurants, hospitals, etc.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">90</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">+ maps included</p>
              </div>

              {/* Road Markings */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Road Markings</h3>
                <p className="text-sm text-gray-600 mb-2">Colour of roads in a map</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">8</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Places on Squares */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Places of Interest on Squares</h3>
                <p className="text-sm text-gray-600 mb-2">Hotels, colleges, etc.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">13</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Circular Roads */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">North & South Circular Roads</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin circular routes</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">28</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">+ maps included</p>
              </div>

              {/* Train Stations */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Train Stations</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin train stations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">7</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Residential Areas */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Residential Areas</h3>
                <p className="text-sm text-gray-600 mb-2">Adjoining residential areas</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">63</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Hotels */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Dublin Hotels</h3>
                <p className="text-sm text-gray-600 mb-2">Comprehensive hotel locations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">192</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">+ maps included</p>
              </div>

              {/* Hospitals */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Dublin Hospitals</h3>
                <p className="text-sm text-gray-600 mb-2">Hospital locations and details</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">52</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">+ maps included</p>
              </div>

              {/* Other Known Places */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Other Known Places</h3>
                <p className="text-sm text-gray-600 mb-2">Various landmarks and locations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">32</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Churches and Cathedrals */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Churches & Cathedrals</h3>
                <p className="text-sm text-gray-600 mb-2">Religious sites in Dublin</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">15</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">+ maps included</p>
              </div>

              {/* Libraries */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Libraries</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin library locations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">19</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Art Galleries */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Art Galleries</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin art galleries</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">21</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Museums */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Museums</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin museum locations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">28</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Schools */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Schools</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin school locations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">60</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Parks, Gardens & Cemeteries */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Parks, Gardens & Cemeteries</h3>
                <p className="text-sm text-gray-600 mb-2">Green spaces and memorial sites</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">30</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Embassies */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Embassies</h3>
                <p className="text-sm text-gray-600 mb-2">Embassy locations in Dublin</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">15</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Sports Grounds */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Sports Grounds</h3>
                <p className="text-sm text-gray-600 mb-2">Sports venues in Dublin</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">33</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Night Clubs & Pubs */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Night Clubs & Pubs</h3>
                <p className="text-sm text-gray-600 mb-2">Entertainment venues</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">96</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Restaurants */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Restaurants</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin restaurant locations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">55</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Cinemas */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Cinemas</h3>
                <p className="text-sm text-gray-600 mb-2">Cinema locations in Dublin</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">12</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Casinos */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Casinos</h3>
                <p className="text-sm text-gray-600 mb-2">Casino locations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">23</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* One Way Streets */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">One Way Streets</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin one-way street navigation</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">127</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* DART Stations */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">DART Stations</h3>
                <p className="text-sm text-gray-600 mb-2">Dublin Area Rapid Transit stations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">26</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Pedestrianised Streets */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Pedestrianised Streets</h3>
                <p className="text-sm text-gray-600 mb-2">Walking-only areas in Dublin</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">37</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Contents - Industry Knowledge */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaBook className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Industry Knowledge Course Contents</h2>
                <p className="text-gray-600 mt-2">Comprehensive SPSV industry knowledge topics covered in our course</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Basic Industry Knowledge */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Basic SPSV Industry Knowledge</h3>
                <p className="text-sm text-gray-600 mb-2">Fundamental SPSV regulations and requirements</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-700">98</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Vehicle */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Vehicle</h3>
                <p className="text-sm text-gray-600 mb-2">Vehicle requirements and specifications</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-700">52</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Hire & Fares */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Hire & Fares</h3>
                <p className="text-sm text-gray-600 mb-2">Pricing structures and hire regulations</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-700">54</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Customer Satisfaction</h3>
                <p className="text-sm text-gray-600 mb-2">Service standards and customer care</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-700">66</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Business */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Business</h3>
                <p className="text-sm text-gray-600 mb-2">Business operations and management</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-700">17</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>

              {/* Health and Safety */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Health and Safety</h3>
                <p className="text-sm text-gray-600 mb-2">Safety regulations and protocols</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-700">41</span>
                  <span className="text-sm text-gray-600">questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* At the Test Centre */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCalendarAlt className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">At the Test Centre</h2>
                <p className="text-gray-600 mt-2">What to bring and when to arrive</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-start gap-4">
                  <FaClock className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Arrival Time</h3>
                    <p className="text-gray-700 text-lg">
                      Please arrive at the test centre <strong>30 minutes prior</strong> to your scheduled test time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaIdCard className="text-red-600" />
                  Required Identification
                </h3>
                <p className="text-gray-700 mb-3">
                  You must bring one of the following forms of identification:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Full Irish Driving Licence</strong> (Class B or higher)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>European Licence</strong> accepted by the National Transport Authority
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600 text-sm mt-4 italic">
                  <strong>Important:</strong> No other form of ID is accepted. Make sure you bring the correct identification.
                </p>
              </div>
            </div>
          </div>

          {/* Documents Needed After Passing */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaFileAlt className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Documents Needed After Passing</h2>
                <p className="text-gray-600 mt-2">Prepare these documents to complete your SPSV driver application</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
              <p className="text-gray-700">
                <strong>Tip:</strong> We encourage candidates to arrange these documents in advance so that after passing 
                the SPSV Skills Test, it becomes easier to submit your application immediately.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaFileAlt className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">FORM 15/18 Application Form</h3>
                    <p className="text-gray-700 text-sm">
                      Available from your local Garda station or can be printed online
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaEuroSign className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">SPSV Driver&apos;s License Fee Payment</h3>
                    <p className="text-gray-700 text-sm">
                      Pay fees to NTA after passing the test. Receipt must be attached to your application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaCertificate className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Tax Clearance Certificate</h3>
                    <p className="text-gray-700 text-sm">
                      Arrange this certificate in advance
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaCheckCircle className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">SPSV Skills Certificate</h3>
                    <p className="text-gray-700 text-sm">
                      Certificate received after passing the SPSV Skills Test
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaIdCard className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Full Irish Licence Copy</h3>
                    <p className="text-gray-700 text-sm">
                      Class B minimum, must be at least one year old
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaFileAlt className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Police Clearance Certificate</h3>
                    <p className="text-gray-700 text-sm">
                      Required if you have lived outside Ireland for more than one year (for that country)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaFileAlt className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">NDLS Driving History</h3>
                    <p className="text-gray-700 text-sm">
                      Attach your NDLS driving history with the application
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FaIdCard className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Three Identical Photographs</h3>
                    <p className="text-gray-700 text-sm">
                      Size: 10cm by 7cm (passport-style photos)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Join SPSV Mastery Class Dublin and get comprehensive preparation for your SPSV Skills Test
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors text-lg"
              >
                View Our Courses
              </a>
              <a
                href="tel:+353892100704"
                className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-lg"
              >
                Call: +353 89 210 0704
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
