import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function getUserFromSession(req: NextRequest) {
  const sessionToken = req.cookies.get('session')?.value;
  
  if (!sessionToken || !supabase) {
    throw new Error('No valid session');
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(sessionToken);
  
  if (error || !user) {
    throw new Error('Invalid session');
  }
  
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromSession(req);

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    // Don't return sensitive data
    const { ...safeUser } = userData;
    
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 401 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromSession(req);

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }
    
    const body = await req.json();
    const { name, skillLevel, locale, units } = body;
    
    const { data: userData, error } = await supabase
      .from('users')
      .update({
        name,
        skill_level: skillLevel,
        locale,
        units
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: userData 
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
