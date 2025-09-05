/*
  # Complete CarHelper.ai Database Schema

  1. New Tables
    - `users` - User profiles and preferences
    - `vehicles` - User's vehicles for better diagnostics
    - `conversations` - Chat sessions with AI
    - `messages` - Individual messages in conversations
    - `diagnoses` - AI diagnostic results
    - `plans` - Subscription plans
    - `subscriptions` - User subscriptions
    - `usage` - Daily usage tracking

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for user data access
    - Ensure users can only access their own data

  3. Features
    - Email/password authentication (built into Supabase Auth)
    - User profiles with skill levels
    - Vehicle management
    - Conversation history
    - Subscription management
*/

-- Create enum types
CREATE TYPE skill_level_enum AS ENUM ('beginner', 'diy', 'pro');
CREATE TYPE units_enum AS ENUM ('us', 'metric');
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
CREATE TYPE message_role_enum AS ENUM ('user', 'assistant', 'system');
CREATE TYPE severity_enum AS ENUM ('low', 'medium', 'high');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'canceled', 'past_due', 'trialing');

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  skill_level skill_level_enum DEFAULT 'beginner',
  locale text DEFAULT 'en-US',
  units units_enum DEFAULT 'us',
  role user_role_enum DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year integer NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  trim text,
  vin text,
  mileage integer,
  nickname text,
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  title text,
  started_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role message_role_enum NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  summary text NOT NULL,
  severity severity_enum NOT NULL,
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  json_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  stripe_price_id text UNIQUE NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  limits jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id text NOT NULL REFERENCES plans(id),
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text,
  status subscription_status_enum NOT NULL DEFAULT 'trialing',
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create usage table
CREATE TABLE IF NOT EXISTS usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  diagnoses_count integer DEFAULT 0,
  tokens_used integer DEFAULT 0,
  plan_snapshot jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Users can read own vehicles" ON vehicles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicles" ON vehicles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vehicles" ON vehicles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can read own conversations" ON conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can read own messages" ON messages FOR SELECT TO authenticated 
  USING (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));

-- Diagnoses policies
CREATE POLICY "Users can read own diagnoses" ON diagnoses FOR SELECT TO authenticated 
  USING (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));
CREATE POLICY "Users can insert own diagnoses" ON diagnoses FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));

-- Plans policies (public read)
CREATE POLICY "Anyone can read plans" ON plans FOR SELECT TO authenticated USING (true);

-- Subscriptions policies
CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Usage policies
CREATE POLICY "Users can read own usage" ON usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Insert default plans
INSERT INTO plans (id, name, stripe_price_id, features, limits) VALUES
('one_day', '1-Day AI Mechanic', 'price_1day_placeholder', 
 '["10 diagnoses in 24 hours", "Standard diagnostic accuracy", "General repair instructions", "Standard response speed"]',
 '{"dailyDiagnoses": 10, "tokensPerDay": 50000}'),
('monthly', 'Monthly AI Mechanic', 'price_monthly_placeholder',
 '["Unlimited diagnoses", "Expert diagnostic accuracy", "Detailed repair instructions", "Parts recommendations", "Saved history", "Standard response speed"]',
 '{"dailyDiagnoses": -1, "tokensPerDay": -1}'),
('annual', 'Premium AI Mechanic', 'price_annual_placeholder',
 '["Unlimited diagnoses", "Expert diagnostic accuracy", "Expert-level repair instructions", "Parts recommendations", "Saved history", "Priority response speed", "Expert support"]',
 '{"dailyDiagnoses": -1, "tokensPerDay": -1}')
ON CONFLICT (id) DO NOTHING;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, skill_level, locale, units, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'skill_level')::skill_level_enum, 'beginner'),
    COALESCE(NEW.raw_user_meta_data->>'locale', 'en-US'),
    COALESCE((NEW.raw_user_meta_data->>'units')::units_enum, 'us'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role_enum, 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();