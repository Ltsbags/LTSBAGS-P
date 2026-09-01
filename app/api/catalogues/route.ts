import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let catalogues = db.getCatalogues(true); // only active

    if (category && category !== 'ALL') {
      catalogues = catalogues.filter((c) => c.category === category);
    }

    return NextResponse.json({
      success: true,
      catalogues,
      total: catalogues.length,
    });
  } catch (error: any) {
    console.error('Error fetching public catalogues:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch catalogues' }, { status: 500 });
  }
}
