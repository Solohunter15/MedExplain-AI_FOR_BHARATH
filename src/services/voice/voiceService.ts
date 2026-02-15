// Multilingual voice synthesis and speech recognition service

import { VOICE_SETTINGS, SUPPORTED_LANGUAGES } from '@/constants'

export interface VoiceConfig {
  language: 'en' | 'ml' | 'hi'
  speed: number
  pitch: number
  volume: number
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  language: string
}

class VoiceService {
  private synthesis: SpeechSynthesis | null = null
  private recognition: any = null // SpeechRecognition
  private isListening = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis
      this.initializeSpeechRecognition()
    }
  }

  private initializeSpeechRecognition() {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
    }
  }

  async speak(text: string, config: Partial<VoiceConfig> = {}): Promise<void> {
    if (!this.synthesis || !text.trim()) {
      throw new Error('Speech synthesis not available or empty text')
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synthesis!.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Apply voice configuration
      utterance.rate = config.speed || VOICE_SETTINGS.DEFAULT_SPEED
      utterance.pitch = config.pitch || VOICE_SETTINGS.DEFAULT_PITCH
      utterance.volume = config.volume || VOICE_SETTINGS.DEFAULT_VOLUME
      
      // Set language-specific voice
      if (config.language) {
        const voice = this.getVoiceForLanguage(config.language)
        if (voice) {
          utterance.voice = voice
        }
      }

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`))

      this.synthesis!.speak(utterance)
    })
  }

  async listen(language: 'en' | 'ml' | 'hi' = 'en'): Promise<SpeechRecognitionResult> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available')
    }

    if (this.isListening) {
      throw new Error('Already listening')
    }

    return new Promise((resolve, reject) => {
      this.isListening = true
      
      // Configure recognition for the specified language
      this.recognition.lang = this.getLanguageCode(language)
      
      this.recognition.onresult = (event: any) => {
        this.isListening = false
        const result = event.results[0]
        
        resolve({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          language
        })
      }

      this.recognition.onerror = (event: any) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.recognition.start()
    })
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }

  private getVoiceForLanguage(language: 'en' | 'ml' | 'hi'): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices()
    const languageCode = this.getLanguageCode(language)
    
    // Try to find a voice that matches the language
    const matchingVoice = voices.find(voice => 
      voice.lang.startsWith(languageCode) || 
      voice.lang.includes(languageCode)
    )
    
    return matchingVoice || null
  }

  private getLanguageCode(language: 'en' | 'ml' | 'hi'): string {
    const languageCodes = {
      en: 'en-US',
      ml: 'ml-IN', // Malayalam (India)
      hi: 'hi-IN'  // Hindi (India)
    }
    
    return languageCodes[language]
  }

  // Text-to-speech for medical content with appropriate pacing
  async speakMedicalContent(content: string, language: 'en' | 'ml' | 'hi' = 'en'): Promise<void> {
    // Slower speed for medical content to ensure comprehension
    const medicalConfig: VoiceConfig = {
      language,
      speed: 0.8, // Slower than normal
      pitch: 1.0,
      volume: 0.9
    }

    // Break content into smaller chunks for better comprehension
    const sentences = this.splitIntoSentences(content)
    
    for (const sentence of sentences) {
      if (sentence.trim()) {
        await this.speak(sentence, medicalConfig)
        // Small pause between sentences
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  private splitIntoSentences(text: string): string[] {
    // Split by sentence endings, considering medical abbreviations
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
  }

  // Check if voice features are supported
  isVoiceSupported(): boolean {
    return !!(this.synthesis && this.recognition)
  }

  isSpeechSynthesisSupported(): boolean {
    return !!this.synthesis
  }

  isSpeechRecognitionSupported(): boolean {
    return !!this.recognition
  }
}

export const voiceService = new VoiceService()