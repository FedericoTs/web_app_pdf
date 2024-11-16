import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Test the auth connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      status: 'ok',
      session: data.session,
      message: 'Auth system is working correctly'
    })
  } catch (err) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
