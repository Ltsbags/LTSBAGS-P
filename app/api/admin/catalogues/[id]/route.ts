import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const catalogue = db.getCatalogueById(id);
  if (!catalogue) {
    return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
  }

  return NextResponse.json({ catalogue });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const catalogue = db.getCatalogueById(id);
  const deleted = db.deleteCatalogue(id);

  if (deleted) {
    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'DELETE_CATALOGUE',
      'CATALOGUE',
      id,
      { title: catalogue?.title, category: catalogue?.category }
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Failed to delete catalogue' }, { status: 400 });
}
