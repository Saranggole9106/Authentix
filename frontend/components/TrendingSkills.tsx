'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TrendingSkillCard from './TrendingSkillCard'
import { Flame, TrendingUp, RefreshCw } from 'lucide-react'

interface TrendingSkill {
  name: string
  icon: string
  category: string
  growth: string
  demand: 'High' | 'Medium' | 'Low'
  avgSalary: string
  jobOpenings: number
  color: string
  description: string
}

const TrendingSkills: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const trendingSkills: TrendingSkill[] = [
    {
      name: 'AI/Machine Learning',
      icon: '🤖',
      category: 'Artificial Intelligence',
      growth: '+45%',
      demand: 'High',
      avgSalary: '$130k',
      jobOpenings: 15420,
      color: 'from-pink-500 to-red-600',
      description: 'Build intelligent systems and predictive models with cutting-edge AI technologies'
    },
    {
      name: 'Blockchain/Web3',
      icon: '⛓️',
      category: 'Blockchain',
      growth: '+38%',
      demand: 'High',
      avgSalary: '$125k',
      jobOpenings: 8930,
      color: 'from-purple-500 to-indigo-600',
      description: 'Develop decentralized applications and smart contracts for the future of finance'
    },
    {
      name: 'Cloud Computing',
      icon: '☁️',
      category: 'DevOps',
      growth: '+32%',
      demand: 'High',
      avgSalary: '$115k',
      jobOpenings: 22150,
      color: 'from-blue-500 to-cyan-600',
      description: 'Master AWS, Azure, and GCP for scalable cloud infrastructure solutions'
    },
    {
      name: 'Cybersecurity',
      icon: '🛡️',
      category: 'Security',
      growth: '+28%',
      demand: 'High',
      avgSalary: '$120k',
      jobOpenings: 18760,
      color: 'from-green-500 to-emerald-600',
      description: 'Protect digital assets and infrastructure from evolving cyber threats'
    },
    {
      name: 'Data Science',
      icon: '📊',
      category: 'Analytics',
      growth: '+25%',
      demand: 'High',
      avgSalary: '$110k',
      jobOpenings: 12340,
      color: 'from-orange-500 to-yellow-600',
      description: 'Extract insights from big data using statistical analysis and machine learning'
    },
    {
      name: 'React/Frontend',
      icon: '⚛️',
      category: 'Frontend',
      growth: '+22%',
      demand: 'High',
      avgSalary: '$95k',
      jobOpenings: 28950,
      color: 'from-blue-400 to-blue-600',
      description: 'Create modern, responsive user interfaces with React and modern frameworks'
    }
  ]

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Update timestamp every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 60000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <motion.section
      className="py-20 relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <span className="gradient-text">Trending Skills</span> This Week
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Stay ahead of the curve with the most in-demand skills in today's job market. 
            Real-time data from industry reports and job postings.
          </p>
          
          {/* Market Update Indicator */}
          <motion.div
            className="flex items-center justify-center mt-6 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-md">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Data</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-md">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Skills Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg animate-pulse h-full flex flex-col"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {trendingSkills.map((skill, index) => (
              <TrendingSkillCard
                key={skill.name}
                skill={skill}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Want to see more trending skills or get personalized recommendations?
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Skills
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default TrendingSkills
