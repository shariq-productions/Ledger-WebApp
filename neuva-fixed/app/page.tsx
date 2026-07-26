'use client'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'

export default function HomePage() {
  const { isAuthenticated, isChecking, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={logout}
      />
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-drawer' : 'ml-drawer-collapsed'
        }`}
      >
        <div className="p-6">
          <Dashboard />
        </div>
      </main>
    </div>
  )
}
