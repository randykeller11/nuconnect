export type EventRow = {
  id: string
  name: string
  summary?: string | null
  starts_at?: string | null  // ISO
  city?: string | null
  participants_count?: number | null
}

export type RoomRow = {
  id: string
  event_id?: string | null
  name: string
  slug: string
  tagline?: string | null
  topic?: string | null
  is_public: boolean
  member_count: number
}

export type RoomMemberRow = {
  room_id: string
  user_id: string
  joined_at: string
}

export type ProfileRow = {
  user_id: string
  name?: string | null
  role?: string | null
  headline?: string | null
  industries?: string[] | null
  skills?: string[] | null
  interests?: string[] | null
  networking_goals?: string[] | null
  linkedin_url?: string | null
  profile_photo_url?: string | null
  company?: string | null
  location?: string | null
  seniority?: string | null
  objectives?: string[] | null
  seeking?: string[] | null
  openness?: number | null
  intro_style?: string | null
  enable_icebreakers?: boolean | null
  show_linkedin?: boolean | null
  show_company?: boolean | null
  primary_skill?: string | null
  icebreaker_tone?: string | null
}

// Combined types for API responses
export type EventWithRooms = EventRow & {
  rooms: RoomRow[]
}

export type RoomWithEvent = {
  room: RoomRow
  event: EventRow | null
}
