'use client'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [mode, setMode] = useState<'magic' | 'password'>('magic')
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    console.log('=== LOGIN FORM SUBMIT DEBUG ===')
    console.log('Form submitted - mode:', mode)
    console.log('Auth type:', authType)
    console.log('Current hostname:', window.location.hostname)
    console.log('Current origin:', window.location.origin)
    console.log('Environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
    })
    
    const supabase = supabaseBrowser()
    
    try {
      if (mode === 'magic') {
        // Force production URL if we're in production environment
        const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        const baseUrl = isProduction 
          ? 'https://nuconnect-9f3561915ae1.herokuapp.com'
          : (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
        
        const redirectUrl = `${baseUrl}/auth/callback`
        
        console.log('Magic link debug:')
        console.log('- isProduction:', isProduction)
        console.log('- baseUrl:', baseUrl)
        console.log('- redirectUrl:', redirectUrl)
        console.log('=== END LOGIN DEBUG ===')
        
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectUrl,
            shouldCreateUser: true,
          },
        })
        
        if (error) {
          toast.error('Failed to send Magic Link. Try again.')
        } else {
          toast.success(`Check your email for a magic link to ${authType === 'signin' ? 'sign in' : 'create your account'}.`)
        }
      } else {
        if (authType === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          
          if (error) {
            toast.error('Sign up failed: ' + error.message)
          } else {
            toast.success('Account created! Check your email to verify your account.')
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          })
          
          if (error) {
            toast.error('Sign in failed: ' + error.message)
          } else {
            router.push('/auth/callback')
          }
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
          <CardTitle className="text-3xl font-bold text-inkwell">
            {authType === 'signin' ? 'Welcome Back' : 'Join NuConnect'}
          </CardTitle>
          <CardDescription className="text-lg text-lunar">
            {authType === 'signin' 
              ? 'Sign in to continue networking' 
              : 'Create your account to start networking'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {/* Sign In / Sign Up Toggle */}
          <div className="flex rounded-xl bg-inkwell/10 p-1 mb-6">
            <button
              type="button"
              onClick={() => setAuthType('signin')}
              className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all ${
                authType === 'signin'
                  ? 'bg-inkwell text-aulait shadow-md'
                  : 'text-inkwell hover:bg-inkwell/10'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthType('signup')}
              className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all ${
                authType === 'signup'
                  ? 'bg-inkwell text-aulait shadow-md'
                  : 'text-inkwell hover:bg-inkwell/10'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Method Toggle */}
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
                  placeholder={authType === 'signup' ? 'Create a password' : 'Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 text-lg border-2 border-lunar/20 focus:border-inkwell rounded-xl"
                />
                {authType === 'signup' && (
                  <p className="text-xs text-lunar/70 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait rounded-xl shadow-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Loading...' : 
               mode === 'magic' ? 
                 (authType === 'signin' ? 'Send Sign In Link' : 'Send Sign Up Link') :
                 (authType === 'signin' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          {mode === 'magic' && (
            <p className="text-sm text-lunar/70 text-center">
              {authType === 'signin' 
                ? "We'll send you a secure link to sign in without a password"
                : "We'll send you a secure link to create your account without a password"
              }
            </p>
          )}

          {/* Alternative Action */}
          <div className="text-center pt-4 border-t border-lunar/10">
            <p className="text-sm text-lunar">
              {authType === 'signin' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setAuthType(authType === 'signin' ? 'signup' : 'signin')}
                className="ml-2 text-inkwell hover:text-lunar font-medium underline"
              >
                {authType === 'signin' ? 'Create one here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
