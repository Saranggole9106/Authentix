'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Award, TrendingUp, Clock, Star, BookOpen, Users, ArrowRight, Calendar, Trophy, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Badge {
  tokenId: number
  skillName: string
  skillLevel: string
  issueDate: string
  isActive: boolean
  transactionHash: string
}

interface Assessment {
  assessmentId: string
  skillName: string
  score: number
  level: string
  completedAt: string
  badgeEarned: boolean
}

const DashboardPage: React.FC = () => {
  const { isAuthenticated, user, refreshUser } = useAuth()
  const router = useRouter()
  const [badges, setBadges] = useState<Badge[]>([])
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    fetchDashboardData()
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      await refreshUser()
      
      const token = localStorage.getItem('deskill_token')
      if (!token) {
        setLoading(false)
        return
      }
      
      // Fetch user badges
      try {
        const badgesResponse = await axios.get(`${API_BASE_URL}/auth/badges`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setBadges(badgesResponse.data.data.badges || [])
      } catch (badgeError) {
        console.log('No badges found or user not authenticated')
        setBadges([])
      }

      // Fetch recent assessments
      try {
        const assessmentsResponse = await axios.get(`${API_BASE_URL}/assessments/user/history?limit=5`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setRecentAssessments(assessmentsResponse.data.data.submissions || [])
      } catch (assessmentError) {
        console.log('No assessment history found or user not authenticated')
        setRecentAssessments([])
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      // Don't show error toast for authentication issues
      if (error.response?.status !== 401) {
        toast.error('Failed to load dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSkillIcon = (skillName: string) => {
    const icons: { [key: string]: string } = {
      'javascript': '⚡',
      'react': '⚛️',
      'node.js': '🟢',
      'solidity': '⛓️',
      'python': '🐍',
      'machine learning': '🤖'
    }
    return icons[skillName.toLowerCase()] || '📚'
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-black dark:to-slate-900 transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Welcome back{user?.username ? `, ${user.username}` : ''}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Track your skill verification progress and manage your blockchain credentials.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 transition-colors duration-300">
            <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1 transition-colors duration-300">
              {user?.totalSkillsVerified || 0}
            </div>
            <div className="text-blue-700 dark:text-blue-300 text-sm transition-colors duration-300">Skills Verified</div>
          </div>

          <div className="card p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-700 transition-colors duration-300">
            <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1 transition-colors duration-300">
              {user?.activeBadgesCount || 0}
            </div>
            <div className="text-green-700 dark:text-green-300 text-sm transition-colors duration-300">Active Badges</div>
          </div>

          <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 transition-colors duration-300">
            <div className="w-12 h-12 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1 transition-colors duration-300">
              {user?.reputation || 0}
            </div>
            <div className="text-purple-700 dark:text-purple-300 text-sm transition-colors duration-300">Reputation</div>
          </div>

          <div className="card p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 transition-colors duration-300">
            <div className="w-12 h-12 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1 transition-colors duration-300">
              {recentAssessments.length}
            </div>
            <div className="text-orange-700 dark:text-orange-300 text-sm transition-colors duration-300">Assessments Taken</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Badges */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Your Skill Badges</h2>
                <Link href="/badges" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300">
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : badges.length > 0 ? (
                <div className="space-y-4">
                  {badges.slice(0, 5).map((badge, index) => (
                    <motion.div
                      key={badge.tokenId}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="text-2xl">
                        {getSkillIcon(badge.skillName)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{badge.skillName}</h3>
                          <span className={`badge ${getLevelColor(badge.skillLevel)}`}>
                            {badge.skillLevel}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(badge.issueDate).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>Token #{badge.tokenId}</span>
                          </span>
                        </div>
                      </div>
                      <a
                        href={`https://testnet.bscscan.com/tx/${badge.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">No badges yet</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">Take assessments to earn your first skill badge!</p>
                  <Link href="/assessments" className="btn-primary">
                    Browse Assessments
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Recent Activity */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/assessments" className="w-full btn-primary flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Take Assessment</span>
                </Link>
                <Link href="/skills" className="w-full btn-outline flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Browse Skills</span>
                </Link>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Recent Activity</h2>
              {recentAssessments.length > 0 ? (
                <div className="space-y-3">
                  {recentAssessments.slice(0, 3).map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{assessment.skillName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Score: {assessment.score}%</div>
                      </div>
                      <div className="text-right">
                        {assessment.badgeEarned && (
                          <Award className="w-5 h-5 text-green-500 mb-1" />
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          {new Date(assessment.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          className="mt-8 card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Skill Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['JavaScript', 'React', 'Node.js', 'Python', 'Solidity', 'Machine Learning'].map((skill, index) => {
              const userHasSkill = badges.some(badge => badge.skillName === skill)
              const skillBadge = badges.find(badge => badge.skillName === skill)
              
              return (
                <div key={skill} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-xl">{getSkillIcon(skill)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{skill}</h3>
                      {userHasSkill && skillBadge && (
                        <span className={`badge ${getLevelColor(skillBadge.skillLevel)}`}>
                          {skillBadge.skillLevel}
                        </span>
                      )}
                    </div>
                  </div>
                  {userHasSkill ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  ) : (
                    <Link 
                      href={`/assessments?skill=${skill.toLowerCase()}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300"
                    >
                      Take Assessment →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
