'use client'

import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Search } from 'lucide-react'

const INDUSTRY_GROUPS = [
  {
    label: "Tech & Startups",
    options: [
      "Technology", "Startups", "Venture Capital", "Fintech", "EdTech", "HealthTech", "Climate Tech"
    ]
  },
  {
    label: "Business & Services",
    options: [
      "Consulting", "Finance", "Retail", "Manufacturing", "Non-Tech Services", "Logistics/Supply Chain", "Hospitality", "Real Estate"
    ]
  },
  {
    label: "Impact & Public",
    options: [
      "Nonprofit", "Government", "NGO", "Social Impact"
    ]
  },
  {
    label: "Creative & Media",
    options: [
      "Media", "Creative/Arts"
    ]
  },
  {
    label: "Other",
    options: [
      "Healthcare", "Education", "Energy", "Agriculture", "Transportation"
    ]
  }
]

const SKILL_GROUPS = [
  {
    label: "Tech",
    options: [
      "JavaScript", "Python", "React", "Node.js", "Data Analytics", "Cybersecurity", "AI/ML", "Cloud Architecture", "DevOps"
    ]
  },
  {
    label: "Business",
    options: [
      "Negotiation", "Sales Strategy", "Business Development", "Fundraising", "Partnerships", "Project Management"
    ]
  },
  {
    label: "Creative",
    options: [
      "Branding", "Content Creation", "Video Editing", "Storytelling", "UX/UI"
    ]
  },
  {
    label: "People Skills",
    options: [
      "Mentorship", "Conflict Resolution", "Public Speaking", "Community Management"
    ]
  }
]

const INTEREST_GROUPS = [
  {
    label: "Emerging Tech",
    options: [
      "AI", "Machine Learning", "Blockchain", "AR/VR", "Climate Tech"
    ]
  },
  {
    label: "Lifestyle",
    options: [
      "Travel", "Cooking", "Reading", "Sports"
    ]
  },
  {
    label: "Social Good",
    options: [
      "Education Equity", "Sustainability", "Diversity & Inclusion"
    ]
  },
  {
    label: "Hobbies",
    options: [
      "Gaming", "Music", "Art", "Photography"
    ]
  }
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
    primarySkill?: string
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

  // Primary Skill selection
  const handlePrimarySkillChange = (skill: string) => {
    onChange({ ...data, primarySkill: skill })
  }

  // Filter helper for search
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
        {INDUSTRY_GROUPS.map(group => (
          <div key={group.label} className="mb-2">
            <div className="text-xs text-lunar mb-1">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {filterOptions(group.options).map((industry) => (
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
        ))}
      </div>

      {/* Skills */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Skills (max 5) {data.skills?.length || 0}/5
        </Label>
        {SKILL_GROUPS.map(group => (
          <div key={group.label} className="mb-2">
            <div className="text-xs text-lunar mb-1">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {filterOptions(group.options).map((skill) => (
                <Badge
                  key={skill}
                  variant={data.skills?.includes(skill) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    data.skills?.includes(skill)
                      ? 'bg-lunar text-aulait'
                      : 'hover:bg-lunar/10'
                  }`}
                  onClick={() => handleArrayChange('skills', skill, 5)}
                  style={{
                    border: data.primarySkill === skill ? '2px solid #3b3b4f' : undefined,
                    boxShadow: data.primarySkill === skill ? '0 0 0 2px #3b3b4f' : undefined
                  }}
                  onDoubleClick={() => handlePrimarySkillChange(skill)}
                  title="Double-click to set as Primary Skill"
                >
                  {skill}
                  {data.primarySkill === skill && (
                    <span className="ml-1 text-xs text-inkwell font-bold">(Primary)</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        <div className="text-xs text-lunar mt-1">
          <span>Double-click a skill to set as your Primary Skill.</span>
        </div>
      </div>

      {/* Interests */}
      <div>
        <Label className="text-inkwell font-medium mb-3 block">
          Interests (max 7) {data.interests?.length || 0}/7
        </Label>
        {INTEREST_GROUPS.map(group => (
          <div key={group.label} className="mb-2">
            <div className="text-xs text-lunar mb-1">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {filterOptions(group.options).map((interest) => (
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
        ))}
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
