import { NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = createServerClientInstance()

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json(
        { error: `Failed to check storage status: ${listError.message}` },
        { status: 500 }
      )
    }

    const pdfBucketExists = buckets?.some(bucket => bucket.name === 'pdfs')

    if (!pdfBucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase
        .storage
        .createBucket('pdfs', {
          public: false,
          allowedMimeTypes: ['application/pdf'],
          fileSizeLimit: 10485760 // 10MB
        })

      if (createError) {
        console.error('Error creating bucket:', createError)
        return NextResponse.json(
          { error: `Failed to initialize storage: ${createError.message}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { message: 'Storage initialized successfully', bucket: 'pdfs' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Storage initialization error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to initialize storage system'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
