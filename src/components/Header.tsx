'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMenu, FiX, FiChevronDown, FiUser, FiArrowRight, FiBook, FiCalendar, FiHelpCircle, FiHome } from 'react-icons/fi';

export interface HeaderProps {
  onEnrollClick?: () => void;
  onContactClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onEnrollClick, onContactClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  // Auth removed - user state will be added when auth is reimplemented
  const user = null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  };

  const handleEnroll = () => {
    const event = new CustomEvent('openEnrollmentFromHeader');
    window.dispatchEvent(event);
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: <FiHome className="w-4 h-4" /> },
    { href: '/timetable', label: 'Timetable', icon: <FiCalendar className="w-4 h-4" /> },
    { href: '/test-guide', label: 'Test Guide', icon: <FiHelpCircle className="w-4 h-4" /> },
    { href: '/spsv-manual', label: 'Official Manual', icon: <FiBook className="w-4 h-4" /> },
  ];

  const moreLinks = [
    { action: () => scrollToSection('features'), label: 'Why Choose Us' },
    { action: () => scrollToSection('testimonials'), label: 'Success Stories' },
    { action: () => scrollToSection('contact'), label: 'Contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-900/5 border-b border-gray-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="SPSV Mastery Class Dublin - Taxi Driver Test Training"
                  width={48}
                  height={48}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className={`hidden sm:block transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                <div className="font-bold text-sm leading-tight">SPSV Mastery</div>
                <div className="text-xs opacity-70">Taxi Test Training</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  onBlur={() => setTimeout(() => setIsMoreOpen(false), 200)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1 ${
                    isScrolled 
                      ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  More
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isMoreOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-100 py-2 animate-fade-in">
                    {moreLinks.map((link, i) => (
                      <button
                        key={i}
                        onClick={link.action}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  {/* Sign In */}
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isScrolled 
                        ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </Link>
                  
                  {/* Enroll CTA */}
                  <button
                    onClick={handleEnroll}
                    className="group px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    Enroll Now
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="SPSV Mastery"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <div className="font-bold text-gray-900 text-sm">SPSV Mastery</div>
                <div className="text-xs text-gray-500">Taxi Test Training</div>
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto">
            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-medium"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-gray-400">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              
              {/* Divider */}
              <div className="!my-4 border-t border-gray-100" />
              
              {/* More Links */}
              {moreLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.action}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-medium"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Mobile CTA Section */}
            <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
              {/* Sign In */}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all font-medium"
                >
                  <FiUser className="w-5 h-5" />
                  Sign In
                </Link>
              )}
              
              {/* Primary CTA */}
              <button
                onClick={handleEnroll}
                className="w-full px-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                Enroll Now
                <FiArrowRight className="w-5 h-5" />
              </button>
              
              {/* Trust Badge */}
              <p className="text-center text-xs text-gray-500 pt-2">
                Dublin&apos;s Premier Taxi Test Training School
              </p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
