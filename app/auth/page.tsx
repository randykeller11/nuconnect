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
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`,
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
    <div className="min-h-screen bg-gradient-to-br from-aulait to-aulait/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-2xl font-bold text-aulait">N</span>
          </div>
          <CardTitle className="text-3xl font-bold text-inkwell">Welcome to NuConnect</CardTitle>
          <CardDescription className="text-lg text-lunar">Sign in to start networking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="flex rounded-xl bg-lunar/10 p-1">
            <button
              type="button"
              onClick={() => setMode('magic')}
              className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all ${
                mode === 'magic'
                  ? 'bg-white text-inkwell shadow-md'
                  : 'text-lunar hover:text-inkwell'
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all ${
                mode === 'password'
                  ? 'bg-white text-inkwell shadow-md'
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
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 text-lg border-2 border-lunar/20 focus:border-inkwell rounded-xl"
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
                  className="w-full h-12 text-lg border-2 border-lunar/20 focus:border-inkwell rounded-xl"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait rounded-xl shadow-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Loading...' : mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
            </Button>
          </form>

          {mode === 'magic' && (
            <p className="text-sm text-lunar/70 text-center">
              We'll send you a secure link to sign in without a password
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
