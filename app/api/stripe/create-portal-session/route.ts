import { NextRequest, NextResponse } from 'next/server';
import getStripe from '@/lib/stripe';
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

export async function POST(req: NextRequest) {
  try {
    // Get Stripe instance inside the handler
    const stripe = getStripe();
    
    const user = await getUserFromSession(req);
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }
    
    // Get Stripe customer ID
    const { data: customer, error } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (error || !customer) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 404 }
      );
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
