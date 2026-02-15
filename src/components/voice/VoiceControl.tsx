'use client'

import { useState, useEffect } from 'react'
import { VOICE_SETTINGS } from '@/constants'

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setVoiceEnabled(true)
    }
  }, [])

  const startListening = () => {
    if (!voiceEnabled) return
    
    setIsListening(true)
    // TODO: Implement speech recognition
    setTimeout(() => setIsListening(false), 3000) // Simulate listening
  }

  const speak = (text: string) => {
    if (!voiceEnabled || !text) return

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = VOICE_SETTINGS.DEFAULT_SPEED
    utterance.pitch = VOICE_SETTINGS.DEFAULT_PITCH
    utterance.volume = VOICE_SETTINGS.DEFAULT_VOLUME
    
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  if (!voiceEnabled) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Voice features not supported in this browser
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={startListening}
        disabled={isListening || isSpeaking}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-lg
          min-h-[50px] transition-all duration-200
          ${isListening
            ? 'bg-red-600 text-white animate-pulse'
            : 'bg-green-600 hover:bg-green-700 text-white'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-4 focus:ring-green-300
        `}
        aria-label={isListening ? 'Listening...' : 'Start voice command'}
      >
        <span className="text-xl">
          {isListening ? '🎤' : '🗣️'}
        </span>
        <span>
          {isListening ? 'Listening...' : 'Voice Command'}
        </span>
      </button>

      <button
        onClick={() => speak('Welcome to MedExplain AI. How can I help you understand your health better today?')}
        disabled={isSpeaking || isListening}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-lg
          min-h-[50px] transition-all duration-200
          ${isSpeaking
            ? 'bg-blue-600 text-white animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-4 focus:ring-blue-300
        `}
        aria-label={isSpeaking ? 'Speaking...' : 'Test voice output'}
      >
        <span className="text-xl">
          {isSpeaking ? '🔊' : '🎵'}
        </span>
        <span>
          {isSpeaking ? 'Speaking...' : 'Test Voice'}
        </span>
      </button>

      {isSpeaking && (
        <button
          onClick={stopSpeaking}
          className="
            flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg
            bg-red-500 hover:bg-red-600 text-white
            min-h-[50px] transition-colors duration-200
            focus:outline-none focus:ring-4 focus:ring-red-300
          "
          aria-label="Stop speaking"
        >
          <span className="text-xl">⏹️</span>
          <span>Stop</span>
        </button>
      )}
    </div>
  )
}