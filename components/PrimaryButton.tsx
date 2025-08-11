import React from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loading?: boolean
  size?: 'default' | 'lg' | 'xl'
}

export function PrimaryButton({ 
  children, 
  loading = false, 
  size = 'default',
  className,
  disabled,
  ...props 
}: PrimaryButtonProps) {
  const sizeClasses = {
    default: 'h-12 px-6',
    lg: 'h-14 px-8 text-lg',
    xl: 'h-16 px-10 text-xl'
  }

  return (
    <Button
      className={cn(
        'bg-inkwell text-aulait hover:bg-lunar rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg',
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-aulait/30 border-t-aulait rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  )
}
