'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { FiCheck, FiStar, FiArrowRight } from 'react-icons/fi';

const successStories = [
  {
    name: 'Jomon C Ulahan',
    content: "I am writing this to express my sincere gratitude for the exceptional training and support you provided throughout our SPSV classes. Your deep knowledge of the subject, combined with your unique ability to make complex topics easy to understand, has been invaluable to us. Beyond the curriculum, your constant motivation and unwavering dedication truly inspired us to push our limits, especially during the challenging Week 4. Thank you for being more than just a trainer; you have been a true mentor and a constant source of encouragement. We feel much more confident approaching our NTA exams because of your guidance. We are truly grateful for all the effort you've invested in our success.",
    rating: 5,
  },
  {
    name: 'Connor Kelly',
    content: "SPSV Mastery and Mr Stephen made the difference for me. The classroom sessions were thorough and the practice app meant I could revise on the go. I passed both Industry and Area Knowledge first time. Couldn't recommend them enough.",
    rating: 5,
  },
  {
    name: 'Nathan Kerr',
    content: "I was nervous about the NTA exam but the daily mock tests and weekly study sessions at SPSV Mastery built my confidence. Mr Stephen's way of explaining regulations and routes is clear and practical. Passed first time.",
    rating: 5,
  },
  {
    name: 'Sanjay Patel',
    content: "Coming from a different country, I needed structure and support. SPSV Mastery gave me exactly that. The app helped me practise every day and Mr Stephen's teaching in class made the material stick. I passed my SPSV test and am grateful.",
    rating: 5,
  },
  {
    name: 'Mithun Nair',
    content: "The combination of in-person classes and the practice app is brilliant. Mr Stephen goes through everything thoroughly and the mock tests prepare you for the real exam. I passed both modules and would tell anyone to join SPSV Mastery.",
    rating: 5,
  },
  {
    name: 'Stephen Kelly',
    content: "I'd tried studying on my own and failed. With SPSV Mastery it was different—proper classroom teaching, daily mocks, and the app for revision. Mr Stephen knows the exam inside out. Passed first time after joining.",
    rating: 5,
  },
  {
    name: 'Niall McGovern',
    content: "Mr Stephen and the team at SPSV Mastery are top class. The materials are covered thoroughly, the mock tests get you exam-ready, and the app is a great backup. I passed my taxi test and am now on the road. Thanks a million.",
    rating: 5,
  },
  {
    name: 'Michael Byrne',
    content: "SPSV Mastery prepared me properly for the NTA exam. The classroom experience and the practice app together made the difference. Mr Stephen's encouragement and clear teaching helped me pass first time. Highly recommend.",
    rating: 5,
  },
  {
    name: "Benny O'Rourke",
    content: "I was looking for a proper taxi test course and found it with SPSV Mastery. Mr Stephen goes through the material thoroughly and the weekly study sessions keep you on track. Passed both sections. Great setup.",
    rating: 5,
  },
  {
    name: 'Dembelle Diallo',
    content: "SPSV Mastery and Mr Stephen helped me pass my SPSV test. The classes are well organised, the app is very useful for practice, and the mock tests made me confident for the real exam. I'm grateful for the support.",
    rating: 5,
  },
  {
    name: 'Odumbo Okonkwo',
    content: "I passed my taxi driver test thanks to SPSV Mastery. The teaching is thorough, the daily mocks get you ready, and Mr Stephen is a real mentor. The practice app helped me revise every day. Would recommend to anyone.",
    rating: 5,
  },
  {
    name: 'Aisling Murphy',
    content: "Mr Stephen and SPSV Mastery made passing the SPSV exam achievable. The classroom sessions cover everything, the app is handy for revision, and the mock tests mirror the real thing. I passed first time. Very happy.",
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    content: "The structure at SPSV Mastery—classes, materials, daily mocks, and the app—really works. Mr Stephen explains everything clearly and keeps you motivated. I passed my NTA exam and am thankful for the training.",
    rating: 5,
  },
  {
    name: 'Kwame Asante',
    content: "I passed my SPSV test with SPSV Mastery. Mr Stephen's teaching and the practice app were the key. The weekly study sessions and mock tests prepared me well for the exam. Great course and great support.",
    rating: 5,
  },
  {
    name: "Siobhan O'Brien",
    content: "SPSV Mastery gave me the confidence to sit the NTA exam. The classroom experience is thorough, the materials are well covered, and the app lets you practise anytime. Mr Stephen is an excellent trainer. Passed first time.",
    rating: 5,
  },
];

export default function SuccessStoriesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 pt-20 pb-32">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <FiStar className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Real Stories, Real Results</span>
          </div>

          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Success{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Stories
            </span>
          </h1>

          <p
            className={`text-xl text-gray-300 max-w-2xl mx-auto transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Hear from students who passed their SPSV taxi driver test with SPSV Mastery and Mr Stephen&apos;s support
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 px-4 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all duration-300 ${mounted ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-1 text-amber-400 text-lg mb-4">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  &quot;{story.content}&quot;
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-bold text-gray-900">{story.name}</p>
                  <p className="text-sm text-emerald-600">Passed SPSV Taxi Test</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join SPSV Mastery and get the same expert training, practice app, and support that helped these students pass.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
          >
            Enquire Now
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
