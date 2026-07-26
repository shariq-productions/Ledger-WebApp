'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface AuthContextType {
  isAuthenticated: boolean
  isChecking: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // The auth cookie is httpOnly, so it can never be read from
    // document.cookie on the client. We have to ask the server whether
    // the request is authenticated instead.
    const checkAuth = async () => {
      try {
        await api.get('/auth/me')
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }
    checkAuth()
  }, [])

  const login = () => {
    // The httpOnly cookie is already set by the server via the
    // Set-Cookie header on the /api/auth/login response. Nothing to do
    // here except update local state and navigate.
    setIsAuthenticated(true)
    router.push('/')
  }

  const logout = async () => {
    try {
      // We can't clear an httpOnly cookie from client JS, so we call an
      // endpoint that clears it for us.
      await api.post('/auth/logout')
    } finally {
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isChecking, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
