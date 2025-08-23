'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import WalletConnect from './WalletConnect'
import ThemeToggle from './ThemeToggle'
import { Award, Home, BookOpen, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Skills', href: '/skills', icon: BookOpen },
    { name: 'Assessments', href: '/assessments', icon: Award },
    ...(isAuthenticated ? [{ name: 'Dashboard', href: '/dashboard', icon: User }] : []),
  ]

  return (
    <motion.header
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AuthentiX</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Info, Theme Toggle & Wallet Connect */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user && (
              <motion.div
                className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.username || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.totalSkillsVerified} skills verified
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user.username || user.walletAddress.slice(2, 4)).charAt(0).toUpperCase()}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <WalletConnect />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {isAuthenticated && user && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {(user.username || user.walletAddress.slice(2, 4)).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {user.username || 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.totalSkillsVerified} skills verified
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header
