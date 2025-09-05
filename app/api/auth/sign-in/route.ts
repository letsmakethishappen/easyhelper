import { NextRequest, NextResponse } from 'next/server';
import { authRateLimiter, checkRateLimit } from '@/lib/rate-limiter';
import { signInUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const clientIp = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  
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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const data = await signInUser(email, password);

    const response = NextResponse.json({ 
      message: 'Signed in successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name
      }
    });

    // Set session cookie with the access token
    response.cookies.set('session', data.session?.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }
}