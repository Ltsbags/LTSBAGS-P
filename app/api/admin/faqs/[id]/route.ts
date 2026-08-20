import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const existing = db.getFaqById(id);

    if (!existing) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    const updated = db.saveFaq({
      ...existing,
      ...body,
      id,
    });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPDATE_FAQ',
      'FAQ',
      id,
      { question: updated.question }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update FAQ error:', error);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = db.deleteFaq(id);

    if (deleted) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'DELETE_FAQ',
        'FAQ',
        id
      );
      return NextResponse.json({ message: 'FAQ deleted successfully' });
    }

    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
