'use client'

import { useState } from 'react'
import UploadZone from './medical/UploadZone'
import VoiceControl from './voice/VoiceControl'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'upload' | 'reports' | 'prescriptions'>('upload')

  const tabs = [
    { id: 'upload', label: 'Upload Report', icon: '📄' },
    { id: 'reports', label: 'My Reports', icon: '📊' },
    { id: 'prescriptions', label: 'Prescriptions', icon: '💊' }
  ]

  return (
    <div className="elder-friendly bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Voice Control */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <VoiceControl />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6" aria-label="Dashboard navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-4 px-2 border-b-2 font-medium text-lg
                min-h-[60px] flex items-center space-x-2
                ${activeTab === tab.id
                  ? 'border-green-600 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
                focus:outline-none focus:ring-4 focus:ring-green-300 rounded-t-lg
              `}
              aria-selected={activeTab === tab.id}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'upload' && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Upload Medical Report
            </h3>
            <UploadZone />
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Your Medical Reports
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No reports uploaded yet. Upload your first medical report to get started.
            </p>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Prescription Intelligence
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Upload a prescription to get detailed explanations about your medications.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}