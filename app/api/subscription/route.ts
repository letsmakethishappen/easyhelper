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

    // Get user's subscription
    const { data: subscription, error } = await supabase
      .from('stripe_subscriptions')
      .select(`
        *,
        plans(name, features, limits)
      `)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    // Get usage for current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const { data: usage, error: usageError } = await supabase
      .from('usage')
      .select('diagnoses_count, tokens_used')
      .eq('user_id', user.id)
      .gte('date', firstDayOfMonth.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (usageError) throw usageError;

    const totalDiagnoses = usage?.reduce((sum, day) => sum + day.diagnoses_count, 0) || 0;
    const totalTokens = usage?.reduce((sum, day) => sum + day.tokens_used, 0) || 0;

    return NextResponse.json({ 
      subscription: subscription || null,
      usage: {
        diagnosesThisMonth: totalDiagnoses,
        tokensUsed: totalTokens,
        diagnosesLimit: subscription?.plans?.limits?.dailyDiagnoses || 2 // Free plan limit
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 401 }
    );
  }
}
