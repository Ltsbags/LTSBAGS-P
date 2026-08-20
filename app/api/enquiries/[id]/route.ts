import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    const updated = db.updateEnquiryStatus(id, status);
    if (updated) {
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
    const { id } = await params;
    const success = db.deleteEnquiry(id);
    if (success) {
      return NextResponse.json({ message: 'Enquiry deleted' });
    }
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
