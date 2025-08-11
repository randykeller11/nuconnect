import { pgTable, text, serial, timestamp, uuid, jsonb, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core user authentication table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User profile information for NuConnect
export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey(),
  name: text("name").notNull(),
  profilePhotoUrl: text("profile_photo_url"),
  interests: text("interests").array().default([]),
  careerGoals: text("career_goals"),
  mentorshipPref: text("mentorship_pref").default("none"), // 'seeking', 'offering', 'both', 'none'
  contactPrefs: jsonb("contact_prefs").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Events that host networking sessions
export const events = pgTable("events", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  dateTime: timestamp("date_time").notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Match rooms within events
export const matchRooms = pgTable("match_rooms", {
  id: uuid("id").primaryKey(),
  eventId: uuid("event_id"),
  visibility: text("visibility").default("public"), // 'public', 'private'
  createdBy: uuid("created_by"),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Room membership
export const roomMembers = pgTable("room_members", {
  roomId: uuid("room_id").notNull(),
  userId: uuid("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// AI-generated matches
export const matches = pgTable("matches", {
  id: uuid("id").primaryKey(),
  roomId: uuid("room_id").notNull(),
  userA: uuid("user_a").notNull(),
  userB: uuid("user_b").notNull(),
  matchScore: numeric("match_score"),
  sharedTopics: text("shared_topics").array().default([]),
  aiExplanation: text("ai_explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact information sharing
export const contactShares = pgTable("contact_shares", {
  matchId: uuid("match_id").notNull(),
  userId: uuid("user_id").notNull(),
  payload: jsonb("payload").notNull(),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
});

// User connections and notes
export const connections = pgTable("connections", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  matchId: uuid("match_id").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Boost transactions (future feature)
export const boostTransactions = pgTable("boost_transactions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  type: text("type").notNull(), // 'priority_visibility', 'extra_matches', 'save_contact_card'
  amountCents: integer("amount_cents").default(0),
  status: text("status").default("not_applicable"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  createdAt: true,
  updatedAt: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Event = typeof events.$inferSelect;
export type MatchRoom = typeof matchRooms.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Connection = typeof connections.$inferSelect;
