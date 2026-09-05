/**
 * Types & Schemas for LTS BAGS Programmatic SEO Engine
 * Quality > Quantity: Every page provides unique, search-intent-focused B2B value.
 */

export type PageType = 
  | 'product_location'
  | 'product_industry'
  | 'product_material'
  | 'product_application'
  | 'manufacturing_service'
  | 'location_hub'
  | 'industry_hub'
  | 'material_hub';

export type PageStatus = 
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type SchemaType = 
  | 'Organization'
  | 'LocalBusiness'
  | 'Product'
  | 'Service';

export interface SeoPageFaq {
  question: string;
  answer: string;
}

export interface SeoPageSpecifications {
  materials: string[];
  hardware: string[];
  branding_options: string[];
  moq: string;
  sample_timeline: string;
  bulk_timeline: string;
  packaging?: string;
  export_compliance?: string;
}

export interface SeoPage {
  id: string;
  page_type: PageType;
  product_id?: string;
  location_id?: string;
  industry_id?: string;
  material_id?: string;
  application_id?: string;

  slug: string;
  url: string;

  h1: string;
  seo_title: string;
  meta_description: string;

  intro_content: string[];
  product_overview: string;
  manufacturing_content: string;
  customization_content: string;
  applications_content: string;
  industry_content?: string;
  location_content?: string;

  specifications: SeoPageSpecifications;
  faq: SeoPageFaq[];
  cta_text: string;

  featured_image: string;
  image_alt: string;

  canonical_url: string;

  robots_index: boolean;
  robots_follow: boolean;

  og_title: string;
  og_description: string;
  og_image: string;

  schema_type: SchemaType;

  status: PageStatus;
  quality_score: number; // 0 to 100
  duplicate_score: number; // 0 to 100
  quality_flags?: string[];

  created_at: string;
  updated_at: string;
}

export interface SeoProduct {
  id: string;
  name: string;
  category: string;
  slug: string;
  description: string;
  materials: string[];
  applications: string[];
  customization_options: string[];
  moq: string;
  sample_availability: string;
  production_lead_time: string;
  branding_options: string[];
  packaging: string;
  industries: string[];
  image: string;
  image_alt: string;
}

export interface SeoLocation {
  id: string;
  city: string;
  state: string;
  country: string;
  slug: string;
  is_factory_hq: boolean; // Only Mumbai is TRUE
  local_intro: string;
  business_relevance: string;
  shipping_information: string;
  nearby_industrial_context: string;
}

export interface SeoIndustry {
  id: string;
  name: string;
  slug: string;
  overview: string;
  typical_products: string[];
  typical_customizations: string[];
  typical_buyer_requirements: string[];
  applications: string[];
  relevant_product_categories: string[];
}

export interface SeoMaterial {
  id: string;
  name: string;
  slug: string;
  material_characteristics: string;
  typical_bag_applications: string[];
  durability: string;
  customization_options: string[];
  advantages: string[];
  limitations: string[];
  suitable_products: string[];
}

export interface SeoApplication {
  id: string;
  name: string;
  slug: string;
  description: string;
  popular_bag_types: string[];
  buyer_types: string[];
  key_features: string[];
}

export interface QualityCheckResult {
  page_id: string;
  slug: string;
  score: number;
  is_indexable: boolean;
  passed_checks: string[];
  failed_checks: string[];
  duplicate_risk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  cannibalization_with?: string;
  recommendations: string[];
}

export interface SeoLeadEvent {
  id?: string;
  event_type: 'quote_submit' | 'whatsapp_click' | 'phone_click' | 'email_click' | 'catalogue_download' | 'file_upload';
  page_slug: string;
  page_title?: string;
  product?: string;
  location?: string;
  industry?: string;
  referrer?: string;
  user_agent?: string;
  timestamp: string;
}
