/*
  # Create vehicles table

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `year` (integer)
      - `make` (text)
      - `model` (text)
      - `trim` (text, optional)
      - `vin` (text, optional, unique)
      - `mileage` (integer, optional)
      - `nickname` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `vehicles` table
    - Add policies for users to manage their own vehicles
*/

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
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, vin) -- VIN unique per user
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);