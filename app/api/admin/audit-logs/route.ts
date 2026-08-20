import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '150', 10);
    const action = searchParams.get('action') || undefined;
    const resource = searchParams.get('resource') || undefined;

    const logs = db.getAuditLogs(limit, action, resource);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
