'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [connectionDetails, setConnectionDetails] = useState<any>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient()
        console.log('Testing Supabase connection...')
        
        // Test connection and check tables
        const [sessionResult, pdfResult, settingsResult] = await Promise.all([
          supabase.auth.getSession(),
          supabase.from('pdf_documents').select('count'),
          supabase.from('user_settings').select('count')
        ])
        
        if (sessionResult.error) throw sessionResult.error
        if (pdfResult.error) throw pdfResult.error
        if (settingsResult.error) throw settingsResult.error

        setConnectionDetails({
          session: sessionResult.data.session ? 'Active' : 'No active session',
          tables: {
            pdf_documents: 'Available',
            user_settings: 'Available'
          },
          url: process.env.NEXT_PUBLIC_SUPABASE_URL
        })
        setStatus('connected')
      } catch (err) {
        console.error('Error:', err)
        if (err instanceof Error) {
          setErrorMessage(`Error: ${err.message}`)
        } else if (typeof err === 'object' && err !== null) {
          setErrorMessage(`Error details: ${JSON.stringify(err, null, 2)}`)
        } else {
          setErrorMessage(`Unknown error: ${String(err)}`)
        }
        setStatus('error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">Supabase Test</h1>
        <div className="text-center">
          {status === 'loading' && <p className="text-blue-600">Testing connection...</p>}
          {status === 'connected' && (
            <div>
              <p className="text-green-600">✓ Connected successfully!</p>
              <div className="mt-4 text-left">
                <h2 className="font-semibold">Connection Details:</h2>
                <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-gray-100 p-4 text-sm text-gray-800">
                  {JSON.stringify(connectionDetails, null, 2)}
                </pre>
                <h2 className="mt-4 font-semibold">Next Steps:</h2>
                <ol className="mt-2 list-decimal pl-5 text-sm text-gray-700">
                  <li className="mb-2">Set up authentication UI components</li>
                  <li className="mb-2">Implement PDF upload functionality</li>
                  <li>Add document processing logic</li>
                </ol>
              </div>
            </div>
          )}
          {status === 'error' && (
            <>
              <p className="mb-2 text-red-600">✗ Connection failed</p>
              <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-gray-100 p-4 text-left text-sm text-gray-800">
                {errorMessage}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
