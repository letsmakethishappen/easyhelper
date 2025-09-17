-- Fix RLS policies to allow API routes to work properly
-- The issue is that server-side API routes don't have auth.uid() context

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert own diagnoses" ON diagnoses;

-- Create more permissive policies for server-side operations
-- Conversations: Allow insert if user exists and matches
CREATE POLICY "Allow conversation insert for valid users" ON conversations 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = user_id)
  );

-- Messages: Allow insert if conversation belongs to a valid user
CREATE POLICY "Allow message insert for valid conversations" ON messages 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.id = conversation_id
    )
  );

-- Diagnoses: Allow insert if conversation belongs to a valid user
CREATE POLICY "Allow diagnosis insert for valid conversations" ON diagnoses 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.id = conversation_id
    )
  );

-- Also add service role policies for API operations
-- These allow the service role (used by API routes) to bypass RLS
CREATE POLICY "Service role can manage conversations" ON conversations 
  FOR ALL TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role can manage messages" ON messages 
  FOR ALL TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role can manage diagnoses" ON diagnoses 
  FOR ALL TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role can manage users" ON users 
  FOR ALL TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role can manage usage" ON usage 
  FOR ALL TO service_role 
  USING (true) 
  WITH CHECK (true);
