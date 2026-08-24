import { ImageProcessingStatus, ProcessedProductImage, ImageProcessingSettings } from '../types';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadataInfo {
  format: string;
  width: number;
  height: number;
  channels: number;
  hasAlpha: boolean;
  size: number;
}

export interface BackgroundRemovalOptions {
  provider?: string;
  apiKey?: string;
  featherRadius?: number;
  threshold?: number;
  preserveEdges?: boolean;
}

export interface UpscalingOptions {
  provider?: string;
  apiKey?: string;
  targetResolution?: number;
  paddingPercent?: number; // 5 - 10%
  centerProduct?: boolean;
}

export interface OptimizationOptions {
  outputFormat?: 'webp' | 'png' | 'avif';
  quality?: 'high' | 'very_high';
  generateThumbnails?: boolean;
  productName?: string;
  categoryName?: string;
  variantSuffix?: string;
}

export interface ProcessImageOptions {
  productId?: string;
  productName?: string;
  categoryName?: string;
  variantSuffix?: string; // 'main', 'side', 'detail', etc.
  autoBackgroundRemoval?: boolean;
  autoUpscaling?: boolean;
  targetResolution?: number;
  outputFormat?: 'webp' | 'png' | 'avif';
  quality?: 'high' | 'very_high';
  paddingPercent?: number;
  bgRemovalProvider?: string;
  upscaleProvider?: string;
  bgRemovalApiKey?: string;
  upscalingApiKey?: string;
}

export interface ProcessingStepProgress {
  step: ImageProcessingStatus;
  percentage: number;
  message: string;
}

export interface ProcessImageResult {
  success: boolean;
  image: ProcessedProductImage;
  metadata?: ImageMetadataInfo;
  warnings?: string[];
  error?: string;
}

export interface IBackgroundRemovalProvider {
  name: string;
  removeBackground(
    inputBuffer: Buffer,
    options?: BackgroundRemovalOptions
  ): Promise<{ buffer: Buffer; hasTransparency: boolean; isConfigured?: boolean; warning?: string }>;
}

export interface IUpscalingProvider {
  name: string;
  upscaleAndCenter(
    inputBuffer: Buffer,
    options?: UpscalingOptions
  ): Promise<{ buffer: Buffer; width: number; height: number; isConfigured?: boolean; warning?: string }>;
}

export interface IImageOptimizationProvider {
  name: string;
  optimizeAndGenerateVariants(
    processedBuffer: Buffer,
    originalBuffer: Buffer,
    options: OptimizationOptions
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
  }>;
}
