'use client'

import React, { useEffect, useState } from 'react'
import { FiPlay, FiArrowRight, FiCheck } from 'react-icons/fi'
import { FeatureShowcaseGrid } from './demos/FeatureShowcase'

interface SaaSHeroProps {
  onGetStarted?: () => void
  onWatchDemo?: () => void
}

export function SaaSHero({ onGetStarted, onWatchDemo }: SaaSHeroProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const benefits = [
    'Expert Taxi Test Tutors',
    'Industry & Area Knowledge',
    'Practice App Included',
    'Dublin Classes'
  ]

  return (
    <section className="relative min-h-screen overflow-hidden" aria-label="Taxi Driver Test Training Dublin">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {mounted && [...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/50 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="text-center mb-12 md:mb-16">
          {/* Trust Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <FiCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Dublin&apos;s #1 Taxi Driver Test Training</span>
          </div>

          {/* Main Heading - SEO Optimized */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Pass Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient">
              Taxi Driver Test
            </span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-300">
              First Time, Guaranteed
            </span>
          </h1>

          {/* Subtitle - SEO Optimized */}
          <p className={`text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Expert <strong className="text-gray-300">SPSV taxi exam</strong> preparation in Dublin. 
            In-person classes cover <strong className="text-gray-300">Industry Knowledge</strong> &amp; <strong className="text-gray-300">Area Knowledge</strong>, 
            plus a practice app with 500+ questions to help you pass your <strong className="text-gray-300">taxi test</strong>.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Book Taxi Test Classes
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
            </button>
            <button
              onClick={onWatchDemo}
              className="group px-8 py-4 border-2 border-gray-700 hover:border-emerald-500/50 rounded-xl font-semibold text-white hover:bg-emerald-500/5 transition-all w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <FiPlay className="w-5 h-5 text-emerald-400" />
                See How We Help You Pass
              </span>
            </button>
          </div>

          {/* Quick Benefits */}
          <div className={`flex flex-wrap justify-center gap-4 md:gap-6 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <FiCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Showcase */}
        <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <FeatureShowcaseGrid />
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  )
}
