import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    // Create a Supabase client with the access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    // Get additional user data from your users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      // Return basic user info even if extended data fails
      return NextResponse.json({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          skillLevel: 'beginner',
          locale: 'en-US',
          units: 'us',
          role: 'user'
        }
      });
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
