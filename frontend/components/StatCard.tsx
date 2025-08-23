'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  trend?: string
  icon: React.ReactNode
  index?: number
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, index = 0 }) => {
  const isPositiveTrend = trend?.startsWith('+')
  
  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${
            isPositiveTrend ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositiveTrend ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">
          {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {title}
        </p>
      </div>
    </motion.div>
  )
}

export default StatCard
