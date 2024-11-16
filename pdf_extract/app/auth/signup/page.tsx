'use client'

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Navigation from "@/app/components/shared/navigation"
import Link from "next/link"
import { useState } from "react"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Signup functionality will be implemented later
    setTimeout(() => setIsLoading(false), 1000)
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    setPasswordStrength(strength)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation showAuthButtons={false} />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Password"
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                />
                {/* Password strength indicator */}
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === 0
                          ? 'w-0'
                          : passwordStrength === 1
                          ? 'w-1/5 bg-red-500'
                          : passwordStrength === 2
                          ? 'w-2/5 bg-orange-500'
                          : passwordStrength === 3
                          ? 'w-3/5 bg-yellow-500'
                          : passwordStrength === 4
                          ? 'w-4/5 bg-lime-500'
                          : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password strength:{' '}
                    {passwordStrength === 0
                      ? 'Very weak'
                      : passwordStrength === 1
                      ? 'Weak'
                      : passwordStrength === 2
                      ? 'Fair'
                      : passwordStrength === 3
                      ? 'Good'
                      : passwordStrength === 4
                      ? 'Strong'
                      : 'Very strong'}
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
