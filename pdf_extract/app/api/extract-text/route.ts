import { NextRequest, NextResponse } from 'next/server';
import { LlamaParseReader } from "llamaindex";
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a temporary file path in the OS temp directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.name);
    await fs.writeFile(tempFilePath, buffer);

    // Set up the LlamaParse reader with API key
    const reader = new LlamaParseReader({ 
      resultType: "markdown",
      apiKey: process.env.LLAMACLOUD_API_KEY 
    });

    // Parse the document
    const documents = await reader.loadData(tempFilePath);

    // Clean up the temporary file
    await fs.unlink(tempFilePath);

    // Return the full text from all documents
    const fullText = documents.map(doc => doc.text).join('\n\n');

    return NextResponse.json({ text: fullText });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Error processing PDF' },
      { status: 500 }
    );
  }
}
