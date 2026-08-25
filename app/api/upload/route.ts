import { NextRequest, NextResponse } from 'next/server';
import { coreImageProcessor } from '@/lib/image-processing/core-processor';
import { db } from '@/lib/db';
import { getPresetConfig } from '@/lib/image-processing/presets';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const preset = (formData.get('preset') as string) || 'general';
    const contextName = (formData.get('contextName') as string) || '';
    const categoryName = (formData.get('categoryName') as string) || '';
    const altText = (formData.get('altText') as string) || '';
    const caption = (formData.get('caption') as string) || '';
    const fitMode = formData.get('fitMode') as 'cover' | 'contain' | 'smart_crop' | null;
    const bgMode = formData.get('bgMode') as 'original' | 'white' | 'transparent' | null;
    const focalX = formData.get('focalX') ? parseFloat(formData.get('focalX') as string) : 50;
    const focalY = formData.get('focalY') ? parseFloat(formData.get('focalY') as string) : 50;
    const rotation = formData.get('rotation') ? parseInt(formData.get('rotation') as string, 10) : 0;
    const zoom = formData.get('zoom') ? parseFloat(formData.get('zoom') as string) : 1;
    const addToMediaLibrary = formData.get('addToMediaLibrary') !== 'false';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate and process
    const result = await coreImageProcessor.processAndOptimize(buffer, {
      preset,
      contextName: contextName || file.name.replace(/\.[^/.]+$/, ''),
      categoryName,
      altText: altText || undefined,
      caption: caption || undefined,
      fitMode: fitMode || undefined,
      bgMode: bgMode || undefined,
      focalPoint: { x: focalX, y: focalY },
      rotation,
      zoom,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Image processing failed' }, { status: 500 });
    }

    // Auto-register in Media Library
    let savedMediaAsset = null;
    if (addToMediaLibrary) {
      const presetCfg = getPresetConfig(preset);
      savedMediaAsset = db.saveMedia({
        title: contextName || result.fileName,
        url: result.url,
        originalUrl: result.originalUrl,
        thumbnailUrl: result.thumbnailUrl,
        smallThumbnailUrl: result.smallThumbnailUrl,
        responsiveVariants: result.responsiveVariants,
        category: presetCfg.category || 'PRODUCTS',
        preset: presetCfg.key,
        fileSize: result.fileSize,
        originalFileSize: result.originalFileSize,
        dimensions: result.dimensions,
        originalDimensions: result.originalDimensions,
        savingsPercent: result.savingsPercent,
        mimeType: result.mimeType,
        altText: result.altText,
        caption,
        focalPoint: result.focalPoint,
        hash: result.hash,
      });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      originalUrl: result.originalUrl,
      thumbnailUrl: result.thumbnailUrl,
      smallThumbnailUrl: result.smallThumbnailUrl,
      responsiveVariants: result.responsiveVariants,
      dimensions: result.dimensions,
      width: result.width,
      height: result.height,
      originalDimensions: result.originalDimensions,
      fileSize: result.fileSize,
      originalFileSize: result.originalFileSize,
      savingsPercent: result.savingsPercent,
      fileName: result.fileName,
      altText: result.altText,
      preset: result.preset,
      hash: result.hash,
      mediaId: savedMediaAsset?.id,
    });
  } catch (error: any) {
    console.error('File upload & optimization error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process uploaded image' }, { status: 500 });
  }
}

