import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const media = db.getMedia();
    return NextResponse.json(media);
  } catch (error) {
    console.error('Failed to fetch media assets:', error);
    return NextResponse.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }
    const saved = db.saveMedia(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Failed to save media asset:', error);
    return NextResponse.json({ error: 'Failed to save media asset' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }
    const success = db.deleteMedia(id);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to delete media asset:', error);
    return NextResponse.json({ error: 'Failed to delete media asset' }, { status: 500 });
  }
}
