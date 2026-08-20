import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const enquiry = db.getEnquiryById(id);
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }
    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiry' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes, assignedTo, internalNotes } = body;

    const existing = db.getEnquiryById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    const updated = db.updateEnquiryStatus(
      id, 
      status || existing.status, 
      notes !== undefined ? notes : internalNotes !== undefined ? internalNotes : existing.notes,
      assignedTo !== undefined ? assignedTo : existing.assignedTo
    );

    if (updated) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'UPDATE_ENQUIRY',
        'ENQUIRY',
        id,
        { status: updated.status, assignedTo: updated.assignedTo }
      );
      return NextResponse.json(updated);
    }
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = db.getEnquiryById(id);

    const success = db.deleteEnquiry(id);
    if (success) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'DELETE_ENQUIRY',
        'ENQUIRY',
        id,
        { customer: existing?.name, company: existing?.company }
      );
      return NextResponse.json({ message: 'Enquiry deleted successfully' });
    }
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
