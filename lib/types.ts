export type AdminRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'SALES_MANAGER' 
  | 'SALES_STAFF' 
  | 'CONTENT_MANAGER' 
  | 'SEO_MANAGER' 
  | 'EDITOR' 
  | 'SEO_SPECIALIST';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  token: string;
  userId: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress: string;
  createdAt: string;
}

export interface BankDetails {
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  upiId?: string;
  upiQrCodeUrl?: string;
}

export interface CompanyContactInfo {
  companyName?: string;
  legalCompanyName?: string;
  tagline?: string;
  businessDescription?: string;
  logoUrl?: string;
  phone1?: string;
  phone2?: string;
  whatsapp?: string;
  email1?: string;
  email2?: string;
  factoryAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  googleMapsUrl?: string;
  googleBusinessProfileUrl?: string;
  workingHours?: string;
  gstNumber?: string;
  isoCertificate?: string;
  cinNumber?: string;
  socialLinkedin?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialWhatsapp?: string;
  bankDetails?: BankDetails;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  sublabel: string;
}

export interface FeatureItem {
  id?: string;
  title: string;
  description: string;
  iconName?: string;
}
export type HomepageFeature = FeatureItem;

export interface ProcessStepItem {
  id?: string;
  stepNumber?: string;
  title: string;
  description: string;
}
export type HomepageProcessStep = ProcessStepItem;

export type TestimonialSource = 'Google Review' | 'Verified Customer' | 'Direct Feedback' | 'Other';
export type TestimonialVerificationStatus = 'VERIFIED' | 'UNVERIFIED';
export type TestimonialPublishStatus = 'PUBLISHED' | 'DRAFT';

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  company: string;
  content: string;
  review?: string;
  rating: number;
  avatarUrl?: string;
  photoUrl?: string;
  source?: TestimonialSource;
  verificationStatus?: TestimonialVerificationStatus;
  publishStatus?: TestimonialPublishStatus;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export type Testimonial = TestimonialItem;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  displayOrder: number;
  isEnabled: boolean;
  isExternal?: boolean;
  targetBlank?: boolean;
  badge?: string;
  children?: NavLinkItem[];
}
export type NavigationMenuItem = NavLinkItem;

export interface NavigationMenuConfig {
  headerNav: NavLinkItem[];
  footerNav: NavLinkItem[];
  quickLinks: NavLinkItem[];
  importantLinks: NavLinkItem[];
  updatedAt?: string;
}

export interface ClientLogoItem {
  id: string;
  companyName: string;
  logoUrl: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageContent {
  cataloguePdfUrl?: string;
  heroHeading?: string;
  heroDescription?: string;
  heroCtaText?: string;
  heroCtaUrl?: string;
  stats?: StatItem[];
  categoriesTitle?: string;
  categoriesSubtitle?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  whyChooseTitle?: string;
  whyChooseSubtitle?: string;
  whyChooseFeatures?: FeatureItem[];
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: ProcessStepItem[];
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials?: TestimonialItem[];
  clientLogos?: ClientLogoItem[];
  manufacturingTitle?: string;
  manufacturingDescription?: string;
  customizationTitle?: string;
  customizationDescription?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  blogTitle?: string;
  blogSubtitle?: string;
}

export interface AboutPageContent {
  headline?: string;
  subtitle?: string;
  storyTitle?: string;
  storyContent?: string;
  missionTitle?: string;
  missionContent?: string;
  visionTitle?: string;
  visionContent?: string;
  factoryCapacityTitle?: string;
  factoryCapacityDetails?: string;
  factoryCapacity?: string;
  qualityPolicyTitle?: string;
  qualityPolicyDetails?: string;
  qualityPolicy?: string;
  aboutImageUrl?: string;
}

export interface FooterContent {
  aboutBrief?: string;
  copyrightText?: string;
  quickLinksTitle?: string;
  categoriesTitle?: string;
  contactTitle?: string;
}

export interface CompanyMetrics {
  yearsExperience?: string;
  factoryArea?: string;
  dailyCapacity?: string;
  monthlyCapacity?: string;
  workforce?: string;
  minOrderQuantity?: string;
  onTimeDeliveryRate?: string;
  countriesServed?: string;
  certificationsList?: string;
  certifications?: string;
  qualityStandards?: string;
  clientSectionMode?: 'CLIENTS' | 'INDUSTRIES_SERVED';
  clientSectionTitle?: string;
}

export type FactoryDepartment =
  | 'Factory Exterior'
  | 'Factory Interior'
  | 'Cutting Department'
  | 'Stitching Department'
  | 'Printing Department'
  | 'Embroidery Department'
  | 'Quality Control'
  | 'Packaging'
  | 'Warehouse'
  | 'Finished Goods'
  | 'Dispatch'
  | 'Machinery';

export interface FactoryGalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  department: FactoryDepartment;
  altText: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type CertificationStatus = 'VERIFIED' | 'PENDING_VERIFICATION' | 'EXPIRED';

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issuingAuthority?: string;
  certificateNumber: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  imageUrl?: string;
  pdfUrl?: string;
  verificationUrl?: string;
  status?: CertificationStatus;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type ImageProcessingStatus = 
  | 'pending' 
  | 'uploading' 
  | 'removing_background' 
  | 'cleaning_edges' 
  | 'upscaling' 
  | 'optimizing' 
  | 'completed' 
  | 'failed';

export interface ProcessedProductImage {
  id: string;
  productId?: string;
  originalUrl: string;
  processedUrl: string;
  webUrl: string;
  thumbnailUrl: string;
  smallThumbnailUrl?: string;
  altText: string;
  fileName: string;
  isPrimary: boolean;
  sortOrder: number;
  processingStatus: ImageProcessingStatus;
  error?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  mimeType?: string;
  hasTransparency?: boolean;
  bgRemovalApplied?: boolean;
  upscalingApplied?: boolean;
  bgRemovalProvider?: string;
  upscaleProvider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageProcessingSettings {
  autoProcessing: boolean;
  autoBackgroundRemoval: boolean;
  autoUpscaling: boolean;
  targetResolution: number; // e.g. 2000 or 3000
  outputFormat: 'webp' | 'png' | 'avif';
  quality: 'high' | 'very_high';
  paddingPercent: number; // e.g. 8 (5-10%)
  bgRemovalProvider: 'none' | 'smart_ai' | 'remove_bg' | 'clipdrop' | 'replicate' | 'gemini';
  upscaleProvider: 'none' | 'smart_ai' | 'sharp_lanczos' | 'waifu2x' | 'replicate';
  bgRemovalApiKey?: string;
  upscalingApiKey?: string;
  hasBgRemovalApiKey?: boolean;
  hasUpscalingApiKey?: boolean;
  bgRemovalApiKeyMasked?: string;
  upscalingApiKeyMasked?: string;
  preserveOriginals: boolean;
}

export interface SiteSettings {
  logoUrl?: string;
  logoDarkUrl?: string;
  logoText?: string;
  logoSubtitle?: string;
  cataloguePdfUrl?: string;
  contactInfo?: CompanyContactInfo;
  metrics?: CompanyMetrics;
  certifications?: Certification[];
  factoryGallery?: FactoryGalleryItem[];
  navigation?: NavigationMenuConfig;
  homepage?: HomepageContent;
  about?: AboutPageContent;
  footer?: FooterContent;
  imageProcessing?: ImageProcessingSettings;
  seoDefaults?: {
    defaultMetaTitle?: string;
    defaultMetaDescription?: string;
    defaultKeywords?: string;
    siteUrl?: string;
    ogImage?: string;
    twitterHandle?: string;
    googleSiteVerification?: string;
    googleAnalyticsId?: string;
  };
  updatedAt?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  displayOrder: number;
  isActive: boolean;
  badgeText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage?: string;
  featuredImage?: string;
  iconName?: string;
  parentId?: string;
  parentSlug?: string;
  parentCategory?: string;
  displayOrder?: number;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  breadcrumbTitle?: string;
  subcategories?: Category[];
  level?: 'MAIN' | 'SUB' | number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export type ProductStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface CommercialOptions {
  requestQuote?: boolean;
  requestSample?: boolean;
  bulkOrder?: boolean;
  exportOrder?: boolean;
  showPrice?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  categoryId: string;
  categoryName?: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  galleryImages?: ProcessedProductImage[];
  featuredImage?: string;
  thumbnail?: string;
  lifestyleImages?: string[];
  detailImages?: string[];
  manufacturingImages?: string[];
  videoUrl?: string;
  youtubeUrl?: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  materials: string;
  size?: string;
  dimensions?: string;
  capacity?: string;
  weight?: string;
  laptopSize?: string;
  compartments?: string | number;
  closureType?: string;
  handleType?: string;
  strapType?: string;
  lining?: string;
  colors?: string[];
  availableColors?: string[];
  moq: number;
  sampleAvailability?: boolean | string;
  sampleAvailable?: boolean;
  productionLeadTime?: string;
  countryOfOrigin?: string;
  packaging?: string;
  packagingInformation?: string;
  customizationOptions?: string[];
  printingOptions?: string[];
  embroideryOptions?: string[];
  applications?: string[];
  price?: number;
  isPriceOnRequest?: boolean;
  priceDisplay?: string;
  commercialOptions?: CommercialOptions;
  specifications: ProductSpecification[];
  isFeatured: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  displayOrder?: number;
  sortOrder?: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  robotsMeta?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  imageAltText: string;
  breadcrumbTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export type BlogStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  status?: BlogStatus;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  altText?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUOTATION'
  | 'SAMPLE'
  | 'NEGOTIATION'
  | 'CONFIRMED'
  | 'PRODUCTION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'QUOTE_SENT'
  | 'SAMPLE_REQUESTED'
  | 'SAMPLE_SENT'
  | 'ORDER_CONFIRMED'
  | 'CLOSED'
  | 'IN_PROGRESS'
  | 'QUOTED';

export interface RfqProductItem {
  category?: string;
  productName: string;
  quantity: number;
  targetPrice?: string;
  material?: string;
  size?: string;
  color?: string;
  logoBranding?: string;
  customNotes?: string;
}

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface EnquiryTimelineItem {
  id?: string;
  status: string;
  note?: string;
  author?: string;
  timestamp: string;
}

export interface Enquiry {
  id: string;
  enquiryNumber?: string;
  name: string;
  customerName?: string;
  company: string;
  companyName?: string;
  email: string;
  mobile: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  state?: string;
  destination?: string;
  productRequirement: string;
  productId?: string;
  product?: string;
  category?: string;
  quantity: number;
  targetPrice?: string;
  material?: string;
  materialRequirement?: string;
  size?: string;
  color?: string;
  logoBranding?: string;
  brandingRequirement?: string;
  customizationRequirement?: string;
  printingType?: string;
  embroideryType?: string;
  sampleRequired?: boolean;
  requiredDate?: string;
  deliveryDate?: string;
  deliveryRequirement?: string;
  deliveryLocation?: string;
  deliveryAddress?: string;
  referenceImageUrl?: string;
  uploadedFileUrl?: string;
  message: string;
  items?: RfqProductItem[];
  status: EnquiryStatus;
  priority?: LeadPriority;
  source?: 'FORM' | 'AI_CHATBOT' | 'SAMPLE_REQUEST' | 'WHATSAPP_LEAD' | 'DIRECT' | 'CATALOGUE_DOWNLOAD' | 'QUICK_QUOTE';
  internalNotes?: string;
  notes?: string;
  assignedStaff?: string;
  assignedTo?: string;
  assignedSalesPerson?: string;
  followUpDate?: string;
  quotationNumber?: string;
  quotationId?: string;
  timeline?: EnquiryTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  productName: string;
  productCode?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  enquiryId?: string;
  customerId?: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  clientMobile: string;
  items: QuotationItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  shippingCharge?: number;
  otherCharges?: number;
  totalAmount: number;
  paymentTerms?: string;
  deliveryTerms?: string;
  bankDetails?: BankDetails;
  bankDetailsText?: string;
  termsAndConditions?: string;
  notes?: string;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'PAID' | 'VIEWED' | 'NEGOTIATION' | 'EXPIRED';
  sentAt?: string;
  viewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  website?: string;
  industry?: string;
  customerType?: 'CORPORATE' | 'WHOLESALER' | 'RETAILER' | 'INSTITUTION' | 'EXPORTER' | 'INDIVIDUAL';
  leadSource?: string;
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
  enquiryIds?: string[];
  quotationIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogueItem {
  id: string;
  title: string;
  description?: string;
  coverImageUrl: string;
  pdfUrl: string;
  category?: string;
  version?: string;
  fileSize?: string;
  viewsCount: number;
  downloadsCount: number;
  isActive: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export type Catalogue = CatalogueItem;

export interface RedirectRule {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  statusCode: 301 | 302;
  isActive: boolean;
  hitCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AnalyticsEventType = 
  | 'PAGE_VIEW' 
  | 'PRODUCT_VIEW' 
  | 'QUOTE_FORM_START' 
  | 'QUOTE_FORM_SUBMIT' 
  | 'WHATSAPP_CLICK' 
  | 'PHONE_CLICK' 
  | 'EMAIL_CLICK' 
  | 'CATALOGUE_DOWNLOAD' 
  | 'SEARCH'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_SUCCESS';

export interface AnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  resourceId?: string;
  resourceName?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
}

export interface SmtpSettings {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  senderName?: string;
  senderEmail?: string;
  notifyEmail?: string;
  enabled?: boolean;
}

export interface WhatsAppConfig {
  defaultNumber?: string;
  templateMessage?: string;
  enabled?: boolean;
}

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  blogs: Blog[];
  enquiries: Enquiry[];
  customers?: Customer[];
  catalogues?: CatalogueItem[];
  redirects?: RedirectRule[];
  analyticsEvents?: AnalyticsEvent[];
  settings?: SiteSettings;
  slides?: HeroSlide[];
  quotations?: Quotation[];
  payments?: Payment[];
  media?: MediaAsset[];
  clients?: Client[];
  languageSettings?: LanguageSettings;
  entityTranslations?: EntityTranslation[];
  users?: AdminUser[];
  sessions?: AdminSession[];
  auditLogs?: AuditLog[];
  faqs?: FaqItem[];
  testimonials?: TestimonialItem[];
  navigation?: NavigationMenuConfig;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  quotationId?: string;
  quoteNumber?: string;
  clientName: string;
  companyName: string;
  amount: number;
  paymentMethod: 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'CREDIT_CARD' | 'CASH' | 'RAZORPAY' | 'ONLINE';
  transactionRef: string;
  paymentDate: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResponsiveVariant {
  width: number;
  height: number;
  url: string;
  fileSize?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  originalUrl?: string;
  thumbnailUrl?: string;
  smallThumbnailUrl?: string;
  responsiveVariants?: ResponsiveVariant[];
  category: 'PRODUCTS' | 'HERO' | 'CATEGORIES' | 'BLOGS' | 'LOGOS' | 'TESTIMONIALS' | 'FACTORY' | 'CERTIFICATES' | 'GENERAL';
  preset?: string;
  fileSize?: string;
  originalFileSize?: string;
  dimensions?: string;
  originalDimensions?: string;
  savingsPercent?: number;
  mimeType?: string;
  altText?: string;
  caption?: string;
  focalPoint?: { x: number; y: number };
  hash?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  enabled: boolean;
  isDefault?: boolean;
}

export interface EntityTranslation {
  id: string;
  entityType: 'product' | 'category' | 'blog' | 'slide';
  entityId: string;
  langCode: string;
  title?: string;
  name?: string;
  shortDesc?: string;
  fullDesc?: string;
  content?: string;
  excerpt?: string;
  materials?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  specifications?: ProductSpecification[];
  features?: string[];
  updatedAt?: string;
}

export interface LanguageSettings {
  languages: LanguageConfig[];
  defaultLanguage: string;
  uiTranslations: Record<string, Record<string, string>>;
}

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  blogs: Blog[];
  enquiries: Enquiry[];
  settings?: SiteSettings;
  slides?: HeroSlide[];
  quotations?: Quotation[];
  payments?: Payment[];
  media?: MediaAsset[];
  clients?: Client[];
  languageSettings?: LanguageSettings;
  entityTranslations?: EntityTranslation[];
  users?: AdminUser[];
  sessions?: AdminSession[];
  auditLogs?: AuditLog[];
  faqs?: FaqItem[];
  testimonials?: TestimonialItem[];
  navigation?: NavigationMenuConfig;
}
