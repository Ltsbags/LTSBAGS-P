import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult.errorResponse) return authResult.errorResponse;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const customers = db.getCustomers(search, status);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to get customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult.errorResponse) return authResult.errorResponse;

    const body = await req.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const saved = db.saveCustomer(body);

    logAuditActivity({
      adminId: authResult.id || authResult.user?.id,
      adminName: authResult.name || authResult.user?.name,
      adminEmail: authResult.email || authResult.user?.email,
      action: body.id ? 'UPDATE' : 'CREATE',
      resource: 'CUSTOMER',
      details: `${body.id ? 'Updated' : 'Created'} customer ${saved.name} (${saved.companyName})`,
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error('Failed to save customer:', error);
    return NextResponse.json({ error: 'Failed to save customer' }, { status: 500 });
  }
}
