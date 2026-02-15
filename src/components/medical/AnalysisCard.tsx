'use client'

import { useState } from 'react'
import { voiceService } from '@/services/voice/voiceService'
import { AIAnalysis } from '@/types'

interface AnalysisCardProps {
  analysis: AIAnalysis
  language: 'en' | 'ml' | 'hi'
}

export default function AnalysisCard({ analysis, language }: AnalysisCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = async (text: string) => {
    try {
      setIsSpeaking(true)
      await voiceService.speakMedicalContent(text, language)
    } catch (error) {
      console.error('Speech failed:', error)
    } finally {
      setIsSpeaking(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return '✅'
      case 'medium': return '⚠️'
      case 'high': return '🚨'
      default: return 'ℹ️'
    }
  }

  return (
    <div className="elder-friendly bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
          AI Analysis Results
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Risk Level Badge */}
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1
            ${getRiskLevelColor(analysis.riskLevel)}
          `}>
            <span>{getRiskIcon(analysis.riskLevel)}</span>
            <span className="capitalize">{analysis.riskLevel} Risk</span>
          </span>
          
          {/* Confidence Score */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(analysis.confidence * 100)}% confidence
          </span>
        </div>
      </div>

      {/* Summary Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-xl font-medium text-gray-800 dark:text-white">
            Summary
          </h4>
          <button
            onClick={() => handleSpeak(analysis.summary)}
            disabled={isSpeaking}
            className="
              flex items-center space-x-2 px-3 py-2 text-sm
              bg-blue-600 hover:bg-blue-700 text-white rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors duration-200
            "
            aria-label="Listen to summary"
          >
            <span>{isSpeaking ? '🔊' : '🎵'}</span>
            <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
          </button>
        </div>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Key Findings */}
      {analysis.keyFindings.length > 0 && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-xl font-medium text-gray-800 dark:text-white">
              Key Findings
            </h4>
            <button
              onClick={() => handleSpeak(analysis.keyFindings.join('. '))}
              disabled={isSpeaking}
              className="
                flex items-center space-x-2 px-3 py-2 text-sm
                bg-green-600 hover:bg-green-700 text-white rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-green-500
                transition-colors duration-200
              "
              aria-label="Listen to key findings"
            >
              <span>{isSpeaking ? '🔊' : '🎵'}</span>
              <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
            </button>
          </div>
          
          <ul className="space-y-3">
            {analysis.keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-green-600 text-xl mt-1">•</span>
                <span className="text-lg text-gray-700 dark:text-gray-300">
                  {finding}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-xl font-medium text-gray-800 dark:text-white">
              Recommendations
            </h4>
            <button
              onClick={() => handleSpeak(analysis.recommendations.join('. '))}
              disabled={isSpeaking}
              className="
                flex items-center space-x-2 px-3 py-2 text-sm
                bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition-colors duration-200
              "
              aria-label="Listen to recommendations"
            >
              <span>{isSpeaking ? '🔊' : '🎵'}</span>
              <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
            </button>
          </div>
          
          <ul className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-blue-600 text-xl mt-1">→</span>
                <span className="text-lg text-gray-700 dark:text-gray-300">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 rounded-b-lg">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Important:</strong> This AI analysis is for informational purposes only. 
            Always consult with qualified healthcare professionals for medical decisions and treatment.
          </p>
        </div>
      </div>
    </div>
  )
}