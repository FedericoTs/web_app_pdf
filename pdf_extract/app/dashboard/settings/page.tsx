'use client'

import { useState, useEffect } from 'react'
import { Settings, User, CreditCard, Palette, Key } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'account' | 'subscription' | 'appearance' | 'integrations'

interface APIKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('account')
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<{
    name: string
    email: string
  } | null>(null)
  const [userSettings, setUserSettings] = useState<{
    theme: string
    colorPalette: {
      primary: string
      secondary: string
      success: string
      warning: string
      error: string
    }
  } | null>(null)
  const [colorPalette, setColorPalette] = useState({
    primary: '#8b5cf6',
    secondary: '#ec4899',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  })
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Get user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (!session) {
        router.push('/auth/sign-in')
        return
      }

      // Get user settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .single()

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError
      }

      if (settings) {
        setUserSettings(settings)
        if (settings.colorPalette) {
          setColorPalette(settings.colorPalette)
        }
      }

      // Set user profile
      setUserProfile({
        name: session.user.user_metadata?.name || '',
        email: session.user.email || '',
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      setMessage({ type: 'error', text: 'Failed to load user data' })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!userProfile) return

    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        data: { name: userProfile.name }
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Password updated successfully' })
    } catch (error) {
      console.error('Error updating password:', error)
      setMessage({ type: 'error', text: 'Failed to update password' })
    } finally {
      setLoading(false)
    }
  }

  const updateAppearance = async () => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          colorPalette,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Appearance settings updated successfully' })
    } catch (error) {
      console.error('Error updating appearance:', error)
      setMessage({ type: 'error', text: 'Failed to update appearance settings' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Key },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-gray-500">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="flex-1 lg:max-w-2xl">
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border px-3 py-2"
                      value={userProfile?.name || ''}
                      onChange={(e) => setUserProfile(prev => ({ ...prev!, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-lg border px-3 py-2"
                      value={userProfile?.email || ''}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full rounded-lg border px-3 py-2"
                      onChange={(e) => {/* Handle password change */}}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <input 
                      type="password" 
                      className="w-full rounded-lg border px-3 py-2"
                      onChange={(e) => {/* Handle password change */}}
                    />
                  </div>
                </div>
              </div>

              <button 
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={updateProfile}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium">Current Plan</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Pro Plan</span>
                    <span className="text-gray-500">$29/month</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Unlimited PDF Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Advanced Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Priority Support</span>
                    </div>
                  </div>
                </div>
                <button className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  Change Plan
                </button>
              </div>

              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium">Billing Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-14 rounded bg-gray-100" />
                      <span>•••• 4242</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:underline">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Color Palette</h3>
                <div className="grid gap-4">
                  {Object.entries(colorPalette).map(([name, color]) => (
                    <div key={name} className="space-y-2">
                      <label className="text-sm font-medium capitalize">{name}</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) =>
                            setColorPalette((prev) => ({ ...prev, [name]: e.target.value }))
                          }
                          className="h-10 w-20"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) =>
                            setColorPalette((prev) => ({ ...prev, [name]: e.target.value }))
                          }
                          className="w-32 rounded-lg border px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={updateAppearance}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">API Keys</h3>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Create New Key
                </button>
              </div>

              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-gray-500">Created on {key.createdAt}</p>
                      </div>
                      <button className="text-sm text-red-600 hover:underline">Revoke</button>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={key.key}
                          readOnly
                          className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
                        />
                        <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">Last used: {key.lastUsed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
