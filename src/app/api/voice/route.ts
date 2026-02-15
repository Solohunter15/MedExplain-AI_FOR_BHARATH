import { NextRequest, NextResponse } from 'next/server'
import { logAuditEvent } from '@/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, language = 'en', userId, action } = body

    if (!text || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log voice interaction
    logAuditEvent('voice_interaction', userId, {
      action,
      language,
      textLength: text.length
    })

    // In production, this would integrate with advanced TTS services
    // For now, return configuration for client-side speech synthesis
    const voiceConfig = {
      language,
      speed: 0.8, // Slower for medical content
      pitch: 1.0,
      volume: 0.9
    }

    return NextResponse.json({
      success: true,
      voiceConfig,
      message: 'Voice configuration ready'
    })

  } catch (error) {
    console.error('Voice service error:', error)
    return NextResponse.json(
      { error: 'Voice service failed' },
      { status: 500 }
    )
  }
}

// Handle speech-to-text results
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { transcript, confidence, language, userId } = body

    if (!transcript || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log speech recognition event
    logAuditEvent('speech_recognition', userId, {
      language,
      confidence,
      transcriptLength: transcript.length
    })

    // Process the voice command (simplified)
    let response = 'I heard you say: ' + transcript

    if (transcript.toLowerCase().includes('upload')) {
      response = 'I can help you upload a medical report. Please use the upload button or drag and drop your file.'
    } else if (transcript.toLowerCase().includes('explain')) {
      response = 'I can explain your medical reports in simple terms. Please upload a report first.'
    } else if (transcript.toLowerCase().includes('help')) {
      response = 'I can help you understand medical reports, prescriptions, and health information. What would you like to know?'
    }

    return NextResponse.json({
      success: true,
      response,
      originalTranscript: transcript,
      confidence
    })

  } catch (error) {
    console.error('Speech processing error:', error)
    return NextResponse.json(
      { error: 'Speech processing failed' },
      { status: 500 }
    )
  }
}