'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { uploadAvatar, getAvatarUrl } from '@/lib/storage'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { ROLES, INDUSTRIES, NETWORKING_GOALS, CONNECTION_PREFERENCES, SKILLS } from '@/shared/taxonomy'

export default function ProfileEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [form, setForm] = useState<any>({
    first_name: '',
    last_name: '',
    avatar_url: '',
    role: '',
    industries: [],
    networking_goals: [],
    connection_preferences: [],
    bio: '',
    skills: [],
    linkedin_url: ''
  })

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Check auth
        const supabase = supabaseBrowser()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          router.push('/auth')
          return
        }

        setUserId(user.id)

        // Load profile
        const res = await fetch('/api/me/profile')
        const json = await res.json()
        
        if (json?.profile) {
          setForm({ ...form, ...json.profile })
        }
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    initializeProfile()
  }, [])

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    try {
      const path = await uploadAvatar(file, userId)
      setForm((f: any) => ({ ...f, avatar_url: path }))
      toast.success('Avatar updated')
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message)
    }
  }

  async function onSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json?.error || 'Save failed')
      }
      
      toast.success('Profile saved successfully')
    } catch (err: any) {
      toast.error('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-aulait to-aulait/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inkwell mx-auto mb-4"></div>
          <p className="text-lunar font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aulait to-aulait/80 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-inkwell mb-2">Edit Your Profile</h1>
          <p className="text-xl text-lunar">Keep your networking profile up to date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar + Basic Info */}
          <Card className="lg:col-span-1 shadow-2xl border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-inkwell">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-lunar/20 overflow-hidden border-4 border-white shadow-lg">
                  {form.avatar_url ? (
                    <img 
                      src={getAvatarUrl(form.avatar_url) || ''} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lunar">
                      <span className="text-2xl font-bold">
                        {form.first_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-inkwell hover:text-lunar transition-colors">
                      Change Photo
                    </span>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={onAvatarChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-inkwell mb-1">First Name</label>
                    <Input 
                      value={form.first_name || ''} 
                      onChange={e => setForm({ ...form, first_name: e.target.value })}
                      className="border-2 border-lunar/20 focus:border-inkwell rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-inkwell mb-1">Last Name</label>
                    <Input 
                      value={form.last_name || ''} 
                      onChange={e => setForm({ ...form, last_name: e.target.value })}
                      className="border-2 border-lunar/20 focus:border-inkwell rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-inkwell mb-1">LinkedIn URL</label>
                  <Input 
                    placeholder="https://linkedin.com/in/yourname"
                    value={form.linkedin_url || ''}
                    onChange={e => setForm({ ...form, linkedin_url: e.target.value })}
                    className="border-2 border-lunar/20 focus:border-inkwell rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Professional Details */}
          <Card className="lg:col-span-2 shadow-2xl border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-inkwell">Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Role */}
              <div>
                <label className="block text-base font-medium text-inkwell mb-2">Current Role</label>
                <select
                  className="w-full h-12 text-base rounded-lg border-2 border-lunar/20 focus:border-inkwell bg-background px-4"
                  value={form.role || ''}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Select your role</option>
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Industries */}
              <MultiSelect
                label="Industries"
                helper="Select up to 3 industries that best describe your work"
                options={INDUSTRIES}
                values={form.industries || []}
                onChange={(values) => setForm({ ...form, industries: values })}
                max={3}
              />

              {/* Networking Goals */}
              <MultiSelect
                label="Networking Goals"
                helper="What do you want to achieve through networking?"
                options={NETWORKING_GOALS}
                values={form.networking_goals || []}
                onChange={(values) => setForm({ ...form, networking_goals: values })}
                max={4}
              />

              {/* Connection Preferences */}
              <MultiSelect
                label="Who You Want to Meet"
                helper="Select the types of people you'd like to connect with"
                options={CONNECTION_PREFERENCES}
                values={form.connection_preferences || []}
                onChange={(values) => setForm({ ...form, connection_preferences: values })}
                max={4}
              />

              {/* Skills */}
              <TagCombobox
                label="Skills & Interests"
                helper="Add skills, technologies, or areas of interest"
                options={SKILLS}
                values={form.skills || []}
                onChange={(values) => setForm({ ...form, skills: values })}
                allowCreate={true}
                max={10}
              />

              {/* Bio */}
              <div>
                <label className="block text-base font-medium text-inkwell mb-2">Short Bio</label>
                <Textarea
                  placeholder="Tell people about yourself, what you're working on, or what you'd like to discuss..."
                  value={form.bio || ''}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  className="border-2 border-lunar/20 focus:border-inkwell rounded-lg min-h-[120px]"
                  maxLength={600}
                />
                <div className="text-xs text-lunar mt-1 text-right">
                  {(form.bio?.length || 0)}/600 characters
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="px-8 py-3 text-base rounded-xl border-2 border-lunar/20 hover:border-inkwell"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={onSave} 
                  disabled={saving}
                  className="px-8 py-3 text-base bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait rounded-xl shadow-lg transition-all duration-300"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Multi-select component
function MultiSelect({ label, helper, options, values, onChange, max = 99 }: {
  label: string
  helper?: string
  options: string[]
  values: string[]
  onChange: (values: string[]) => void
  max?: number
}) {
  const toggle = (option: string) => {
    const hasOption = values.includes(option)
    let newValues = hasOption 
      ? values.filter(v => v !== option) 
      : [...values, option]
    
    if (newValues.length > max) {
      newValues = newValues.slice(0, max)
    }
    
    onChange(newValues)
  }

  return (
    <div>
      <label className="block text-base font-medium text-inkwell mb-1">{label}</label>
      {helper && <p className="text-sm text-lunar mb-3">{helper}</p>}
      
      {/* Selected items */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem] p-3 border-2 border-lunar/20 rounded-lg bg-background">
        {values.length === 0 ? (
          <span className="text-lunar italic">Click options below to add them</span>
        ) : (
          values.map(value => (
            <Badge 
              key={value}
              variant="secondary"
              className="cursor-pointer bg-inkwell text-aulait hover:bg-lunar px-3 py-1"
              onClick={() => toggle(value)}
            >
              {value} ×
            </Badge>
          ))
        )}
      </div>

      {/* Available options */}
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {options.map(option => {
          const isSelected = values.includes(option)
          const isMaxReached = values.length >= max
          
          return (
            <button
              key={option}
              type="button"
              disabled={!isSelected && isMaxReached}
              onClick={() => toggle(option)}
              className={`p-3 text-sm rounded-lg border-2 transition-all text-left ${
                isSelected 
                  ? 'border-inkwell bg-inkwell text-aulait' 
                  : isMaxReached
                  ? 'border-lunar/20 bg-lunar/10 text-lunar/50 cursor-not-allowed'
                  : 'border-lunar/20 bg-background text-inkwell hover:border-inkwell hover:bg-inkwell/5'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
      
      {max < 99 && (
        <p className="text-sm text-lunar text-center mt-2">
          {values.length} / {max} selected
        </p>
      )}
    </div>
  )
}

// Tag combobox component
function TagCombobox({ label, helper, options, values, onChange, allowCreate = false, max = 10 }: {
  label: string
  helper?: string
  options: string[]
  values: string[]
  onChange: (values: string[]) => void
  allowCreate?: boolean
  max?: number
}) {
  const [input, setInput] = useState('')

  const addValue = (value: string) => {
    const trimmedValue = value.trim()
    if (!trimmedValue || values.includes(trimmedValue) || values.length >= max) return
    
    onChange([...values, trimmedValue])
    setInput('')
  }

  const removeValue = (value: string) => {
    onChange(values.filter(v => v !== value))
  }

  return (
    <div>
      <label className="block text-base font-medium text-inkwell mb-1">{label}</label>
      {helper && <p className="text-sm text-lunar mb-3">{helper}</p>}
      
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {values.map(value => (
          <Badge 
            key={value}
            variant="secondary"
            className="bg-lunar/10 text-inkwell border border-lunar/20 px-3 py-1"
          >
            {value}
            <button 
              className="ml-2 text-xs opacity-70 hover:opacity-100" 
              onClick={() => removeValue(value)}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            list="skill-options"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addValue(input)
              }
            }}
            placeholder="Type to add or pick from suggestions..."
            className="border-2 border-lunar/20 focus:border-inkwell rounded-lg"
          />
          <datalist id="skill-options">
            {options.map(option => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>
        <Button
          type="button"
          onClick={() => addValue(input)}
          disabled={!input.trim() || values.length >= max}
          className="bg-inkwell hover:bg-lunar text-aulait rounded-lg"
        >
          Add
        </Button>
      </div>
      
      <p className="text-xs text-lunar mt-1">
        {values.length} / {max} skills added
      </p>
    </div>
  )
}
