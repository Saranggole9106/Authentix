'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import LiveStats from '@/components/LiveStats'
import TrendingSkills from '@/components/TrendingSkills'
import BNBIntegration from '@/components/BNBIntegration'
import { Award, Shield, Zap, Users, ArrowRight, CheckCircle, Star, Cpu, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Assessment',
      description: 'Advanced AI evaluates your skills through comprehensive tests and real-world scenarios.',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      hoverColor: 'hover:shadow-blue-500/25'
    },
    {
      icon: Shield,
      title: 'Soulbound Tokens',
      description: 'Non-transferable NFT badges that represent your verified skills on the blockchain.',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      hoverColor: 'hover:shadow-purple-500/25'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Get your skills verified instantly with immutable blockchain-backed credentials.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      hoverColor: 'hover:shadow-emerald-500/25'
    },
    {
      icon: Users,
      title: 'Decentralized Trust',
      description: 'Build a reputation that follows you everywhere with tamper-proof skill records.',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      hoverColor: 'hover:shadow-orange-500/25'
    }
  ]

  const stats = [
    { label: 'Skills Verified', value: '10,000+' },
    { label: 'Active Users', value: '2,500+' },
    { label: 'Badges Issued', value: '15,000+' },
    { label: 'Success Rate', value: '98%' }
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-black dark:to-slate-900 transition-colors duration-300 relative overflow-hidden">
        
        <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-5xl mx-auto">
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="gradient-text dark:bg-gradient-to-r dark:from-green-400 dark:via-emerald-400 dark:to-blue-400 dark:bg-clip-text dark:text-transparent">AuthentiX</span>
            </motion.h1>
            
            <motion.h2
              className="text-xl md:text-2xl text-blue-600 dark:text-green-400 font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              AI-Powered Skill Verification
            </motion.h2>
            
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-blue-600 dark:text-green-400 font-semibold">AI-powered assessments</span> and{' '}
              <span className="text-blue-600 dark:text-green-400 font-semibold">blockchain technology</span> to create{' '}
              <span className="text-blue-600 dark:text-green-400 font-semibold">Soulbound Tokens</span> that represent your verified skills. 
              Build your decentralized reputation with cutting-edge technology.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary flex items-center space-x-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link href="/skills" className="btn-primary flex items-center space-x-2">
                  <span>Start Verifying Skills</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              
              <Link href="/skills" className="btn-outline">
                Browse Skills
              </Link>
            </motion.div>
          </div>

          {/* Hero Animation */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="relative mx-auto max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Stats Section */}
                <div className="floating-card p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      >
                        <div className="text-2xl md:text-3xl font-bold organix-glow mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-teal-300">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* 3D Isometric Visual */}
                <div className="relative h-80 isometric-3d">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Central Pyramid */}
                    <div className="relative">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-24 h-24 floating-card"
                          style={{
                            transform: `rotateY(${i * 90}deg) translateZ(60px)`,
                          }}
                          animate={{
                            y: [-5, 5, -5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg opacity-80"></div>
                        </motion.div>
                      ))}
                      
                      {/* Orbiting Elements */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={`orbit-${i}`}
                          className="absolute w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                            marginLeft: '-16px',
                            marginTop: '-16px',
                          }}
                          animate={{
                            rotate: [0, 360],
                            x: [0, 80 * Math.cos((i * 60) * Math.PI / 180)],
                            y: [0, 80 * Math.sin((i * 60) * Math.PI / 180)],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "linear"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Statistics Dashboard */}
      <LiveStats />

      {/* Trending Skills Section */}
      <TrendingSkills />

      {/* BNB Chain Integration */}
      <BNBIntegration />

      {/* Features Section */}
      <section className="py-20 relative bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
              Why Choose <span className="gradient-text">AuthentiX</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Experience the future of skill verification with blockchain technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 border border-gray-100 dark:border-slate-700"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div 
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-purple-900/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight transition-colors duration-300">
              Verify Your <span className="gradient-text">Skills</span>
              <br />
              Earn <span className="gradient-text">Blockchain</span> Badges
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Take AI-powered assessments and earn Soulbound Token badges that prove your expertise 
              on the blockchain. Build your decentralized professional identity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your MetaMask wallet and sign in to the platform securely.',
                icon: Shield,
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                title: 'Take Assessment',
                description: 'Complete AI-powered skill assessments tailored to your expertise level.',
                icon: Award,
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '03',
                title: 'Earn Badge',
                description: 'Receive your Soulbound Token badge on BNB Smart Chain as proof of skill.',
                icon: Star,
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:scale-105 h-full flex flex-col">
                  <div className={`absolute top-6 right-6 text-5xl font-bold text-gray-100 dark:text-slate-700 opacity-50`}>
                    {item.step}
                  </div>
                  <div className="relative flex-1 flex flex-col">
                    <div 
                      className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300`}
                    >
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 z-20">
                    <ArrowRight className="w-6 h-6 text-blue-400 animate-pulse" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="card rounded-3xl p-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover-lift"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get <span className="text-white">Verified</span>?
              </h2>
              <p className="text-lg mb-6 text-blue-100">
                Join thousands of professionals who have already verified their skills on the blockchain.
              </p>
              <p className="text-lg mb-6 text-blue-100">
                Start building your <span className="text-white font-semibold">decentralized reputation</span> today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link href="/assessments" className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center space-x-2">
                    <span>Take Assessment</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link href="/skills" className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
                
                <Link href="/skills" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-all duration-300">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AuthentiX</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300 mb-4 max-w-md transition-colors duration-300">
                Decentralized skill verification platform powered by AI assessments and blockchain technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 dark:text-gray-200 tracking-wider uppercase mb-4 transition-colors duration-300">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/skills" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Browse Skills</Link></li>
                <li><Link href="/assessments" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Take Assessments</Link></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Leaderboard</a></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 dark:text-gray-200 tracking-wider uppercase mb-4 transition-colors duration-300">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
            
          <div className="mt-8 pt-8 border-t border-gray-800 dark:border-slate-700 transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">
                &copy; 2024 AuthentiX. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}

export default HomePage
