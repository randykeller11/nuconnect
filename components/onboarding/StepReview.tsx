'use client'

import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Edit2 } from 'lucide-react'

interface StepReviewProps {
  data: {
    role?: string
    company?: string
    location?: string
    headline?: string
    industries?: string[]
    skills?: string[]
    interests?: string[]
    seniority?: string
    objectives?: string[]
    seeking?: string[]
    openness?: number
    introStyle?: string
    enableIcebreakers?: boolean
    showLinkedIn?: boolean
    showCompany?: boolean
    linkedin_url?: string
    profile_photo_url?: string
  }
  onChange: (data: any) => void
  onEditStep: (step: number) => void
  onComplete: () => void
  isLoading?: boolean
}

export function StepReview({ data, onChange, onEditStep, onComplete, isLoading = false }: StepReviewProps) {
  const handleConsentChange = (field: string, checked: boolean) => {
    onChange({ ...data, [field]: checked })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-inkwell mb-2">Review Your Profile</h3>
        <p className="text-lunar">Make sure everything looks good before we create your profile</p>
      </div>

      {/* Professional Info */}
      <div className="bg-aulait/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-inkwell">Professional Information</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            className="text-lunar hover:text-inkwell"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Role:</span> {data.role || 'Not specified'}</div>
          <div><span className="font-medium">Company:</span> {data.company || 'Not specified'}</div>
          <div><span className="font-medium">Location:</span> {data.location || 'Not specified'}</div>
          <div><span className="font-medium">Seniority:</span> {data.seniority || 'Not specified'}</div>
          {data.headline && (
            <div><span className="font-medium">Headline:</span> {data.headline}</div>
          )}
          {data.linkedin_url && (
            <div><span className="font-medium">LinkedIn:</span> {data.linkedin_url}</div>
          )}
        </div>
      </div>

      {/* Focus Areas */}
      <div className="bg-aulait/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-inkwell">Focus Areas</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(2)}
            className="text-lunar hover:text-inkwell"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          {data.industries && data.industries.length > 0 && (
            <div>
              <span className="font-medium text-sm">Industries:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.industries.map(industry => (
                  <Badge key={industry} variant="outline" className="text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data.skills && data.skills.length > 0 && (
            <div>
              <span className="font-medium text-sm">Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.skills.map(skill => (
                  <Badge
                    key={skill}
                    variant={data.primarySkill === skill ? "default" : "outline"}
                    className={`text-xs ${data.primarySkill === skill ? "bg-inkwell text-aulait" : ""}`}
                  >
                    {skill}
                    {data.primarySkill === skill && (
                      <span className="ml-1 text-xs font-bold">(Primary)</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data.interests && data.interests.length > 0 && (
            <div>
              <span className="font-medium text-sm">Interests:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.interests.map(interest => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Networking Intent */}
      <div className="bg-aulait/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-inkwell">Networking Intent</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(3)}
            className="text-lunar hover:text-inkwell"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          {data.objectives && data.objectives.length > 0 && (
            <div>
              <span className="font-medium text-sm">Objectives:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.objectives.map(objective => (
                  <Badge key={objective} variant="outline" className="text-xs">
                    {objective}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data.seeking && data.seeking.length > 0 && (
            <div>
              <span className="font-medium text-sm">Seeking:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.seeking.map(item => (
                  <Badge key={item} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium">Openness:</span> {data.openness || 3}/5
          </div>
          <div className="text-sm">
            <span className="font-medium">Style:</span> {data.introStyle || 'Not specified'}
          </div>
          {data.enableIcebreakers && (
            <div className="text-sm">
              <span className="font-medium">Icebreaker Tone:</span> {data.icebreakerTone || 'Fun'}
            </div>
          )}
        </div>
      </div>

      {/* Privacy Consent */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-inkwell mb-4">Privacy Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-inkwell font-medium">Show LinkedIn Profile</Label>
              <p className="text-sm text-lunar">Allow others to see your LinkedIn profile link</p>
            </div>
            <Switch
              checked={data.showLinkedIn || false}
              onCheckedChange={(checked) => handleConsentChange('showLinkedIn', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-inkwell font-medium">Show Company Name</Label>
              <p className="text-sm text-lunar">Display your company name in your profile</p>
            </div>
            <Switch
              checked={data.showCompany || false}
              onCheckedChange={(checked) => handleConsentChange('showCompany', checked)}
            />
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="pt-8">
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className="w-full bg-inkwell text-aulait hover:bg-lunar h-12 text-lg"
        >
          {isLoading ? 'Setting up your profile...' : 'Finish & See Matches'}
        </Button>
      </div>
    </div>
  )
}
