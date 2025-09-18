import { NextRequest, NextResponse } from 'next/server';

// Mock OBD code database - in production this would be in the database
const OBD_CODES: Record<string, any> = {
  'P0300': {
    code: 'P0300',
    title: 'Random/Multiple Cylinder Misfire Detected',
    system: 'Ignition',
    description: 'The engine control module has detected misfiring in multiple cylinders or a random pattern of misfires.',
    commonCauses: [
      'Worn or fouled spark plugs',
      'Faulty ignition coils',
      'Vacuum leaks',
      'Low fuel pressure',
      'Dirty fuel injectors',
      'Carbon buildup on valves'
    ],
    commonFixes: [
      'Replace spark plugs',
      'Test and replace ignition coils',
      'Check for vacuum leaks',
      'Test fuel pressure',
      'Clean fuel injectors',
      'Perform carbon cleaning service'
    ],
    severity: 'medium',
    urgency: 'Address within a few days to prevent catalytic converter damage'
  },
  'P0171': {
    code: 'P0171',
    title: 'System Too Lean (Bank 1)',
    system: 'Fuel',
    description: 'The engine is running too lean, meaning there is too much air and not enough fuel in the air/fuel mixture.',
    commonCauses: [
      'Vacuum leak',
      'Dirty or faulty MAF sensor',
      'Clogged fuel filter',
      'Weak fuel pump',
      'Dirty fuel injectors'
    ],
    commonFixes: [
      'Check for vacuum leaks',
      'Clean or replace MAF sensor',
      'Replace fuel filter',
      'Test fuel pump pressure',
      'Clean fuel injectors'
    ],
    severity: 'medium',
    urgency: 'Should be diagnosed within a week'
  }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code: rawCode } = await params;
    const code = rawCode.toUpperCase();
    
    const obdData = OBD_CODES[code];
    
    if (!obdData) {
      return NextResponse.json(
        { error: 'OBD code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ obdCode: obdData });
  } catch (error) {
    console.error('OBD lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup OBD code' },
      { status: 500 }
    );
  }
}
