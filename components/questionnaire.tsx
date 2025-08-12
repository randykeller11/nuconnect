'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Construction } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Questionnaire() {
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
          <h1 className="text-3xl font-bold text-inkwell">Questionnaire</h1>
        </div>

        {/* Coming Soon Card */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl">
          <CardContent className="p-12 text-center">
            <Construction className="w-16 h-16 text-lunar/40 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-inkwell mb-4">Questionnaire Coming Soon</h2>
            <p className="text-lg text-lunar mb-8 max-w-2xl mx-auto">
              We're building a comprehensive questionnaire system for better matching. 
              For now, you can complete your profile through the onboarding flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/onboarding')}
                className="bg-inkwell text-aulait hover:bg-lunar"
              >
                Complete Onboarding
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/home')}
                className="border-lunar text-lunar hover:bg-lunar hover:text-aulait"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
