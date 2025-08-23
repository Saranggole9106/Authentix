'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useWallet } from './WalletContext'
import axios from 'axios'
import toast from 'react-hot-toast'

interface User {
  id: string
  walletAddress: string
  username?: string
  email?: string
  profileImage?: string
  totalSkillsVerified: number
  reputation: number
  activeBadgesCount: number
  badges: Badge[]
  assessments: Assessment[]
  lastLogin: string
  createdAt: string
}

interface Badge {
  tokenId: number
  skillName: string
  skillLevel: string
  issueDate: string
  expiryDate?: string
  certificateHash: string
  isActive: boolean
  transactionHash: string
}

interface Assessment {
  assessmentId: string
  skillName: string
  score: number
  level: string
  completedAt: string
  aiEvaluation: string
  badgeEarned: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
  updateProfile: (data: { username?: string; email?: string }) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { account, signMessage, isConnected } = useWallet()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('deskill_token')
    const storedUser = localStorage.getItem('deskill_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
  }, [])

  // Clear auth state when wallet disconnects
  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      logout()
    }
  }, [isConnected, isAuthenticated])

  // Login with MetaMask
  const login = async () => {
    if (!account) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Get nonce from backend
      const nonceResponse = await axios.post(`${API_BASE_URL}/auth/nonce`, {
        walletAddress: account
      })

      const { message, nonce } = nonceResponse.data.data

      // Step 2: Sign the message with MetaMask
      const signature = await signMessage(message)

      // Step 3: Authenticate with backend
      const authResponse = await axios.post(`${API_BASE_URL}/auth/authenticate`, {
        walletAddress: account,
        signature
      })

      const { token: authToken, user: userData } = authResponse.data.data

      // Step 4: Store auth data
      setToken(authToken)
      setUser(userData)
      setIsAuthenticated(true)

      localStorage.setItem('deskill_token', authToken)
      localStorage.setItem('deskill_user', JSON.stringify(userData))

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      toast.success('Successfully logged in!')
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error('Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)

    localStorage.removeItem('deskill_token')
    localStorage.removeItem('deskill_user')

    delete axios.defaults.headers.common['Authorization']

    toast.success('Logged out successfully')
  }

  // Update user profile
  const updateProfile = async (data: { username?: string; email?: string }) => {
    if (!token) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const updatedUser = response.data.data.user
      setUser(prev => prev ? { ...prev, ...updatedUser } : null)
      
      localStorage.setItem('deskill_user', JSON.stringify({ ...user, ...updatedUser }))

      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Update profile error:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to update profile')
      }
      throw error
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!token) return

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const userData = response.data.data.user
      setUser(userData)
      localStorage.setItem('deskill_user', JSON.stringify(userData))
    } catch (error: any) {
      console.error('Refresh user error:', error)
      
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout()
      }
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
