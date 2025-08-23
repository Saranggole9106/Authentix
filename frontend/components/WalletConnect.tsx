'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@/contexts/WalletContext'
import { useAuth } from '@/contexts/AuthContext'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

const WalletConnect: React.FC = () => {
  const { account, isConnected, isConnecting, chainId, balance, connectWallet, disconnectWallet, switchToNetwork } = useWallet()
  const { isAuthenticated, login, logout, isLoading } = useAuth()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Address copied to clipboard!')
  }

  const openBlockExplorer = () => {
    if (!account) return
    
    const explorerUrl = chainId === 97 
      ? `https://testnet.bscscan.com/address/${account}`
      : `https://bscscan.com/address/${account}`
    
    window.open(explorerUrl, '_blank')
  }

  const handleConnect = async () => {
    if (!isConnected) {
      await connectWallet()
    } else if (!isAuthenticated) {
      await login()
    }
  }

  const handleDisconnect = () => {
    if (isAuthenticated) {
      logout()
    }
    disconnectWallet()
  }

  const switchToBSC = () => {
    switchToNetwork(97) // BSC Testnet
  }

  if (!isConnected) {
    return (
      <motion.button
        onClick={handleConnect}
        disabled={isConnecting}
        className="btn-primary flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Wallet className="w-5 h-5" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        {isConnecting && <div className="spinner ml-2" />}
      </motion.button>
    )
  }

  if (chainId && chainId !== 97 && chainId !== 56) {
    return (
      <motion.div
        className="bg-warning-50 border border-warning-200 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-warning-800 font-medium">Wrong Network</h3>
            <p className="text-warning-600 text-sm">Please switch to BSC network</p>
          </div>
          <button
            onClick={switchToBSC}
            className="bg-warning-500 hover:bg-warning-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Switch Network
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex items-center space-x-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Wallet Info */}
      <div className="hidden md:flex items-center space-x-3 bg-white rounded-lg border border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">
            {chainId === 97 ? 'BSC Testnet' : 'BSC Mainnet'}
          </span>
        </div>
        
        <div className="border-l border-gray-200 pl-3">
          <div className="text-sm font-medium text-gray-900">
            {formatAddress(account!)}
          </div>
          {balance && (
            <div className="text-xs text-gray-500">
              {parseFloat(balance).toFixed(4)} BNB
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => copyToClipboard(account!)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Copy address"
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={openBlockExplorer}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="View on explorer"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Auth Status */}
      {!isAuthenticated ? (
        <motion.button
          onClick={login}
          disabled={isLoading}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          {isLoading && <div className="spinner ml-2" />}
        </motion.button>
      ) : (
        <motion.button
          onClick={handleDisconnect}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default WalletConnect
