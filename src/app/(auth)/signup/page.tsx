'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiAlertCircle, FiArrowRight, FiLock } from 'react-icons/fi'

export default function SignupPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Redirect to login page after 3 seconds
    const timeout = setTimeout(() => {
      router.replace('/login')
    }, 3000)
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="SPSV Mastery"
                width={64}
                height={64}
                className="mx-auto"
              />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiLock className="w-8 h-8 text-amber-400" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Registration Not Available
            </h1>
            
            <p className="text-gray-400 mb-6">
              Public registration is disabled. Student accounts are created by administrators only.
            </p>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-400 text-left">
                  If you&apos;re enrolled in a class, your administrator will provide you with login credentials.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Redirecting to sign in page...
            </p>
            
            <Link 
              href="/login" 
              className="group w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              Go to Sign In
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
