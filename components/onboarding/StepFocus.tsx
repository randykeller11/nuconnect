'use client'

import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Search, Star } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

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
  'Student / Career Transition',
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
  const [expandedPanel, setExpandedPanel] = useState<'industries' | 'skills' | 'interests' | 'seniority'>('industries')

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

  // Collapsible panel helper
  const Panel = ({
    id,
    label,
    children,
    tooltip,
  }: {
    id: 'industries' | 'skills' | 'interests' | 'seniority'
    label: string
    children: React.ReactNode
    tooltip?: string
  }) => (
    <div className="mb-4">
      <div
        className={`flex items-center justify-between cursor-pointer select-none py-2 px-2 rounded-lg ${expandedPanel === id ? 'bg-aulait/60' : 'hover:bg-aulait/30'}`}
        onClick={() => setExpandedPanel(id)}
      >
        <div className="flex items-center gap-2">
          <Label className="text-inkwell font-medium">{label}</Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-lunar cursor-help">❓</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">{tooltip}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="text-xs text-lunar">
          {id === 'industries' && `${data.industries?.length || 0}/3`}
          {id === 'skills' && `${data.skills?.length || 0}/5`}
          {id === 'interests' && `${data.interests?.length || 0}/7`}
        </span>
      </div>
      {expandedPanel === id && (
        <div className="pt-2">{children}</div>
      )}
    </div>
  )

  // "Other" input for industries
  const [otherIndustry, setOtherIndustry] = useState('')
  const handleAddOtherIndustry = () => {
    if (otherIndustry.trim() && (!data.industries || data.industries.length < 3)) {
      handleArrayChange('industries', otherIndustry.trim(), 3)
      setOtherIndustry('')
    }
  }

  // Progress bar encouragement
  const encouragement = "These details help us make smarter matches at your next event."

  // Primary skill highlight
  const primarySkill = data.primarySkill

  return (
    <div className="space-y-6">
      <div className="mb-2 text-center text-sm text-lunar">{encouragement}</div>
      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lunar w-4 h-4" />
        <Input
          placeholder="Search industries, skills, interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collapsible Panels */}
      <Panel
        id="industries"
        label="Industries"
        tooltip="Industries help us match you with people in similar or complementary fields."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        {/* Other industry input */}
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Other (type in)"
            value={otherIndustry}
            onChange={e => setOtherIndustry(e.target.value)}
            className="w-48"
            maxLength={32}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddOtherIndustry}
            disabled={!otherIndustry.trim() || (data.industries?.length || 0) >= 3}
          >
            Add
          </Button>
        </div>
      </Panel>

      <Panel
        id="skills"
        label="Skills"
        tooltip="Skills are used to find people with similar expertise or those who need your help."
      >
        {/* Primary skill highlight */}
        {primarySkill && (
          <div className="mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-inkwell">Primary Skill: {primarySkill}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SKILL_GROUPS.map(group => (
            <div key={group.label} className="mb-2">
              <div className="text-xs text-lunar mb-1">{group.label}</div>
              <div className="flex flex-wrap gap-2">
                {filterOptions(group.options).map((skill) => (
                  <Badge
                    key={skill}
                    variant={data.skills?.includes(skill) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-colors relative group ${
                      data.skills?.includes(skill)
                        ? 'bg-lunar text-aulait'
                        : 'hover:bg-lunar/10'
                    }`}
                    onClick={() => handleArrayChange('skills', skill, 5)}
                  >
                    {skill}
                    {/* Star icon toggle for primary skill */}
                    {data.skills?.includes(skill) && (
                      <span
                        className="ml-1 cursor-pointer"
                        onClick={e => {
                          e.stopPropagation()
                          handlePrimarySkillChange(skill)
                        }}
                        title="Set as Primary Skill"
                      >
                        <Star
                          className={`w-4 h-4 inline align-middle transition-colors ${
                            data.primarySkill === skill ? 'text-yellow-500 fill-yellow-400' : 'text-lunar group-hover:text-yellow-500'
                          }`}
                          fill={data.primarySkill === skill ? '#facc15' : 'none'}
                        />
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-lunar mt-1">
          <span>Click the <Star className="inline w-3 h-3 text-yellow-500" /> to set your Primary Skill.</span>
        </div>
      </Panel>

      <Panel
        id="interests"
        label="Interests"
        tooltip="Interests help us find common ground for introductions and icebreakers."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
      </Panel>

      <Panel
        id="seniority"
        label="Seniority Level"
        tooltip="Seniority helps us match you with peers at a similar career stage."
      >
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
      </Panel>
    </div>
  )
}
