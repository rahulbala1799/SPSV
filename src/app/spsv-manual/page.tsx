'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { ChapterSection } from '@/components/manual/ChapterSection';
import { TableOfContents } from '@/components/manual/TableOfContents';
import { ProgressTracker } from '@/components/manual/ProgressTracker';
import { manualQuestions } from '@/data/manualQuestions';
import { FiDownload, FiSearch, FiArrowUp, FiBook, FiCheck } from 'react-icons/fi';

// Load content from JSON file
const loadManualContent = async () => {
  try {
    const response = await fetch('/pdf-organized.json');
    const data = await response.json();
    return data.sections;
  } catch (error) {
    console.error('Error loading manual content:', error);
    return [];
  }
};

const STORAGE_KEY = 'spsv-manual-progress-v1';

export default function SPSVManualPage() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [answeredCounts, setAnsweredCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const chapterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load content on mount
  useEffect(() => {
    loadManualContent().then((sections) => {
      const mappedChapters = sections.map((section: any) => {
        let chapterId = section.title.toLowerCase()
          .replace('chapter ', 'chapter-')
          .replace(':', '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        
        if (chapterId === 'welcome') chapterId = 'welcome';
        else if (chapterId === 'terminology') chapterId = 'terminology';
        else if (chapterId.startsWith('chapter-1')) chapterId = 'chapter-1';
        else if (chapterId.startsWith('chapter-2')) chapterId = 'chapter-2';
        else if (chapterId.startsWith('chapter-3')) chapterId = 'chapter-3';
        else if (chapterId.startsWith('chapter-4')) chapterId = 'chapter-4';
        else if (chapterId.startsWith('chapter-5')) chapterId = 'chapter-5';
        else if (chapterId.startsWith('chapter-6')) chapterId = 'chapter-6';
        else if (chapterId.startsWith('chapter-7')) chapterId = 'chapter-7';
        else if (chapterId.startsWith('chapter-8')) chapterId = 'chapter-8';
        else if (chapterId.startsWith('chapter-9')) chapterId = 'chapter-9';
        else if (chapterId.startsWith('chapter-10')) chapterId = 'chapter-10';
        else if (chapterId.startsWith('chapter-11')) chapterId = 'chapter-11';
        else if (chapterId === 'appendices') chapterId = 'appendices';
        
        const chapterQuestions = manualQuestions.find(
          q => q.chapterId === chapterId
        )?.questions || [];

        return {
          ...section,
          chapterId,
          questions: chapterQuestions,
        };
      });
      setChapters(mappedChapters);
    });
  }, []);

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const progress = JSON.parse(saved);
      const counts: Record<string, number> = {};
      Object.entries(progress.chapters || {}).forEach(([chId, chData]: [string, any]) => {
        counts[chId] = Object.keys(chData.questions || {}).length;
      });
      setAnsweredCounts(counts);
    }
  }, []);

  // Update answered counts when answers change
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress = JSON.parse(saved);
        const counts: Record<string, number> = {};
        Object.entries(progress.chapters || {}).forEach(([chId, chData]: [string, any]) => {
          counts[chId] = Object.keys(chData.questions || {}).length;
        });
        setAnsweredCounts(counts);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('questionAnswered', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('questionAnswered', handleStorageChange);
    };
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
        setActiveChapter(chapterId);
        setTimeout(() => {
          const element = chapterRefs.current[chapterId];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      return newSet;
    });
  };

  const handleChapterClick = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      newSet.add(chapterId);
      return newSet;
    });
    setActiveChapter(chapterId);
    setTimeout(() => {
      const element = chapterRefs.current[chapterId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progressData = chapters.map(ch => ({
    id: ch.chapterId,
    title: ch.title,
    pageRange: ch.pageRange,
    answeredCount: answeredCounts[ch.chapterId] || 0,
    totalQuestions: ch.questions?.length || 4,
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 pt-20 pb-24">
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
            <FiBook className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Official NTA Documentation</span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            SPSV{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Official Manual
            </span>
          </h1>
          
          <p className={`text-xl text-gray-300 max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Complete guide to SPSV taxi driver regulations and requirements - Edition 8.0
          </p>
          
          <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <a
              href="/nta.pdf"
              download
              className="group px-6 py-3 bg-white rounded-xl font-bold text-gray-900 hover:bg-gray-100 transition-all flex items-center gap-3"
            >
              <FiDownload className="w-5 h-5 text-emerald-600" />
              Download PDF
            </a>
            <div className="flex items-center gap-2 text-gray-400">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Interactive chapters with practice questions</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Table of Contents */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <TableOfContents
                  chapters={progressData}
                  activeChapter={activeChapter}
                  onChapterClick={handleChapterClick}
                />
              </div>

              {/* Progress Tracker */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <ProgressTracker chapters={progressData} />
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {chapters.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiBook className="w-8 h-8 text-emerald-600 animate-pulse" />
                  </div>
                  <p className="text-gray-600 text-lg">Loading manual content...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredChapters.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                      <p className="text-gray-600">No chapters found matching your search.</p>
                    </div>
                  ) : (
                    filteredChapters.map((chapter) => (
                      <div
                        key={chapter.chapterId}
                        ref={(el) => {
                          chapterRefs.current[chapter.chapterId] = el;
                        }}
                      >
                        <ChapterSection
                          chapterId={chapter.chapterId}
                          title={chapter.title}
                          pageRange={chapter.pageRange}
                          content={chapter.pages || []}
                          questions={chapter.questions || []}
                          isExpanded={expandedChapters.has(chapter.chapterId)}
                          onToggle={handleToggleChapter}
                          answeredCount={answeredCounts[chapter.chapterId] || 0}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:scale-105 z-50 flex items-center justify-center"
          aria-label="Back to top"
        >
          <FiArrowUp className="w-6 h-6" />
        </button>
      )}
    </main>
  );
}
