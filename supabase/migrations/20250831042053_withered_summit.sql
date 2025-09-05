/*
  # Create subscriptions and usage tables

  1. New Tables
    - `plans`
      - `id` (text, primary key)
      - `name` (text)
      - `stripe_price_id` (text)
      - `features` (jsonb)
      - `limits` (jsonb)
      - `created_at` (timestamp)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `plan_id` (text, foreign key to plans)
      - `stripe_customer_id` (text)
      - `stripe_subscription_id` (text, optional)
      - `status` (enum: active, canceled, past_due, trialing)
      - `current_period_end` (timestamp)
      - `created_at` (timestamp)
    
    - `usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `date` (date)
      - `diagnoses_count` (integer, default 0)
      - `tokens_used` (integer, default 0)
      - `plan_snapshot` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for user data access
*/

-- Create subscription status enum
CREATE TYPE subscription_status_enum AS ENUM ('active', 'canceled', 'past_due', 'trialing');

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
  UNIQUE(user_id) -- One subscription per user
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
  UNIQUE(user_id, date) -- One usage record per user per day
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Plans policies (public read)
CREATE POLICY "Anyone can read plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Subscription policies
CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Usage policies
CREATE POLICY "Users can read own usage"
  ON usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON usage
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

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
 '{"dailyDiagnoses": -1, "tokensPerDay": -1}');