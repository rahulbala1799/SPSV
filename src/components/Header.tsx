'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { FaBars, FaTimes } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

export interface HeaderProps {
  onEnrollClick?: () => void;
  onContactClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onEnrollClick, onContactClick }) => {
  const { data: session } = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'>('STUDENT');
  
  const user = session?.user;
  
  // Fetch role from database
  React.useEffect(() => {
    if (user?.id) {
      fetch(`/api/users/${user.id}/role`)
        .then(res => res.json())
        .then(data => {
          if (data.role) setUserRole(data.role);
        })
        .catch(() => {
          // Default to STUDENT if fetch fails
          setUserRole('STUDENT');
        });
    }
  }, [user?.id]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleEnroll = () => {
    if (onEnrollClick) {
      onEnrollClick();
    } else {
      scrollToSection('enrollment');
    }
    setIsMenuOpen(false);
  };

  const handleContact = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      scrollToSection('contact');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="SPSV Mastery Class Dublin Logo"
              width={180}
              height={180}
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Navigation - Show only 3 items, rest in menu */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <a
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
            >
              Home
            </a>
            <a
              href="/timetable"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
            >
              Timetable
            </a>
            <a
              href="/test-guide"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
            >
              Test Guide
            </a>
            <a
              href="/spsv-manual"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
            >
              Official Manual
            </a>
            {/* More menu button for desktop */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap flex items-center gap-1"
            >
              More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 lg:px-6 py-2 lg:py-3 text-gray-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
                >
                  Dashboard
                </Link>
                {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                  <Link
                    href="/admin"
                    className="px-4 lg:px-6 py-2 lg:py-3 text-gray-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await authClient.signOut();
                    window.location.href = '/';
                  }}
                  className="px-4 lg:px-6 py-2 lg:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm lg:text-base whitespace-nowrap"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="tel:+353894934222"
                  className="px-4 lg:px-6 py-2 lg:py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm lg:text-base whitespace-nowrap"
                >
                  Call Us
                </a>
                <a
                  href="https://wa.me/353894934222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm lg:text-base whitespace-nowrap"
                >
                  WhatsApp
                </a>
                <Link
                  href="/login"
                  className="px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm lg:text-base whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    // Dispatch event to open enrollment modal
                    const event = new CustomEvent('openEnrollmentFromHeader');
                    window.dispatchEvent(event);
                  }}
                  className="text-sm lg:text-base whitespace-nowrap"
                >
                  Enroll Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-green-600 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Collapsible Menu - Mobile and Desktop */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-4">
              {/* Show Home, Timetable, Test Guide only if on mobile (they're already visible on desktop) */}
              <div className="md:hidden flex flex-col gap-4">
                <a
                  href="/"
                  className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="/timetable"
                  className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Timetable
                </a>
              <a
                href="/test-guide"
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Test Guide
              </a>
              <a
                href="/spsv-manual"
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Official Manual
              </a>
              </div>
              
              {/* Additional menu items for both mobile and desktop */}
              <button
                onClick={() => {
                  scrollToSection('features');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => {
                  scrollToSection('testimonials');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Success Stories
              </button>
              <button
                onClick={() => {
                  scrollToSection('contact');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Contact
              </button>
              
              {/* CTA buttons - only show on mobile */}
              <div className="md:hidden flex flex-col gap-3 pt-2 border-t border-gray-200">
                <a
                  href="tel:+353894934222"
                  className="w-full px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Call: +353 89 493 4222
                </a>
                <a
                  href="https://wa.me/353894934222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  WhatsApp Us
                </a>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    setIsMenuOpen(false);
                    const event = new CustomEvent('openEnrollmentFromHeader');
                    window.dispatchEvent(event);
                  }}
                  className="w-full"
                >
                  Enroll Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
