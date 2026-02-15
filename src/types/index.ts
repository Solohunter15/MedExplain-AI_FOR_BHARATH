// Core application types

export interface User {
  id: string
  email: string
  preferredLanguage: 'en' | 'ml' | 'hi'
  accessibilitySettings: AccessibilitySettings
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  voiceEnabled: boolean
  highContrast: boolean
  reducedMotion: boolean
}

export interface MedicalReport {
  id: string
  userId: string
  filename: string
  uploadDate: Date
  analysisStatus: 'pending' | 'processing' | 'completed' | 'error'
  blockchainHash?: string
  encryptedContent: string
}

export interface AIAnalysis {
  id: string
  reportId: string
  summary: string
  keyFindings: string[]
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  language: string
  confidence: number
}

export interface Prescription {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  sideEffects: string[]
  interactions: string[]
}

export interface VoiceSettings {
  language: 'en' | 'ml' | 'hi'
  speed: number
  pitch: number
  volume: number
}

export interface BlockchainVerification {
  hash: string
  timestamp: Date
  network: 'polygon' | 'ethereum'
  verified: boolean
}