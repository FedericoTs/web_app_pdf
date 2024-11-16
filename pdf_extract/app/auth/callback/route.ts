import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (!code) {
      console.error('No code provided in callback')
      return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=no_code`)
    }

    const cookieStore = cookies()
    const supabase = createServerClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=${error.message}`)
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=server_error`)
  }
}
