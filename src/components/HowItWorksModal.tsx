'use client'

import { useState, useEffect } from 'react'
import { 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheck, 
  FiClock, 
  FiBook, 
  FiFlag, 
  FiTrendingUp,
  FiUsers,
  FiSmartphone,
  FiTarget,
  FiAward,
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight
} from 'react-icons/fi'

interface HowItWorksModalProps {
  isOpen: boolean
  onClose: () => void
  onEnroll?: () => void
}

export function HowItWorksModal({ isOpen, onClose, onEnroll }: HowItWorksModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(30)
  const [timerActive, setTimerActive] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      const timer = setTimeout(() => setTimerSeconds(s => s - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timerActive, timerSeconds])

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setQuizAnswer(null)
      setShowQuizResult(false)
      setTimerSeconds(30)
      setTimerActive(false)
    }
  }, [isOpen])

  const handleQuizAnswer = (index: number) => {
    setQuizAnswer(index)
    setShowQuizResult(true)
    setTimerActive(false)
  }

  const steps = [
    {
      id: 'intro',
      title: 'Your Path to SPSV Success',
      subtitle: 'A proven system combining expert instruction with smart practice'
    },
    {
      id: 'classroom',
      title: 'Step 1: Learn in the Classroom',
      subtitle: 'Expert instructors guide you through the material'
    },
    {
      id: 'chapters',
      title: 'Step 2: Practice by Chapter',
      subtitle: 'Reinforce what you learned with focused questions'
    },
    {
      id: 'timed-test',
      title: 'Step 3: Timed Mock Tests',
      subtitle: 'Simulate real exam conditions'
    },
    {
      id: 'flagging',
      title: 'Step 4: Flag & Review',
      subtitle: 'Never forget a difficult question'
    },
    {
      id: 'progress',
      title: 'Step 5: Track Your Progress',
      subtitle: 'Know exactly when you\'re ready'
    },
    {
      id: 'ready',
      title: 'You\'re Ready to Pass!',
      subtitle: 'Join our next class and start your journey'
    }
  ]

  if (!isOpen) return null

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'intro':
        return (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center">
              <FiPlay className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              How We Help You Pass
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              Our method combines the best of both worlds: expert classroom instruction with a powerful practice app. Here&apos;s how it works...
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: <FiUsers />, label: 'In-Person Classes' },
                { icon: <FiSmartphone />, label: 'Practice App' },
                { icon: <FiFlag />, label: 'Smart Review' },
                { icon: <FiTrendingUp />, label: 'Progress Tracking' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'classroom':
        return (
          <div className="py-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FiUsers className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Classroom Sessions</h3>
                  <p className="text-emerald-100">Dublin</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: '👨‍🏫', title: 'Expert Instructors', desc: 'Learn from tutors who know exactly what the exam requires' },
                  { icon: '🗣️', title: 'Ask Questions', desc: 'Get immediate answers to anything you don\'t understand' },
                  { icon: '📚', title: 'Structured Lessons', desc: 'Each topic covered thoroughly, chapter by chapter' },
                  { icon: '👥', title: 'Group Learning', desc: 'Learn alongside others, hear different perspectives' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-emerald-100 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-semibold text-amber-800">After each class...</p>
                <p className="text-amber-700 text-sm">You&apos;ll practice what you learned using the app. This reinforcement is key to remembering the material.</p>
              </div>
            </div>
          </div>
        )

      case 'chapters':
        return (
          <div className="py-6">
            <p className="text-gray-600 mb-6 text-center">
              After class, open the app and practice the chapter you just learned. Questions are organized to match classroom lessons.
            </p>
            
            {/* Interactive Chapter Demo */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {/* App Header Mock */}
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <FiBook className="w-5 h-5" />
                  <span className="font-semibold">Chapter Practice</span>
                </div>
              </div>
              
              {/* Chapter Selection */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-3">Select a chapter to practice:</p>
                <div className="space-y-2">
                  {[
                    { name: 'Industry Knowledge - Part 1', progress: 100, questions: 45 },
                    { name: 'Industry Knowledge - Part 2', progress: 75, questions: 38 },
                    { name: 'Dublin Routes & Navigation', progress: 45, questions: 52 },
                    { name: 'One-Way Streets', progress: 0, questions: 28 },
                  ].map((ch, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-xl border-2 transition-all ${
                        i === 2 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{ch.name}</span>
                        <span className="text-xs text-gray-500">{ch.questions} Q&apos;s</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                            style={{ width: `${ch.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{ch.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'timed-test':
        return (
          <div className="py-6">
            <p className="text-gray-600 mb-6 text-center">
              When you&apos;re ready, take timed mock tests that simulate real exam conditions. Try this mini example:
            </p>
            
            {/* Interactive Timed Test Demo */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {/* Timer Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-5 h-5" />
                    <span className="font-semibold">Timed Test</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                    <span className="font-mono font-bold">
                      00:{String(timerSeconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${(timerSeconds / 30) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Question */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">1</span>
                  <span className="text-sm text-gray-500">Question 1 of 25</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6">
                  What is the maximum fare a taxi driver can charge for a journey?
                </h4>
                
                <div className="space-y-3">
                  {[
                    'The fare shown on the taximeter',
                    'Any amount agreed with the passenger',
                    'A flat rate decided by the driver',
                    'Double the meter rate at night',
                  ].map((option, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (!showQuizResult) {
                          handleQuizAnswer(i)
                        }
                      }}
                      disabled={showQuizResult}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showQuizResult
                          ? i === 0
                            ? 'border-emerald-500 bg-emerald-50'
                            : quizAnswer === i
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-100 bg-gray-50'
                          : quizAnswer === i
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          showQuizResult && i === 0
                            ? 'bg-emerald-500 text-white'
                            : showQuizResult && quizAnswer === i && i !== 0
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-gray-800">{option}</span>
                        {showQuizResult && i === 0 && (
                          <FiCheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
                        )}
                        {showQuizResult && quizAnswer === i && i !== 0 && (
                          <FiXCircle className="w-5 h-5 text-red-500 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {showQuizResult && (
                  <div className={`mt-4 p-4 rounded-xl ${quizAnswer === 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <p className={`font-semibold ${quizAnswer === 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {quizAnswer === 0 ? '✓ Correct!' : '✗ Not quite right'}
                    </p>
                    <p className={`text-sm mt-1 ${quizAnswer === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      The fare must be the amount shown on the taximeter, which is regulated by the NTA. This is one of the most important regulations to know!
                    </p>
                  </div>
                )}

                {!timerActive && !showQuizResult && (
                  <button
                    onClick={() => setTimerActive(true)}
                    className="mt-4 w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Start Timer & Answer
                  </button>
                )}
              </div>
            </div>
          </div>
        )

      case 'flagging':
        return (
          <div className="py-6">
            <p className="text-gray-600 mb-6 text-center">
              Found a tricky question? Flag it for later review. The app remembers what you struggle with.
            </p>
            
            {/* Flagging Demo */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
                <div className="flex items-center gap-2">
                  <FiFlag className="w-5 h-5" />
                  <span className="font-semibold">Flagged Questions</span>
                  <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">5 flagged</span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {[
                  { topic: 'Dublin Routes', question: 'Shortest route from Heuston to Airport?', difficulty: 'Hard' },
                  { topic: 'One-Way Streets', question: 'Direction of traffic on Grafton St?', difficulty: 'Medium' },
                  { topic: 'Fare Calculation', question: 'Extra charge for airport pickup?', difficulty: 'Hard' },
                  { topic: 'Regulations', question: 'Maximum wait time before meter starts?', difficulty: 'Medium' },
                  { topic: 'Landmarks', question: 'Location of Christchurch Cathedral?', difficulty: 'Easy' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiFlag className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.question}</p>
                      <p className="text-xs text-gray-500">{item.topic}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      item.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                      item.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 border-t">
                <button className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold">
                  Review All Flagged Questions
                </button>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-semibold text-blue-800">Spaced Repetition</p>
                <p className="text-blue-700 text-sm">Flagged questions automatically come back at optimal intervals so you truly memorize them.</p>
              </div>
            </div>
          </div>
        )

      case 'progress':
        return (
          <div className="py-6">
            <p className="text-gray-600 mb-6 text-center">
              Your dashboard shows exactly where you stand. No more guessing if you&apos;re ready for the exam.
            </p>
            
            {/* Progress Dashboard Demo */}
            <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-2xl p-6 text-white mb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-emerald-100 text-sm">Overall Readiness</p>
                  <p className="text-4xl font-bold">78%</p>
                </div>
                <div className="w-20 h-20 relative">
                  <svg className="transform -rotate-90" width="80" height="80">
                    <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                    <circle cx="40" cy="40" r="35" stroke="white" strokeWidth="8" fill="none" 
                      strokeLinecap="round" strokeDasharray="220" strokeDashoffset="48" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiTarget className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">312</p>
                  <p className="text-xs text-emerald-100">Questions Done</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">86%</p>
                  <p className="text-xs text-emerald-100">Accuracy</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">14/18</p>
                  <p className="text-xs text-emerald-100">Chapters</p>
                </div>
              </div>
            </div>

            {/* Weak Areas */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiTarget className="w-4 h-4 text-amber-500" />
                Areas to Focus On
              </h4>
              <div className="space-y-3">
                {[
                  { topic: 'Dublin One-Way Streets', accuracy: 62, status: 'Needs Work' },
                  { topic: 'Fare Calculations', accuracy: 71, status: 'Almost There' },
                ].map((area, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">{area.topic}</span>
                        <span className="text-gray-500">{area.accuracy}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${area.accuracy < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${area.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'ready':
        return (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center animate-pulse">
              <FiAward className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              That&apos;s How You&apos;ll Pass!
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              Expert classroom instruction + structured practice + smart review = confidence on exam day.
            </p>
            
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <h4 className="font-bold text-gray-800 mb-4">What You Get:</h4>
              <div className="space-y-3 text-left">
                {[
                  'In-person classes in Dublin',
                  'Full access to the practice app',
                  '500+ practice questions',
                  'Timed mock tests',
                  'Flag & review system',
                  'Progress tracking dashboard',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onClose()
                onEnroll?.()
              }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Enquire About Classes
                <FiArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-sm text-gray-500">{steps[currentStep].subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="px-6 py-3 bg-gray-50 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentStep 
                  ? 'bg-emerald-500 w-8' 
                  : i < currentStep 
                  ? 'bg-emerald-300' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {renderStepContent()}
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <span className="text-sm text-gray-400">
            {currentStep + 1} of {steps.length}
          </span>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Next
              <FiChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose()
                onEnroll?.()
              }}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Get Started
              <FiArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
