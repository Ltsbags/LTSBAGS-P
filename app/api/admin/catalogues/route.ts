import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const catalogues = db.getCatalogues(false);
  return NextResponse.json({ catalogues, total: catalogues.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.pdfUrl) {
      return NextResponse.json({ error: 'Catalogue title and PDF URL are required' }, { status: 400 });
    }

    const catalogue = db.saveCatalogue(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      body.id ? 'UPDATE_CATALOGUE' : 'CREATE_CATALOGUE',
      'CATALOGUE',
      catalogue.id,
      { title: catalogue.title, category: catalogue.category }
    );

    return NextResponse.json({ success: true, catalogue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save catalogue' }, { status: 500 });
  }
}
