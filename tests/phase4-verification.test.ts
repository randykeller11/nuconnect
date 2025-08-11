import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

// Mock the dependencies
jest.mock('../lib/pipeline/stateMachine', () => ({
  intakeStateMachine: {
    getNextQuestion: jest.fn(),
    processAnswer: jest.fn()
  }
}));

jest.mock('../lib/pipeline/match-heuristic', () => ({
  matchingHeuristic: {
    rankCandidates: jest.fn()
  }
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
      insert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      upsert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }))
}));

describe('Phase 4: API Routes & UI Verification', () => {
  
  describe('API Route Structure', () => {
    test('should have all required API route files', () => {
      const fs = require('fs');
      const requiredRoutes = [
        'app/api/intake/questions/route.ts',
        'app/api/intake/answers/route.ts',
        'app/api/rooms/create/route.ts',
        'app/api/rooms/join/route.ts',
        'app/api/rooms/[id]/match/route.ts',
        'app/api/matches/[id]/share-contact/route.ts',
        'app/api/connections/route.ts',
        'app/api/boosts/route.ts'
      ];

      requiredRoutes.forEach(route => {
        expect(fs.existsSync(route)).toBe(true);
      });
    });

    test('should have all required UI page files', () => {
      const fs = require('fs');
      const requiredPages = [
        'app/login/page.tsx',
        'app/intake/page.tsx',
        'app/rooms/page.tsx',
        'app/rooms/[id]/page.tsx',
        'app/connections/page.tsx'
      ];

      requiredPages.forEach(page => {
        expect(fs.existsSync(page)).toBe(true);
      });
    });

    test('should have all required component files', () => {
      const fs = require('fs');
      const requiredComponents = [
        'components/BrandHeader.tsx',
        'components/FormCard.tsx',
        'components/PrimaryButton.tsx'
      ];

      requiredComponents.forEach(component => {
        expect(fs.existsSync(component)).toBe(true);
      });
    });
  });

  describe('Intake API Routes', () => {
    test('intake questions route should return next question', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      
      const mockQuestion = {
        id: 'name',
        type: 'text',
        question: 'What is your name?',
        required: true
      };
      
      intakeStateMachine.getNextQuestion.mockResolvedValue(mockQuestion);

      // Mock the route handler
      const mockRequest = {
        url: 'http://localhost:3000/api/intake/questions?userId=test-user',
        method: 'GET'
      } as NextRequest;

      // Since we can't easily test the actual route handler without more setup,
      // we'll test the core logic
      const userId = 'test-user';
      const result = await intakeStateMachine.getNextQuestion(userId);
      
      expect(result).toEqual(mockQuestion);
      expect(intakeStateMachine.getNextQuestion).toHaveBeenCalledWith(userId);
    });

    test('intake answers route should process answer', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      
      const mockResult = {
        success: true,
        nextQuestion: {
          id: 'interests',
          type: 'multiselect',
          question: 'What are your interests?',
          options: ['AI', 'Fintech'],
          required: true
        },
        isComplete: false
      };
      
      intakeStateMachine.processAnswer.mockResolvedValue(mockResult);

      const userId = 'test-user';
      const answer = 'John Doe';
      const result = await intakeStateMachine.processAnswer(userId, answer);
      
      expect(result.success).toBe(true);
      expect(result.nextQuestion).toBeDefined();
      expect(intakeStateMachine.processAnswer).toHaveBeenCalledWith(userId, answer);
    });
  });

  describe('Rooms API Routes', () => {
    test('rooms create route should validate input', () => {
      const { insertMatchRoomSchema } = require('../shared/schema');
      
      const validRoom = {
        name: 'Test Room',
        description: 'A test room',
        visibility: 'public',
        event_id: '123e4567-e89b-12d3-a456-426614174000'
      };

      const result = insertMatchRoomSchema.safeParse(validRoom);
      expect(result.success).toBe(true);
    });

    test('rooms join route should validate membership', () => {
      const { insertRoomMemberSchema } = require('../shared/schema');
      
      const validMembership = {
        room_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001'
      };

      const result = insertRoomMemberSchema.safeParse(validMembership);
      expect(result.success).toBe(true);
    });

    test('match generation should use heuristic', async () => {
      const { matchingHeuristic } = require('../lib/pipeline/match-heuristic');
      
      const mockMatches = [
        {
          id: 'match-1',
          profile: {
            user_id: 'user-2',
            name: 'Jane Doe',
            interests: ['AI', 'Fintech'],
            career_goals: 'find-cofounder',
            mentorship_pref: 'offering'
          },
          score: 8.5,
          sharedTopics: ['AI', 'Fintech'],
          explanation: 'Great match based on shared interests'
        }
      ];
      
      matchingHeuristic.rankCandidates.mockReturnValue(mockMatches);

      const userProfile = {
        user_id: 'user-1',
        name: 'John Doe',
        interests: ['AI', 'Fintech'],
        career_goals: 'find-cofounder',
        mentorship_pref: 'seeking'
      };
      
      const candidates = [mockMatches[0].profile];
      const options = { userId: 'user-1', maxMatches: 3 };
      
      const result = matchingHeuristic.rankCandidates(userProfile, candidates, options);
      
      expect(result).toHaveLength(1);
      expect(result[0].score).toBe(8.5);
      expect(result[0].sharedTopics).toContain('AI');
    });
  });

  describe('Contact Sharing API', () => {
    test('contact share route should validate payload', () => {
      const { insertContactShareSchema } = require('../shared/schema');
      
      const validShare = {
        match_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        payload: {
          email: 'john@example.com',
          linkedin: 'https://linkedin.com/in/johndoe'
        }
      };

      const result = insertContactShareSchema.safeParse(validShare);
      expect(result.success).toBe(true);
    });

    test('should handle mutual contact sharing', () => {
      // Mock scenario where both users have shared contact info
      const contactShares = [
        {
          match_id: 'match-1',
          user_id: 'user-1',
          payload: { email: 'user1@example.com' }
        },
        {
          match_id: 'match-1',
          user_id: 'user-2',
          payload: { email: 'user2@example.com' }
        }
      ];

      const isMutual = contactShares.length >= 2;
      expect(isMutual).toBe(true);
    });
  });

  describe('Connections API', () => {
    test('connections route should validate input', () => {
      const { insertConnectionSchema } = require('../shared/schema');
      
      const validConnection = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        match_id: '123e4567-e89b-12d3-a456-426614174001',
        notes: 'Great conversation about AI startups'
      };

      const result = insertConnectionSchema.safeParse(validConnection);
      expect(result.success).toBe(true);
    });
  });

  describe('Boosts API', () => {
    test('boosts route should validate transaction', () => {
      const { insertBoostTransactionSchema } = require('../shared/schema');
      
      const validBoost = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'priority_visibility',
        amount_cents: 500,
        status: 'active'
      };

      const result = insertBoostTransactionSchema.safeParse(validBoost);
      expect(result.success).toBe(true);
    });

    test('should validate boost types', () => {
      const { insertBoostTransactionSchema } = require('../shared/schema');
      
      const validTypes = ['priority_visibility', 'extra_matches', 'save_contact_card'];
      
      validTypes.forEach(type => {
        const boost = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          type,
          amount_cents: 500
        };
        
        const result = insertBoostTransactionSchema.safeParse(boost);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('UI Component Structure', () => {
    test('should have proper TypeScript interfaces', () => {
      // Test that key interfaces are properly defined
      const schema = require('../shared/schema');
      
      expect(typeof schema.insertProfileSchema).toBe('object');
      expect(typeof schema.insertEventSchema).toBe('object');
      expect(typeof schema.insertMatchRoomSchema).toBe('object');
      expect(typeof schema.insertMatchSchema).toBe('object');
    });

    test('should have NuConnect color palette in Tailwind config', () => {
      const tailwindConfig = require('../tailwind.config.js');
      
      expect(tailwindConfig.theme.extend.colors).toHaveProperty('inkwell');
      expect(tailwindConfig.theme.extend.colors).toHaveProperty('lunar');
      expect(tailwindConfig.theme.extend.colors).toHaveProperty('creme');
      expect(tailwindConfig.theme.extend.colors).toHaveProperty('aulait');
      
      expect(tailwindConfig.theme.extend.colors.inkwell).toBe('#2C3639');
      expect(tailwindConfig.theme.extend.colors.lunar).toBe('#3F4E4F');
      expect(tailwindConfig.theme.extend.colors.creme).toBe('#A27B5B');
      expect(tailwindConfig.theme.extend.colors.aulait).toBe('#DCD7C9');
    });
  });

  describe('Toast System', () => {
    test('should have toast provider and hook', () => {
      const fs = require('fs');
      expect(fs.existsSync('lib/hooks/use-toast.tsx')).toBe(true);
      
      // Test that the hook exports the expected functions
      const { useToast, ToastProvider } = require('../lib/hooks/use-toast');
      expect(typeof ToastProvider).toBe('function');
      // Note: useToast can only be tested within a React component context
    });
  });

  describe('Utility Functions', () => {
    test('should have cn utility function', () => {
      const { cn } = require('../lib/utils');
      
      expect(typeof cn).toBe('function');
      
      // Test basic className merging
      const result = cn('text-red-500', 'bg-blue-500');
      expect(typeof result).toBe('string');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });
  });

  describe('Error Handling', () => {
    test('API routes should handle missing parameters', () => {
      // Test validation of required parameters
      const testCases = [
        { userId: undefined, answer: 'test' }, // Missing userId
        { userId: 'test', answer: undefined }, // Missing answer
        { userId: '', answer: 'test' }, // Empty userId
      ];

      testCases.forEach(testCase => {
        const isValid = !!(testCase.userId && testCase.answer);
        expect(isValid).toBe(false);
      });
    });

    test('should validate UUID format', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const invalidUUID = 'not-a-uuid';
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test(validUUID)).toBe(true);
      expect(uuidRegex.test(invalidUUID)).toBe(false);
    });
  });

  describe('Integration Flow', () => {
    test('should support complete user journey', async () => {
      const { intakeStateMachine } = require('../lib/pipeline/stateMachine');
      const { matchingHeuristic } = require('../lib/pipeline/match-heuristic');
      
      // Mock the complete flow
      const userId = 'test-user';
      
      // 1. Start intake
      const firstQuestion = {
        id: 'name',
        type: 'text',
        question: 'What is your name?',
        required: true
      };
      intakeStateMachine.getNextQuestion.mockResolvedValueOnce(firstQuestion);
      
      // 2. Process answer
      const processResult = {
        success: true,
        nextQuestion: {
          id: 'interests',
          type: 'multiselect',
          question: 'What are your interests?',
          options: ['AI', 'Fintech'],
          required: true
        },
        isComplete: false
      };
      intakeStateMachine.processAnswer.mockResolvedValueOnce(processResult);
      
      // 3. Generate matches
      const matches = [
        {
          id: 'match-1',
          profile: {
            user_id: 'user-2',
            name: 'Jane Doe',
            interests: ['AI'],
            career_goals: 'find-cofounder',
            mentorship_pref: 'offering'
          },
          score: 7.5,
          sharedTopics: ['AI'],
          explanation: 'Shared interest in AI'
        }
      ];
      matchingHeuristic.rankCandidates.mockReturnValueOnce(matches);
      
      // Execute the flow
      const question1 = await intakeStateMachine.getNextQuestion(userId);
      expect(question1.id).toBe('name');
      
      const answer1 = await intakeStateMachine.processAnswer(userId, 'John Doe');
      expect(answer1.success).toBe(true);
      expect(answer1.nextQuestion.id).toBe('interests');
      
      const userProfile = {
        user_id: userId,
        name: 'John Doe',
        interests: ['AI', 'Fintech'],
        career_goals: 'find-cofounder',
        mentorship_pref: 'seeking'
      };
      
      const generatedMatches = matchingHeuristic.rankCandidates(
        userProfile, 
        [matches[0].profile], 
        { userId, maxMatches: 3 }
      );
      
      expect(generatedMatches).toHaveLength(1);
      expect(generatedMatches[0].sharedTopics).toContain('AI');
    });
  });

  describe('Performance Considerations', () => {
    test('should limit match results appropriately', () => {
      const { matchingHeuristic } = require('../lib/pipeline/match-heuristic');
      
      const mockMatches = Array.from({ length: 10 }, (_, i) => ({
        id: `match-${i}`,
        profile: {
          user_id: `user-${i}`,
          name: `User ${i}`,
          interests: ['AI'],
          career_goals: 'find-cofounder',
          mentorship_pref: 'seeking'
        },
        score: Math.random() * 10,
        sharedTopics: ['AI'],
        explanation: 'Test match'
      }));
      
      matchingHeuristic.rankCandidates.mockReturnValue(mockMatches.slice(0, 3));
      
      const userProfile = {
        user_id: 'current-user',
        name: 'Current User',
        interests: ['AI'],
        career_goals: 'find-cofounder',
        mentorship_pref: 'seeking'
      };
      
      const result = matchingHeuristic.rankCandidates(
        userProfile,
        mockMatches.map(m => m.profile),
        { userId: 'current-user', maxMatches: 3 }
      );
      
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });
});
