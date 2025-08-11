import React from 'react'

interface BrandHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function BrandHeader({ title, subtitle, className = '' }: BrandHeaderProps) {
  return (
    <div className={`bg-inkwell text-aulait py-16 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-aulait rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-inkwell">N</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-aulait/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
