import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';
    const slides = db.getSlides(activeOnly);
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Slide title and image URL are required' },
        { status: 400 }
      );
    }

    const slide = db.createSlide({
      title: body.title,
      description: body.description || '',
      imageUrl: body.imageUrl,
      buttonText: body.buttonText || 'Explore Products',
      buttonUrl: body.buttonUrl || '/products',
      badgeText: body.badgeText || '',
      displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (Array.isArray(body.reorder)) {
      db.reorderSlides(body.reorder);
      return NextResponse.json({ success: true, slides: db.getSlides() });
    }
    return NextResponse.json({ error: 'Invalid reorder data' }, { status: 400 });
  } catch (error) {
    console.error('Error reordering slides:', error);
    return NextResponse.json({ error: 'Failed to reorder slides' }, { status: 500 });
  }
}
