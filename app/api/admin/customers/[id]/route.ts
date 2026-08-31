import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    const customer = db.getCustomerById(id);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve customer' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    const body = await req.json(); // activity payload
    const updated = db.addCustomerActivity(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add activity' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    const deleted = db.deleteCustomer(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    logAuditActivity({
      adminId: authResult.id,
      adminName: authResult.name,
      action: 'DELETE',
      resource: 'CUSTOMER',
      details: `Deleted customer record ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
