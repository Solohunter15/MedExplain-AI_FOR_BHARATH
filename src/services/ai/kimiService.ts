// Kimi AI integration service for medical analysis

export interface KimiAnalysisRequest {
  content: string
  language: 'en' | 'ml' | 'hi'
  reportType: 'medical_report' | 'prescription' | 'lab_results'
}

export interface KimiAnalysisResponse {
  summary: string
  keyFindings: string[]
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  language: string
}

class KimiService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.KIMI_AI_API_KEY || ''
    this.baseUrl = 'https://api.moonshot.cn/v1' // Kimi AI endpoint
  }

  async analyzeMedicalContent(request: KimiAnalysisRequest): Promise<KimiAnalysisResponse> {
    try {
      const prompt = this.buildMedicalPrompt(request)
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [
            {
              role: 'system',
              content: 'You are a medical AI assistant specialized in explaining medical reports and prescriptions in simple, accessible language. Always prioritize patient safety and recommend consulting healthcare professionals.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`Kimi AI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.parseKimiResponse(data, request.language)
    } catch (error) {
      console.error('Kimi AI analysis failed:', error)
      throw new Error('Failed to analyze medical content')
    }
  }

  private buildMedicalPrompt(request: KimiAnalysisRequest): string {
    const languageInstructions = {
      en: 'Respond in English',
      ml: 'Respond in Malayalam (മലയാളം)',
      hi: 'Respond in Hindi (हिन्दी)'
    }

    return `
      ${languageInstructions[request.language]}. 
      
      Analyze this ${request.reportType.replace('_', ' ')} and provide:
      1. A simple summary that a non-medical person can understand
      2. Key findings in bullet points
      3. Recommendations for next steps
      4. Risk level assessment (low/medium/high)
      
      Content to analyze:
      ${request.content}
      
      Important: Use simple language suitable for elderly users and those with limited medical knowledge. Always recommend consulting with healthcare professionals for medical decisions.
    `
  }

  private parseKimiResponse(data: any, language: string): KimiAnalysisResponse {
    const content = data.choices?.[0]?.message?.content || ''
    
    // Parse the structured response
    // This is a simplified parser - in production, you'd want more robust parsing
    const sections = content.split('\n\n')
    
    return {
      summary: sections[0] || 'Analysis completed',
      keyFindings: this.extractBulletPoints(content),
      recommendations: this.extractRecommendations(content),
      riskLevel: this.extractRiskLevel(content),
      confidence: 0.85, // Default confidence
      language
    }
  }

  private extractBulletPoints(content: string): string[] {
    const lines = content.split('\n')
    return lines
      .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
      .map(line => line.replace(/^[•-]\s*/, '').trim())
      .filter(line => line.length > 0)
  }

  private extractRecommendations(content: string): string[] {
    // Look for recommendation section
    const recommendationSection = content.toLowerCase().includes('recommend')
    if (recommendationSection) {
      return this.extractBulletPoints(content)
    }
    return ['Consult with your healthcare provider for personalized advice']
  }

  private extractRiskLevel(content: string): 'low' | 'medium' | 'high' {
    const lowerContent = content.toLowerCase()
    if (lowerContent.includes('high risk') || lowerContent.includes('urgent')) {
      return 'high'
    }
    if (lowerContent.includes('medium risk') || lowerContent.includes('moderate')) {
      return 'medium'
    }
    return 'low'
  }
}

export const kimiService = new KimiService()