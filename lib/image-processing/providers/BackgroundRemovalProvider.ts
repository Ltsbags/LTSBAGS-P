import sharp from 'sharp';
import { IBackgroundRemovalProvider, BackgroundRemovalOptions } from '../types';

export class BackgroundRemovalProvider implements IBackgroundRemovalProvider {
  name: string;

  constructor(providerName: string = 'smart_ai') {
    this.name = providerName;
  }

  async removeBackground(
    inputBuffer: Buffer,
    options: BackgroundRemovalOptions = {}
  ): Promise<{ buffer: Buffer; hasTransparency: boolean; isConfigured?: boolean; warning?: string }> {
    const provider = options.provider || process.env.BACKGROUND_REMOVAL_PROVIDER || 'none';
    const apiKey = options.apiKey || process.env.BACKGROUND_REMOVAL_API_KEY;

    // 0. If provider is none/disabled or empty
    if (provider === 'none' || provider === 'disabled' || !provider) {
      return {
        buffer: inputBuffer,
        hasTransparency: false,
        isConfigured: false,
        warning: 'Background removal is disabled.',
      };
    }

    // 1. External remove.bg provider
    if (provider === 'remove_bg') {
      if (!apiKey) {
        const localResult = await this.removeBackgroundSmartAI(inputBuffer, options);
        return {
          ...localResult,
          isConfigured: false,
          warning: 'External AI provider is not configured. Local image processing is available.',
        };
      }

      try {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(inputBuffer)], { type: 'image/png' });
        formData.append('image_file', blob, 'product.png');
        formData.append('size', 'auto');
        formData.append('format', 'png');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': apiKey,
          },
          body: formData,
        });

        if (response.ok) {
          const arrayBuf = await response.arrayBuffer();
          return {
            buffer: Buffer.from(new Uint8Array(arrayBuf)),
            hasTransparency: true,
            isConfigured: true,
          };
        } else {
          const localResult = await this.removeBackgroundSmartAI(inputBuffer, options);
          return {
            ...localResult,
            isConfigured: true,
            warning: `External AI provider (Remove.bg) returned status ${response.status}. Local image processing was applied.`,
          };
        }
      } catch (apiErr: any) {
        const localResult = await this.removeBackgroundSmartAI(inputBuffer, options);
        return {
          ...localResult,
          isConfigured: true,
          warning: `External AI provider connection error. Local image processing was applied.`,
        };
      }
    }

    // 2. External Clipdrop provider
    if (provider === 'clipdrop') {
      if (!apiKey) {
        const localResult = await this.removeBackgroundSmartAI(inputBuffer, options);
        return {
          ...localResult,
          isConfigured: false,
          warning: 'External AI provider is not configured. Local image processing is available.',
        };
      }

      try {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(inputBuffer)], { type: 'image/png' });
        formData.append('image_file', blob, 'product.png');

        const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
          },
          body: formData,
        });

        if (response.ok) {
          const arrayBuf = await response.arrayBuffer();
          return {
            buffer: Buffer.from(new Uint8Array(arrayBuf)),
            hasTransparency: true,
            isConfigured: true,
          };
        } else {
          const localResult = await this.removeBackgroundSmartAI(inputBuffer, options);
          return {
            ...localResult,
            isConfigured: true,
            warning: `External AI provider (ClipDrop) returned status ${response.status}. Local image processing was applied.`,
          };
        }
      } catch (clipErr: any) {
        const localResult = await this.removeBackgroundSmartAI(inputBuffer, options);
        return {
          ...localResult,
          isConfigured: true,
          warning: `External AI provider connection error. Local image processing was applied.`,
        };
      }
    }

    // 3. Built-in Smart AI & Computer Vision Background Removal Engine
    if (provider === 'smart_ai') {
      const smartResult = await this.removeBackgroundSmartAI(inputBuffer, options);
      return {
        ...smartResult,
        isConfigured: true,
      };
    }

    // Default fallback to local Sharp processing
    const localFallback = await this.removeBackgroundSmartAI(inputBuffer, options);
    return {
      ...localFallback,
      isConfigured: false,
      warning: 'External AI provider is not configured. Local image processing is available.',
    };
  }

  /**
   * Built-in intelligent background isolation engine
   * Analyzes background luminance, studio lighting, chroma distances,
   * creates soft alpha matting, and protects delicate straps, zippers, and handles.
   */
  private async removeBackgroundSmartAI(
    inputBuffer: Buffer,
    _options: BackgroundRemovalOptions
  ): Promise<{ buffer: Buffer; hasTransparency: boolean }> {
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    const width = metadata.width || 800;
    const height = metadata.height || 800;

    // Convert to RGBA raw pixel data
    const rawData = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data } = rawData;
    const totalPixels = width * height;

    // Sample border pixels (corners and edges) to identify background color profile
    const bgSamples: { r: number; g: number; b: number }[] = [];
    const sampleSize = Math.max(4, Math.min(20, Math.floor(Math.min(width, height) / 40)));

    // Top-left, top-right, bottom-left, bottom-right corners
    const sampleCorner = (startX: number, startY: number) => {
      for (let y = startY; y < startY + sampleSize && y < height; y++) {
        for (let x = startX; x < startX + sampleSize && x < width; x++) {
          const idx = (y * width + x) * 4;
          // If already transparent, skip
          if (data[idx + 3] < 50) continue;
          bgSamples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
        }
      }
    };

    sampleCorner(0, 0);
    sampleCorner(width - sampleSize, 0);
    sampleCorner(0, height - sampleSize);
    sampleCorner(width - sampleSize, height - sampleSize);

    // Top and bottom edge samples
    for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x += 4) {
      const topIdx = (2 * width + x) * 4;
      const botIdx = ((height - 3) * width + x) * 4;
      bgSamples.push({ r: data[topIdx], g: data[topIdx + 1], b: data[topIdx + 2] });
      bgSamples.push({ r: data[botIdx], g: data[botIdx + 1], b: data[botIdx + 2] });
    }

    if (bgSamples.length === 0) {
      bgSamples.push({ r: 255, g: 255, b: 255 });
    }

    // Calculate median / average background color
    let avgR = 0, avgG = 0, avgB = 0;
    for (const s of bgSamples) {
      avgR += s.r;
      avgG += s.g;
      avgB += s.b;
    }
    avgR = Math.round(avgR / bgSamples.length);
    avgG = Math.round(avgG / bgSamples.length);
    avgB = Math.round(avgB / bgSamples.length);

    // Determine if background is predominantly light (studio white/grey) or dark
    const bgLuminance = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
    const isLightBg = bgLuminance > 180;

    // Create mask buffer
    const alphaChannel = Buffer.alloc(totalPixels);

    // Color distance helper (Euclidean in RGB space with luminance weighting)
    const colorDist = (r: number, g: number, b: number, br: number, bg: number, bb: number) => {
      const dr = r - br;
      const dg = g - bg;
      const db = b - bb;
      return Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
    };

    // Thresholds
    // High sensitivity to preserve bag textures and dark strap details against light background
    const hardThreshold = isLightBg ? 16 : 22;
    const softThreshold = isLightBg ? 42 : 48;

    // Pass 1: Initial pixel classification
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const currentAlpha = data[idx + 3];

      // If already transparent, preserve transparency
      if (currentAlpha < 10) {
        alphaChannel[i] = 0;
        continue;
      }

      // Check distance to average background
      const dist = colorDist(r, g, b, avgR, avgG, avgB);

      // Light background specific check: very bright studio pixels (near white #F5F5F5+)
      const pixelLum = 0.299 * r + 0.587 * g + 0.114 * b;
      const isPureStudioWhite = isLightBg && pixelLum > 242 && Math.abs(r - g) < 12 && Math.abs(g - b) < 12;

      if (dist < hardThreshold || isPureStudioWhite) {
        alphaChannel[i] = 0; // Pure background
      } else if (dist < softThreshold) {
        // Soft edge gradient for smooth anti-aliased edge
        const t = (dist - hardThreshold) / (softThreshold - hardThreshold);
        alphaChannel[i] = Math.round(t * 255);
      } else {
        alphaChannel[i] = currentAlpha; // Solid foreground product
      }
    }

    // Pass 2: Edge cleanup and connected component protection
    // Protect interior of bag from accidental transparent speckles (morphological hole closing)
    const cleanedAlpha = Buffer.from(alphaChannel);
    const radius = 1;

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const i = y * width + x;
        
        // If this pixel was marked background or semi-transparent, check if it is completely surrounded by solid product
        if (cleanedAlpha[i] < 200) {
          let solidNeighbors = 0;
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              if (dx === 0 && dy === 0) continue;
              const ni = (y + dy) * width + (x + dx);
              if (alphaChannel[ni] > 220) {
                solidNeighbors++;
              }
            }
          }
          // If 7 of 8 neighbors are solid product, this is an interior detail (e.g., zipper teeth, metal eyelet, woven fabric)
          if (solidNeighbors >= 7) {
            cleanedAlpha[i] = 255;
          }
        }
      }
    }

    // Apply cleaned alpha channel to RGBA buffer
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      data[idx + 3] = cleanedAlpha[i];
    }

    // Generate output buffer with transparent background
    const outputBuffer = await sharp(data, {
      raw: {
        width,
        height,
        channels: 4,
      },
    })
      .png({ compressionLevel: 8 })
      .toBuffer();

    return {
      buffer: outputBuffer,
      hasTransparency: true,
    };
  }
}

export const defaultBackgroundRemovalProvider = new BackgroundRemovalProvider();
