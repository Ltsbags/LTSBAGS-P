import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const existing = db.getTestimonialById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updated = db.saveTestimonial({
      ...existing,
      ...body,
      id,
    });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPDATE_TESTIMONIAL',
      'TESTIMONIAL',
      id,
      { client: `${updated.name} (${updated.company})` }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = db.deleteTestimonial(id);

    if (deleted) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'DELETE_TESTIMONIAL',
        'TESTIMONIAL',
        id
      );
      return NextResponse.json({ message: 'Testimonial deleted successfully' });
    }

    return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
