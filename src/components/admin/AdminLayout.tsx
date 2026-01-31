'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiClipboard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBarChart2,
  FiMessageSquare,
} from 'react-icons/fi'

interface AdminLayoutProps {
  children: React.ReactNode
  user?: any
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Students', href: '/admin/students', icon: FiUsers },
    { name: 'Content', href: '/admin/content', icon: FiFileText },
    { name: 'MCQ Builder', href: '/admin/mcq-builder', icon: FiClipboard },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo & Brand */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              SPSV Admin
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Taxi License Training</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.[0] || user?.email?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || user?.email || 'Admin'}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.role || 'Administrator'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <FiMenu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
