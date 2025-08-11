import { z } from "zod";

// NuConnect schema definitions for Supabase integration
// Note: Using Supabase auth.users table instead of custom users table

// Database tables: profiles, events, matchRooms, matches, connections, contactShares, boostTransactions

// User profile information for NuConnect
export const insertProfileSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string().min(1),
  profile_photo_url: z.string().url().optional(),
  interests: z.array(z.string()).default([]),
  career_goals: z.string().optional(),
  mentorship_pref: z.enum(['seeking', 'offering', 'both', 'none']).default('none'),
  contact_prefs: z.record(z.any()).default({}),
});

export const insertEventSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  date_time: z.string().datetime(),
  created_by: z.string().uuid().optional(),
});

export const insertMatchRoomSchema = z.object({
  event_id: z.string().uuid().optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  created_by: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const insertRoomMemberSchema = z.object({
  room_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const insertMatchSchema = z.object({
  room_id: z.string().uuid(),
  user_a: z.string().uuid(),
  user_b: z.string().uuid(),
  match_score: z.number().min(0).max(1).optional(),
  shared_topics: z.array(z.string()).default([]),
  ai_explanation: z.string().optional(),
});

export const insertContactShareSchema = z.object({
  match_id: z.string().uuid(),
  user_id: z.string().uuid(),
  payload: z.record(z.any()),
});

export const insertConnectionSchema = z.object({
  user_id: z.string().uuid(),
  match_id: z.string().uuid(),
  notes: z.string().optional(),
});

export const insertBoostTransactionSchema = z.object({
  user_id: z.string().uuid(),
  type: z.enum(['priority_visibility', 'extra_matches', 'save_contact_card']),
  amount_cents: z.number().int().default(0),
  status: z.string().default('not_applicable'),
});

// Legacy schemas for backward compatibility
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  relationshipStatus: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertMatchRoom = z.infer<typeof insertMatchRoomSchema>;
export type InsertRoomMember = z.infer<typeof insertRoomMemberSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type InsertContactShare = z.infer<typeof insertContactShareSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type InsertBoostTransaction = z.infer<typeof insertBoostTransactionSchema>;

// Legacy types for backward compatibility
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

// Database record types (what comes back from Supabase)
export interface Profile {
  user_id: string;
  name: string;
  profile_photo_url?: string;
  interests: string[];
  career_goals?: string;
  mentorship_pref: 'seeking' | 'offering' | 'both' | 'none';
  contact_prefs: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  location?: string;
  date_time: string;
  created_by?: string;
  created_at: string;
}

export interface MatchRoom {
  id: string;
  event_id?: string;
  visibility: 'public' | 'private';
  created_by?: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface RoomMember {
  room_id: string;
  user_id: string;
  joined_at: string;
}

export interface Match {
  id: string;
  room_id: string;
  user_a: string;
  user_b: string;
  match_score?: number;
  shared_topics: string[];
  ai_explanation?: string;
  created_at: string;
}

export interface ContactShare {
  match_id: string;
  user_id: string;
  payload: Record<string, any>;
  shared_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  match_id: string;
  notes?: string;
  created_at: string;
}

export interface BoostTransaction {
  id: string;
  user_id: string;
  type: 'priority_visibility' | 'extra_matches' | 'save_contact_card';
  amount_cents: number;
  status: string;
  created_at: string;
}

// Legacy types for backward compatibility
export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  relationshipStatus?: string;
  createdAt: Date;
}

// Questionnaire types (legacy - keeping for backward compatibility)
export interface QuestionnaireResponse {
  id: number;
  userId: number;
  answers: any;
  isComplete: boolean;
  submittedAt: Date;
  updatedAt: Date;
}

export interface ProfessionalSignup {
  id: number;
  name: string;
  firm: string;
  email: string;
  phone: string;
  specialty: string;
  submittedAt: Date;
}

export interface ContactSubmission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationshipStatus: string;
  message: string;
  submittedAt: Date;
}

export type InsertQuestionnaireResponse = Omit<QuestionnaireResponse, 'id' | 'submittedAt' | 'updatedAt'>;
export type InsertProfessionalSignup = Omit<ProfessionalSignup, 'id' | 'submittedAt'>;
export type InsertContactSubmission = Omit<ContactSubmission, 'id' | 'submittedAt'>;
