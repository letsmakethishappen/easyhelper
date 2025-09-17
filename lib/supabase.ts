import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Supabase configuration missing. Some features may not work.');
  }
}

// Client-side Supabase client (with anon key)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side Supabase client (with service role key for API routes)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Helper function to create a client with a specific access token
export function createClientWithToken(accessToken: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          skill_level: 'beginner' | 'diy' | 'pro';
          locale: string;
          units: 'us' | 'metric';
          role: 'user' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          skill_level?: 'beginner' | 'diy' | 'pro';
          locale?: string;
          units?: 'us' | 'metric';
          role?: 'user' | 'admin';
          created_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          skill_level?: 'beginner' | 'diy' | 'pro';
          locale?: string;
          units?: 'us' | 'metric';
          role?: 'user' | 'admin';
        };
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          year: number;
          make: string;
          model: string;
          trim: string | null;
          vin: string | null;
          mileage: number | null;
          nickname: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          year: number;
          make: string;
          model: string;
          trim?: string | null;
          vin?: string | null;
          mileage?: number | null;
          nickname?: string | null;
          created_at?: string;
        };
        Update: {
          year?: number;
          make?: string;
          model?: string;
          trim?: string | null;
          vin?: string | null;
          mileage?: number | null;
          nickname?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string | null;
          started_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_id?: string | null;
          started_at?: string;
        };
        Update: {
          vehicle_id?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: any;
          created_at?: string;
        };
        Update: {
          content?: any;
        };
      };
      diagnoses: {
        Row: {
          id: string;
          conversation_id: string;
          summary: string;
          severity: 'low' | 'medium' | 'high';
          confidence: number;
          json_data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          summary: string;
          severity: 'low' | 'medium' | 'high';
          confidence: number;
          json_data: any;
          created_at?: string;
        };
        Update: {
          summary?: string;
          severity?: 'low' | 'medium' | 'high';
          confidence?: number;
          json_data?: any;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          stripe_price_id: string;
          features: any;
          limits: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          stripe_price_id: string;
          features: any;
          limits: any;
          created_at?: string;
        };
        Update: {
          name?: string;
          stripe_price_id?: string;
          features?: any;
          limits?: any;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          status: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_end: string;
          created_at?: string;
        };
        Update: {
          plan_id?: string;
          stripe_subscription_id?: string | null;
          status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_end?: string;
        };
      };
      usage: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          diagnoses_count: number;
          tokens_used: number;
          plan_snapshot: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          diagnoses_count?: number;
          tokens_used?: number;
          plan_snapshot: any;
          created_at?: string;
        };
        Update: {
          diagnoses_count?: number;
          tokens_used?: number;
          plan_snapshot?: any;
        };
      };
    };
  };
};
