'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from './Button';

export interface HeroProps {
  title: string;
  subtitle?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  primaryCTA = 'Get Started',
  secondaryCTA,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !backgroundRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const rate = scrolled * 0.5; // Parallax speed

      if (rect.bottom > 0) {
        backgroundRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative text-white py-20 px-4 overflow-hidden min-h-[600px] flex items-center"
    >
      {/* Parallax Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hero.png)',
          willChange: 'transform',
        }}
      ></div>
      
      {/* Green Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/75 via-green-700/75 to-green-800/75 z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 1)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-green-100" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 1)' }}>
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={onPrimaryClick}
            className="!bg-white !text-green-700 hover:!bg-green-50 font-bold border-2 border-white"
          >
            {primaryCTA}
          </Button>
          {secondaryCTA && (
            <Button
              variant="outline"
              size="large"
              onClick={onSecondaryClick}
              className="border-2 border-white text-white hover:bg-white hover:text-green-700 bg-transparent"
            >
              {secondaryCTA}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
