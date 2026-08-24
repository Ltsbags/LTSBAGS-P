import sharp from 'sharp';
import { IUpscalingProvider, UpscalingOptions } from '../types';

export class UpscalingProvider implements IUpscalingProvider {
  name: string;

  constructor(providerName: string = 'smart_ai') {
    this.name = providerName;
  }

  async upscaleAndCenter(
    inputBuffer: Buffer,
    options: UpscalingOptions = {}
  ): Promise<{ buffer: Buffer; width: number; height: number; isConfigured?: boolean; warning?: string }> {
    const provider = options.provider || process.env.UPSCALING_PROVIDER || 'smart_ai';
    const apiKey = options.apiKey || process.env.UPSCALING_API_KEY;

    const image = sharp(inputBuffer);
    const metadata = await image.metadata();
    const origWidth = metadata.width || 800;
    const origHeight = metadata.height || 800;

    // 0. If provider is none/disabled
    if (provider === 'none' || provider === 'disabled') {
      return {
        buffer: inputBuffer,
        width: origWidth,
        height: origHeight,
        isConfigured: false,
        warning: 'Upscaling provider is not configured.',
      };
    }

    // If external cloud provider like replicate or waifu2x without key
    if ((provider === 'replicate' || provider === 'waifu2x') && !apiKey) {
      return {
        buffer: inputBuffer,
        width: origWidth,
        height: origHeight,
        isConfigured: false,
        warning: `Upscaling provider '${provider}' is not configured (API key missing).`,
      };
    }

    const targetRes = options.targetResolution || 2000;
    const paddingPercent = options.paddingPercent !== undefined ? options.paddingPercent : 8; // 8% breathing space

    // Step 1: Detect product bounding box using alpha channel / non-transparent bounding box
    const rawData = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data } = rawData;
    let minX = origWidth;
    let minY = origHeight;
    let maxX = 0;
    let maxY = 0;
    let hasOpaquePixel = false;

    for (let y = 0; y < origHeight; y++) {
      for (let x = 0; x < origWidth; x++) {
        const alpha = data[(y * origWidth + x) * 4 + 3];
        if (alpha > 20) {
          hasOpaquePixel = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Fallback if no alpha channel detected
    if (!hasOpaquePixel) {
      minX = 0;
      minY = 0;
      maxX = origWidth - 1;
      maxY = origHeight - 1;
    }

    // Add 2px safety margin around cropped box
    minX = Math.max(0, minX - 2);
    minY = Math.max(0, minY - 2);
    maxX = Math.min(origWidth - 1, maxX + 2);
    maxY = Math.min(origHeight - 1, maxY + 2);

    const cropWidth = Math.max(10, maxX - minX + 1);
    const cropHeight = Math.max(10, maxY - minY + 1);

    // Step 2: Extract the tightly cropped product
    const croppedProductBuffer = await sharp(inputBuffer)
      .extract({
        left: minX,
        top: minY,
        width: cropWidth,
        height: cropHeight,
      })
      .toBuffer();

    // Step 3: Determine output canvas dimensions and scaling factor
    // Target canvas is a square canvas (e.g. 2000x2000 or 3000x3000) or high-res container
    const canvasSize = Math.max(targetRes, Math.max(cropWidth, cropHeight));
    const paddingPixels = Math.round(canvasSize * (paddingPercent / 100));
    const availableSize = canvasSize - paddingPixels * 2;

    // Maintain aspect ratio strictly without stretching
    const scaleRatio = Math.min(
      availableSize / cropWidth,
      availableSize / cropHeight
    );

    const scaledWidth = Math.round(cropWidth * scaleRatio);
    const scaledHeight = Math.round(cropHeight * scaleRatio);

    // Step 4: High-fidelity multi-pass Lanczos3 upscaling with detail unsharp masking
    let scaledProductImage = sharp(croppedProductBuffer).resize(
      scaledWidth,
      scaledHeight,
      {
        kernel: sharp.kernel.lanczos3,
        fit: 'inside',
        withoutEnlargement: false,
      }
    );

    // Apply delicate unsharp mask to restore micro-edge crispness without changing texture
    if (scaleRatio > 1.2) {
      scaledProductImage = scaledProductImage.sharpen({
        sigma: 0.8,
        m1: 1.0,
        m2: 2.0,
        x1: 2.0,
        y2: 10.0,
      });
    }

    const scaledProductBuffer = await scaledProductImage.toBuffer();

    // Step 5: Center inside square canvas with transparent background
    const leftOffset = Math.round((canvasSize - scaledWidth) / 2);
    const topOffset = Math.round((canvasSize - scaledHeight) / 2);

    const centeredCanvas = await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: scaledProductBuffer,
          top: topOffset,
          left: leftOffset,
        },
      ])
      .png({ compressionLevel: 8 })
      .toBuffer();

    return {
      buffer: centeredCanvas,
      width: canvasSize,
      height: canvasSize,
    };
  }
}

export const defaultUpscalingProvider = new UpscalingProvider();
