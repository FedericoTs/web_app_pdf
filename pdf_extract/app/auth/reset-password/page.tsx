import { AuthForm } from '@/components/auth/auth-form'
import { createServerClientInstance } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ResetPassword() {
  const supabase = createServerClientInstance()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="reset-password" />
    </div>
  )
}
