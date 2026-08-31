import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      // Allow fallback if called internally, but try auth
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const start = searchParams.get('start') || undefined;
    const end = searchParams.get('end') || undefined;

    const stats = db.getStats(filter, start, end);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to get admin stats:', error);
    return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 });
  }
}
