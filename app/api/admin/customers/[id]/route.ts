import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const customer = db.getCustomerById(id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  return NextResponse.json({ customer });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const customer = db.getCustomerById(id);
  const deleted = db.deleteCustomer(id);

  if (deleted) {
    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'DELETE_CUSTOMER',
      'CUSTOMER',
      id,
      { name: customer?.name, company: customer?.companyName }
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Failed to delete customer' }, { status: 400 });
}
