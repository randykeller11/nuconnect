import { IntakeStateMachine } from './stateMachine';
import { sessionManager } from './session';
import * as openrouterModule from '../ai/openrouter';

// Mock the openrouter module
jest.mock('../ai/openrouter');
const mockOpenrouterChat = openrouterModule.openrouterChat as jest.MockedFunction<typeof openrouterModule.openrouterChat>;

describe('Intake State Machine', () => {
  let stateMachine: IntakeStateMachine;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    stateMachine = new IntakeStateMachine();
    sessionManager.clearSession(testUserId);
    jest.clearAllMocks();
  });

  afterEach(() => {
    sessionManager.clearSession(testUserId);
  });

  describe('getNextQuestion', () => {
    test('should return first question for new user', async () => {
      const question = await stateMachine.getNextQuestion(testUserId);
      
      expect(question).toBeDefined();
      expect(question?.id).toBe('name');
      expect(question?.type).toBe('text');
      expect(question?.required).toBe(true);
    });

    test('should return null when intake is complete', async () => {
      // Complete the intake
      sessionManager.createSession(testUserId);
      sessionManager.completeIntake(testUserId);
      
      const question = await stateMachine.getNextQuestion(testUserId);
      expect(question).toBeNull();
    });

    test('should progress through base questions', async () => {
      // Get first question
      const q1 = await stateMachine.getNextQuestion(testUserId);
      expect(q1?.id).toBe('name');

      // Answer and get next
      await stateMachine.processAnswer(testUserId, 'John Doe');
      const q2 = await stateMachine.getNextQuestion(testUserId);
      expect(q2?.id).toBe('interests');

      // Answer and get next
      await stateMachine.processAnswer(testUserId, ['AI', 'Fintech']);
      const q3 = await stateMachine.getNextQuestion(testUserId);
      expect(q3?.id).toBe('career_goals');
    });
  });

  describe('processAnswer', () => {
    test('should successfully process valid text answer', async () => {
      await stateMachine.getNextQuestion(testUserId); // Initialize session
      
      const result = await stateMachine.processAnswer(testUserId, 'John Doe');
      
      expect(result.success).toBe(true);
      expect(result.nextQuestion).toBeDefined();
      expect(result.nextQuestion?.id).toBe('interests');
      
      // Check session was updated
      const session = sessionManager.getSession(testUserId);
      expect(session?.profile.name).toBe('John Doe');
      expect(session?.currentStep).toBe(1);
    });

    test('should successfully process multiselect answer', async () => {
      // Progress to interests question
      await stateMachine.getNextQuestion(testUserId);
      await stateMachine.processAnswer(testUserId, 'John Doe');
      
      const result = await stateMachine.processAnswer(testUserId, ['AI', 'Fintech', 'Education']);
      
      expect(result.success).toBe(true);
      
      const session = sessionManager.getSession(testUserId);
      expect(session?.profile.interests).toEqual(['AI', 'Fintech', 'Education']);
    });

    test('should reject invalid answer for required field', async () => {
      await stateMachine.getNextQuestion(testUserId); // Initialize session
      
      const result = await stateMachine.processAnswer(testUserId, '');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid answer format');
    });

    test('should reject invalid option for select field', async () => {
      // Progress to career goals question
      await stateMachine.getNextQuestion(testUserId);
      await stateMachine.processAnswer(testUserId, 'John Doe');
      await stateMachine.processAnswer(testUserId, ['AI']);
      
      const result = await stateMachine.processAnswer(testUserId, 'invalid-option');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid answer format');
    });

    test('should complete intake after sufficient questions', async () => {
      // Answer all base questions + some dynamic ones
      await stateMachine.getNextQuestion(testUserId);
      await stateMachine.processAnswer(testUserId, 'John Doe');
      await stateMachine.processAnswer(testUserId, ['AI']);
      await stateMachine.processAnswer(testUserId, 'find-cofounder');
      await stateMachine.processAnswer(testUserId, 'seeking');
      await stateMachine.processAnswer(testUserId, 'San Francisco');
      
      // Mock AI response for dynamic questions
      mockOpenrouterChat.mockResolvedValue(JSON.stringify({
        question: 'What specific AI expertise are you looking for?',
        type: 'text',
        required: false
      }));
      
      await stateMachine.processAnswer(testUserId, 'Machine learning');
      
      mockOpenrouterChat.mockResolvedValue(JSON.stringify({
        question: 'What stage is your startup idea?',
        type: 'text',
        required: false
      }));
      
      const result = await stateMachine.processAnswer(testUserId, 'Early concept');
      
      expect(result.success).toBe(true);
      expect(result.isComplete).toBe(true);
    });

    test('should handle session not found error', async () => {
      const result = await stateMachine.processAnswer('nonexistent-user', 'answer');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('No active session');
    });
  });

  describe('dynamic question generation', () => {
    test('should generate dynamic question using AI', async () => {
      // Complete base questions
      await stateMachine.getNextQuestion(testUserId);
      await stateMachine.processAnswer(testUserId, 'John Doe');
      await stateMachine.processAnswer(testUserId, ['AI', 'Fintech']);
      await stateMachine.processAnswer(testUserId, 'find-cofounder');
      await stateMachine.processAnswer(testUserId, 'seeking');
      await stateMachine.processAnswer(testUserId, 'San Francisco');
      
      // Mock AI response
      mockOpenrouterChat.mockResolvedValue(JSON.stringify({
        question: 'What specific technical skills are you looking for in a co-founder?',
        type: 'text',
        required: false
      }));
      
      const question = await stateMachine.getNextQuestion(testUserId);
      
      expect(question).toBeDefined();
      expect(question?.question).toContain('technical skills');
      expect(mockOpenrouterChat).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('AI, Fintech')
          })
        ]),
        'openai/gpt-4o-mini',
        0.3
      );
    });

    test('should handle AI failure gracefully', async () => {
      // Complete base questions
      await stateMachine.getNextQuestion(testUserId);
      await stateMachine.processAnswer(testUserId, 'John Doe');
      await stateMachine.processAnswer(testUserId, ['AI']);
      await stateMachine.processAnswer(testUserId, 'find-cofounder');
      await stateMachine.processAnswer(testUserId, 'seeking');
      await stateMachine.processAnswer(testUserId, 'San Francisco');
      
      // Mock AI failure
      mockOpenrouterChat.mockRejectedValue(new Error('API Error'));
      
      const question = await stateMachine.getNextQuestion(testUserId);
      
      expect(question).toBeNull(); // Should complete intake on AI failure
    });
  });
});
