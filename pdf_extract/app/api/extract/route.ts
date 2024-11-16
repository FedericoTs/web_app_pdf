import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LlamaParser } from 'llamaparser'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { 
          error: 'No file provided',
          details: 'The request must include a file in the form data'
        },
        { status: 400 }
      )
    }

    // Initialize LlamaParser
    const parser = new LlamaParser()
    
    try {
      // Convert File to Buffer for LlamaParser
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Extract text from PDF
      const result = await parser.parse(buffer)
      
      if (!result || !result.documents || result.documents.length === 0) {
        throw new Error('No text could be extracted from the PDF')
      }
      
      // Combine all document chunks for complete text
      const fullText = result.documents.map(doc => doc.text).join('\n\n')
      
      if (!fullText.trim()) {
        throw new Error('Extracted text is empty')
      }
      
      return NextResponse.json({ text: fullText }, { status: 200 })
      
    } catch (parseError) {
      console.error('PDF parsing error:', parseError)
      return NextResponse.json(
        {
          error: 'Failed to parse PDF',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
          stack: parseError instanceof Error ? parseError.stack : undefined
        },
        { status: 422 }
      )
    }
    
  } catch (error) {
    console.error('Error in PDF extraction:', error)
    return NextResponse.json(
      {
        error: 'Failed to extract text from PDF',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}