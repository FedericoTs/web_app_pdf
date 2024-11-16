import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run on specific paths
     */
    '/',
    '/dashboard/:path*',
    '/auth/:path*'
  ]
}
