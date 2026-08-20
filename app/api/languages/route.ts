import { NextRequest, NextResponse } from 'next/server';
import { getLanguageSettings, updateLanguageSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = getLanguageSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch languages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateLanguageSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update languages' }, { status: 500 });
  }
}
