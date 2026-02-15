import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { summary, findings } = await request.json()

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary is required' },
        { status: 400 }
      )
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const prompt = `Based on this medical summary: "${summary}" and findings: ${JSON.stringify(findings)}, create a simple 3-step wellness action plan. 

Format as a bulleted list with:
- Clear, actionable steps
- Simple language for elderly patients
- Encouraging tone
- Specific timeframes where appropriate

Example format:
• Step 1: [Action] - [Why it helps]
• Step 2: [Action] - [Why it helps]  
• Step 3: [Action] - [Why it helps]`

    const systemInstruction = "You are a wellness coach creating simple, encouraging action plans for elderly patients. Use clear language and provide specific, achievable steps. Always remind them to consult their doctor."

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
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const plan = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate wellness plan. Please try again."

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Wellness plan generation error:", error)
    return NextResponse.json(
      { error: 'Failed to generate wellness plan' },
      { status: 500 }
    )
  }
}