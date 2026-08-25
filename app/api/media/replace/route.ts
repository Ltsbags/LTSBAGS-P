import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';
import { coreImageProcessor } from '@/lib/image-processing/core-processor';
import { getPresetConfig } from '@/lib/image-processing/presets';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const mediaId = formData.get('mediaId') as string | null;
    const file = formData.get('file') as File | null;
    const replaceGlobalReferences = formData.get('replaceGlobalReferences') === 'true';

    if (!mediaId) {
      return NextResponse.json({ error: 'mediaId is required' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Replacement image file is required' }, { status: 400 });
    }

    const existingAsset = db.getMediaById(mediaId);
    if (!existingAsset) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
    }

    const preset = (formData.get('preset') as string) || existingAsset.preset || 'general';
    const altText = (formData.get('altText') as string) || existingAsset.altText || '';
    const focalX = formData.get('focalX') ? parseFloat(formData.get('focalX') as string) : (existingAsset.focalPoint?.x || 50);
    const focalY = formData.get('focalY') ? parseFloat(formData.get('focalY') as string) : (existingAsset.focalPoint?.y || 50);
    const rotation = formData.get('rotation') ? parseInt(formData.get('rotation') as string, 10) : 0;
    const zoom = formData.get('zoom') ? parseFloat(formData.get('zoom') as string) : 1;
    const fitMode = formData.get('fitMode') as 'cover' | 'contain' | 'smart_crop' | null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await coreImageProcessor.processAndOptimize(buffer, {
      preset,
      contextName: existingAsset.title,
      altText,
      fitMode: fitMode || undefined,
      focalPoint: { x: focalX, y: focalY },
      rotation,
      zoom,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to process replacement image' }, { status: 500 });
    }

    const oldUrl = existingAsset.url;
    const newUrl = result.url;

    // Update media asset
    const updatedMedia = db.saveMedia({
      id: existingAsset.id,
      title: existingAsset.title,
      url: newUrl,
      originalUrl: result.originalUrl,
      thumbnailUrl: result.thumbnailUrl,
      smallThumbnailUrl: result.smallThumbnailUrl,
      responsiveVariants: result.responsiveVariants,
      fileSize: result.fileSize,
      originalFileSize: result.originalFileSize,
      dimensions: result.dimensions,
      originalDimensions: result.originalDimensions,
      savingsPercent: result.savingsPercent,
      mimeType: result.mimeType,
      altText: result.altText,
      focalPoint: result.focalPoint,
      hash: result.hash,
    });

    let replacedCount = 0;
    if (replaceGlobalReferences && oldUrl !== newUrl) {
      replacedCount = db.replaceImageUrlEverywhere(oldUrl, newUrl);
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'REPLACE_MEDIA',
      'MEDIA',
      existingAsset.id,
      { title: existingAsset.title, oldUrl, newUrl, replacedCount }
    );

    return NextResponse.json({
      success: true,
      media: updatedMedia,
      replacedGlobalCount: replacedCount,
      message: `Image replaced successfully.${replacedCount > 0 ? ` Updated in ${replacedCount} location(s).` : ''}`,
    });
  } catch (error: any) {
    console.error('Error replacing media:', error);
    return NextResponse.json({ error: error.message || 'Failed to replace media asset' }, { status: 500 });
  }
}
