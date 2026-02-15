import { NextRequest, NextResponse } from 'next/server'
import { kimiService } from '@/services/ai/kimiService'
import { encryptionService } from '@/services/encryption/encryptionService'
import { logAuditEvent } from '@/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      encryptedContent, 
      userKey, 
      userId, 
      language = 'en', 
      reportType = 'medical_report' 
    } = body

    if (!encryptedContent || !userKey || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Decrypt the content
    const decryptedData = await encryptionService.decryptData(encryptedContent, userKey)
    
    // Analyze with Kimi AI
    const analysisResult = await kimiService.analyzeMedicalContent({
      content: decryptedData.content,
      language: language as 'en' | 'ml' | 'hi',
      reportType: reportType as 'medical_report' | 'prescription' | 'lab_results'
    })

    // Log the analysis event
    logAuditEvent('ai_analysis_requested', userId, {
      language,
      reportType,
      confidence: analysisResult.confidence,
      riskLevel: analysisResult.riskLevel
    })

    return NextResponse.json({
      success: true,
      analysis: analysisResult
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}

// Get analysis history for a user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId parameter' },
      { status: 400 }
    )
  }

  try {
    // In production, this would fetch from a database
    // For now, return a mock response
    const mockAnalyses = [
      {
        id: '1',
        date: new Date().toISOString(),
        reportType: 'medical_report',
        summary: 'Blood test results show normal values',
        riskLevel: 'low',
        language: 'en'
      }
    ]

    logAuditEvent('analysis_history_accessed', userId, { limit })

    return NextResponse.json({
      success: true,
      analyses: mockAnalyses.slice(0, limit)
    })

  } catch (error) {
    console.error('Analysis history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    )
  }
}