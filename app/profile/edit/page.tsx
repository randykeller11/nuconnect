'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Construction } from 'lucide-react'

export default function ProfileEditPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-inkwell">Edit Profile</h1>
        </div>

        {/* Coming Soon Card */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl">
          <CardContent className="p-12 text-center">
            <Construction className="w-16 h-16 text-lunar/40 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-inkwell mb-4">Profile Editor Coming Soon</h2>
            <p className="text-lg text-lunar mb-8 max-w-2xl mx-auto">
              We're building a comprehensive profile editor with avatar upload, 
              skill management, and privacy controls. For now, you can update 
              your profile through the onboarding flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/onboarding')}
                className="bg-inkwell text-aulait hover:bg-lunar"
              >
                Update via Onboarding
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/profile')}
                className="border-lunar text-lunar hover:bg-lunar hover:text-aulait"
              >
                View Current Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-inkwell/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="font-semibold text-inkwell mb-2">Avatar Upload</h3>
              <p className="text-sm text-lunar">Upload and crop your profile photo</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-lunar/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-inkwell mb-2">Live Preview</h3>
              <p className="text-sm text-lunar">See how your profile looks to others</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-creme/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-inkwell mb-2">Privacy Controls</h3>
              <p className="text-sm text-lunar">Control what information you share</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
