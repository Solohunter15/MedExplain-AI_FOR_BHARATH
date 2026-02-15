# Google Gemini API Integration Guide

## Overview
MedExplain AI integrates Google's Gemini 2.0 Flash model for advanced AI capabilities including natural language understanding, text-to-speech, and medical content analysis.

## Features

### 1. AI Chat Assistant
- Natural conversation about medical reports
- Simplified explanations for elderly users
- Context-aware responses
- Multi-turn conversations

### 2. Text-to-Speech (TTS)
- Natural voice synthesis using Gemini's audio generation
- Kore voice profile (soothing, clear)
- 24kHz audio quality
- WAV format output for browser compatibility

### 3. Wellness Plan Generation
- Personalized action plans based on medical reports
- Simple, actionable recommendations
- Formatted as easy-to-follow checklists

### 4. Medical Content Analysis
- Report summarization
- Key findings extraction
- Risk assessment
- Recommendations generation

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Important**: The `NEXT_PUBLIC_` prefix makes the key available to client-side code. For production, consider using a backend proxy to protect your API key.

### 3. API Endpoints

#### Text Generation
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
```

#### Audio Generation (TTS)
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
```

## Usage Examples

### Basic Text Generation

```typescript
const callGeminiText = async (prompt: string, systemInstruction = "") => {
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
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
};
```

### Text-to-Speech

```typescript
const callGeminiTTS = async (text: string) => {
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
  
  // Convert base64 to audio blob
  // Add WAV header for browser playback
  // Return audio URL
};
```

### Medical Analysis

```typescript
const analyzeMedicalReport = async (reportText: string) => {
  const prompt = `Analyze this medical report and provide:
1. A simple summary (2-3 sentences)
2. Key findings (bullet points)
3. Risk level (Low/Medium/High)
4. Recommendations

Report: ${reportText}`;

  const systemInstruction = `You are a medical AI assistant. 
Explain medical terms in simple language suitable for elderly patients. 
Always recommend consulting healthcare professionals for medical decisions.`;

  return await callGeminiText(prompt, systemInstruction);
};
```

## Best Practices

### 1. System Instructions
Always provide clear system instructions to guide the AI's behavior:

```typescript
const systemInstruction = `
You are a helpful, empathetic medical assistant for seniors.
- Use simple language
- Avoid medical jargon
- Keep responses short (max 3 sentences)
- Always recommend consulting doctors
- Be encouraging and supportive
`;
```

### 2. Prompt Engineering

**Good Prompt:**
```typescript
const prompt = `Based on this blood test showing glucose: 105 mg/dL, 
explain in simple terms what this means and what the patient should do.`;
```

**Better Prompt:**
```typescript
const prompt = `You are explaining to a 65-year-old patient with limited 
medical knowledge. Their fasting blood sugar is 105 mg/dL (normal range: 
70-100 mg/dL). Explain what this means and provide 2 simple action steps.`;
```

### 3. Error Handling

```typescript
try {
  const response = await callGeminiText(prompt);
  return response;
} catch (error) {
  console.error("Gemini API Error:", error);
  return "I'm having trouble connecting. Please try again.";
}
```

### 4. Rate Limiting

Gemini API has rate limits. Implement:
- Request queuing
- Retry logic with exponential backoff
- User feedback during processing

```typescript
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (fn: Function, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
};
```

### 5. Audio Processing

The TTS API returns raw PCM audio. Convert to WAV for browser playback:

```typescript
function getWavHeader(dataLength: number, sampleRate: number, 
                      numChannels: number, bitsPerSample: number) {
  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  
  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  
  // fmt chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  
  // data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataLength, true);
  
  return new Uint8Array(buffer);
}
```

## Security Considerations

### 1. API Key Protection

**Development:**
```bash
# .env.local (not committed to git)
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

**Production:**
- Use backend API routes to proxy requests
- Never expose API keys in client-side code
- Implement rate limiting per user
- Monitor API usage

### 2. Backend Proxy Example

```typescript
// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { prompt, systemInstruction } = await request.json();
  
  // Validate request
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
  }
  
  // Call Gemini API server-side
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
  return NextResponse.json(data);
}
```

### 3. Input Sanitization

```typescript
const sanitizeInput = (text: string): string => {
  // Remove potential injection attempts
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
    .slice(0, 5000); // Limit length
};
```

## Cost Optimization

### 1. Caching

```typescript
const cache = new Map<string, { response: string, timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

const getCachedOrFetch = async (prompt: string) => {
  const cached = cache.get(prompt);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  
  const response = await callGeminiText(prompt);
  cache.set(prompt, { response, timestamp: Date.now() });
  return response;
};
```

### 2. Request Batching

```typescript
const batchRequests = async (prompts: string[]) => {
  // Combine multiple prompts into one request
  const combinedPrompt = prompts.map((p, i) => `Query ${i + 1}: ${p}`).join('\n\n');
  const response = await callGeminiText(combinedPrompt);
  // Parse and split responses
  return response.split(/Query \d+:/);
};
```

## Testing

### Unit Tests

```typescript
import { callGeminiText } from './gemini-service';

describe('Gemini Integration', () => {
  it('should generate medical summary', async () => {
    const prompt = 'Explain what hemoglobin 14.2 g/dL means';
    const response = await callGeminiText(prompt);
    
    expect(response).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });
  
  it('should handle errors gracefully', async () => {
    const response = await callGeminiText('', 'invalid');
    expect(response).toContain('trouble connecting');
  });
});
```

## Troubleshooting

### Common Issues

**1. API Key Not Working**
- Verify key is correct
- Check API is enabled in Google Cloud Console
- Ensure billing is set up

**2. Audio Not Playing**
- Check WAV header is correct
- Verify browser supports audio/wav
- Check console for errors

**3. Rate Limit Errors**
- Implement exponential backoff
- Add request queuing
- Consider caching responses

**4. Slow Responses**
- Use streaming for long responses
- Implement loading states
- Consider response caching

## Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Best Practices](https://ai.google.dev/docs/best_practices)

## Support

For issues with Gemini integration:
1. Check API status: https://status.cloud.google.com/
2. Review error messages in console
3. Consult Gemini documentation
4. Open issue in project repository