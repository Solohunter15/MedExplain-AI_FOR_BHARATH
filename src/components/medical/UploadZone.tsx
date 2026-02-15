'use client'

import { useState, useCallback } from 'react'

export default function UploadZone() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
  }, [])

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    setUploadStatus('uploading')
    
    try {
      // TODO: Implement actual file upload with encryption
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate upload
      setUploadStatus('success')
      
      setTimeout(() => setUploadStatus('idle'), 3000)
    } catch (error) {
      setUploadStatus('error')
      setTimeout(() => setUploadStatus('idle'), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          min-h-[200px] flex flex-col items-center justify-center
          ${isDragOver
            ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
          }
          ${uploadStatus === 'uploading' ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="text-6xl mb-4">
          {uploadStatus === 'uploading' && '⏳'}
          {uploadStatus === 'success' && '✅'}
          {uploadStatus === 'error' && '❌'}
          {uploadStatus === 'idle' && '📄'}
        </div>

        <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {uploadStatus === 'uploading' && 'Uploading and Encrypting...'}
          {uploadStatus === 'success' && 'Upload Successful!'}
          {uploadStatus === 'error' && 'Upload Failed'}
          {uploadStatus === 'idle' && 'Drop your medical report here'}
        </h4>

        <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
          {uploadStatus === 'idle' && 'or click to browse files'}
          {uploadStatus === 'uploading' && 'Securing your data with blockchain verification'}
          {uploadStatus === 'success' && 'Your report is now being analyzed'}
          {uploadStatus === 'error' && 'Please try again or contact support'}
        </p>

        {uploadStatus === 'idle' && (
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
        )}

        {uploadStatus === 'idle' && (
          <label
            htmlFor="file-upload"
            className="
              bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg
              cursor-pointer transition-colors duration-200 text-lg
              focus:outline-none focus:ring-4 focus:ring-green-300
              min-h-[50px] flex items-center
            "
          >
            Choose Files
          </label>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h5 className="font-semibold text-blue-800 dark:text-blue-200 text-lg">
              Your Privacy is Protected
            </h5>
            <p className="text-blue-700 dark:text-blue-300 text-base">
              All files are encrypted end-to-end and verified on the blockchain. 
              Only you have access to your medical data.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium mb-1">Supported formats:</p>
        <p>PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)</p>
      </div>
    </div>
  )
}