import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = db.saveFactoryGalleryItem({ id, ...body });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating factory gallery item:', error);
    return NextResponse.json({ error: 'Failed to update factory gallery item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = db.deleteFactoryGalleryItem(id);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting factory gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
