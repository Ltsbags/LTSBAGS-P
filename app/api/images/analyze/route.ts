import { NextRequest, NextResponse } from 'next/server';
import { coreImageProcessor } from '@/lib/image-processing/core-processor';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const preset = formData.get('preset') as string | null;
    const contextName = formData.get('contextName') as string | null;
    const categoryName = formData.get('categoryName') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const analysis = await coreImageProcessor.analyzeImage(buffer, {
      preset: preset || undefined,
      contextName: contextName || undefined,
      categoryName: categoryName || undefined,
    });

    // Check duplicate in Media Library
    const duplicateAsset = db.findMediaByHash(analysis.hash);

    return NextResponse.json({
      success: true,
      analysis,
      isDuplicate: Boolean(duplicateAsset),
      duplicateAsset: duplicateAsset ? {
        id: duplicateAsset.id,
        title: duplicateAsset.title,
        url: duplicateAsset.url,
        thumbnailUrl: duplicateAsset.thumbnailUrl,
        dimensions: duplicateAsset.dimensions,
        fileSize: duplicateAsset.fileSize,
        category: duplicateAsset.category,
      } : null,
    });
  } catch (error: any) {
    console.error('Image analysis error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze image' }, { status: 400 });
  }
}
