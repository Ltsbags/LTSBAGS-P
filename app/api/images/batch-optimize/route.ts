import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';
import { coreImageProcessor } from '@/lib/image-processing/core-processor';
import { resolveImageBuffer } from '@/lib/image-processing/buffer-resolver';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const category = body.category || 'ALL';

    const allMedia = db.getMedia(category);
    let processedCount = 0;
    let skippedCount = 0;
    let totalSavedBytes = 0;
    const errors: string[] = [];

    for (const item of allMedia) {
      // If already has webp and savingsPercent, we can skip or re-check
      if (item.mimeType === 'image/webp' && item.savingsPercent && item.savingsPercent > 0) {
        skippedCount++;
        continue;
      }

      try {
        const sourceUrl = item.originalUrl || item.url;
        if (!sourceUrl) {
          skippedCount++;
          continue;
        }

        const resolved = await resolveImageBuffer(sourceUrl);
        const buffer = resolved.buffer;

        if (buffer && buffer.length > 0) {
          const result = await coreImageProcessor.processAndOptimize(buffer, {
            preset: item.preset || (item.category === 'PRODUCTS' ? 'product_main' : item.category === 'HERO' ? 'hero_banner' : 'general'),
            contextName: item.title,
            altText: item.altText,
            focalPoint: item.focalPoint,
          });

          if (result.success) {
            db.saveMedia({
              id: item.id,
              title: item.title,
              category: item.category,
              url: result.url,
              originalUrl: result.originalUrl,
              thumbnailUrl: result.thumbnailUrl,
              smallThumbnailUrl: result.smallThumbnailUrl,
              responsiveVariants: result.responsiveVariants,
              dimensions: result.dimensions,
              originalDimensions: result.originalDimensions,
              fileSize: result.fileSize,
              originalFileSize: result.originalFileSize,
              savingsPercent: result.savingsPercent,
              mimeType: result.mimeType,
              hash: result.hash,
            });
            processedCount++;
            if (result.originalFileSizeBytes > result.fileSizeBytes) {
              totalSavedBytes += (result.originalFileSizeBytes - result.fileSizeBytes);
            }
          }
        } else {
          skippedCount++;
        }
      } catch (err: any) {
        errors.push(`Error optimizing ${item.title}: ${err.message}`);
      }
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'BATCH_OPTIMIZE_MEDIA',
      'MEDIA',
      'batch',
      { processedCount, skippedCount, errorsCount: errors.length }
    );

    return NextResponse.json({
      success: true,
      processedCount,
      skippedCount,
      totalSavedBytes,
      totalSavedFormatted: totalSavedBytes > 1024 * 1024 ? (totalSavedBytes / (1024 * 1024)).toFixed(1) + ' MB' : (totalSavedBytes / 1024).toFixed(0) + ' KB',
      errors: errors.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Batch optimization error:', error);
    return NextResponse.json({ error: error.message || 'Failed to batch optimize images' }, { status: 500 });
  }
}
