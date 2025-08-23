'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from './StatCard'
import { Users, Target, Award, TrendingUp } from 'lucide-react'

interface PlatformStats {
  activeUsers: number
  skillsVerified: number
  badgesIssued: number
  successRate: number
  trends: {
    activeUsers: string
    skillsVerified: string
    badgesIssued: string
    successRate: string
  }
}

const LiveStats: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats>({
    activeUsers: 2847,
    skillsVerified: 15234,
    badgesIssued: 8956,
    successRate: 94,
    trends: {
      activeUsers: '+12%',
      skillsVerified: '+8%',
      badgesIssued: '+15%',
      successRate: '+2%'
    }
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching real-time data
    const fetchStats = async () => {
      try {
        // In a real implementation, this would fetch from your API
        // const response = await fetch('/api/stats')
        // const data = await response.json()
        
        // For now, simulate real-time updates with slight variations
        const baseStats = {
          activeUsers: 2847,
          skillsVerified: 15234,
          badgesIssued: 8956,
          successRate: 94
        }

        // Add small random variations to simulate real-time updates
        const variation = () => Math.floor(Math.random() * 10) - 5
        
        setStats({
          activeUsers: baseStats.activeUsers + variation(),
          skillsVerified: baseStats.skillsVerified + Math.floor(Math.random() * 50),
          badgesIssued: baseStats.badgesIssued + Math.floor(Math.random() * 20),
          successRate: Math.min(100, baseStats.successRate + (Math.random() * 2 - 1)),
          trends: {
            activeUsers: '+12%',
            skillsVerified: '+8%',
            badgesIssued: '+15%',
            successRate: '+2%'
          }
        })
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setIsLoading(false)
      }
    }

    fetchStats()
    
    // Update stats every 30 seconds to simulate real-time data
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const statsData = [
    {
      title: 'Active Users',
      value: isLoading ? '...' : stats.activeUsers.toLocaleString(),
      trend: stats.trends.activeUsers,
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Skills Verified',
      value: isLoading ? '...' : stats.skillsVerified.toLocaleString(),
      trend: stats.trends.skillsVerified,
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Badges Issued',
      value: isLoading ? '...' : stats.badgesIssued.toLocaleString(),
      trend: stats.trends.badgesIssued,
      icon: <Award className="w-6 h-6" />
    },
    {
      title: 'Success Rate',
      value: isLoading ? '...' : `${Math.round(stats.successRate)}%`,
      trend: stats.trends.successRate,
      icon: <TrendingUp className="w-6 h-6" />
    }
  ]

  return (
    <motion.section
      className="py-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
            Platform <span className="gradient-text">Statistics</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Real-time insights into our growing community of skill verification
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live Data</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default LiveStats
