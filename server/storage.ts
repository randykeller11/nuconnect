import { createClient } from '@supabase/supabase-js';
import { 
  type QuestionnaireResponse, 
  type InsertQuestionnaireResponse,
  type ProfessionalSignup,
  type InsertProfessionalSignup,
  type ContactSubmission,
  type InsertContactSubmission,
  type User,
  type InsertUser
} from "../shared/schema.js";

// Supabase connection
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export interface IStorage {
  // User methods
  createUser(userData: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(userId: number): Promise<User | null>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Questionnaire methods
  createQuestionnaireResponse(response: InsertQuestionnaireResponse): Promise<QuestionnaireResponse>;
  getAllQuestionnaireResponses(): Promise<QuestionnaireResponse[]>;
  createOrUpdateQuestionnaireResponse(userId: number, answers: any, isComplete?: boolean): Promise<QuestionnaireResponse>;
  getQuestionnaireResponseByUserId(userId: number): Promise<QuestionnaireResponse | null>;
  
  // Professional signup methods
  createProfessionalSignup(signup: InsertProfessionalSignup): Promise<ProfessionalSignup>;
  getAllProfessionalSignups(): Promise<ProfessionalSignup[]>;

  // Contact submission methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
}

export class SupabaseStorage implements IStorage {
  async createUser(userData: InsertUser): Promise<User> {
    try {
      let bcrypt;
      try {
        bcrypt = require('bcrypt');
      } catch (err) {
        console.log('bcrypt not found, using bcryptjs as fallback');
        bcrypt = require('bcryptjs');
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password: hashedPassword,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          relationship_status: userData.relationshipStatus,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        relationshipStatus: data.relationship_status,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Supabase error: ${error.message}`);
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        relationshipStatus: data.relationship_status,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return null;

      let bcrypt;
      try {
        bcrypt = require('bcrypt');
      } catch (err) {
        console.log('bcrypt not found, using bcryptjs as fallback');
        bcrypt = require('bcryptjs');
      }
      const isValid = await bcrypt.compare(password, user.password);
      
      return isValid ? user : null;
    } catch (error) {
      throw new Error(`Failed to validate user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Supabase error: ${error.message}`);
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        relationshipStatus: data.relationship_status,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      throw new Error(`Failed to get user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createOrUpdateQuestionnaireResponse(userId: number, answers: any, isComplete: boolean = false): Promise<QuestionnaireResponse> {
    try {
      const { data: existing, error: findError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .update({
            answers: answers,
            is_complete: isComplete,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          throw new Error(`Supabase error: ${error.message}`);
        }

        return {
          id: data.id,
          userId: data.user_id,
          answers: data.answers,
          isComplete: data.is_complete,
          submittedAt: new Date(data.submitted_at),
          updatedAt: new Date(data.updated_at),
        };
      } else {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .insert({
            user_id: userId,
            answers: answers,
            is_complete: isComplete,
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Supabase error: ${error.message}`);
        }

        return {
          id: data.id,
          userId: data.user_id,
          answers: data.answers,
          isComplete: data.is_complete,
          submittedAt: new Date(data.submitted_at),
          updatedAt: new Date(data.updated_at),
        };
      }
    } catch (error) {
      throw new Error(`Failed to save questionnaire response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQuestionnaireResponseByUserId(userId: number): Promise<QuestionnaireResponse | null> {
    try {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Supabase error: ${error.message}`);
      }

      return {
        id: data.id,
        userId: data.user_id,
        answers: data.answers,
        isComplete: data.is_complete,
        submittedAt: new Date(data.submitted_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      throw new Error(`Failed to get questionnaire response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createQuestionnaireResponse(insertResponse: InsertQuestionnaireResponse): Promise<QuestionnaireResponse> {
    try {
      console.log('Attempting to insert questionnaire response:', insertResponse);
      
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .insert({
          user_id: insertResponse.userId,
          answers: insertResponse.answers,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }

      return {
        id: data.id,
        userId: data.user_id,
        answers: data.answers,
        isComplete: data.is_complete || false,
        submittedAt: new Date(data.submitted_at),
        updatedAt: new Date(data.updated_at || data.submitted_at),
      };
    } catch (error) {
      console.error('Full error object:', error);
      throw new Error(`Failed to create questionnaire response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllQuestionnaireResponses(): Promise<QuestionnaireResponse[]> {
    try {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        answers: item.answers,
        isComplete: item.is_complete || false,
        submittedAt: new Date(item.submitted_at),
        updatedAt: new Date(item.updated_at || item.submitted_at),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch questionnaire responses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createProfessionalSignup(insertSignup: InsertProfessionalSignup): Promise<ProfessionalSignup> {
    try {
      console.log('Attempting to insert professional signup:', insertSignup);
      
      const { data, error } = await supabase
        .from('professional_signups')
        .insert(insertSignup)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }

      return {
        id: data.id,
        name: data.name,
        firm: data.firm,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        submittedAt: new Date(data.submitted_at),
      };
    } catch (error) {
      console.error('Full error object:', error);
      throw new Error(`Failed to create professional signup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllProfessionalSignups(): Promise<ProfessionalSignup[]> {
    try {
      const { data, error } = await supabase
        .from('professional_signups')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        firm: item.firm,
        email: item.email,
        phone: item.phone,
        specialty: item.specialty,
        submittedAt: new Date(item.submitted_at),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch professional signups: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    try {
      console.log('Attempting to insert contact submission:', insertSubmission);
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          first_name: insertSubmission.firstName,
          last_name: insertSubmission.lastName,
          email: insertSubmission.email,
          phone: insertSubmission.phone,
          relationship_status: insertSubmission.relationshipStatus,
          message: insertSubmission.message,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }

      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        relationshipStatus: data.relationship_status,
        message: data.message,
        submittedAt: new Date(data.submitted_at),
      };
    } catch (error) {
      console.error('Full error object:', error);
      throw new Error(`Failed to create contact submission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return (data || []).map(item => ({
        id: item.id,
        firstName: item.first_name,
        lastName: item.last_name,
        email: item.email,
        phone: item.phone,
        relationshipStatus: item.relationship_status,
        message: item.message,
        submittedAt: new Date(item.submitted_at),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch contact submissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const storage = new SupabaseStorage();
