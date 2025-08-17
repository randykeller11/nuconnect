'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function Callback() {
  const router = useRouter()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createSupabaseBrowserClient()
        
        // Ensure the auth session is available (magic-link / OAuth has already set it)
        const { error: callbackError } = await supabase.auth.getSession()
        
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
        
        // Check if user has completed onboarding by querying the profile directly
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_stage, name')
            .eq('user_id', user.id)
            .single()
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile query error:', profileError)
            router.replace('/onboarding')
            return
          }
          
          // If profile exists and onboarding is complete, go to home
          if (profile && profile.onboarding_stage === 'complete') {
            router.replace('/home')
          } else {
            // No profile or incomplete onboarding, go to onboarding
            router.replace('/onboarding')
          }
        } catch (error) {
          console.error('Profile check error:', error)
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
