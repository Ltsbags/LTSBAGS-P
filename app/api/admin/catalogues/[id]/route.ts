import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const catalogue = db.getCatalogueById(id);

    if (!catalogue) {
      return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, catalogue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching catalogue' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const existing = db.getCatalogueById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Catalogue not found' }, { status: 404 });
    }

    const updated = db.saveCatalogue({
      id,
      title: body.title !== undefined ? body.title.trim() : existing.title,
      description: body.description !== undefined ? body.description.trim() : existing.description,
      fileUrl: body.fileUrl !== undefined ? body.fileUrl.trim() : existing.fileUrl,
      originalFileName: body.originalFileName !== undefined ? body.originalFileName : existing.originalFileName,
      fileSize: body.fileSize !== undefined ? body.fileSize : existing.fileSize,
      fileSizeBytes: body.fileSizeBytes !== undefined ? body.fileSizeBytes : existing.fileSizeBytes,
      coverImageUrl: body.coverImageUrl !== undefined ? body.coverImageUrl.trim() : existing.coverImageUrl,
      category: body.category !== undefined ? body.category : existing.category,
      version: body.version !== undefined ? body.version : existing.version,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : existing.displayOrder,
      downloadCount: body.downloadCount !== undefined ? Number(body.downloadCount) : existing.downloadCount,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
    });

    return NextResponse.json({
      success: true,
      catalogue: updated,
      message: 'Catalogue updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating catalogue' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = db.deleteCatalogue(id);

    if (!success) {
      return NextResponse.json({ error: 'Catalogue not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Catalogue deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting catalogue' }, { status: 500 });
  }
}
