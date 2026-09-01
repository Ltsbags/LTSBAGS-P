import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let catalogues = db.getCatalogues(false);

    if (category && category !== 'ALL') {
      catalogues = catalogues.filter((c) => c.category === category);
    }

    if (search) {
      catalogues = catalogues.filter(
        (c) =>
          c.title.toLowerCase().includes(search) ||
          c.description?.toLowerCase().includes(search) ||
          c.category?.toLowerCase().includes(search) ||
          c.version?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      catalogues,
      total: catalogues.length,
      totalDownloads: catalogues.reduce((sum, c) => sum + (c.downloadCount || 0), 0),
    });
  } catch (error: any) {
    console.error('Error fetching admin catalogues:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch catalogues' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, fileUrl } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Catalogue title is required' }, { status: 400 });
    }

    if (!fileUrl || !fileUrl.trim()) {
      return NextResponse.json({ error: 'PDF file or URL is required' }, { status: 400 });
    }

    const saved = db.saveCatalogue({
      title: title.trim(),
      description: body.description?.trim() || '',
      fileUrl: fileUrl.trim(),
      originalFileName: body.originalFileName || fileUrl.split('/').pop() || 'catalogue.pdf',
      fileSize: body.fileSize || '5.0 MB',
      fileSizeBytes: body.fileSizeBytes,
      coverImageUrl: body.coverImageUrl?.trim() || '',
      category: body.category || 'Corporate Backpacks',
      version: body.version || 'v2026.1',
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
      downloadCount: body.downloadCount || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json({
      success: true,
      catalogue: saved,
      message: 'PDF Catalogue published successfully',
    });
  } catch (error: any) {
    console.error('Error saving admin catalogue:', error);
    return NextResponse.json({ error: error.message || 'Failed to save catalogue' }, { status: 500 });
  }
}
