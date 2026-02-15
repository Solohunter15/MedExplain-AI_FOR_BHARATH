// Blockchain service for document verification on Polygon/Ethereum

import { ethers } from 'ethers'
import { BLOCKCHAIN_NETWORKS } from '@/constants'

export interface BlockchainVerification {
  hash: string
  transactionHash: string
  blockNumber: number
  timestamp: Date
  network: 'polygon' | 'ethereum'
  verified: boolean
}

export interface DocumentHash {
  documentId: string
  contentHash: string
  userAddress: string
  timestamp: number
}

class BlockchainService {
  private polygonProvider: ethers.JsonRpcProvider
  private ethereumProvider: ethers.JsonRpcProvider
  
  // Simple contract ABI for document hashing
  private contractABI = [
    'function storeDocumentHash(string memory documentId, string memory contentHash) public',
    'function getDocumentHash(string memory documentId) public view returns (string memory, address, uint256)',
    'function verifyDocument(string memory documentId, string memory contentHash) public view returns (bool)',
    'event DocumentStored(string indexed documentId, string contentHash, address indexed user, uint256 timestamp)'
  ]

  constructor() {
    this.polygonProvider = new ethers.JsonRpcProvider(
      process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com'
    )
    this.ethereumProvider = new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'
    )
  }

  async storeDocumentHash(
    documentId: string,
    contentHash: string,
    network: 'polygon' | 'ethereum' = 'polygon',
    privateKey?: string
  ): Promise<BlockchainVerification> {
    try {
      const provider = network === 'polygon' ? this.polygonProvider : this.ethereumProvider
      
      if (!privateKey) {
        throw new Error('Private key required for blockchain transactions')
      }

      const wallet = new ethers.Wallet(privateKey, provider)
      
      // Contract address would be deployed separately
      const contractAddress = this.getContractAddress(network)
      const contract = new ethers.Contract(contractAddress, this.contractABI, wallet)

      // Store document hash on blockchain
      const transaction = await contract.storeDocumentHash(documentId, contentHash)
      const receipt = await transaction.wait()

      return {
        hash: contentHash,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: new Date(),
        network,
        verified: true
      }
    } catch (error) {
      console.error('Blockchain storage failed:', error)
      throw new Error('Failed to store document hash on blockchain')
    }
  }

  async verifyDocumentHash(
    documentId: string,
    contentHash: string,
    network: 'polygon' | 'ethereum' = 'polygon'
  ): Promise<boolean> {
    try {
      const provider = network === 'polygon' ? this.polygonProvider : this.ethereumProvider
      const contractAddress = this.getContractAddress(network)
      const contract = new ethers.Contract(contractAddress, this.contractABI, provider)

      const isValid = await contract.verifyDocument(documentId, contentHash)
      return isValid
    } catch (error) {
      console.error('Blockchain verification failed:', error)
      return false
    }
  }

  async getDocumentInfo(
    documentId: string,
    network: 'polygon' | 'ethereum' = 'polygon'
  ): Promise<DocumentHash | null> {
    try {
      const provider = network === 'polygon' ? this.polygonProvider : this.ethereumProvider
      const contractAddress = this.getContractAddress(network)
      const contract = new ethers.Contract(contractAddress, this.contractABI, provider)

      const [contentHash, userAddress, timestamp] = await contract.getDocumentHash(documentId)
      
      if (!contentHash) {
        return null
      }

      return {
        documentId,
        contentHash,
        userAddress,
        timestamp: Number(timestamp)
      }
    } catch (error) {
      console.error('Failed to get document info:', error)
      return null
    }
  }

  async generateDocumentHash(content: string): Promise<string> {
    // Create a hash of the document content
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return `0x${hashHex}`
  }

  private getContractAddress(network: 'polygon' | 'ethereum'): string {
    // These would be the actual deployed contract addresses
    const addresses = {
      polygon: process.env.POLYGON_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
      ethereum: process.env.ETHEREUM_CONTRACT_ADDRESS || '0x0987654321098765432109876543210987654321'
    }
    
    return addresses[network]
  }

  // Utility method to check network status
  async getNetworkInfo(network: 'polygon' | 'ethereum' = 'polygon') {
    try {
      const provider = network === 'polygon' ? this.polygonProvider : this.ethereumProvider
      const blockNumber = await provider.getBlockNumber()
      const gasPrice = await provider.getFeeData()
      
      return {
        network,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
        connected: true
      }
    } catch (error) {
      console.error(`Failed to get ${network} network info:`, error)
      return {
        network,
        blockNumber: 0,
        gasPrice: '0',
        connected: false
      }
    }
  }
}

export const blockchainService = new BlockchainService()