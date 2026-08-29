import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, action, status, assignedTo, priority } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Enquiry IDs array is required' }, { status: 400 });
    }

    let updatedCount = 0;

    if (action === 'STATUS_UPDATE' && status) {
      updatedCount = db.bulkUpdateEnquiries(ids, { status });
    } else if (action === 'ASSIGN_STAFF' && assignedTo) {
      updatedCount = db.bulkUpdateEnquiries(ids, { assignedTo });
    } else if (action === 'PRIORITY_UPDATE' && priority) {
      updatedCount = db.bulkUpdateEnquiries(ids, { priority });
    } else if (action === 'DELETE') {
      ids.forEach((id) => db.deleteEnquiry(id));
      updatedCount = ids.length;
    } else {
      return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'BULK_UPDATE_ENQUIRIES',
      'ENQUIRY',
      ids.join(','),
      { action, count: updatedCount }
    );

    return NextResponse.json({ success: true, count: updatedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to perform bulk enquiry action' }, { status: 500 });
  }
}
