'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function DemoModeToggle() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleDemoMode = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/demo/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !isDemoMode })
      })

      if (res.ok) {
        const data = await res.json()
        setIsDemoMode(data.enabled)
        toast.success(data.enabled ? 'Demo Mode enabled - synergy matches will be auto-generated' : 'Demo Mode disabled')
      } else {
        toast.error('Failed to toggle demo mode')
      }
    } catch (error) {
      console.error('Demo mode toggle error:', error)
      toast.error('Failed to toggle demo mode')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-purple-800 flex items-center gap-2">
          🚀 Demo Mode
          <span className={`px-2 py-1 rounded-full text-xs ${
            isDemoMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isDemoMode ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-purple-700">
            {isDemoMode 
              ? 'Auto-generating synergy matches for demo purposes'
              : 'Enable to auto-generate matches with AI synergy analysis'
            }
          </p>
          <Button 
            onClick={toggleDemoMode}
            disabled={isLoading}
            className={`w-full ${
              isDemoMode 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isLoading ? 'Processing...' : isDemoMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
