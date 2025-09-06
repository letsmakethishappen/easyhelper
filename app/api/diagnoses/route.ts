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
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { data: diagnoses, error } = await supabase
      .from('diagnoses')
      .select(`
        *,
        conversations!inner(
          user_id,
          vehicle_id,
          vehicles(year, make, model, nickname)
        )
      `)
      .eq('conversations.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Format the response
    const formattedDiagnoses = diagnoses.map(diagnosis => ({
      id: diagnosis.id,
      summary: diagnosis.summary,
      severity: diagnosis.severity,
      confidence: diagnosis.confidence,
      vehicleName: diagnosis.conversations.vehicles 
        ? `${diagnosis.conversations.vehicles.year} ${diagnosis.conversations.vehicles.make} ${diagnosis.conversations.vehicles.model}`
        : 'Unknown Vehicle',
      obdCode: diagnosis.json_data?.obdCode,
      createdAt: diagnosis.created_at,
      hasRepairGuide: diagnosis.json_data?.diySteps?.length > 0
    }));

    return NextResponse.json({ diagnoses: formattedDiagnoses });
  } catch (error) {
    console.error('Get diagnoses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagnoses' },
      { status: 401 }
    );
  }
}
