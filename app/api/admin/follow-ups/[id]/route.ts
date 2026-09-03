import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult.errorResponse) return authResult.errorResponse;

    const { id } = await params;
    const item = db.getFollowUpById(id);
    if (!item) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve follow-up' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult.errorResponse) return authResult.errorResponse;

    const { id } = await params;
    const deleted = db.deleteFollowUp(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 });
    }

    logAuditActivity({
      adminId: authResult.id || authResult.user?.id,
      adminName: authResult.name || authResult.user?.name,
      adminEmail: authResult.email || authResult.user?.email,
      action: 'DELETE',
      resource: 'FOLLOW_UP',
      details: `Deleted follow-up ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete follow-up' }, { status: 500 });
  }
}
