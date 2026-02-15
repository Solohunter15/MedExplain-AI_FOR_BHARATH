// Shared utility functions

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength - 3) + '...'
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    return file.type.includes(type)
  })
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// HIPAA compliance utilities
export const maskSensitiveData = (text: string): string => {
  // Mask potential PII in medical text
  return text
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, 'XXX-XX-XXXX') // SSN
    .replace(/\b\d{10,}\b/g, 'XXXXXXXXXX') // Phone numbers
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 'email@hidden.com') // Email
}

export const logAuditEvent = (event: string, userId: string, details: any) => {
  // In production, this would send to a HIPAA-compliant audit logging service
  console.log(`[AUDIT] ${new Date().toISOString()} - ${event}`, {
    userId,
    details: maskSensitiveData(JSON.stringify(details))
  })
}

// Accessibility utilities
export const announceToScreenReader = (message: string) => {
  if (typeof window === 'undefined') return
  
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const focusElement = (elementId: string) => {
  if (typeof window === 'undefined') return
  
  const element = document.getElementById(elementId)
  if (element) {
    element.focus()
  }
}

// Language utilities
export const getLanguageDirection = (language: 'en' | 'ml' | 'hi'): 'ltr' | 'rtl' => {
  // All supported languages use left-to-right
  return 'ltr'
}

export const translateText = async (text: string, targetLanguage: 'en' | 'ml' | 'hi'): Promise<string> => {
  // Placeholder for translation service integration
  // In production, this would integrate with a translation API
  console.log(`Translating "${text}" to ${targetLanguage}`)
  return text // Return original text for now
}