'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { Search, Filter, BookOpen, Clock, Users, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const SkillsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const skills = [
    {
      id: 1,
      name: 'JavaScript',
      description: 'Master the fundamentals of JavaScript programming',
      category: 'Programming',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 1250,
      rating: 4.8,
      color: 'from-yellow-400 to-yellow-600',
      icon: '⚡'
    },
    {
      id: 2,
      name: 'React',
      description: 'Build modern web applications with React',
      category: 'Frontend',
      levels: ['Intermediate', 'Advanced'],
      assessments: 2,
      participants: 890,
      rating: 4.9,
      color: 'from-blue-400 to-blue-600',
      icon: '⚛️'
    },
    {
      id: 3,
      name: 'Node.js',
      description: 'Server-side JavaScript development',
      category: 'Backend',
      levels: ['Intermediate', 'Advanced'],
      assessments: 2,
      participants: 675,
      rating: 4.7,
      color: 'from-green-400 to-green-600',
      icon: '🟢'
    },
    {
      id: 4,
      name: 'Solidity',
      description: 'Smart contract development for blockchain',
      category: 'Blockchain',
      levels: ['Advanced', 'Expert'],
      assessments: 1,
      participants: 320,
      rating: 4.6,
      color: 'from-purple-400 to-purple-600',
      icon: '⛓️'
    },
    {
      id: 5,
      name: 'Python',
      description: 'Versatile programming language for various applications',
      category: 'Programming',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 1450,
      rating: 4.8,
      color: 'from-blue-500 to-green-500',
      icon: '🐍'
    },
    {
      id: 6,
      name: 'Machine Learning',
      description: 'AI and machine learning fundamentals',
      category: 'AI/ML',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 580,
      rating: 4.7,
      color: 'from-pink-400 to-red-600',
      icon: '🤖'
    },
    // Design Skills
    {
      id: 7,
      name: 'UI/UX Design',
      description: 'User interface and experience design principles',
      category: 'Design',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 950,
      rating: 4.8,
      color: 'from-purple-400 to-pink-500',
      icon: '🎨'
    },
    {
      id: 8,
      name: 'Figma',
      description: 'Professional design and prototyping with Figma',
      category: 'Design',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 720,
      rating: 4.7,
      color: 'from-indigo-400 to-purple-500',
      icon: '📐'
    },
    {
      id: 9,
      name: 'Adobe Photoshop',
      description: 'Image editing and digital art creation',
      category: 'Design',
      levels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      assessments: 3,
      participants: 1100,
      rating: 4.6,
      color: 'from-blue-500 to-cyan-500',
      icon: '🖼️'
    },
    {
      id: 10,
      name: 'Adobe Illustrator',
      description: 'Vector graphics and logo design',
      category: 'Design',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 680,
      rating: 4.7,
      color: 'from-orange-400 to-red-500',
      icon: '✏️'
    },
    // Data Science Skills
    {
      id: 11,
      name: 'SQL',
      description: 'Database querying and data manipulation',
      category: 'Data Science',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 1350,
      rating: 4.8,
      color: 'from-blue-600 to-indigo-600',
      icon: '🗃️'
    },
    {
      id: 12,
      name: 'Python Data Analysis',
      description: 'Data analysis with pandas, numpy, and matplotlib',
      category: 'Data Science',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 3,
      participants: 890,
      rating: 4.7,
      color: 'from-green-500 to-teal-600',
      icon: '📊'
    },
    {
      id: 13,
      name: 'Tableau',
      description: 'Business intelligence and data visualization',
      category: 'Data Science',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 650,
      rating: 4.6,
      color: 'from-cyan-500 to-blue-600',
      icon: '📈'
    },
    {
      id: 14,
      name: 'Power BI',
      description: 'Microsoft business analytics and reporting',
      category: 'Data Science',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 520,
      rating: 4.5,
      color: 'from-yellow-500 to-orange-500',
      icon: '📋'
    },
    {
      id: 15,
      name: 'R Programming',
      description: 'Statistical computing and data analysis',
      category: 'Data Science',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 430,
      rating: 4.6,
      color: 'from-purple-500 to-indigo-600',
      icon: '📐'
    },
    // DevOps Skills
    {
      id: 16,
      name: 'Docker',
      description: 'Containerization and application deployment',
      category: 'DevOps',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 980,
      rating: 4.7,
      color: 'from-blue-500 to-cyan-500',
      icon: '🐳'
    },
    {
      id: 17,
      name: 'AWS',
      description: 'Amazon Web Services cloud platform',
      category: 'DevOps',
      levels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      assessments: 4,
      participants: 1200,
      rating: 4.8,
      color: 'from-orange-500 to-yellow-500',
      icon: '☁️'
    },
    {
      id: 18,
      name: 'Kubernetes',
      description: 'Container orchestration and management',
      category: 'DevOps',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 650,
      rating: 4.6,
      color: 'from-indigo-500 to-purple-600',
      icon: '⚙️'
    },
    {
      id: 19,
      name: 'CI/CD',
      description: 'Continuous integration and deployment pipelines',
      category: 'DevOps',
      levels: ['Intermediate', 'Advanced'],
      assessments: 2,
      participants: 750,
      rating: 4.7,
      color: 'from-green-500 to-emerald-600',
      icon: '🔄'
    },
    {
      id: 20,
      name: 'Terraform',
      description: 'Infrastructure as code and cloud automation',
      category: 'DevOps',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 480,
      rating: 4.5,
      color: 'from-purple-600 to-pink-600',
      icon: '🏗️'
    },
    // Digital Marketing Skills
    {
      id: 21,
      name: 'SEO',
      description: 'Search engine optimization and organic traffic',
      category: 'Digital Marketing',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 1150,
      rating: 4.6,
      color: 'from-green-500 to-teal-600',
      icon: '🔍'
    },
    {
      id: 22,
      name: 'Google Ads',
      description: 'Pay-per-click advertising and campaign management',
      category: 'Digital Marketing',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 850,
      rating: 4.5,
      color: 'from-blue-500 to-indigo-600',
      icon: '📢'
    },
    {
      id: 23,
      name: 'Social Media Marketing',
      description: 'Social platform strategy and content marketing',
      category: 'Digital Marketing',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 1300,
      rating: 4.7,
      color: 'from-pink-500 to-rose-600',
      icon: '📱'
    },
    {
      id: 24,
      name: 'Google Analytics',
      description: 'Web analytics and data-driven marketing insights',
      category: 'Digital Marketing',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 920,
      rating: 4.6,
      color: 'from-orange-500 to-red-600',
      icon: '📊'
    },
    {
      id: 25,
      name: 'Email Marketing',
      description: 'Email campaigns and automation strategies',
      category: 'Digital Marketing',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 680,
      rating: 4.4,
      color: 'from-cyan-500 to-blue-600',
      icon: '📧'
    },
    // Business Skills
    {
      id: 26,
      name: 'Project Management',
      description: 'Planning, executing, and delivering projects successfully',
      category: 'Business',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 1400,
      rating: 4.7,
      color: 'from-indigo-500 to-purple-600',
      icon: '📋'
    },
    {
      id: 27,
      name: 'Financial Analysis',
      description: 'Business finance and investment analysis',
      category: 'Business',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 620,
      rating: 4.5,
      color: 'from-green-600 to-emerald-700',
      icon: '💰'
    },
    {
      id: 28,
      name: 'Business Strategy',
      description: 'Strategic planning and competitive analysis',
      category: 'Business',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 540,
      rating: 4.6,
      color: 'from-blue-600 to-cyan-700',
      icon: '🎯'
    },
    {
      id: 29,
      name: 'Agile/Scrum',
      description: 'Agile methodologies and Scrum framework',
      category: 'Business',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 890,
      rating: 4.6,
      color: 'from-orange-500 to-red-600',
      icon: '🔄'
    },
    {
      id: 30,
      name: 'Leadership',
      description: 'Team leadership and management skills',
      category: 'Business',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 750,
      rating: 4.7,
      color: 'from-purple-600 to-pink-700',
      icon: '👥'
    },
    // Creative Skills
    {
      id: 31,
      name: 'Content Writing',
      description: 'Creative writing and content strategy',
      category: 'Creative',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 3,
      participants: 1200,
      rating: 4.6,
      color: 'from-teal-500 to-cyan-600',
      icon: '✍️'
    },
    {
      id: 32,
      name: 'Video Editing',
      description: 'Video production and post-production editing',
      category: 'Creative',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 780,
      rating: 4.5,
      color: 'from-red-500 to-pink-600',
      icon: '🎬'
    },
    {
      id: 33,
      name: 'Photography',
      description: 'Digital photography and image composition',
      category: 'Creative',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 950,
      rating: 4.7,
      color: 'from-yellow-500 to-orange-600',
      icon: '📸'
    },
    {
      id: 34,
      name: 'Copywriting',
      description: 'Persuasive writing for marketing and sales',
      category: 'Creative',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      assessments: 2,
      participants: 640,
      rating: 4.4,
      color: 'from-green-500 to-teal-600',
      icon: '📝'
    },
    {
      id: 35,
      name: 'Brand Design',
      description: 'Brand identity and visual communication',
      category: 'Creative',
      levels: ['Intermediate', 'Advanced', 'Expert'],
      assessments: 2,
      participants: 520,
      rating: 4.6,
      color: 'from-indigo-500 to-purple-600',
      icon: '🎨'
    }
  ]

  const categories = ['all', 'Programming', 'Frontend', 'Backend', 'Blockchain', 'AI/ML', 'Design', 'Data Science', 'DevOps', 'Digital Marketing', 'Business', 'Creative']
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || skill.levels.includes(selectedLevel)
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    
    return matchesSearch && matchesLevel && matchesCategory
  })

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
            Explore <span className="gradient-text">AuthentiX Skills</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Discover and verify your expertise across various domains. Take AI-powered assessments 
            and earn blockchain-backed credentials.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="card group hover-lift transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Card Header */}
              <div className={`h-32 bg-gradient-to-r ${skill.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-4 left-4">
                  <span className="text-3xl">{skill.icon}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {skill.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold">{skill.name}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 transition-colors duration-300">
                  {skill.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{skill.assessments} assessments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{skill.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{skill.rating}</span>
                  </div>
                </div>

                {/* Levels */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {skill.levels.map(level => (
                      <span
                        key={level}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full transition-colors duration-300"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/assessments?skill=${skill.name.toLowerCase()}`}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Take Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredSkills.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">No skills found</h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="mt-16 card bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white hover-lift"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Don't see your skill?
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            We're constantly adding new skills and assessments. 
            Request a new skill or suggest improvements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-300">
              Request Skill
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-all duration-300">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SkillsPage
