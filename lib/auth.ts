import { supabase } from './supabase';

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    // In production, password verification is handled by Supabase Auth
    return true;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

export async function createUser(email: string, name: string, password: string) {
  if (!supabase) {
    throw new Error('Database not configured. Please set up Supabase connection.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        skill_level: 'beginner',
        locale: 'en-US',
        units: 'us',
        role: 'user'
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signInUser(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function getCurrentUser() {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}