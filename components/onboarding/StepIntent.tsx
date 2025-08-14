'use client'

import React from 'react'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'

const OBJECTIVES = [
  'Find Co-founder', 'Explore Jobs', 'Hire Talent', 'Learn AI', 
  'Mentor Others', 'Find Mentor', 'Find Investors', 'Get Feedback'
]

const SEEKING = [
  'Technical Co-founder', 'Business Co-founder', 'Mentor', 'Job Opportunities',
  'Investment', 'Partnerships', 'Feedback', 'Learning Opportunities'
]

interface StepIntentProps {
  data: {
    objectives?: string[]
    seeking?: string[]
    openness?: number
    introStyle?: 'short' | 'detailed'
    enableIcebreakers?: boolean
  }
  onChange: (data: any) => void
}

export function StepIntent({ data, onChange }: StepIntentProps) {
  const handleArrayChange = (field: string, value: string, maxCount: number) => {
    const currentArray = data[field as keyof typeof data] as string[] || []
    let newArray: string[]
    
    if (currentArray.includes(value)) {
      newArray = currentArray.filter(item => item !== value)
    } else if (currentArray.length < maxCount) {
      newArray = [...currentArray, value]
    } else {
      return // Don't add if at max count
    }
    
    onChange({ ...data, [field]: newArray })
  }

  const handleSliderChange = (value: number[]) => {
    onChange({ ...data, openness: value[0] })
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    onChange({ ...data, [field]: checked })
  }

  const handleRadioChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-8">

      {/* Objectives */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Objectives (max 4) {data.objectives?.length || 0}/4
        </Label>
        <div className="flex flex-wrap gap-2">
          {OBJECTIVES.map((objective) => (
            <Badge
              key={objective}
              variant={data.objectives?.includes(objective) ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                data.objectives?.includes(objective)
                  ? 'bg-inkwell text-aulait'
                  : 'hover:bg-inkwell/10'
              }`}
              onClick={() => handleArrayChange('objectives', objective, 4)}
            >
              {objective}
            </Badge>
          ))}
        </div>
      </div>

      {/* Seeking */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Seeking (max 3) {data.seeking?.length || 0}/3
        </Label>
        <div className="flex flex-wrap gap-2">
          {SEEKING.map((item) => (
            <Badge
              key={item}
              variant={data.seeking?.includes(item) ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                data.seeking?.includes(item)
                  ? 'bg-lunar text-aulait'
                  : 'hover:bg-lunar/10'
              }`}
              onClick={() => handleArrayChange('seeking', item, 3)}
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-6 pt-4 border-t border-lunar/20">
        <h4 className="font-medium text-inkwell">Preferences</h4>
        
        {/* Openness Slider */}
        <div>
          <Label className="text-inkwell font-medium mb-3 block">
            Openness to new connections: {data.openness || 3}/5
          </Label>
          <div className="px-2">
            <Slider
              value={[data.openness || 3]}
              onValueChange={handleSliderChange}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-lunar mt-2">
              <span>Selective</span>
              <span>Very Open</span>
            </div>
          </div>
        </div>

        {/* Intro Style */}
        <div>
          <Label className="text-inkwell font-medium mb-3 block">
            Introduction Style
          </Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="introStyle"
                value="short"
                checked={data.introStyle === 'short'}
                onChange={(e) => handleRadioChange('introStyle', e.target.value)}
                className="text-inkwell"
              />
              <span className="text-lunar">Short & Direct</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="introStyle"
                value="detailed"
                checked={data.introStyle === 'detailed'}
                onChange={(e) => handleRadioChange('introStyle', e.target.value)}
                className="text-inkwell"
              />
              <span className="text-lunar">Detailed & Personal</span>
            </label>
          </div>
        </div>

        {/* Icebreakers Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-inkwell font-medium">Enable AI Icebreakers</Label>
            <p className="text-sm text-lunar">Get conversation starters for your matches</p>
          </div>
          <Switch
            checked={data.enableIcebreakers || false}
            onCheckedChange={(checked) => handleSwitchChange('enableIcebreakers', checked)}
          />
        </div>
      </div>
    </div>
  )
}
