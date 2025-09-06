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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromSession(req);

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }
    
    const body = await req.json();
    const { year, make, model, trim, vin, mileage, nickname } = body;
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update({
        year: year ? parseInt(year) : undefined,
        make,
        model,
        trim: trim || null,
        vin: vin || null,
        mileage: mileage ? parseInt(mileage) : null,
        nickname: nickname || null
      })
      .eq('id', params.id)
      .eq('user_id', user.id) // Ensure user owns this vehicle
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      message: 'Vehicle updated successfully',
      vehicle 
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromSession(req);

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id); // Ensure user owns this vehicle

    if (error) throw error;

    return NextResponse.json({ 
      message: 'Vehicle deleted successfully' 
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}
