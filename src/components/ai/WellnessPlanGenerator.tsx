'use client'

import { useState } from 'react'
import { Sparkles, Loader, X } from 'lucide-react'

interface WellnessPlanGeneratorProps {
  reportSummary: string
  findings: any[]
  onClose?: () => void
}

export default function WellnessPlanGenerator({ 
  reportSummary, 
  findings,
  onClose 
}: WellnessPlanGeneratorProps) {
  const [wellnessPlan, setWellnessPlan] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePlan = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/gemini/wellness-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: reportSummary,
          findings: findings
        })
      })
      
      const data = await response.json()
      setWellnessPlan(data.plan)
    } catch (error) {
      console.error('Failed to generate wellness plan:', error)
      setWellnessPlan('Unable to generate plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100">
      {!wellnessPlan ? (
        <div className="text-center">
          <h3 className="font-bold text-[#1a1a1a] mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            AI Wellness Plan
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Get a personalized daily checklist based on this report.
          </p>
          <button
            onClick={generatePlan}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md active:scale-95 hover:opacity-90 rounded-xl h-[50px] px-6 text-base transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Create Action Plan ✨
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-purple-800 flex items-center gap-2">
              <Sparkles size={18} /> Your Action Plan
            </h3>
            {onClose && (
              <button 
                onClick={() => setWellnessPlan(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close plan"
              >
                <X size={16}/>
              </button>
            )}
          </div>
          <div className="prose prose-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-medium">
            {wellnessPlan}
          </div>
        </div>
      )}
    </div>
  )
}