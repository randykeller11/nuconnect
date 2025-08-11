import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface FormCardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function FormCard({ title, children, className = '' }: FormCardProps) {
  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className={`bg-white shadow-xl border-0 rounded-2xl ${className}`}>
          {title && (
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-inkwell">
                {title}
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className="p-8">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
