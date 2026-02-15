'use client'

import { useState, useEffect, useRef } from 'react'
import { X, MessageSquare, Sparkles, Loader, Mic } from 'lucide-react'

interface Message {
  role: 'user' | 'model'
  text: string
}

interface GeminiChatModalProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

export default function GeminiChatModal({ isOpen, onClose, initialMessage }: GeminiChatModalProps) {
  const [chatInput, setChatInput] = useState(initialMessage || '')
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Hello! I'm your health assistant. Ask me anything about your reports or general health terms." 
    }
  ])
  const [isThinking, setIsThinking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSubmit()
    }
  }, [initialMessage, isOpen])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const callGeminiText = async (prompt: string, systemInstruction = "") => {
    try {
      const response = await fetch(
        `/api/gemini/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, systemInstruction }),
        }
      )
      
      const data = await response.json()
      return data.text || "I couldn't generate a response. Please try again."
    } catch (error) {
      console.error("Gemini API Error:", error)
      return "Sorry, I'm having trouble connecting to the AI right now."
    }
  }

  const handleSubmit = async () => {
    if (!chatInput.trim()) return

    const userMsg: Message = { role: 'user', text: chatInput }
    setChatHistory(prev => [...prev, userMsg])
    setChatInput('')
    setIsThinking(true)

    const prompt = `User asked: "${userMsg.text}". Answer simply, as if talking to an elderly person. Keep it short (max 3 sentences).`
    const responseText = await callGeminiText(
      prompt, 
      "You are a helpful, empathetic medical assistant for seniors. Use simple language and always recommend consulting healthcare professionals for medical decisions."
    )

    setChatHistory(prev => [...prev, { role: 'model', text: responseText }])
    setIsThinking(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#2196f3] text-white rounded-t-3xl">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles size={20} /> MedExplain Assistant
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {chatHistory.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[#2196f3] text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex gap-2 items-center text-gray-500">
                <Loader size={16} className="animate-spin" /> Thinking...
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t rounded-b-3xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your health..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-[#2196f3] focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={isThinking}
            />
            <button
              onClick={handleSubmit}
              disabled={isThinking || !chatInput.trim()}
              className="bg-[#2196f3] text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <MessageSquare size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}