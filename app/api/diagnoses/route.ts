import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

async function getUserFromSession(req: NextRequest) {
  const sessionToken = req.cookies.get('session')?.value;
  
  if (!sessionToken || !supabaseAdmin) {
    throw new Error('No valid session');
  }
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(sessionToken);
  
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

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // First get diagnoses with conversations
    const { data: diagnosesData, error: diagnosesError } = await supabaseAdmin
      .from('diagnoses')
      .select(`
        *,
        conversations!inner(
          user_id,
          vehicle_id
        )
      `)
      .eq('conversations.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (diagnosesError) throw diagnosesError;

    if (!diagnosesData || diagnosesData.length === 0) {
      return NextResponse.json({ diagnoses: [] });
    }

    // Get vehicle IDs that are not null
    const vehicleIds = diagnosesData
      .map(d => d.conversations.vehicle_id)
      .filter(id => id !== null);

    // Fetch vehicles separately if there are any
    let vehiclesMap = new Map();
    if (vehicleIds.length > 0) {
      const { data: vehicles, error: vehiclesError } = await supabaseAdmin
        .from('vehicles')
        .select('id, year, make, model, nickname')
        .in('id', vehicleIds);

      if (!vehiclesError && vehicles) {
        vehicles.forEach(vehicle => {
          vehiclesMap.set(vehicle.id, vehicle);
        });
      }
    }

    // Format the response
    const formattedDiagnoses = diagnosesData.map(diagnosis => {
      const vehicle = vehiclesMap.get(diagnosis.conversations.vehicle_id);
      
      return {
        id: diagnosis.id,
        summary: diagnosis.summary,
        severity: diagnosis.severity,
        confidence: diagnosis.confidence,
        vehicleName: vehicle 
          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.nickname ? ` (${vehicle.nickname})` : ''}`
          : 'Unknown Vehicle',
        obdCode: diagnosis.json_data?.obdCode,
        createdAt: diagnosis.created_at,
        hasRepairGuide: diagnosis.json_data?.diySteps?.length > 0
      };
    });

    return NextResponse.json({ diagnoses: formattedDiagnoses });
  } catch (error) {
    console.error('Get diagnoses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagnoses' },
      { status: 500 }
    );
  }
}
