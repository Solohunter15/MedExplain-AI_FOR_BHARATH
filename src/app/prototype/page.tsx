'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Shield, FileText, Pill, Clock, ChevronRight, Upload, CheckCircle, AlertTriangle, ArrowLeft, Globe, Search, MoreVertical, Share2, Download, Trash2, X, Activity, Lock, Sparkles, MessageSquare, PlayCircle, StopCircle, Loader } from 'lucide-react';

/**
 * MEDEXPLAIN AI - PROTOTYPE v2
 * Integrated with Google Gemini API
 */

// --- Design Token Constants ---
const COLORS = {
  primary: '#2d7d32',
  secondary: '#1a1a1a',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  background: '#f6f6f6',
  white: '#ffffff',
  surface: '#ffffff'
};

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', icon: '🇺🇸', label: 'Select Language' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', icon: '🇮🇳', label: 'भाषा चुनें' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', icon: '🇮🇳', label: 'ഭാഷ തിരഞ്ഞെടുക്കുക' }
];

// --- Mock Data ---
const MOCK_DATA = {
  reports: [
    {
      id: 'REP-2026-001',
      title: 'Blood Test Analysis',
      date: '2026-02-05',
      type: 'Pathology',
      risk: 'Low',
      hash: '0x7d2a...4f1e',
      network: 'Polygon',
      verified: true,
      summary: 'Your blood test results indicate you are generally healthy. Hemoglobin and cholesterol levels are within the normal range. However, your fasting blood sugar (105 mg/dL) is slightly elevated, indicating a pre-diabetic range.',
      findings: [
        { label: 'Hemoglobin', value: '14.2 g/dL', status: 'Normal', color: 'success' },
        { label: 'Fasting Blood Sugar', value: '105 mg/dL', status: 'Pre-diabetic', color: 'warning' },
        { label: 'Total Cholesterol', value: '180 mg/dL', status: 'Normal', color: 'success' }
      ],
      recommendations: 'Reduce intake of refined sugars and carbohydrates. Incorporate 30 minutes of daily walking. Schedule a follow-up HbA1c test in 3 months.'
    },
    {
      id: 'REP-2026-002',
      title: 'Chest X-Ray PA View',
      date: '2026-01-20',
      type: 'Radiology',
      risk: 'Low',
      hash: '0x9a1b...3c8d',
      network: 'Polygon',
      verified: true,
      summary: 'The chest X-ray is clear. There are no signs of infection, fluid buildup (pleural effusion), or heart enlargement (cardiomegaly). The lung fields are clear.',
      findings: [
        { label: 'Lung Fields', value: 'Clear', status: 'Normal', color: 'success' },
        { label: 'Heart Size', value: 'Normal', status: 'Normal', color: 'success' }
      ],
      recommendations: 'No further action required unless symptoms persist.'
    }
  ],
  prescriptions: [
    {
      id: 'RX-001',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      instruction: 'Take after meals',
      doctor: 'Dr. Sarah Smith',
      date: '2026-02-01'
    },
    {
      id: 'RX-002',
      medication: 'Atorvastatin',
      dosage: '10mg',
      frequency: 'Once daily',
      instruction: 'Take at night',
      doctor: 'Dr. Sarah Smith',
      date: '2026-02-01'
    }
  ],
  timeline: [
    { date: 'Feb 05, 2026', title: 'Blood Test Report', type: 'report', risk: 'Low' },
    { date: 'Feb 01, 2026', title: 'Prescription: Metformin', type: 'rx', risk: 'info' },
    { date: 'Jan 20, 2026', title: 'Chest X-Ray', type: 'report', risk: 'Low' },
    { date: 'Jan 15, 2026', title: 'General Checkup', type: 'visit', risk: 'info' }
  ]
};

// --- Gemini API Helper ---
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const callGeminiText = async (prompt: string, systemInstruction = "") => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI right now.";
  }
};

// Helper to create WAV header for PCM data
function getWavHeader(dataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number) {
  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataLength, true);
  
  return new Uint8Array(buffer);
}

const callGeminiTTS = async (text: string, setAudioSrc: (src: string) => void, setIsPlaying: (playing: boolean) => void) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Kore" }
              }
            }
          }
        }),
      }
    );
    
    const data = await response.json();
    const audioContent = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (audioContent) {
      const binaryString = window.atob(audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const wavHeader = getWavHeader(bytes.length, 24000, 1, 16);
      const wavBytes = new Uint8Array(wavHeader.length + bytes.length);
      wavBytes.set(wavHeader, 0);
      wavBytes.set(bytes, wavHeader.length);
      
      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);
      setIsPlaying(true);
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

// --- Reusable Components ---
const Button = ({ children, onClick, variant = 'primary', className = '', size = 'md', icon: Icon, disabled = false }: any) => {
  const sizes = {
    sm: "h-[44px] px-4 text-sm",
    md: "h-[50px] px-6 text-base",
    lg: "h-[60px] px-8 text-lg font-bold"
  };
  
  const variants = {
    primary: `bg-[#2d7d32] text-white hover:bg-[#256a29] shadow-md active:scale-95`,
    secondary: `bg-[#1a1a1a] text-white hover:bg-[#333333] shadow-md active:scale-95`,
    outline: `border-2 border-[#2d7d32] text-[#2d7d32] bg-transparent hover:bg-[#f0f9f0]`,
    ghost: `bg-transparent text-[#1a1a1a] hover:bg-gray-100`,
    gemini: `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md active:scale-95 hover:opacity-90`,
    danger: `bg-[#f44336] text-white hover:bg-[#d32f2f]`
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl transition-all flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon size={size === 'lg' ? 24 : 20} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }: any) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, color = 'success', className = '' }: any) => {
  const colors = {
    success: 'bg-[#e8f5e9] text-[#2d7d32] border-[#2d7d32]',
    warning: 'bg-[#fff3e0] text-[#ff9800] border-[#ff9800]',
    error: 'bg-[#ffebee] text-[#f44336] border-[#f44336]',
    info: 'bg-[#e3f2fd] text-[#2196f3] border-[#2196f3]',
    neutral: 'bg-gray-100 text-gray-600 border-gray-300',
    ai: 'bg-purple-100 text-purple-700 border-purple-200'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

const SectionHeader = ({ title, icon: Icon, action }: any) => (
  <div className="flex items-center justify-between mb-4 mt-2">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="text-[#2d7d32]" size={24} />}
      <h2 className="text-xl font-bold text-[#1a1a1a]">{title}</h2>
    </div>
    {action}
  </div>
);

// --- Main Application Component ---
export default function MedExplainPrototype() {
  const [currentScreen, setCurrentScreen] = useState('language');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [activeTab, setActiveTab] = useState('upload');
  const [isListening, setIsListening] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // AI State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: 'model', text: "Hello! I'm your health assistant. Ask me anything about your reports or general health terms." }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [wellnessPlan, setWellnessPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  
  // Audio State
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // --- Voice & AI Functions ---
  const handleAiChatSubmit = async () => {
    if (!aiChatInput.trim()) return;
    
    const userMsg = { role: 'user', text: aiChatInput };
    setAiChatHistory(prev => [...prev, userMsg]);
    setAiChatInput('');
    setIsAiThinking(true);
    
    const prompt = `User asked: "${userMsg.text}". Answer simply, as if talking to an elderly person. Keep it short (max 3 sentences).`;
    const responseText = await callGeminiText(prompt, "You are a helpful, empathetic medical assistant for seniors.");
    
    setAiChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    setIsAiThinking(false);
  };
  
  const generateWellnessPlan = async (report: any) => {
    setIsGeneratingPlan(true);
    const prompt = `Based on this medical summary: "${report.summary}" and findings: ${JSON.stringify(report.findings)}, create a simple 3-step wellness action plan. Format as a bulleted list.`;
    const plan = await callGeminiText(prompt, "Provide a simple, encouraging checklist.");
    setWellnessPlan(plan);
    setIsGeneratingPlan(false);
  };
  
  const handleGeminiTTS = async (text: string) => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }
    
    showNotification("Generating natural voice... ✨", "info");
    await callGeminiTTS(text, setAudioSrc, setIsPlaying);
  };
  
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play().catch(e => console.error("Play error", e));
    }
  }, [audioSrc]);
  
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setShowAiModal(true);
        setAiChatInput("What does my last report mean?");
      }, 2000);
    }
  };
  
  const showNotification = (msg: string, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };
  
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setWellnessPlan(null);
    setCurrentScreen('analysis');
  };
  
  // Render screens (simplified for brevity - full implementation would include all screens)
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.background }}>
      {/* Toast Notifications */}
      <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-white ${n.type === 'info' ? 'bg-[#2196f3]' : 'bg-[#2d7d32]'}`}>
            {n.type === 'info' ? <Mic size={20} className="animate-pulse"/> : <CheckCircle size={20} />}
            {n.msg}
          </div>
        ))}
      </div>
      
      {/* AI Chat Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b flex justify-between items-center bg-[#2196f3] text-white rounded-t-3xl">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={20} /> MedExplain Assistant
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-2 hover:bg-white/20 rounded-full">
                <X size={20}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {aiChatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#2196f3] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex gap-2 items-center text-gray-500">
                    <Loader size={16} className="animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t rounded-b-3xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  placeholder="Ask about your health..."
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#2196f3] focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAiChatSubmit()}
                />
                <button
                  onClick={handleAiChatSubmit}
                  className="bg-[#2196f3] text-white p-3 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <MessageSquare size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto min-h-screen bg-[#f6f6f6] relative shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#2d7d32]">
          MedExplain AI Prototype
        </h1>
        
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">Gemini AI Integration Demo</h2>
            <p className="text-gray-600 mb-4">
              This prototype demonstrates Google Gemini API integration with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>AI-powered chat assistant</li>
              <li>Text-to-Speech (TTS) with natural voice</li>
              <li>Wellness plan generation</li>
              <li>Medical report analysis</li>
            </ul>
          </Card>
          
          <Button
            variant="gemini"
            size="lg"
            className="w-full"
            icon={MessageSquare}
            onClick={() => setShowAiModal(true)}
          >
            Open AI Assistant
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            icon={Mic}
            onClick={toggleVoice}
          >
            {isListening ? 'Listening...' : 'Test Voice Input'}
          </Button>
          
          {MOCK_DATA.reports.map(report => (
            <Card key={report.id} onClick={() => handleViewReport(report)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.date}</p>
                </div>
                <Badge color={report.risk === 'Low' ? 'success' : 'warning'}>
                  {report.risk} Risk
                </Badge>
              </div>
            </Card>
          ))}
        </div>
        
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
      </div>
    </div>
  );
}