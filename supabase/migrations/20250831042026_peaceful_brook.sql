/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `skill_level` (enum: beginner, diy, pro)
      - `locale` (text, default 'en-US')
      - `units` (enum: us, metric)
      - `role` (enum: user, admin)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read/update their own data
*/

-- Create enum types
CREATE TYPE skill_level_enum AS ENUM ('beginner', 'diy', 'pro');
CREATE TYPE units_enum AS ENUM ('us', 'metric');
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  skill_level skill_level_enum DEFAULT 'beginner',
  locale text DEFAULT 'en-US',
  units units_enum DEFAULT 'us',
  role user_role_enum DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);