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
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.replace('/auth')
          return
        }
        
        const res = await fetch('/api/me/profile')
        const { hasProfile } = await res.json()
        
        if (hasProfile) {
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
