import { NextRequest, NextResponse } from 'next/server'
import { encryptionService } from '@/services/encryption/encryptionService'
import { blockchainService } from '@/services/blockchain/blockchainService'
import { kimiService } from '@/services/ai/kimiService'
import { generateId, logAuditEvent } from '@/utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const userKey = formData.get('userKey') as string
    const language = (formData.get('language') as 'en' | 'ml' | 'hi') || 'en'

    if (!file || !userId || !userKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      )
    }

    // Read file content
    const fileBuffer = await file.arrayBuffer()
    const fileContent = Buffer.from(fileBuffer).toString('base64')

    // Generate unique document ID
    const documentId = generateId()

    // Encrypt the file content
    const encryptedData = await encryptionService.encryptData(fileContent, userKey)

    // Generate content hash for blockchain
    const contentHash = await blockchainService.generateDocumentHash(fileContent)

    // Store hash on blockchain (in production, this would be done asynchronously)
    try {
      const blockchainVerification = await blockchainService.storeDocumentHash(
        documentId,
        contentHash,
        'polygon' // Default to Polygon for lower fees
      )
      
      logAuditEvent('document_uploaded', userId, {
        documentId,
        filename: file.name,
        size: file.size,
        blockchainHash: contentHash
      })
    } catch (blockchainError) {
      console.error('Blockchain storage failed:', blockchainError)
      // Continue without blockchain verification for now
    }

    // Start AI analysis (in production, this would be queued)
    let analysisResult = null
    try {
      // For demo purposes, analyze a sample of the content
      const sampleContent = fileContent.substring(0, 1000) // First 1000 chars
      analysisResult = await kimiService.analyzeMedicalContent({
        content: sampleContent,
        language,
        reportType: 'medical_report'
      })

      logAuditEvent('ai_analysis_completed', userId, {
        documentId,
        confidence: analysisResult.confidence,
        riskLevel: analysisResult.riskLevel
      })
    } catch (aiError) {
      console.error('AI analysis failed:', aiError)
      // Continue without AI analysis
    }

    // Return success response
    return NextResponse.json({
      success: true,
      documentId,
      encryptedData,
      contentHash,
      analysis: analysisResult,
      message: 'File uploaded and processed successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get('documentId')
  const userId = searchParams.get('userId')

  if (!documentId || !userId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  try {
    // Get document info from blockchain
    const documentInfo = await blockchainService.getDocumentInfo(documentId)
    
    if (!documentInfo) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    logAuditEvent('document_accessed', userId, { documentId })

    return NextResponse.json({
      success: true,
      documentInfo
    })

  } catch (error) {
    console.error('Document retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}