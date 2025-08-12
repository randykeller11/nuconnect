'use client'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthPage() {
  const [mode, setMode] = useState<'magic' | 'password'>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const supabase = supabaseBrowser()
    
    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser: true,
          },
        })
        
        if (error) {
          toast.error('Failed to send Magic Link. Try again.')
        } else {
          toast.success('Check your email for a magic link.')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        })
        
        if (error) {
          toast.error('Login failed: ' + error.message)
        } else {
          router.push('/auth/callback')
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-aulait flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-inkwell">Welcome to NuConnect</CardTitle>
          <CardDescription>Sign in to start networking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setMode('magic')}
              className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                mode === 'magic'
                  ? 'bg-white text-inkwell shadow-sm'
                  : 'text-lunar hover:text-inkwell'
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                mode === 'password'
                  ? 'bg-white text-inkwell shadow-sm'
                  : 'text-lunar hover:text-inkwell'
              }`}
            >
              Password
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            {mode === 'password' && (
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-inkwell hover:bg-lunar text-white"
              disabled={loading}
            >
              {loading ? 'Loading...' : mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
