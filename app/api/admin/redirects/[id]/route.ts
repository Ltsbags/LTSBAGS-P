import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const redirect = db.getRedirectById(id);
  if (!redirect) {
    return NextResponse.json({ error: 'Redirect not found' }, { status: 404 });
  }

  return NextResponse.json({ redirect });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const redirect = db.getRedirectById(id);
  const deleted = db.deleteRedirect(id);

  if (deleted) {
    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'DELETE_REDIRECT',
      'REDIRECT',
      id,
      { source: redirect?.sourceUrl, target: redirect?.targetUrl }
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Failed to delete redirect rule' }, { status: 400 });
}
