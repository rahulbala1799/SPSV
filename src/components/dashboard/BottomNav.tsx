'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiBook, FiClipboard, FiFlag, FiTrendingUp } from 'react-icons/fi'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: FiHome,
      active: pathname === '/dashboard'
    },
    {
      href: '/dashboard/chapters',
      label: 'Chapters',
      icon: FiBook,
      active: pathname?.startsWith('/dashboard/chapters')
    },
    {
      href: '/dashboard/tests',
      label: 'Tests',
      icon: FiClipboard,
      active: pathname?.startsWith('/dashboard/tests') || pathname?.startsWith('/dashboard/timed-tests')
    },
    {
      href: '/dashboard/flagged-questions',
      label: 'Flagged',
      icon: FiFlag,
      active: pathname === '/dashboard/flagged-questions'
    },
    {
      href: '/dashboard/progress',
      label: 'Progress',
      icon: FiTrendingUp,
      active: pathname === '/dashboard/progress'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.active

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                isActive
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></div>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
