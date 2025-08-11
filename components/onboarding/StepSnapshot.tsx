'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface StepSnapshotProps {
  data: {
    role?: string
    company?: string
    location?: string
    headline?: string
  }
  onChange: (data: any) => void
  isLinkedInPrefilled?: boolean
}

export function StepSnapshot({ data, onChange, isLinkedInPrefilled = false }: StepSnapshotProps) {
  const [showEditDetails, setShowEditDetails] = useState(!isLinkedInPrefilled)

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-inkwell mb-2">Professional Snapshot</h3>
        <p className="text-lunar">Tell us about your current role and background</p>
      </div>

      {isLinkedInPrefilled && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">
            ✓ Information imported from LinkedIn
          </p>
          <Button
            variant="ghost"
            onClick={() => setShowEditDetails(!showEditDetails)}
            className="mt-2 text-blue-600 hover:text-blue-800 p-0 h-auto flex items-center gap-2"
          >
            Edit details
            {showEditDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {showEditDetails && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="role" className="text-inkwell font-medium">
              Current Role *
            </Label>
            <Input
              id="role"
              value={data.role || ''}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="e.g. Software Engineer, Product Manager"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-inkwell font-medium">
              Company
            </Label>
            <Input
              id="company"
              value={data.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="e.g. Google, Startup Inc."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-inkwell font-medium">
              Location
            </Label>
            <Input
              id="location"
              value={data.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="headline" className="text-inkwell font-medium">
              Professional Headline
            </Label>
            <Textarea
              id="headline"
              value={data.headline || ''}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="Brief description of what you do..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      )}

      {!showEditDetails && isLinkedInPrefilled && (
        <div className="space-y-3 text-sm">
          <div><span className="font-medium">Role:</span> {data.role}</div>
          <div><span className="font-medium">Company:</span> {data.company}</div>
          <div><span className="font-medium">Location:</span> {data.location}</div>
          <div><span className="font-medium">Headline:</span> {data.headline}</div>
        </div>
      )}
    </div>
  )
}
