'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/browser'

export default function Callback() {
  const router = useRouter()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = supabaseBrowser()
        
        // Complete the magic-link / OAuth flow and set the auth cookie
        const { error: callbackError } = await supabase.auth.exchangeCodeForSession()
        
        if (callbackError) {
          console.error('Auth callback error:', callbackError)
          router.replace('/auth')
          return
        }
        
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error('User fetch error:', userError)
          router.replace('/auth')
          return
        }

        // Persist user locally so other client routes don’t force re-login
        try {
          localStorage.setItem('nuconnect_user', JSON.stringify(user))
        } catch (_) {
          /* ignore quota / SSR issues */
        }
        
        // Check if user has completed onboarding
        const res = await fetch('/api/me/profile')
        const data = await res.json()
        
        if (!res.ok) {
          console.error('Profile check failed:', data.error)
          router.replace('/onboarding')
          return
        }
        
        const { hasProfile, isOnboardingComplete } = data
        
        if (hasProfile && isOnboardingComplete) {
          router.replace('/home')
        } else {
          router.replace('/onboarding')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.replace('/onboarding')
      }
    }

    handleCallback()
  }, [router])
  
  return (
    <div className="min-h-screen bg-aulait flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inkwell mx-auto mb-4"></div>
        <p className="text-lunar font-medium">Setting up your account...</p>
      </div>
    </div>
  )
}
