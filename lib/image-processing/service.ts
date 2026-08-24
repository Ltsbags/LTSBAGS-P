import { defaultBackgroundRemovalProvider } from './providers/BackgroundRemovalProvider';
import { defaultUpscalingProvider } from './providers/UpscalingProvider';
import { defaultImageOptimizationProvider } from './providers/ImageOptimizationProvider';
import {
  ProcessImageOptions,
  ProcessImageResult,
  ImageMetadataInfo,
} from './types';
import { ProcessedProductImage } from '../types';
import sharp, { type Metadata } from 'sharp';

export class ImageProcessingService {
  /**
   * Main pipeline method to process a product image buffer
   */
  async processImage(
    inputBuffer: Buffer,
    options: ProcessImageOptions = {}
  ): Promise<ProcessImageResult> {
    const warnings: string[] = [];

    // Step 1: Validation
    if (!inputBuffer || inputBuffer.length === 0) {
      return {
        success: false,
        image: this.createFailedPlaceholder('No image data provided'),
        error: 'No image data provided',
      };
    }

    // Max 25MB check
    if (inputBuffer.length > 25 * 1024 * 1024) {
      return {
        success: false,
        image: this.createFailedPlaceholder('File size exceeds 25MB limit'),
        error: 'File size exceeds 25MB limit. Please upload a smaller file.',
      };
    }

    let initialMetadata: Metadata;
    try {
      initialMetadata = await sharp(inputBuffer).metadata();
    } catch (parseErr: any) {
      return {
        success: false,
        image: this.createFailedPlaceholder('Invalid or corrupt image format'),
        error: `Could not parse image: ${parseErr.message || 'Unknown format'}`,
      };
    }

    const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'tiff'];
    if (!initialMetadata.format || !validFormats.includes(initialMetadata.format.toLowerCase())) {
      return {
        success: false,
        image: this.createFailedPlaceholder('Unsupported format. Supported: JPG, PNG, WEBP'),
        error: `Unsupported format (${initialMetadata.format}). Supported: JPG, PNG, WEBP.`,
      };
    }

    const metadataInfo: ImageMetadataInfo = {
      format: initialMetadata.format,
      width: initialMetadata.width || 800,
      height: initialMetadata.height || 800,
      channels: initialMetadata.channels || 3,
      hasAlpha: Boolean(initialMetadata.hasAlpha),
      size: inputBuffer.length,
    };

    // Keep pristine original buffer copy
    const originalBuffer: Buffer = Buffer.from(inputBuffer);
    let workingBuffer: Buffer = Buffer.from(inputBuffer);
    let bgRemovalApplied = false;
    let upscalingApplied = false;

    // Step 2 & 3: Background Removal
    const autoBg = options.autoBackgroundRemoval !== false;
    if (autoBg) {
      try {
        const bgResult = await defaultBackgroundRemovalProvider.removeBackground(
          workingBuffer,
          {
            provider: options.bgRemovalProvider,
            apiKey: options.bgRemovalApiKey,
          }
        );
        workingBuffer = Buffer.from(bgResult.buffer);
        bgRemovalApplied = Boolean(bgResult.hasTransparency);
        if (bgResult.warning) {
          warnings.push(bgResult.warning);
        }
      } catch (bgErr: any) {
        warnings.push(`Background removal step had a non-fatal issue: ${bgErr.message}`);
        console.warn('Background removal non-fatal error:', bgErr);
      }
    }

    // Step 4 & 5: AI Upscaling, Centering & Edge Polish
    const autoUpscale = options.autoUpscaling !== false;
    const targetRes = options.targetResolution || 2000;

    if (autoUpscale) {
      try {
        const upscaleResult = await defaultUpscalingProvider.upscaleAndCenter(
          workingBuffer,
          {
            provider: options.upscaleProvider,
            apiKey: options.upscalingApiKey,
            targetResolution: targetRes,
            paddingPercent: options.paddingPercent || 8,
          }
        );
        workingBuffer = Buffer.from(upscaleResult.buffer);
        upscalingApplied = upscaleResult.isConfigured !== false;
        if (upscaleResult.warning) {
          warnings.push(upscaleResult.warning);
        }
      } catch (upscaleErr: any) {
        warnings.push(`Upscaling step had a non-fatal issue: ${upscaleErr.message}`);
        console.warn('Upscaling non-fatal error:', upscaleErr);
      }
    }

    // Step 6: Multi-Output Generation & Web Optimization
    try {
      const optResult = await defaultImageOptimizationProvider.optimizeAndGenerateVariants(
        workingBuffer,
        originalBuffer,
        {
          productName: options.productName,
          categoryName: options.categoryName,
          variantSuffix: options.variantSuffix || 'main',
          outputFormat: options.outputFormat || 'webp',
          quality: options.quality || 'high',
        }
      );

      const processedImageItem: ProcessedProductImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        productId: options.productId,
        originalUrl: optResult.originalUrl,
        processedUrl: optResult.masterUrl,
        webUrl: optResult.webUrl,
        thumbnailUrl: optResult.thumbnailUrl,
        smallThumbnailUrl: optResult.smallThumbnailUrl,
        altText: optResult.altText,
        fileName: optResult.fileName,
        isPrimary: options.variantSuffix === 'main' || !options.variantSuffix,
        sortOrder: 0,
        processingStatus: 'completed',
        dimensions: {
          width: optResult.width,
          height: optResult.height,
        },
        fileSize: optResult.fileSize,
        mimeType: optResult.mimeType,
        hasTransparency: true,
        bgRemovalApplied,
        upscalingApplied,
        bgRemovalProvider: options.bgRemovalProvider || 'smart_ai',
        upscaleProvider: options.upscaleProvider || 'smart_ai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        image: processedImageItem,
        metadata: metadataInfo,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (optErr: any) {
      return {
        success: false,
        image: this.createFailedPlaceholder(optErr.message),
        error: `Image optimization failed: ${optErr.message}`,
        warnings,
      };
    }
  }

  private createFailedPlaceholder(errMsg: string): ProcessedProductImage {
    return {
      id: `img-${Date.now()}`,
      originalUrl: '',
      processedUrl: '',
      webUrl: '',
      thumbnailUrl: '',
      altText: '',
      fileName: 'failed.webp',
      isPrimary: false,
      sortOrder: 0,
      processingStatus: 'failed',
      error: errMsg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const imageProcessingService = new ImageProcessingService();
