'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { Clock, Users, Award, Play, Lock, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Assessment {
  _id: string
  skillName: string
  title: string
  description: string
  skillLevel: string
  duration: number
  passingScore: number
  totalPoints: number
  questions: any[]
  tags: string[]
  isActive: boolean
}

const AssessmentsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const skillFilter = searchParams.get('skill')

  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState(skillFilter || 'all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchAssessments()
  }, [selectedSkill, selectedLevel])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedSkill !== 'all') params.append('skillName', selectedSkill)
      if (selectedLevel !== 'all') params.append('skillLevel', selectedLevel)

      const response = await axios.get(`${API_BASE_URL}/assessments?${params}`)
      setAssessments(response.data.data.assessments)
    } catch (error) {
      console.error('Error fetching assessments:', error)
      toast.error('Failed to load assessments')
    } finally {
      setLoading(false)
    }
  }

  const startAssessment = (assessmentId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to take assessments')
      return
    }
    router.push(`/assessments/${assessmentId}`)
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

  const skills = ['all', 'JavaScript', 'React', 'Node.js', 'Solidity', 'Python', 'Machine Learning']
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-black dark:to-slate-900 transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Skill <span className="gradient-text">Assessments</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Take AI-powered assessments to verify your skills and earn Soulbound Token badges 
            on the blockchain.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {skills.map(skill => (
                  <option key={skill} value={skill}>
                    {skill === 'all' ? 'All Skills' : skill}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Assessment Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessments.map((assessment, index) => (
              <motion.div
                key={assessment._id}
                className="card group hover-lift transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getSkillIcon(assessment.skillName)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{assessment.skillName}</p>
                      </div>
                    </div>
                    <span className={`badge ${getLevelColor(assessment.skillLevel)}`}>
                      {assessment.skillLevel}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 transition-colors duration-300">
                    {assessment.description}
                  </p>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        {assessment.duration}m
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        {assessment.questions.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        {assessment.passingScore}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Pass Rate</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {assessment.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => startAssessment(assessment._id)}
                    disabled={!isAuthenticated}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      isAuthenticated
                        ? 'btn-primary'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAuthenticated ? (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Assessment</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In Required</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && assessments.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">No assessments found</h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Try adjusting your filters or check back later</p>
          </motion.div>
        )}

        {/* Authentication CTA */}
        {!isAuthenticated && (
          <motion.div
            className="mt-16 card bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white hover-lift"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Verified?
            </h2>
            <p className="text-lg mb-6 text-blue-100">
              Connect your wallet and start taking assessments to earn blockchain-backed skill badges.
            </p>
            <Link href="/" className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center space-x-2">
              <span>Connect Wallet</span>
            </Link>
          </motion.div>
        )}

        {/* User Progress */}
        {isAuthenticated && user && (
          <motion.div
            className="mt-16 card p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {user.totalSkillsVerified}
                </div>
                <div className="text-blue-800 font-medium">Skills Verified</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {user.activeBadgesCount}
                </div>
                <div className="text-green-800 font-medium">Active Badges</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {user.reputation}
                </div>
                <div className="text-purple-800 font-medium">Reputation</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AssessmentsPage
