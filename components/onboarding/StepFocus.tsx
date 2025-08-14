'use client'

import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Search } from 'lucide-react'

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
  'Real Estate', 'Media', 'Transportation', 'Energy', 'Agriculture', 'Consulting'
]

const SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Product Management', 'UX Design',
  'Data Science', 'Marketing', 'Sales', 'Operations', 'Strategy', 'Leadership'
]

const INTERESTS = [
  'AI', 'Machine Learning', 'Blockchain', 'Climate Tech', 'Fintech', 'EdTech',
  'HealthTech', 'Gaming', 'Music', 'Art', 'Sports', 'Travel', 'Cooking', 'Reading'
]

const SENIORITY_OPTIONS = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)', 
  'Senior Level (6-10 years)',
  'Lead/Principal (10+ years)',
  'Executive/C-Level'
]

interface StepFocusProps {
  data: {
    industries?: string[]
    skills?: string[]
    interests?: string[]
    seniority?: string
  }
  onChange: (data: any) => void
}

export function StepFocus({ data, onChange }: StepFocusProps) {
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleSeniorityChange = (value: string) => {
    onChange({ ...data, seniority: value })
  }

  const filterOptions = (options: string[]) => {
    if (!searchTerm) return options
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="space-y-8">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lunar w-4 h-4" />
        <Input
          placeholder="Search industries, skills, interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Industries */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Industries (max 3) {data.industries?.length || 0}/3
        </Label>
        <div className="flex flex-wrap gap-2">
          {filterOptions(INDUSTRIES).map((industry) => (
            <Badge
              key={industry}
              variant={data.industries?.includes(industry) ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                data.industries?.includes(industry)
                  ? 'bg-inkwell text-aulait'
                  : 'hover:bg-inkwell/10'
              }`}
              onClick={() => handleArrayChange('industries', industry, 3)}
            >
              {industry}
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Skills (max 5) {data.skills?.length || 0}/5
        </Label>
        <div className="flex flex-wrap gap-2">
          {filterOptions(SKILLS).map((skill) => (
            <Badge
              key={skill}
              variant={data.skills?.includes(skill) ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                data.skills?.includes(skill)
                  ? 'bg-lunar text-aulait'
                  : 'hover:bg-lunar/10'
              }`}
              onClick={() => handleArrayChange('skills', skill, 5)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Interests (max 7) {data.interests?.length || 0}/7
        </Label>
        <div className="flex flex-wrap gap-2">
          {filterOptions(INTERESTS).map((interest) => (
            <Badge
              key={interest}
              variant={data.interests?.includes(interest) ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                data.interests?.includes(interest)
                  ? 'bg-creme text-aulait'
                  : 'hover:bg-creme/10'
              }`}
              onClick={() => handleArrayChange('interests', interest, 7)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Seniority */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Seniority Level
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {SENIORITY_OPTIONS.map((option) => (
            <label
              key={option}
              className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                data.seniority === option
                  ? 'border-inkwell bg-inkwell/5 text-inkwell'
                  : 'border-lunar/30 text-lunar hover:bg-lunar/5'
              }`}
            >
              <input
                type="radio"
                name="seniority"
                value={option}
                checked={data.seniority === option}
                onChange={(e) => handleSeniorityChange(e.target.value)}
                className="sr-only"
              />
              <span className="font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
