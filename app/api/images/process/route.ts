import { NextRequest, NextResponse } from 'next/server';
import { imageProcessingService } from '@/lib/image-processing/service';
import { ProcessImageOptions } from '@/lib/image-processing/types';
import { resolveImageBuffer } from '@/lib/image-processing/buffer-resolver';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer | null = null;
    let options: ProcessImageOptions = {};

    // Get site image processing settings as base defaults
    const siteSettings = db.getSettings();
    const storedIp = siteSettings.imageProcessing;

    const defaultSettings = {
      autoProcessing: storedIp?.autoProcessing !== undefined ? storedIp.autoProcessing : true,
      autoBackgroundRemoval: storedIp?.autoBackgroundRemoval !== undefined ? storedIp.autoBackgroundRemoval : true,
      autoUpscaling: storedIp?.autoUpscaling !== undefined ? storedIp.autoUpscaling : true,
      targetResolution: storedIp?.targetResolution || 2000,
      outputFormat: storedIp?.outputFormat || 'webp',
      quality: storedIp?.quality || 'high',
      paddingPercent: storedIp?.paddingPercent !== undefined ? storedIp.paddingPercent : 8,
      bgRemovalProvider: storedIp?.bgRemovalProvider || process.env.BACKGROUND_REMOVAL_PROVIDER || 'smart_ai',
      upscaleProvider: storedIp?.upscaleProvider || process.env.UPSCALING_PROVIDER || 'smart_ai',
      bgRemovalApiKey: storedIp?.bgRemovalApiKey || process.env.BACKGROUND_REMOVAL_API_KEY || '',
      upscalingApiKey: storedIp?.upscalingApiKey || process.env.UPSCALING_API_KEY || '',
      preserveOriginals: storedIp?.preserveOriginals !== undefined ? storedIp.preserveOriginals : true,
    };

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const originalUrl = formData.get('originalUrl') as string | null;
      const imageUrl = formData.get('imageUrl') as string | null;

      if (file) {
        const bytes = await file.arrayBuffer();
        const resolved = await resolveImageBuffer(bytes);
        buffer = resolved.buffer;
      } else if (originalUrl || imageUrl) {
        const resolved = await resolveImageBuffer(originalUrl || imageUrl);
        buffer = resolved.buffer;
      }

      options = {
        productId: (formData.get('productId') as string) || undefined,
        productName: (formData.get('productName') as string) || undefined,
        categoryName: (formData.get('categoryName') as string) || undefined,
        variantSuffix: (formData.get('variantSuffix') as string) || 'main',
        autoBackgroundRemoval: formData.get('autoBackgroundRemoval') !== null 
          ? formData.get('autoBackgroundRemoval') === 'true' 
          : defaultSettings.autoBackgroundRemoval,
        autoUpscaling: formData.get('autoUpscaling') !== null 
          ? formData.get('autoUpscaling') === 'true' 
          : defaultSettings.autoUpscaling,
        targetResolution: formData.get('targetResolution') 
          ? Number(formData.get('targetResolution')) 
          : defaultSettings.targetResolution,
        outputFormat: (formData.get('outputFormat') as any) || defaultSettings.outputFormat,
        quality: (formData.get('quality') as any) || defaultSettings.quality,
        paddingPercent: formData.get('paddingPercent') 
          ? Number(formData.get('paddingPercent')) 
          : defaultSettings.paddingPercent,
        bgRemovalProvider: (formData.get('bgRemovalProvider') as string) || defaultSettings.bgRemovalProvider,
        upscaleProvider: (formData.get('upscaleProvider') as string) || defaultSettings.upscaleProvider,
        bgRemovalApiKey: (formData.get('bgRemovalApiKey') as string) || defaultSettings.bgRemovalApiKey,
        upscalingApiKey: (formData.get('upscalingApiKey') as string) || defaultSettings.upscalingApiKey,
      };
    } else {
      // JSON payload (e.g. { dataUrl, options })
      const body = await req.json();
      const rawData = body.dataUrl || body.imageUrl || body.originalUrl || body.base64;

      if (rawData) {
        const resolved = await resolveImageBuffer(rawData);
        buffer = resolved.buffer;
      }

      options = {
        productId: body.productId,
        productName: body.productName,
        categoryName: body.categoryName,
        variantSuffix: body.variantSuffix || 'main',
        autoBackgroundRemoval: body.autoBackgroundRemoval !== undefined ? body.autoBackgroundRemoval : defaultSettings.autoBackgroundRemoval,
        autoUpscaling: body.autoUpscaling !== undefined ? body.autoUpscaling : defaultSettings.autoUpscaling,
        targetResolution: body.targetResolution || defaultSettings.targetResolution,
        outputFormat: body.outputFormat || defaultSettings.outputFormat,
        quality: body.quality || defaultSettings.quality,
        paddingPercent: body.paddingPercent || defaultSettings.paddingPercent,
        bgRemovalProvider: body.bgRemovalProvider || defaultSettings.bgRemovalProvider,
        upscaleProvider: body.upscaleProvider || defaultSettings.upscaleProvider,
        bgRemovalApiKey: body.bgRemovalApiKey || defaultSettings.bgRemovalApiKey,
        upscalingApiKey: body.upscalingApiKey || defaultSettings.upscalingApiKey,
      };
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ error: 'No valid image data received' }, { status: 400 });
    }

    const result = await imageProcessingService.processImage(buffer, options);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to process image',
          image: result.image,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      image: result.image,
      metadata: result.metadata,
      warnings: result.warnings,
    });
  } catch (error: any) {
    console.error('Image processing API error:', error);
    return NextResponse.json(
      { error: error.message || 'Image processing error' },
      { status: 422 }
    );
  }
}
