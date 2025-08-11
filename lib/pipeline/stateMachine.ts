import { openrouterChat, type ORMessage } from '../ai/openrouter';
import { sessionManager, type IntakeSession } from './session';

export interface IntakeQuestion {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'radio';
  question: string;
  options?: string[];
  required: boolean;
  followUp?: string;
}

// Base questions template
const BASE_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'name',
    type: 'text',
    question: 'What\'s your name?',
    required: true
  },
  {
    id: 'interests',
    type: 'multiselect',
    question: 'What are your main professional interests?',
    options: ['AI', 'Climate', 'Fintech', 'Education', 'Health', 'Music', 'Art', 'Gaming', 'Marketing', 'Operations', 'Sales', 'Design', 'Product', 'Engineering'],
    required: true
  },
  {
    id: 'career_goals',
    type: 'select',
    question: 'What\'s your primary career goal right now?',
    options: ['find-cofounder', 'explore-jobs', 'hire', 'learn-ai', 'mentor-others', 'find-mentor', 'investors', 'portfolio-feedback'],
    required: true
  },
  {
    id: 'mentorship',
    type: 'radio',
    question: 'Are you interested in mentorship?',
    options: ['seeking', 'offering', 'both', 'none'],
    required: true
  },
  {
    id: 'location',
    type: 'text',
    question: 'Where are you based? (City, State/Country)',
    required: false
  }
];

export class IntakeStateMachine {
  async getNextQuestion(userId: string): Promise<IntakeQuestion | null> {
    let session = sessionManager.getSession(userId);
    
    // Create session if it doesn't exist
    if (!session) {
      session = sessionManager.createSession(userId);
    }
    
    // If intake is complete
    if (session.currentStep === -1) {
      return null;
    }
    
    // If we have more base questions
    if (session.currentStep < BASE_QUESTIONS.length) {
      return BASE_QUESTIONS[session.currentStep];
    }
    
    // Generate dynamic follow-up question using AI
    return await this.generateDynamicQuestion(session);
  }

  async processAnswer(userId: string, answer: any): Promise<{ 
    success: boolean; 
    nextQuestion?: IntakeQuestion; 
    isComplete?: boolean;
    error?: string;
  }> {
    try {
      let session = sessionManager.getSession(userId);
      
      // Create session if it doesn't exist
      if (!session) {
        session = sessionManager.createSession(userId);
      }

      // Validate answer based on current question
      const currentQuestion = await this.getCurrentQuestion(session);
      if (currentQuestion && !this.validateAnswer(currentQuestion, answer)) {
        return { success: false, error: 'Invalid answer format' };
      }

      // Update profile based on answer
      this.updateProfileFromAnswer(session, answer);
      
      // Advance to next step
      const updatedSession = sessionManager.advanceStep(userId, answer);
      
      // Check if we should complete intake
      if (this.shouldCompleteIntake(updatedSession)) {
        sessionManager.completeIntake(userId);
        return { success: true, isComplete: true };
      }
      
      // Get next question
      const nextQuestion = await this.getNextQuestion(userId);
      
      return { 
        success: true, 
        nextQuestion: nextQuestion || undefined,
        isComplete: !nextQuestion
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async getCurrentQuestion(session: IntakeSession): Promise<IntakeQuestion | null> {
    if (session.currentStep < BASE_QUESTIONS.length) {
      return BASE_QUESTIONS[session.currentStep];
    }
    return null;
  }

  private validateAnswer(question: IntakeQuestion, answer: any): boolean {
    if (question.required && (!answer || answer === '')) {
      return false;
    }

    switch (question.type) {
      case 'text':
        return typeof answer === 'string';
      case 'select':
        return question.options?.includes(answer) || false;
      case 'multiselect':
        return Array.isArray(answer) && answer.every(a => question.options?.includes(a));
      case 'radio':
        return question.options?.includes(answer) || false;
      default:
        return true;
    }
  }

  private updateProfileFromAnswer(session: IntakeSession, answer: any): void {
    const step = session.currentStep;
    const question = BASE_QUESTIONS[step];
    
    if (!question) return;

    switch (question.id) {
      case 'name':
        session.profile.name = answer;
        break;
      case 'interests':
        session.profile.interests = Array.isArray(answer) ? answer : [answer];
        break;
      case 'career_goals':
        session.profile.careerGoals = answer;
        break;
      case 'mentorship':
        session.profile.mentorshipPref = answer;
        break;
      case 'location':
        session.profile.location = answer;
        break;
    }
  }

  private shouldCompleteIntake(session: IntakeSession): boolean {
    // Complete after base questions + maybe 1-2 dynamic questions
    return session.currentStep >= BASE_QUESTIONS.length + 2;
  }

  private async generateDynamicQuestion(session: IntakeSession): Promise<IntakeQuestion | null> {
    try {
      const profile = session.profile;
      const messages: ORMessage[] = [
        {
          role: 'system',
          content: `You are helping create personalized networking questions. Based on the user's profile, generate ONE follow-up question that would help match them with relevant professionals. Keep it concise and actionable.

User profile:
- Interests: ${profile.interests?.join(', ') || 'Not specified'}
- Career goal: ${profile.careerGoals || 'Not specified'}
- Mentorship: ${profile.mentorshipPref || 'Not specified'}

Return ONLY a JSON object with this format:
{
  "question": "Your specific question here",
  "type": "text",
  "required": false
}`
        },
        {
          role: 'user',
          content: 'Generate a follow-up question for this user.'
        }
      ];

      const response = await openrouterChat(messages, 'openai/gpt-4o-mini', 0.3);
      const parsed = JSON.parse(response);
      
      return {
        id: `dynamic_${session.currentStep}`,
        type: parsed.type || 'text',
        question: parsed.question,
        required: parsed.required || false
      };
    } catch (error) {
      console.error('Failed to generate dynamic question:', error);
      // Return null to complete intake if AI fails
      return null;
    }
  }
}

export const intakeStateMachine = new IntakeStateMachine();
