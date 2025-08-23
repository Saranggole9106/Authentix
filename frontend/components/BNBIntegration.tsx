'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Database, Zap, CheckCircle, ExternalLink, Copy, Globe } from 'lucide-react'

const BNBIntegration: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [networkStats, setNetworkStats] = useState({
    gasPrice: '3 Gwei',
    blockTime: '3s',
    tps: '2,000+',
    fees: '$0.10'
  })

  const contractAddress = '0x70a42e32b150Eab33dF5B89BbaBfcB3DeAdb9d24'

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const bnbFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Soulbound Tokens',
      description: 'Non-transferable NFT badges deployed on BNB Smart Chain',
      color: 'from-yellow-400 to-orange-500',
      details: 'ERC-721 compatible with transfer restrictions'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'BNB Greenfield Storage',
      description: 'Decentralized storage for assessment data and certificates',
      color: 'from-green-400 to-emerald-500',
      details: 'Immutable certificate storage with global accessibility'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast & Cheap',
      description: 'Lightning-fast transactions with minimal fees',
      color: 'from-blue-400 to-cyan-500',
      details: '3-second block time, ~$0.10 transaction fees'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Verification',
      description: 'Worldwide skill verification on a trusted network',
      color: 'from-purple-400 to-pink-500',
      details: 'Accessible from anywhere, verified by blockchain'
    }
  ]

  return (
    <motion.section
      className="py-20 relative bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-amber-900/10 dark:to-yellow-900/10"
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
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG89viNFBqmyhkyCO4W2UHVF-NV5Qn6AtTzg&s" 
              alt="BNB Chain" 
              className="w-12 h-12 mr-4"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Powered by <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">BNB Chain</span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            DeSkill leverages BNB Smart Chain and BNB Greenfield to provide secure, 
            fast, and cost-effective skill verification with decentralized storage.
          </p>
        </motion.div>

        {/* Network Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Gas Price</p>
            <p className="text-xl font-bold text-yellow-600">{networkStats.gasPrice}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Block Time</p>
            <p className="text-xl font-bold text-green-600">{networkStats.blockTime}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">TPS</p>
            <p className="text-xl font-bold text-blue-600">{networkStats.tps}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Fees</p>
            <p className="text-xl font-bold text-purple-600">{networkStats.fees}</p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {bnbFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl text-white flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {feature.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contract Information */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Smart Contract Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Network: BNB Smart Chain Testnet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Token: DeSkill Skill Badge (DSKILL)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Type: ERC-721 Soulbound Token</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Verified & Audited</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-3">Contract Address</h4>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg p-3">
                <code className="text-sm font-mono flex-1 break-all">
                  {contractAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(contractAddress)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`https://testnet.bscscan.com/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="View on BscScan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-sm text-white/80 mt-2">
                View contract on BscScan for full transparency
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why BNB Chain for Skill Verification?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                3-second block confirmations for instant badge issuance
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">💰</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cost Effective</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Minimal transaction fees make verification accessible to everyone
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Global Reach</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Worldwide accessibility with enterprise-grade reliability
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default BNBIntegration
