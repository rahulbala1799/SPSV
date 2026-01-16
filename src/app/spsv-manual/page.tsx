'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { ChapterSection } from '@/components/manual/ChapterSection';
import { TableOfContents } from '@/components/manual/TableOfContents';
import { ProgressTracker } from '@/components/manual/ProgressTracker';
import { manualQuestions } from '@/data/manualQuestions';
import { FaDownload, FaSearch, FaArrowUp } from 'react-icons/fa';

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
  const chapterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load content on mount
  useEffect(() => {
    loadManualContent().then((sections) => {
      // Map sections to chapters with questions
      const mappedChapters = sections.map((section: any) => {
        const chapterId = section.title.toLowerCase()
          .replace('chapter ', 'chapter-')
          .replace(':', '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        
        // Find questions for this chapter
        const chapterQuestions = manualQuestions.find(
          q => q.chapterId === chapterId || 
          (chapterId === 'welcome' && q.chapterId === 'welcome') ||
          (chapterId === 'terminology' && q.chapterId === 'terminology') ||
          (chapterId === 'appendices' && q.chapterId === 'appendices')
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
      
      // Count answered questions per chapter
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
    // Also listen for custom events from ChapterQuestions
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
        // Scroll to chapter
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
    setExpandedChapters(prev => new Set(prev).add(chapterId));
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

  // Filter chapters based on search
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SPSV Official Manual</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-6">
            Complete guide to SPSV regulations and requirements - Edition 8.0
          </p>
          <a
            href="/nta.pdf"
            download
            className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            <FaDownload />
            Download PDF
          </a>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Table of Contents & Progress */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Table of Contents */}
              <TableOfContents
                chapters={progressData}
                activeChapter={activeChapter}
                onChapterClick={handleChapterClick}
              />

              {/* Progress Tracker */}
              <ProgressTracker chapters={progressData} />
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {chapters.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading manual content...</p>
                </div>
              ) : (
                <div>
                  {filteredChapters.length === 0 ? (
                    <div className="text-center py-12">
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
          className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
          aria-label="Back to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </main>
  );
}
