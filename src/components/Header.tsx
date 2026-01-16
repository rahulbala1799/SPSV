'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { FaBars, FaTimes } from 'react-icons/fa';

export interface HeaderProps {
  onEnrollClick?: () => void;
  onContactClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onEnrollClick, onContactClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="SPSV Mastery Class Dublin Logo"
              width={180}
              height={180}
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="/timetable"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Timetable
            </a>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Why Choose Us
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Success Stories
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+353892100704"
              className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Call Us
            </a>
            <a
              href="https://wa.me/353892100704"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              WhatsApp
            </a>
            <Button
              variant="primary"
              size="medium"
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
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

        {/* Mobile Collapsible Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-4">
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
              <button
                onClick={() => scrollToSection('features')}
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Success Stories
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Contact
              </button>
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-200">
                <a
                  href="tel:+353892100704"
                  className="w-full px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Call: +353 89 210 0704
                </a>
                <a
                  href="https://wa.me/353892100704"
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
                  onClick={handleEnroll}
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
