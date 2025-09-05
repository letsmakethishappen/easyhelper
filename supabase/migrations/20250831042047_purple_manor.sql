/*
  # Create diagnoses table

  1. New Tables
    - `diagnoses`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key to conversations)
      - `summary` (text)
      - `severity` (enum: low, medium, high)
      - `confidence` (integer, 0-100)
      - `json_data` (jsonb) - stores the full diagnostic response
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `diagnoses` table
    - Add policies for users to read their own diagnoses
*/

-- Create enum for severity levels
CREATE TYPE severity_enum AS ENUM ('low', 'medium', 'high');

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

-- Enable RLS
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own diagnoses"
  ON diagnoses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));

CREATE POLICY "Users can insert own diagnoses"
  ON diagnoses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));

CREATE POLICY "Users can update own diagnoses"
  ON diagnoses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));

CREATE POLICY "Users can delete own diagnoses"
  ON diagnoses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id));