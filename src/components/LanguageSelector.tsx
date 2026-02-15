'use client'

import { useState } from 'react'
import { SUPPORTED_LANGUAGES } from '@/constants'

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ml' | 'hi'>('en')

  const handleLanguageChange = (language: 'en' | 'ml' | 'hi') => {
    setSelectedLanguage(language)
    // TODO: Implement language context update
  }

  return (
    <div className="elder-friendly bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Select Your Language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as 'en' | 'ml' | 'hi')}
            className={`
              p-6 rounded-lg border-2 transition-all duration-200
              min-h-[60px] text-xl font-medium
              ${selectedLanguage === code
                ? 'border-green-600 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 text-gray-700 dark:text-gray-300'
              }
              focus:outline-none focus:ring-4 focus:ring-green-300
              voice-active
            `}
            aria-label={`Select ${name} language`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}