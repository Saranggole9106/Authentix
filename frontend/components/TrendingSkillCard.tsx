'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, Zap } from 'lucide-react'
import Link from 'next/link'

interface TrendingSkillCardProps {
  skill: {
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
  index: number
}

const TrendingSkillCard: React.FC<TrendingSkillCardProps> = ({ skill, index }) => {
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'text-green-500 bg-green-100 dark:bg-green-900/30'
      case 'Medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
      case 'Low': return 'text-red-500 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group hover:scale-105 h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-xl flex items-center justify-center text-2xl`}>
            {skill.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {skill.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {skill.category}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDemandColor(skill.demand)}`}>
          {skill.demand} Demand
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {skill.description}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
            <p className="text-sm font-semibold text-green-500">{skill.growth}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Salary</p>
            <p className="text-sm font-semibold text-blue-500">{skill.avgSalary}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Job Openings</p>
            <p className="text-sm font-semibold text-purple-500">{skill.jobOpenings.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-orange-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Hot Skill</p>
            <p className="text-sm font-semibold text-orange-500">🔥 Trending</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/assessments?skill=${skill.name.toLowerCase()}`}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg mt-auto"
      >
        <span>Get Verified</span>
        <TrendingUp className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}

export default TrendingSkillCard
