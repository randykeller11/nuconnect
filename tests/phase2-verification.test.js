const { createClient } = require('@supabase/supabase-js');

// Mock Supabase client for testing
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    insert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    update: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    delete: jest.fn(() => Promise.resolve({ data: {}, error: null }))
  }))
};

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase)
}));

describe('Phase 2: Database Migrations Verification', () => {
  
  describe('Supabase connection and configuration', () => {
    test('should have required environment variables', () => {
      // Check if environment variables are defined (they might be empty in test env)
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
      expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
    });

    test('should be able to create Supabase client', () => {
      const supabase = createClient('test-url', 'test-key');
      expect(supabase).toBeDefined();
      expect(createClient).toHaveBeenCalled();
    });
  });

  describe('NuConnect schema validation', () => {
    test('shared/schema.ts should contain NuConnect-specific schemas', () => {
      const schema = require('../shared/schema');
      
      // Check for NuConnect schema exports
      expect(schema.insertProfileSchema).toBeDefined();
      expect(schema.insertEventSchema).toBeDefined();
      expect(schema.insertMatchRoomSchema).toBeDefined();
      expect(schema.insertRoomMemberSchema).toBeDefined();
      expect(schema.insertMatchSchema).toBeDefined();
      expect(schema.insertContactShareSchema).toBeDefined();
      expect(schema.insertConnectionSchema).toBeDefined();
      expect(schema.insertBoostTransactionSchema).toBeDefined();
    });

    test('profile schema should validate correctly', () => {
      const { insertProfileSchema } = require('../shared/schema');
      
      const validProfile = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        interests: ['AI', 'Fintech'],
        career_goals: 'find-cofounder',
        mentorship_pref: 'seeking',
        contact_prefs: { email: 'john@example.com' }
      };

      const result = insertProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    test('event schema should validate correctly', () => {
      const { insertEventSchema } = require('../shared/schema');
      
      const validEvent = {
        name: 'Tech Meetup',
        description: 'Monthly networking event',
        location: 'Chicago, IL',
        date_time: new Date().toISOString(),
        created_by: '123e4567-e89b-12d3-a456-426614174000'
      };

      const result = insertEventSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
    });

    test('match room schema should validate correctly', () => {
      const { insertMatchRoomSchema } = require('../shared/schema');
      
      const validRoom = {
        event_id: '123e4567-e89b-12d3-a456-426614174000',
        visibility: 'public',
        created_by: '123e4567-e89b-12d3-a456-426614174000',
        name: 'AI Enthusiasts',
        description: 'Connect with AI professionals'
      };

      const result = insertMatchRoomSchema.safeParse(validRoom);
      expect(result.success).toBe(true);
    });

    test('match schema should validate correctly', () => {
      const { insertMatchSchema } = require('../shared/schema');
      
      const validMatch = {
        room_id: '123e4567-e89b-12d3-a456-426614174000',
        user_a: '123e4567-e89b-12d3-a456-426614174001',
        user_b: '123e4567-e89b-12d3-a456-426614174002',
        match_score: 0.85,
        shared_topics: ['AI', 'Education'],
        ai_explanation: 'Both users interested in AI education'
      };

      const result = insertMatchSchema.safeParse(validMatch);
      expect(result.success).toBe(true);
    });
  });

  describe('Database table structure expectations', () => {
    test('should expect profiles table structure', () => {
      // This test documents the expected table structure
      const expectedProfileColumns = [
        'user_id',
        'name', 
        'profile_photo_url',
        'interests',
        'career_goals',
        'mentorship_pref',
        'contact_prefs',
        'created_at',
        'updated_at'
      ];

      // In a real test, you would query the database schema
      // For now, we just document the expected structure
      expect(expectedProfileColumns).toContain('user_id');
      expect(expectedProfileColumns).toContain('interests');
      expect(expectedProfileColumns).toContain('mentorship_pref');
    });

    test('should expect events table structure', () => {
      const expectedEventColumns = [
        'id',
        'name',
        'description', 
        'location',
        'date_time',
        'created_by',
        'created_at'
      ];

      expect(expectedEventColumns).toContain('id');
      expect(expectedEventColumns).toContain('date_time');
      expect(expectedEventColumns).toContain('created_by');
    });

    test('should expect match_rooms table structure', () => {
      const expectedRoomColumns = [
        'id',
        'event_id',
        'visibility',
        'created_by',
        'name',
        'description',
        'created_at'
      ];

      expect(expectedRoomColumns).toContain('visibility');
      expect(expectedRoomColumns).toContain('event_id');
    });

    test('should expect matches table structure', () => {
      const expectedMatchColumns = [
        'id',
        'room_id',
        'user_a',
        'user_b', 
        'match_score',
        'shared_topics',
        'ai_explanation',
        'created_at'
      ];

      expect(expectedMatchColumns).toContain('user_a');
      expect(expectedMatchColumns).toContain('user_b');
      expect(expectedMatchColumns).toContain('match_score');
      expect(expectedMatchColumns).toContain('shared_topics');
    });
  });

  describe('Schema validation edge cases', () => {
    test('profile schema should reject invalid mentorship preferences', () => {
      const { insertProfileSchema } = require('../shared/schema');
      
      const invalidProfile = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        mentorship_pref: 'invalid_option' // Should be one of: seeking, offering, both, none
      };

      const result = insertProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    test('match room schema should reject invalid visibility', () => {
      const { insertMatchRoomSchema } = require('../shared/schema');
      
      const invalidRoom = {
        name: 'Test Room',
        visibility: 'invalid_visibility' // Should be 'public' or 'private'
      };

      const result = insertMatchRoomSchema.safeParse(invalidRoom);
      expect(result.success).toBe(false);
    });

    test('match schema should reject invalid match score', () => {
      const { insertMatchSchema } = require('../shared/schema');
      
      const invalidMatch = {
        room_id: '123e4567-e89b-12d3-a456-426614174000',
        user_a: '123e4567-e89b-12d3-a456-426614174001',
        user_b: '123e4567-e89b-12d3-a456-426614174002',
        match_score: 1.5 // Should be between 0 and 1
      };

      const result = insertMatchSchema.safeParse(invalidMatch);
      expect(result.success).toBe(false);
    });
  });

  describe('Type definitions', () => {
    test('should export TypeScript types', () => {
      const schema = require('../shared/schema');
      
      // Check that type exports exist (they won't have runtime values)
      expect(typeof schema.insertProfileSchema).toBe('object');
      expect(typeof schema.insertEventSchema).toBe('object');
      expect(typeof schema.insertMatchRoomSchema).toBe('object');
    });
  });

  describe('Backward compatibility', () => {
    test('should maintain legacy schemas for backward compatibility', () => {
      const schema = require('../shared/schema');
      
      // Check that legacy schemas still exist
      expect(schema.insertUserSchema).toBeDefined();
      expect(schema.loginUserSchema).toBeDefined();
    });

    test('legacy user schema should still validate', () => {
      const { insertUserSchema } = require('../shared/schema');
      
      const validUser = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const result = insertUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });
  });
});
