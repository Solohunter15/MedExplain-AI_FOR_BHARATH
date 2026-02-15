import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

// Helper to create WAV header for PCM data
function getWavHeader(dataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number) {
  const blockAlign = numChannels * bitsPerSample / 8
  const byteRate = sampleRate * blockAlign
  const buffer = new ArrayBuffer(44)
  const view = new DataView(buffer)
  
  view.setUint32(0, 0x52494646, false) // "RIFF"
  view.setUint32(4, 36 + dataLength, true)
  view.setUint32(8, 0x57415645, false) // "WAVE"
  view.setUint32(12, 0x666d7420, false) // "fmt "
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  view.setUint32(36, 0x64617461, false) // "data"
  view.setUint32(40, dataLength, true)
  
  return new Uint8Array(buffer)
}

export async function POST(request: NextRequest) {
  try {
    const { text, voiceName = 'Kore', language = 'en' } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

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
                prebuiltVoiceConfig: { voiceName: voiceName }
              }
            }
          }
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini TTS API error: ${response.statusText}`)
    }

    const data = await response.json()
    const audioContent = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

    if (!audioContent) {
      return NextResponse.json(
        { error: 'No audio content generated' },
        { status: 500 }
      )
    }

    // Decode base64 to binary
    const binaryString = Buffer.from(audioContent, 'base64').toString('binary')
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Add WAV header
    const wavHeader = getWavHeader(bytes.length, 24000, 1, 16)
    const wavBytes = new Uint8Array(wavHeader.length + bytes.length)
    wavBytes.set(wavHeader, 0)
    wavBytes.set(bytes, wavHeader.length)

    // Return audio file
    return new NextResponse(wavBytes, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': wavBytes.length.toString(),
      },
    })
  } catch (error) {
    console.error("TTS generation error:", error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}