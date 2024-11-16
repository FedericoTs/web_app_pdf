import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

// Initialize OpenAI client
const openai = new OpenAI()

// Define the schema for individual items
const ItemSchema = z.object({
  item: z.string(),
  unit_price: z.number(),
  quantity: z.number(),
  sum: z.number()
})

// Define the main extraction schema
const ExtractionSchema = z.object({
  company: z.string(),
  address: z.string(),
  billing_id: z.string(),
  billing_date: z.string(),
  total_sum: z.number(),
  items: z.array(ItemSchema)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, schema } = body

    if (!text) {
      return NextResponse.json(
        {
          error: 'No text provided',
          details: 'The request must include the text to process'
        },
        { status: 400 }
      )
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        {
          error: 'Invalid text content',
          details: 'The provided text is too short or empty'
        },
        { status: 400 }
      )
    }

    try {
      // Process with OpenAI
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Extract structured information from the following invoice text according to the specified schema. Make sure to convert numeric values to numbers and dates to ISO format."
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: zodResponseFormat(ExtractionSchema, "invoice")
      })

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('No response received from OpenAI')
      }

      const extractedData = completion.choices[0].message.parsed

      // Validate the extracted data
      if (!extractedData.company || !extractedData.billing_id) {
        throw new Error('Critical information missing from extraction')
      }

      return NextResponse.json(extractedData, { status: 200 })

    } catch (aiError) {
      console.error('OpenAI processing error:', aiError)
      return NextResponse.json(
        {
          error: 'Failed to process text with AI',
          details: aiError instanceof Error ? aiError.message : 'Unknown AI processing error',
          stack: aiError instanceof Error ? aiError.stack : undefined
        },
        { status: 422 }
      )
    }

  } catch (error) {
    console.error('Error in data extraction:', error)
    return NextResponse.json(
      {
        error: 'Failed to extract structured data',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
