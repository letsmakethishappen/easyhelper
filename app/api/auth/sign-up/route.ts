import { NextRequest, NextResponse } from 'next/server';
import { authRateLimiter, checkRateLimit } from '@/lib/rate-limiter';
import { createUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  // Rate limiting
  const rateLimitCheck = await checkRateLimit(authRateLimiter, clientIp);
  
  if (!rateLimitCheck.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create user with Supabase Auth
    const data = await createUser(email, name, password);
    
    const response = NextResponse.json({ 
      message: 'User created successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name
      }
    });

    return response;

  } catch (error: any) {
    console.error('Sign up error:', error);
    
    if (error.message?.includes('already registered')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
