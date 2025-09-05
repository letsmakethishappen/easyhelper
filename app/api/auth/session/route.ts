import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = req.cookies.get('session')?.value;
    
    if (!sessionToken || !supabase) {
      return NextResponse.json({ user: null });
    }

    // Get user from Supabase using the session token
    const { data: { user }, error } = await supabase.auth.getUser(sessionToken);
    
    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    // Get additional user data from our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: userData.name,
        skillLevel: userData.skill_level,
        locale: userData.locale,
        units: userData.units,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
}