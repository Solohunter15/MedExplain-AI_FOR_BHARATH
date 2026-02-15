'use client'

import { useState, useEffect } from 'react'
import { blockchainService } from '@/services/blockchain/blockchainService'

interface VerificationBadgeProps {
  documentId: string
  contentHash: string
  network?: 'polygon' | 'ethereum'
}

export default function VerificationBadge({ 
  documentId, 
  contentHash, 
  network = 'polygon' 
}: VerificationBadgeProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verificationDetails, setVerificationDetails] = useState<any>(null)

  useEffect(() => {
    verifyDocument()
  }, [documentId, contentHash, network])

  const verifyDocument = async () => {
    try {
      setIsLoading(true)
      
      // Verify document hash on blockchain
      const verified = await blockchainService.verifyDocumentHash(
        documentId, 
        contentHash, 
        network
      )
      
      setIsVerified(verified)
      
      if (verified) {
        // Get additional verification details
        const details = await blockchainService.getDocumentInfo(documentId, network)
        setVerificationDetails(details)
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setIsVerified(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin text-2xl">⏳</div>
        <span className="text-gray-600 dark:text-gray-400">Verifying on blockchain...</span>
      </div>
    )
  }

  if (isVerified === null) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
        <span className="text-2xl">⚠️</span>
        <span className="text-yellow-800 dark:text-yellow-200">
          Verification status unknown
        </span>
      </div>
    )
  }

  return (
    <div className={`
      flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200
      ${isVerified 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      }
    `}>
      <div className="text-3xl">
        {isVerified ? '✅' : '❌'}
      </div>
      
      <div className="flex-1">
        <h4 className={`font-semibold text-lg ${
          isVerified 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
        }`}>
          {isVerified ? 'Blockchain Verified' : 'Verification Failed'}
        </h4>
        
        <p className={`text-sm ${
          isVerified 
            ? 'text-green-700 dark:text-green-300' 
            : 'text-red-700 dark:text-red-300'
        }`}>
          {isVerified 
            ? `Document integrity confirmed on ${network} network`
            : 'Document could not be verified on blockchain'
          }
        </p>
        
        {verificationDetails && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <p>Hash: {verificationDetails.contentHash.substring(0, 20)}...</p>
            <p>Stored: {new Date(verificationDetails.timestamp * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>
      
      <button
        onClick={verifyDocument}
        className="
          px-3 py-2 text-sm font-medium rounded-md
          bg-blue-600 hover:bg-blue-700 text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
        "
        aria-label="Re-verify document"
      >
        🔄 Verify Again
      </button>
    </div>
  )
}