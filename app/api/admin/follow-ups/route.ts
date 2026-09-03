import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult.errorResponse) return authResult.errorResponse;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const employee = searchParams.get('employee') || undefined;

    const followUps = db.getFollowUps(status, employee);
    return NextResponse.json(followUps);
  } catch (error) {
    console.error('Failed to get follow-ups:', error);
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult.errorResponse) return authResult.errorResponse;

    const body = await req.json();
    if (!body.title || !body.customerName || !body.followUpDate) {
      return NextResponse.json({ error: 'Title, customer name, and date are required' }, { status: 400 });
    }

    const saved = db.saveFollowUp(body);

    logAuditActivity({
      adminId: authResult.id || authResult.user?.id,
      adminName: authResult.name || authResult.user?.name,
      adminEmail: authResult.email || authResult.user?.email,
      action: body.id ? 'UPDATE' : 'CREATE',
      resource: 'FOLLOW_UP',
      details: `${body.id ? 'Updated' : 'Created'} follow-up: ${saved.title}`,
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error('Failed to save follow-up:', error);
    return NextResponse.json({ error: 'Failed to save follow-up' }, { status: 500 });
  }
}
