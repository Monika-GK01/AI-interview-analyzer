'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // First, authenticate the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      if (!profile?.is_admin) {
        // Not an admin, log them out
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin privileges required.')
      }

      // Update login tracking for admin
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('login_count')
        .eq('id', data.user.id)
        .single()

      await supabase
        .from('profiles')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: (currentProfile?.login_count || 0) + 1
        })
        .eq('id', data.user.id)

      // Redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to log in as admin')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="relative">
              <ShieldCheckIcon className="h-12 w-12 text-yellow-400" />
              <div className="absolute inset-0 h-12 w-12 text-yellow-300 animate-pulse opacity-50">
                <ShieldCheckIcon className="h-12 w-12" />
              </div>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            🔐 Admin Access
          </h1>
          <p className="text-gray-300">Authorized Personnel Only</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold py-3 shadow-lg hover:shadow-xl" 
              isLoading={isLoading}
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Access Admin Panel
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Regular Login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            🔒 This area is restricted to administrators only
          </p>
        </div>
      </div>
    </div>
  )
}
