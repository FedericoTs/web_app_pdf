'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

type AuthMode = 'sign-in' | 'sign-up' | 'reset-password'

interface AuthFormProps {
  mode?: AuthMode
}

export function AuthForm({ mode: initialMode = 'sign-in' }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'reset-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        })
        if (error) throw error
        setMessage({
          type: 'success',
          text: 'Check your email for the password reset link',
        })
      } else if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.refresh()
        router.push('/dashboard')
      } else if (mode === 'sign-up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage({
          type: 'success',
          text: 'Check your email for the confirmation link',
        })
      }
    } catch (error) {
      console.error('Auth error:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight">
          {mode === 'sign-in' && 'Sign in to your account'}
          {mode === 'sign-up' && 'Create a new account'}
          {mode === 'reset-password' && 'Reset your password'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'sign-in' && (
            <>
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </>
          )}
          {mode === 'sign-up' && (
            <>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </>
          )}
          {mode === 'reset-password' && (
            <>
              Remember your password?{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="Enter your email"
            />
          </div>

          {mode !== 'reset-password' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>
          )}
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {mode === 'sign-in' && (
          <div className="flex items-center justify-end">
            <Link
              href="/auth/reset-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              {mode === 'sign-in' && 'Signing in...'}
              {mode === 'sign-up' && 'Creating account...'}
              {mode === 'reset-password' && 'Sending reset link...'}
            </>
          ) : (
            <>
              {mode === 'sign-in' && 'Sign in'}
              {mode === 'sign-up' && 'Create account'}
              {mode === 'reset-password' && 'Send reset link'}
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
