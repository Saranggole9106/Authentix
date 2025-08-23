'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

interface WalletContextType {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  balance: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchToNetwork: (chainId: number) => Promise<void>
  signMessage: (message: string) => Promise<string>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

// Network configurations
const NETWORKS = {
  BSC_TESTNET: {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    blockExplorer: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'tBNB',
      decimals: 18,
    },
  },
  BSC_MAINNET: {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Get current account and network info
  const updateWalletInfo = async () => {
    if (!isMetaMaskInstalled()) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()
      
      if (accounts.length > 0) {
        const account = accounts[0].address
        const network = await provider.getNetwork()
        const balance = await provider.getBalance(account)
        
        setAccount(account)
        setChainId(Number(network.chainId))
        setBalance(ethers.formatEther(balance))
        setIsConnected(true)
      } else {
        setAccount(null)
        setChainId(null)
        setBalance(null)
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Error updating wallet info:', error)
    }
  }

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.')
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    setIsConnecting(true)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // Request account access
      await provider.send('eth_requestAccounts', [])
      
      await updateWalletInfo()
      
      toast.success('Wallet connected successfully!')
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      
      if (error.code === 4001) {
        toast.error('Connection rejected by user')
      } else {
        toast.error('Failed to connect wallet')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setChainId(null)
    setBalance(null)
    setIsConnected(false)
    toast.success('Wallet disconnected')
  }

  // Switch to specific network
  const switchToNetwork = async (targetChainId: number) => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed')
      return
    }

    try {
      const chainIdHex = `0x${targetChainId.toString(16)}`
      
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })
      
      toast.success('Network switched successfully!')
    } catch (error: any) {
      // If the network is not added to MetaMask, add it
      if (error.code === 4902) {
        try {
          const network = targetChainId === 97 ? NETWORKS.BSC_TESTNET : NETWORKS.BSC_MAINNET
          
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
              },
            ],
          })
          
          toast.success('Network added and switched successfully!')
        } catch (addError) {
          console.error('Error adding network:', addError)
          toast.error('Failed to add network')
        }
      } else {
        console.error('Error switching network:', error)
        toast.error('Failed to switch network')
      }
    }
  }

  // Sign a message
  const signMessage = async (message: string): Promise<string> => {
    if (!isMetaMaskInstalled() || !account) {
      throw new Error('Wallet not connected')
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(message)
      
      return signature
    } catch (error: any) {
      console.error('Error signing message:', error)
      
      if (error.code === 4001) {
        throw new Error('Message signing rejected by user')
      } else {
        throw new Error('Failed to sign message')
      }
    }
  }

  // Listen for account and network changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        updateWalletInfo()
      }
    }

    const handleChainChanged = () => {
      updateWalletInfo()
    }

    const handleDisconnect = () => {
      disconnectWallet()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', handleDisconnect)

    // Check if already connected
    updateWalletInfo()

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
        window.ethereum.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [])

  const value: WalletContextType = {
    account,
    isConnected,
    isConnecting,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    switchToNetwork,
    signMessage,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
