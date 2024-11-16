'use client'

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Navigation from "@/app/components/shared/navigation"
import { createClient } from '@/lib/supabase/client'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      console.log('Attempting sign up...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      console.log('Sign up response:', { data, error })

      if (error) throw error

      if (data?.user?.identities?.length === 0) {
        throw new Error('Email already registered')
      }

      setMessage({
        type: 'success',
        text: 'Check your email for the confirmation link.',
      })
    } catch (error) {
      console.error('Auth error:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(strength)
    return strength
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="container flex flex-col items-center gap-4 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-center gap-4">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Create Your Account
            </h1>
            <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
              Join us to start transforming your PDF documents into actionable data
            </p>
          </div>

          <div className="w-full max-w-md space-y-8 mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      checkPasswordStrength(e.target.value)
                    }}
                    className="mt-1"
                  />
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-full rounded ${
                          i < passwordStrength
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long and include uppercase, number, and special character
                  </p>
                </div>
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || passwordStrength < 3}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
