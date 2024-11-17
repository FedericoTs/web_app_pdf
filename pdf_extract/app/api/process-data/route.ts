import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'group';
  description: string;
  fields?: Field[];
}

function createZodSchema(field: Field): z.ZodTypeAny {
  switch (field.type) {
    case 'text':
      return z.string().nullable();
    case 'number':
      return z.number().nullable();
    case 'group':
      if (!field.fields) return z.object({});
      const shape: Record<string, z.ZodTypeAny> = {};
      field.fields.forEach(subField => {
        shape[subField.name] = createZodSchema(subField);
      });
      return z.array(z.object(shape));
    default:
      return z.unknown();
  }
}

function createSystemPrompt(fields: Field[]): string {
  const fieldDescriptions = fields.map(field => {
    if (field.type === 'group') {
      const subFields = field.fields?.map(subField => 
        `    - ${subField.name}: ${subField.description}`
      ).join('\n');
      return `- ${field.name} (collection of items):\n${subFields}`;
    }
    return `- ${field.name}: ${field.description}`;
  }).join('\n');

  return `You are an expert at extracting structured data from documents.
Your task is to extract data according to the provided schema.

For each field in the schema, extract the following information:
${fieldDescriptions}

Important instructions:
1. Extract ALL matching data from the document
2. For group fields, find and extract ALL matching items
3. For number fields:
   - Convert values from string format (like "-55,26" or "1.349,36") to proper numbers (-55.26 or 1349.36)
   - Remove any currency symbols or thousand separators
   - Maintain negative signs
4. For text fields:
   - Keep the exact format as in the document
   - Include the complete text
5. If a specific value is not found, use null
6. Process the entire document thoroughly
7. Maintain the order of items as they appear in the document

Remember: This document may contain multiple entries or rows of data. Make sure to extract ALL of them, not just the first one.`;
}

export async function POST(request: NextRequest) {
  console.log('Starting data processing with OpenAI...');
  
  try {
    const { text, schema } = await request.json();

    if (!text || !schema) {
      console.error('No text or schema provided for processing');
      return NextResponse.json(
        { error: 'No text or schema provided' },
        { status: 400 }
      );
    }

    console.log('Creating dynamic schema from:', schema);

    // Create dynamic Zod schema from user's schema
    const shape: Record<string, z.ZodTypeAny> = {};
    schema.forEach((field: Field) => {
      if (field.type === 'group') {
        // For group fields, we want to ensure we get an array of results
        shape[field.name] = createZodSchema(field);
      } else {
        // For non-group fields, we create an array to capture all instances
        shape[field.name] = z.array(createZodSchema(field));
      }
    });
    const DynamicSchema = z.object(shape);

    console.log('Sending request to OpenAI with text length:', text.length);

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: createSystemPrompt(schema)
        },
        { role: "user", content: text },
      ],
      response_format: zodResponseFormat(DynamicSchema, "pdf_data_extraction"),
      temperature: 0,
    });

    const extracted_data = completion.choices[0].message.parsed;
    console.log('Successfully extracted data:', JSON.stringify(extracted_data, null, 2));

    return NextResponse.json(extracted_data);
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json(
      { error: 'Error processing data' },
      { status: 500 }
    );
  }
}
