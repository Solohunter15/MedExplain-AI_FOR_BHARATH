// Application constants

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ml: 'മലയാളം',
  hi: 'हिन्दी'
} as const

export const COLORS = {
  MEDICAL_GREEN: '#2d7d32',
  PRIVACY_BLACK: '#1a1a1a',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3'
} as const

export const BLOCKCHAIN_NETWORKS = {
  POLYGON: 'polygon',
  ETHEREUM: 'ethereum'
} as const

export const ENCRYPTION_SETTINGS = {
  ALGORITHM: 'AES-256-GCM',
  KEY_LENGTH: 32,
  IV_LENGTH: 16
} as const

export const VOICE_SETTINGS = {
  DEFAULT_SPEED: 1.0,
  DEFAULT_PITCH: 1.0,
  DEFAULT_VOLUME: 0.8,
  MIN_SPEED: 0.5,
  MAX_SPEED: 2.0
} as const

export const ACCESSIBILITY = {
  MIN_TOUCH_TARGET: 44, // pixels
  FONT_SIZES: {
    small: '16px',
    medium: '18px',
    large: '22px',
    'extra-large': '28px'
  }
} as const