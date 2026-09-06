export type ImagePresetKey =
  | 'hero_banner'
  | 'hero_mobile'
  | 'product_main'
  | 'product_gallery'
  | 'category_banner'
  | 'category_thumb'
  | 'blog_featured'
  | 'blog_thumb'
  | 'client_logo'
  | 'testimonial'
  | 'team_photo'
  | 'factory_gallery'
  | 'certificate'
  | 'general';

export interface ImagePresetConfig {
  key: ImagePresetKey;
  label: string;
  description: string;
  targetWidth: number;
  targetHeight: number;
  aspectRatio: number; // width / height
  aspectRatioLabel: string;
  defaultFitMode: 'cover' | 'contain' | 'smart_crop';
  quality: number;
  allowAlpha: boolean;
  paddingPercent?: number; // for contain mode (e.g. 5-8% for products/logos)
  neverCrop?: boolean;
  responsiveWidths: number[];
  category: 'HERO' | 'PRODUCTS' | 'CATEGORIES' | 'BLOGS' | 'LOGOS' | 'TESTIMONIALS' | 'FACTORY' | 'CERTIFICATES' | 'GENERAL';
}

export const IMAGE_PRESETS: Record<ImagePresetKey, ImagePresetConfig> = {
  hero_banner: {
    key: 'hero_banner',
    label: 'Hero Banner (Desktop & Tablet)',
    description: 'Ultra-wide display banner for homepage and landing page hero sections.',
    targetWidth: 1920,
    targetHeight: 800,
    aspectRatio: 1920 / 800, // 2.4 (12:5)
    aspectRatioLabel: '12:5 (1920 × 800 px)',
    defaultFitMode: 'cover',
    quality: 88,
    allowAlpha: false,
    responsiveWidths: [1920, 1280, 768],
    category: 'HERO',
  },
  hero_mobile: {
    key: 'hero_mobile',
    label: 'Hero Banner (Mobile Portrait)',
    description: 'High-impact vertical crop for mobile screens without cutting off text.',
    targetWidth: 1080,
    targetHeight: 1350,
    aspectRatio: 1080 / 1350, // 0.8 (4:5)
    aspectRatioLabel: '4:5 (1080 × 1350 px)',
    defaultFitMode: 'cover',
    quality: 86,
    allowAlpha: false,
    responsiveWidths: [1080, 750, 480],
    category: 'HERO',
  },
  product_main: {
    key: 'product_main',
    label: 'Product Main Image',
    description: 'Square 1:1 catalog image. Product is auto-centered with balanced padding.',
    targetWidth: 1200,
    targetHeight: 1200,
    aspectRatio: 1,
    aspectRatioLabel: '1:1 Square (1200 × 1200 px)',
    defaultFitMode: 'contain',
    quality: 90,
    allowAlpha: true,
    paddingPercent: 6,
    neverCrop: true,
    responsiveWidths: [1200, 800, 400],
    category: 'PRODUCTS',
  },
  product_gallery: {
    key: 'product_gallery',
    label: 'Product Gallery Image',
    description: 'Square detail, side angle, or component view of the bag.',
    targetWidth: 1200,
    targetHeight: 1200,
    aspectRatio: 1,
    aspectRatioLabel: '1:1 Square (1200 × 1200 px)',
    defaultFitMode: 'contain',
    quality: 88,
    allowAlpha: true,
    paddingPercent: 6,
    neverCrop: true,
    responsiveWidths: [1200, 800, 400],
    category: 'PRODUCTS',
  },
  category_banner: {
    key: 'category_banner',
    label: 'Category Banner',
    description: 'Header and collection image for catalog and subcategory collection pages.',
    targetWidth: 1200,
    targetHeight: 1200,
    aspectRatio: 1, // 1:1 Square (1200 × 1200 px)
    aspectRatioLabel: '1:1 (1200 × 1200 px)',
    defaultFitMode: 'contain',
    quality: 88,
    allowAlpha: true,
    paddingPercent: 4,
    neverCrop: true,
    responsiveWidths: [1200, 800, 400],
    category: 'CATEGORIES',
  },
  category_thumb: {
    key: 'category_thumb',
    label: 'Category Thumbnail',
    description: 'Square card image for category cards and menu dropdowns.',
    targetWidth: 800,
    targetHeight: 800,
    aspectRatio: 1,
    aspectRatioLabel: '1:1 Square (800 × 800 px)',
    defaultFitMode: 'contain',
    quality: 85,
    allowAlpha: true,
    paddingPercent: 4,
    neverCrop: true,
    responsiveWidths: [800, 400],
    category: 'CATEGORIES',
  },
  blog_featured: {
    key: 'blog_featured',
    label: 'Blog Featured Image',
    description: '16:9 widescreen header for B2B industry articles and news.',
    targetWidth: 1600,
    targetHeight: 900,
    aspectRatio: 16 / 9, // 1.777
    aspectRatioLabel: '16:9 (1600 × 900 px)',
    defaultFitMode: 'cover',
    quality: 88,
    allowAlpha: false,
    responsiveWidths: [1600, 1024, 640],
    category: 'BLOGS',
  },
  blog_thumb: {
    key: 'blog_thumb',
    label: 'Blog Thumbnail',
    description: 'Compact 16:9 preview for recent posts list and sidebar widgets.',
    targetWidth: 800,
    targetHeight: 450,
    aspectRatio: 16 / 9,
    aspectRatioLabel: '16:9 (800 × 450 px)',
    defaultFitMode: 'cover',
    quality: 85,
    allowAlpha: false,
    responsiveWidths: [800, 400],
    category: 'BLOGS',
  },
  client_logo: {
    key: 'client_logo',
    label: 'Client / Corporate Logo',
    description: 'Contained company logo. Transparency is preserved and edges are NEVER cropped.',
    targetWidth: 800,
    targetHeight: 400,
    aspectRatio: 2, // 2:1
    aspectRatioLabel: '2:1 Contain (800 × 400 px)',
    defaultFitMode: 'contain',
    quality: 92,
    allowAlpha: true,
    paddingPercent: 8,
    neverCrop: true,
    responsiveWidths: [800, 400, 200],
    category: 'LOGOS',
  },
  testimonial: {
    key: 'testimonial',
    label: 'Testimonial Client Photo',
    description: 'Square avatar photo for verified corporate client reviews.',
    targetWidth: 600,
    targetHeight: 600,
    aspectRatio: 1,
    aspectRatioLabel: '1:1 Square (600 × 600 px)',
    defaultFitMode: 'cover',
    quality: 86,
    allowAlpha: false,
    responsiveWidths: [600, 300],
    category: 'TESTIMONIALS',
  },
  team_photo: {
    key: 'team_photo',
    label: 'Team / Executive Photo',
    description: 'Square executive or team member portrait for the About page.',
    targetWidth: 1200,
    targetHeight: 1200,
    aspectRatio: 1,
    aspectRatioLabel: '1:1 Square (1200 × 1200 px)',
    defaultFitMode: 'cover',
    quality: 88,
    allowAlpha: false,
    responsiveWidths: [1200, 600],
    category: 'GENERAL',
  },
  factory_gallery: {
    key: 'factory_gallery',
    label: 'Factory / Workshop Photo',
    description: '3:2 industrial shot for manufacturing capability showcase.',
    targetWidth: 1600,
    targetHeight: 1066,
    aspectRatio: 1600 / 1066, // 1.5
    aspectRatioLabel: '3:2 Landscape (1600 × 1066 px)',
    defaultFitMode: 'cover',
    quality: 86,
    allowAlpha: false,
    responsiveWidths: [1600, 1024, 600],
    category: 'FACTORY',
  },
  certificate: {
    key: 'certificate',
    label: 'Certification / ISO Document',
    description: '3:4 portrait or document view of compliance and quality certificates.',
    targetWidth: 1200,
    targetHeight: 1600,
    aspectRatio: 1200 / 1600, // 0.75
    aspectRatioLabel: '3:4 Document (1200 × 1600 px)',
    defaultFitMode: 'contain',
    quality: 90,
    allowAlpha: false,
    paddingPercent: 4,
    responsiveWidths: [1200, 600],
    category: 'CERTIFICATES',
  },
  general: {
    key: 'general',
    label: 'General Website Image',
    description: 'Standard balanced image for custom content and marketing blocks.',
    targetWidth: 1200,
    targetHeight: 1200,
    aspectRatio: 1,
    aspectRatioLabel: '1:1 Square (1200 × 1200 px)',
    defaultFitMode: 'contain',
    quality: 88,
    allowAlpha: true,
    paddingPercent: 4,
    neverCrop: true,
    responsiveWidths: [1200, 800, 400],
    category: 'GENERAL',
  },
};

/**
 * Ensures images from CDNs (like Unsplash) don't have fit=crop query params
 * which chop off product handles, straps, or edges.
 */
export function sanitizeImageUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    return url.replace(/([?&])fit=crop(&|$)/, '$1fit=max$2');
  }
  return url;
}

export function getPresetConfig(key?: string): ImagePresetConfig {
  if (key && key in IMAGE_PRESETS) {
    return IMAGE_PRESETS[key as ImagePresetKey];
  }
  return IMAGE_PRESETS.general;
}
