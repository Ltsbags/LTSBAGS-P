import sharp from 'sharp';
import crypto from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getPresetConfig, ImagePresetKey, ImagePresetConfig } from './presets';
import { ResponsiveVariant, MediaAsset } from '../types';

export interface ProcessImageRequestOptions {
  preset?: ImagePresetKey | string;
  contextName?: string; // Product name, category name, or blog title
  categoryName?: string;
  altText?: string;
  caption?: string;
  fitMode?: 'cover' | 'contain' | 'smart_crop';
  focalPoint?: { x: number; y: number }; // 0 to 100
  rotation?: number; // 0, 90, 180, 270
  zoom?: number; // 1.0 to 3.0
  cropRect?: { x: number; y: number; width: number; height: number }; // In relative percent or pixels
  bgMode?: 'original' | 'white' | 'transparent';
  quality?: number;
  outputFormat?: 'webp' | 'png' | 'jpeg';
}

export interface ImageAnalysisResult {
  isValid: boolean;
  format: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square';
  fileSize: number;
  formattedSize: string;
  hasAlpha: boolean;
  hash: string;
  suggestedPreset: ImagePresetKey;
  suggestedFileName: string;
  suggestedAltText: string;
  targetPresetConfig: ImagePresetConfig;
}

export interface ProcessImageResponseResult {
  success: boolean;
  url: string;
  originalUrl: string;
  thumbnailUrl: string;
  smallThumbnailUrl: string;
  responsiveVariants: ResponsiveVariant[];
  dimensions: string;
  width: number;
  height: number;
  originalDimensions: string;
  originalWidth: number;
  originalHeight: number;
  fileSize: string;
  fileSizeBytes: number;
  originalFileSize: string;
  originalFileSizeBytes: number;
  savingsPercent: number;
  mimeType: string;
  fileName: string;
  altText: string;
  preset: string;
  focalPoint: { x: number; y: number };
  hash: string;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'bag-image';
}

export class CoreImageProcessor {
  /**
   * Validate file buffer signatures to ensure safe image uploads
   */
  validateBuffer(buffer: Buffer): { valid: boolean; format: string; error?: string } {
    if (!buffer || buffer.length === 0) {
      return { valid: false, format: 'unknown', error: 'Empty file buffer' };
    }

    if (buffer.length > 15 * 1024 * 1024) {
      return { valid: false, format: 'unknown', error: 'File size exceeds maximum 15MB limit' };
    }

    // Magic number checks
    const header = buffer.slice(0, 12);
    // JPEG: FF D8 FF
    if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
      return { valid: true, format: 'jpeg' };
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47
    ) {
      return { valid: true, format: 'png' };
    }

    // WebP: RIFF....WEBP
    if (
      header[0] === 0x52 &&
      header[1] === 0x49 &&
      header[2] === 0x46 &&
      header[3] === 0x46 &&
      header[8] === 0x57 &&
      header[9] === 0x45 &&
      header[10] === 0x42 &&
      header[11] === 0x50
    ) {
      return { valid: true, format: 'webp' };
    }

    // AVIF: ftypavif or ftypavis at offset 4
    const ftyp = header.slice(4, 12).toString('ascii');
    if (ftyp.includes('avif') || ftyp.includes('avis')) {
      return { valid: true, format: 'avif' };
    }

    // SVG: Check text prefix safely
    const textStart = buffer.slice(0, 500).toString('utf8').trim().toLowerCase();
    if (textStart.includes('<svg') || (textStart.startsWith('<?xml') && textStart.includes('<svg'))) {
      if (textStart.includes('<script') || textStart.includes('javascript:') || textStart.includes('onload=')) {
        return { valid: false, format: 'svg', error: 'SVG contains disallowed executable scripts' };
      }
      return { valid: true, format: 'svg' };
    }

    return { valid: false, format: 'unknown', error: 'Unsupported image format. Allowed: JPG, PNG, WebP, AVIF, SVG' };
  }

  /**
   * Calculate SHA-256 hash of buffer for duplicate detection
   */
  calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Analyze image buffer before full processing
   */
  async analyzeImage(
    buffer: Buffer,
    options: ProcessImageRequestOptions = {}
  ): Promise<ImageAnalysisResult> {
    const val = this.validateBuffer(buffer);
    if (!val.valid) {
      throw new Error(val.error || 'Invalid image file');
    }

    const hash = this.calculateHash(buffer);
    let meta = await sharp(buffer).metadata();

    // Account for EXIF orientation swap
    let w = meta.width || 1200;
    let h = meta.height || 1200;
    if (meta.orientation && (meta.orientation >= 5 && meta.orientation <= 8)) {
      const temp = w;
      w = h;
      h = temp;
    }

    const aspectRatio = w / h;
    const orientation = aspectRatio > 1.1 ? 'landscape' : aspectRatio < 0.9 ? 'portrait' : 'square';

    let suggestedPreset: ImagePresetKey = 'general';
    if (options.preset) {
      suggestedPreset = options.preset as ImagePresetKey;
    } else if (val.format === 'png' && meta.hasAlpha && aspectRatio >= 1.5) {
      suggestedPreset = 'client_logo';
    } else if (Math.abs(aspectRatio - 1) < 0.15) {
      suggestedPreset = 'product_main';
    } else if (aspectRatio > 2.0) {
      suggestedPreset = 'hero_banner';
    } else if (aspectRatio > 1.6) {
      suggestedPreset = 'blog_featured';
    }

    const targetPresetConfig = getPresetConfig(options.preset || suggestedPreset);

    // Auto SEO filename
    const contextSlug = sanitizeSlug(options.contextName || options.categoryName || 'lts-bags-product');
    const suggestedFileName = `${contextSlug}-${targetPresetConfig.targetWidth}x${targetPresetConfig.targetHeight}.webp`;
    
    // Auto ALT text
    const cleanContext = options.contextName || options.categoryName || 'B2B Custom Bags & Backpacks';
    const suggestedAltText = `${cleanContext} manufactured by LTS Bags Mumbai`;

    return {
      isValid: true,
      format: val.format,
      width: w,
      height: h,
      aspectRatio,
      orientation,
      fileSize: buffer.length,
      formattedSize: formatBytes(buffer.length),
      hasAlpha: Boolean(meta.hasAlpha),
      hash,
      suggestedPreset,
      suggestedFileName,
      suggestedAltText,
      targetPresetConfig,
    };
  }

  /**
   * Process, crop, resize, and optimize image according to user specifications
   */
  async processAndOptimize(
    inputBuffer: Buffer,
    options: ProcessImageRequestOptions = {}
  ): Promise<ProcessImageResponseResult> {
    const analysis = await this.analyzeImage(inputBuffer, options);
    const presetConfig = getPresetConfig(options.preset || analysis.suggestedPreset);
    
    const targetW = presetConfig.targetWidth;
    const targetH = presetConfig.targetHeight;
    const targetAspect = targetW / targetH;
    
    const fitMode = options.fitMode || presetConfig.defaultFitMode;
    const focalPoint = options.focalPoint || { x: 50, y: 50 }; // 0 to 100%
    const rotation = options.rotation || 0;
    const zoom = Math.max(1, Math.min(3, options.zoom || 1));
    const bgMode = options.bgMode || (presetConfig.allowAlpha && analysis.hasAlpha ? 'transparent' : 'white');
    const quality = options.quality || presetConfig.quality;

    // 1. Initial pipeline: Auto-rotate EXIF + manual rotation
    let pipeline = sharp(inputBuffer).rotate(); // auto EXIF
    if (rotation !== 0) {
      pipeline = pipeline.rotate(rotation);
    }

    // Get rotated base buffer & metadata
    const rotatedBuffer = await pipeline.toBuffer();
    const rotatedMeta = await sharp(rotatedBuffer).metadata();
    const currentW = rotatedMeta.width || targetW;
    const currentH = rotatedMeta.height || targetH;

    let processedBuffer: Buffer;

    if (fitMode === 'contain' || presetConfig.neverCrop) {
      // CONTAIN MODE: Fit entire image inside canvas with balanced padding (e.g. Products / Logos)
      const paddingPercent = (presetConfig.paddingPercent ?? 6) / 100;
      const innerW = Math.round(targetW * (1 - paddingPercent * 2));
      const innerH = Math.round(targetH * (1 - paddingPercent * 2));

      // Resize image inside inner bounds
      const resizedInner = await sharp(rotatedBuffer)
        .resize({
          width: innerW,
          height: innerH,
          fit: 'inside',
          withoutEnlargement: false,
          kernel: sharp.kernel.lanczos3,
        })
        .toBuffer();

      const innerMeta = await sharp(resizedInner).metadata();
      const actualInnerW = innerMeta.width || innerW;
      const actualInnerH = innerMeta.height || innerH;

      const leftOffset = Math.round((targetW - actualInnerW) / 2);
      const topOffset = Math.round((targetH - actualInnerH) / 2);

      // Determine background
      let bgCanvas: { r: number; g: number; b: number; alpha: number } = { r: 255, g: 255, b: 255, alpha: 1 };
      if (bgMode === 'transparent' || (presetConfig.allowAlpha && rotatedMeta.hasAlpha)) {
        bgCanvas = { r: 0, g: 0, b: 0, alpha: 0 };
      } else if (bgMode === 'original') {
        bgCanvas = { r: 248, g: 250, b: 252, alpha: 1 };
      }

      // Create base canvas and composite inner product centered
      processedBuffer = await sharp({
        create: {
          width: targetW,
          height: targetH,
          channels: 4,
          background: bgCanvas,
        },
      })
        .composite([
          {
            input: resizedInner,
            top: topOffset,
            left: leftOffset,
          },
        ])
        .toBuffer();
    } else {
      // COVER / SMART CROP MODE (e.g. Hero banner, Category banner, Blog featured, Testimonial)
      const currentAspect = currentW / currentH;

      if (options.cropRect && options.cropRect.width > 0 && options.cropRect.height > 0) {
        // User provided custom crop rectangle
        const cropX = Math.max(0, Math.min(currentW - 10, Math.round(options.cropRect.x)));
        const cropY = Math.max(0, Math.min(currentH - 10, Math.round(options.cropRect.y)));
        const cropW = Math.max(10, Math.min(currentW - cropX, Math.round(options.cropRect.width)));
        const cropH = Math.max(10, Math.min(currentH - cropY, Math.round(options.cropRect.height)));

        processedBuffer = await sharp(rotatedBuffer)
          .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
          .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
          .toBuffer();
      } else {
        // Compute crop window based on focal point & zoom
        let cropW = currentW;
        let cropH = currentH;

        if (currentAspect > targetAspect) {
          // Source is wider than target: crop width
          cropW = Math.round(currentH * targetAspect);
          cropH = currentH;
        } else {
          // Source is taller than target: crop height
          cropW = currentW;
          cropH = Math.round(currentW / targetAspect);
        }

        // Apply zoom reduction to crop window
        if (zoom > 1) {
          cropW = Math.round(cropW / zoom);
          cropH = Math.round(cropH / zoom);
        }

        // Calculate top/left offsets from focal point (0% - 100%)
        const focalXFrac = Math.max(0, Math.min(1, focalPoint.x / 100));
        const focalYFrac = Math.max(0, Math.min(1, focalPoint.y / 100));

        const idealCenterX = currentW * focalXFrac;
        const idealCenterY = currentH * focalYFrac;

        let left = Math.round(idealCenterX - cropW / 2);
        let top = Math.round(idealCenterY - cropH / 2);

        // Clamp inside image bounds
        left = Math.max(0, Math.min(currentW - cropW, left));
        top = Math.max(0, Math.min(currentH - cropH, top));

        processedBuffer = await sharp(rotatedBuffer)
          .extract({
            left,
            top,
            width: Math.min(cropW, currentW - left),
            height: Math.min(cropH, currentH - top),
          })
          .resize(targetW, targetH, {
            kernel: sharp.kernel.lanczos3,
          })
          .toBuffer();
      }
    }

    // 2. Generate Master WebP Optimized Image
    const masterWebP = await sharp(processedBuffer)
      .webp({ quality, effort: 5 })
      .toBuffer();

    // 3. Generate Responsive Variants
    const responsiveVariants: ResponsiveVariant[] = [];
    const variantWidths = presetConfig.responsiveWidths || [targetW, Math.round(targetW * 0.66), Math.round(targetW * 0.33)];

    for (const vW of variantWidths) {
      if (vW < targetW) {
        const vH = Math.round(vW / targetAspect);
        const vBuf = await sharp(processedBuffer)
          .resize(vW, vH, { kernel: sharp.kernel.lanczos3 })
          .webp({ quality: Math.max(75, quality - 4), effort: 4 })
          .toBuffer();
        
        responsiveVariants.push({
          width: vW,
          height: vH,
          url: `data:image/webp;base64,${vBuf.toString('base64')}`,
          fileSize: formatBytes(vBuf.length),
        });
      }
    }

    // 4. Generate Thumbnail (400px wide) & Small Thumbnail (200px wide)
    const thumbBuf = await sharp(processedBuffer)
      .resize({
        width: 400,
        height: Math.round(400 / targetAspect),
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toBuffer();

    const smallThumbBuf = await sharp(processedBuffer)
      .resize({
        width: 180,
        height: Math.round(180 / targetAspect),
        fit: 'inside',
      })
      .webp({ quality: 75 })
      .toBuffer();

    // 5. Build Filenames & URLs
    const slugBase = sanitizeSlug(options.contextName || options.categoryName || 'lts-bags');
    const timestamp = Date.now().toString().slice(-6);
    const fileName = `${slugBase}-${presetConfig.key}-${timestamp}.webp`;
    const altText = options.altText || analysis.suggestedAltText;

    let originalUrl = `data:${analysis.format === 'png' ? 'image/png' : 'image/jpeg'};base64,${inputBuffer.toString('base64')}`;
    let webUrl = `data:image/webp;base64,${masterWebP.toString('base64')}`;
    let thumbnailUrl = `data:image/webp;base64,${thumbBuf.toString('base64')}`;
    let smallThumbnailUrl = `data:image/webp;base64,${smallThumbBuf.toString('base64')}`;

    // 6. Write to disk if public/uploads directory is writable
    try {
      const uploadBase = path.join(process.cwd(), 'public', 'uploads');
      const optDir = path.join(uploadBase, 'optimized');
      const thumbDir = path.join(uploadBase, 'thumb');
      const origDir = path.join(uploadBase, 'original');

      await mkdir(optDir, { recursive: true });
      await mkdir(thumbDir, { recursive: true });
      await mkdir(origDir, { recursive: true });

      const optFile = `${slugBase}_opt_${timestamp}.webp`;
      const thumbFile = `${slugBase}_thumb_${timestamp}.webp`;
      const origFile = `${slugBase}_orig_${timestamp}.${analysis.format}`;

      await writeFile(path.join(optDir, optFile), masterWebP);
      await writeFile(path.join(thumbDir, thumbFile), thumbBuf);
      await writeFile(path.join(origDir, origFile), inputBuffer);

      webUrl = `/uploads/optimized/${optFile}`;
      thumbnailUrl = `/uploads/thumb/${thumbFile}`;
      originalUrl = `/uploads/original/${origFile}`;
    } catch (diskErr) {
      console.warn('Could not write uploads to disk folders, using data URLs:', diskErr);
    }

    const optSize = masterWebP.length;
    const origSize = inputBuffer.length;
    const savingsPercent = origSize > optSize ? Math.round(((origSize - optSize) / origSize) * 100) : 0;

    return {
      success: true,
      url: webUrl,
      originalUrl,
      thumbnailUrl,
      smallThumbnailUrl,
      responsiveVariants,
      dimensions: `${targetW}x${targetH}`,
      width: targetW,
      height: targetH,
      originalDimensions: `${analysis.width}x${analysis.height}`,
      originalWidth: analysis.width,
      originalHeight: analysis.height,
      fileSize: formatBytes(optSize),
      fileSizeBytes: optSize,
      originalFileSize: formatBytes(origSize),
      originalFileSizeBytes: origSize,
      savingsPercent,
      mimeType: 'image/webp',
      fileName,
      altText,
      preset: presetConfig.key,
      focalPoint,
      hash: analysis.hash,
    };
  }
}

export const coreImageProcessor = new CoreImageProcessor();
