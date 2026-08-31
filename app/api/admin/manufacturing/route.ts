import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const config = db.getManufacturingConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch manufacturing configuration' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const updated = db.saveManufacturingConfig(body);

    logAuditActivity({
      adminId: authResult.id,
      adminName: authResult.name,
      action: 'UPDATE',
      resource: 'MANUFACTURING_CONFIG',
      details: `Updated manufacturing capacities & specs for ${updated.factoryName}`,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update manufacturing configuration' }, { status: 500 });
  }
}
