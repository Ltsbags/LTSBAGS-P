import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { IImageOptimizationProvider, OptimizationOptions } from '../types';

export class ImageOptimizationProvider implements IImageOptimizationProvider {
  name = 'sharp_optimizer';

  private sanitizeSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'product-bag';
  }

  async optimizeAndGenerateVariants(
    processedBuffer: Buffer,
    originalBuffer: Buffer,
    options: OptimizationOptions = {}
  ): Promise<{
    masterUrl: string;
    webUrl: string;
    thumbnailUrl: string;
    smallThumbnailUrl: string;
    originalUrl: string;
    fileName: string;
    altText: string;
    width: number;
    height: number;
    fileSize: number;
    mimeType: string;
  }> {
    const productName = options.productName || 'B2B Custom Bag Model';
    const categoryName = options.categoryName || 'B2B Bags';
    const variantSuffix = options.variantSuffix || 'main';
    const outputFormat = options.outputFormat || 'webp';
    const qualityLevel = options.quality === 'very_high' ? 95 : 88;

    // 1. Generate SEO Filename and ALT Text
    const slugBase = this.sanitizeSlug(productName);
    const timestamp = Date.now().toString().slice(-6);
    const seoBaseName = `${slugBase}-${variantSuffix}-${timestamp}`;
    const seoFileName = `${seoBaseName}.${outputFormat}`;

    // Clean, natural non-stuffed ALT text
    const altText = `${productName} manufactured by LTS Bags Mumbai`;

    // 2. Generate Master Transparent Image
    const masterWebP = await sharp(processedBuffer)
      .webp({ quality: qualityLevel, lossless: false, effort: 6 })
      .toBuffer();

    const masterMetadata = await sharp(masterWebP).metadata();
    const width = masterMetadata.width || 2000;
    const height = masterMetadata.height || 2000;

    // 3. Generate Web Optimized Image (2000px max, progressive/optimized)
    const webBuffer = await sharp(processedBuffer)
      .resize({
        width: Math.min(2400, width),
        height: Math.min(2400, height),
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: qualityLevel, effort: 5 })
      .toBuffer();

    // 4. Generate Thumbnail (600x600 px)
    const thumbBuffer = await sharp(processedBuffer)
      .resize(600, 600, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: sharp.kernel.lanczos3,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // 5. Generate Small Thumbnail (300x300 px)
    const smallThumbBuffer = await sharp(processedBuffer)
      .resize(300, 300, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: sharp.kernel.lanczos3,
      })
      .webp({ quality: 80 })
      .toBuffer();

    // 6. Save all folders to public/uploads/ directories with structured paths
    const baseUploadDir = path.join(process.cwd(), 'public', 'uploads');
    const originalDir = path.join(baseUploadDir, 'original');
    const processedDir = path.join(baseUploadDir, 'processed');
    const webDir = path.join(baseUploadDir, 'web');
    const thumbDir = path.join(baseUploadDir, 'thumbnail');
    const smallDir = path.join(baseUploadDir, 'small');

    let originalUrl = `data:image/jpeg;base64,${originalBuffer.toString('base64')}`;
    let masterUrl = `data:image/webp;base64,${masterWebP.toString('base64')}`;
    let webUrl = `data:image/webp;base64,${webBuffer.toString('base64')}`;
    let thumbnailUrl = `data:image/webp;base64,${thumbBuffer.toString('base64')}`;
    let smallThumbnailUrl = `data:image/webp;base64,${smallThumbBuffer.toString('base64')}`;

    try {
      await mkdir(originalDir, { recursive: true });
      await mkdir(processedDir, { recursive: true });
      await mkdir(webDir, { recursive: true });
      await mkdir(thumbDir, { recursive: true });
      await mkdir(smallDir, { recursive: true });

      const origFile = `orig_${seoBaseName}.jpg`;
      const procFile = `proc_${seoBaseName}.webp`;
      const webFile = `web_${seoBaseName}.webp`;
      const thumbFile = `thumb_${seoBaseName}.webp`;
      const smallFile = `small_${seoBaseName}.webp`;

      await writeFile(path.join(originalDir, origFile), originalBuffer);
      await writeFile(path.join(processedDir, procFile), masterWebP);
      await writeFile(path.join(webDir, webFile), webBuffer);
      await writeFile(path.join(thumbDir, thumbFile), thumbBuffer);
      await writeFile(path.join(smallDir, smallFile), smallThumbBuffer);

      // Set clean paths if available
      originalUrl = `/uploads/original/${origFile}`;
      masterUrl = `/uploads/processed/${procFile}`;
      webUrl = `/uploads/web/${webFile}`;
      thumbnailUrl = `/uploads/thumbnail/${thumbFile}`;
      smallThumbnailUrl = `/uploads/small/${smallFile}`;
    } catch (diskErr) {
      console.warn('Could not write images to disk folders, fallback to data URLs:', diskErr);
    }

    return {
      masterUrl,
      webUrl,
      thumbnailUrl,
      smallThumbnailUrl,
      originalUrl,
      fileName: seoFileName,
      altText,
      width,
      height,
      fileSize: webBuffer.length,
      mimeType: `image/${outputFormat}`,
    };
  }
}

export const defaultImageOptimizationProvider = new ImageOptimizationProvider();
