import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department') || undefined;
    const onlyActive = searchParams.get('active') === 'true';
    const items = db.getFactoryGallery(department, onlyActive);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching factory gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch factory gallery' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, department, caption, altText, displayOrder, isActive } = body;

    if (!imageUrl || !department || !caption) {
      return NextResponse.json(
        { error: 'Image URL, department, and caption are required' },
        { status: 400 }
      );
    }

    const item = db.saveFactoryGalleryItem({
      imageUrl,
      department,
      caption,
      altText: altText || caption,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      isActive: isActive !== undefined ? !!isActive : true,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error adding factory gallery item:', error);
    return NextResponse.json({ error: 'Failed to add factory gallery item' }, { status: 500 });
  }
}
