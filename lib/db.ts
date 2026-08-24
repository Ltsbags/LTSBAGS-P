import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Category, 
  Product, 
  Blog, 
  Enquiry, 
  SiteSettings, 
  HeroSlide, 
  Quotation, 
  Payment, 
  MediaAsset, 
  Client, 
  LanguageConfig, 
  EntityTranslation, 
  LanguageSettings, 
  CompanyMetrics, 
  Certification, 
  FactoryGalleryItem, 
  FactoryDepartment,
  AdminUser,
  AdminSession,
  AuditLog,
  FaqItem,
  TestimonialItem,
  NavigationMenuConfig
} from './types';
import { INITIAL_LANGUAGES } from './i18n/languages';
import { INITIAL_TRANSLATIONS_MAP } from './i18n/translations';
import { COMPLETE_CATEGORIES_DATA } from './categories-data';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
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

const INITIAL_METRICS: CompanyMetrics = {
  yearsExperience: '15+ Years',
  factoryArea: '25,000+ Sq. Ft.',
  dailyCapacity: '10,000+ Bags/Day',
  monthlyCapacity: '250,000+ Bags/Month',
  workforce: '150+ Skilled Artisans',
  minOrderQuantity: '50 - 100 Units',
  onTimeDeliveryRate: '99.8%',
  countriesServed: '15+ Countries',
  certificationsList: 'ISO 9001:2015, AQL 2.5 QC',
  qualityStandards: '100% In-Line & Final Inspection',
  clientSectionMode: 'INDUSTRIES_SERVED',
  clientSectionTitle: 'Businesses & Industries We Serve',
};

const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    name: 'ISO 9001:2015 Quality Management System',
    issuingOrganization: 'International Organization for Standardization / TUV NORD',
    certificateNumber: 'ISO-9001-2015-LTS-8842',
    issueDate: '2023-01-15',
    expiryDate: '2027-01-14',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    description: 'Certified for design, manufacturing, bulk cutting, heavy stitching, and global export of executive, travel, and promotional bags.',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cert-2',
    name: 'AQL 2.5 Final Quality Acceptance Protocol',
    issuingOrganization: 'Bureau of International Quality Assurance',
    certificateNumber: 'AQL-2.5-STITCH-QC-9921',
    issueDate: '2024-03-01',
    expiryDate: '2028-02-28',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    description: 'Standardized factory defect classification and rigorous load drop, seam tensile, and zipper pull cycle compliance.',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cert-3',
    name: 'MSME Registered Manufacturing Unit (Government of India)',
    issuingOrganization: 'Ministry of Micro, Small & Medium Enterprises, India',
    certificateNumber: 'UDYAM-MH-19-0098234',
    issueDate: '2021-08-10',
    expiryDate: '2031-08-09',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    description: 'Officially recognized industrial OEM manufacturing enterprise for luggage, baggage, and textile merchandise.',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_FACTORY_GALLERY: FactoryGalleryItem[] = [
  {
    id: 'fac-1',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
    caption: 'Modern ISO-certified industrial manufacturing premises in Dharavi, Mumbai, Maharashtra.',
    department: 'Factory Exterior',
    altText: 'LTS Bags Manufacturing Plant Exterior and Main Logistics Gate',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-2',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
    caption: '25,000+ sq. ft. dust-controlled production floor with ergonomic conveyor workflow.',
    department: 'Factory Interior',
    altText: 'LTS Bags Main Production Floor and Assembly Lines',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-3',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000',
    caption: 'Multi-ply automated laser & CNC fabric cutting table for millimeter-precise pattern pieces.',
    department: 'Cutting Department',
    altText: 'Automated CNC Fabric Cutting Machines at LTS Bags Factory',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-4',
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1000',
    caption: 'Heavy-duty direct-drive programmable sewing machines and computer bar-tack stations.',
    department: 'Stitching Department',
    altText: 'High-speed automated sewing line for heavy 1680D nylon and canvas bags',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-5',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
    caption: 'Automatic carousel screen printing and heat-transfer curing ovens for corporate logos.',
    department: 'Printing Department',
    altText: 'Precision multi-color screen printing station for custom bag logos',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-6',
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=1000',
    caption: 'Multi-head computerized 3D embroidery machines rendering high-density thread branding.',
    department: 'Embroidery Department',
    altText: 'Computerized multi-head Tajima-style embroidery machines',
    displayOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-7',
    imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1000',
    caption: 'In-line AQL 2.5 testing bench: Zipper cycling, 25kg handle drop load, and seam tensile test.',
    department: 'Quality Control',
    altText: 'Quality testing laboratory and inspection station at LTS Bags plant',
    displayOrder: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-8',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
    caption: 'Individual poly-bag vacuum packaging, barcode labeling, and moisture-absorbing silica packets.',
    department: 'Packaging',
    altText: 'Bulk product polybagging and carton packaging line',
    displayOrder: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-9',
    imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000',
    caption: 'High-density pallet racking storing raw 1680D nylon rolls, organic canvas, and hardware.',
    department: 'Warehouse',
    altText: 'Raw materials and textile warehouse inventory',
    displayOrder: 9,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-10',
    imageUrl: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&q=80&w=1000',
    caption: 'Palletized finished corporate backpacks and duffel cartons staged for client audit.',
    department: 'Finished Goods',
    altText: 'Finished bags boxed and palletized ready for dispatch',
    displayOrder: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-11',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000',
    caption: 'Dedicated loading bay with daily logistics pickups for Pan-India and global air/sea export.',
    department: 'Dispatch',
    altText: 'Logistics dispatch bay with transport freight trucks',
    displayOrder: 11,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac-12',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000',
    caption: 'Computerized programmable pattern stitchers and ultrasonic edge sealers.',
    department: 'Machinery',
    altText: 'Industrial automated bag manufacturing machinery setup',
    displayOrder: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  logoUrl: '',
  logoText: 'LTS BAGS',
  logoSubtitle: '',
  updatedAt: new Date().toISOString(),
  metrics: INITIAL_METRICS,
  certifications: INITIAL_CERTIFICATIONS,
  factoryGallery: INITIAL_FACTORY_GALLERY,
  seoDefaults: {
    siteUrl: 'https://ltsbags.com',
    googleSiteVerification: '',
    googleAnalyticsId: '',
  },
  contactInfo: {
    companyName: 'LTS BAGS PRIVATE LIMITED',
    tagline: 'Premier OEM/ODM Custom Bag Manufacturer & Global Exporter',
    logoUrl: '',
    phone1: '+91 98335 98338',
    phone2: '+91 96199 61971',
    email1: 'info@ltsbags.com',
    email2: 'sales@ltsbags.com',
    factoryAddress: 'FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI, MUMBAI 400017, MAHARASHTRA, INDIA',
    googleMapsUrl: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    gstNumber: '27AAGCL1568H1ZC',
    isoCertificate: 'ISO 9001:2015 Certified Manufacturing Facility',
    socialLinkedin: 'https://linkedin.com/company/ltsbags',
    socialFacebook: 'https://facebook.com/ltsbags',
    socialInstagram: 'https://instagram.com/ltsbags',
    socialYoutube: 'https://youtube.com/@ltsbags',
    socialWhatsapp: '+919833598338',
  },
  homepage: {
    stats: [
      { id: 'stat-1', label: 'Manufacturing Experience', value: '15+ Years', sublabel: 'Serving Global Brands' },
      { id: 'stat-2', label: 'Daily Production Capacity', value: '10,000+', sublabel: 'Units Per Day' },
      { id: 'stat-3', label: 'Corporate Clients', value: '500+', sublabel: 'MNCs & Institutions' },
      { id: 'stat-4', label: 'On-Time Batch Delivery', value: '99.8%', sublabel: 'Guaranteed Timelines' },
    ],
    categoriesTitle: 'Explore Product Categories',
    categoriesSubtitle: 'Direct factory supply across corporate, educational, travel, and promotional bag collections.',
    featuredTitle: 'Featured Wholesale Products',
    featuredSubtitle: 'Hand-picked bestsellers for corporate gifting, employee onboarding kits, and institutional orders.',
    whyChooseTitle: 'Why Choose LTS BAGS Factory',
    whyChooseSubtitle: 'State-of-the-art machinery, rigorous quality assurance, and end-to-end custom branding solutions.',
    whyChooseFeatures: [
      { id: 'feat-1', title: 'ISO 9001:2015 QC Standards', description: 'Every batch undergoes 5-step stress, zipper pull, bar-tack, and load drop testing.', iconName: 'ShieldCheck' },
      { id: 'feat-2', title: 'Direct Factory Pricing', description: 'Eliminate middlemen commissions with transparent bulk tiered pricing directly from our manufacturing floor.', iconName: 'Factory' },
      { id: 'feat-3', title: 'Flexible Low MOQ', description: 'Custom sample prototyping and production runs starting from just 50 units for corporate events.', iconName: 'Layers' },
      { id: 'feat-4', title: 'Custom Branding & 3D Logo', description: 'Screen printing, precision 3D embroidery, laser-etched metal plates, and rubber patches.', iconName: 'Award' },
      { id: 'feat-5', title: 'Pan-India & Export Logistics', description: 'Seamless express delivery with door-to-door freight shipping for domestic and international orders.', iconName: 'Truck' },
      { id: 'feat-6', title: 'Rapid Prototype Turnaround', description: 'Get physical sample bags delivered in 3 to 5 business days after design approval.', iconName: 'Clock' },
    ],
    processTitle: 'Our 4-Step Bulk Production Workflow',
    processSubtitle: 'From concept design and material selection to high-speed stitching and final quality dispatch.',
    processSteps: [
      { id: 'step-1', stepNumber: '01', title: 'Requirement & Spec Briefing', description: 'Share target bag dimensions, fabric preference (1680D nylon, 600D poly, organic canvas), and logo artwork.' },
      { id: 'step-2', stepNumber: '02', title: 'Physical Sample Creation', description: 'Our pattern masters craft a physical sample for hands-on inspection and approval within 3-5 days.' },
      { id: 'step-3', stepNumber: '03', title: 'Bulk CNC Cutting & Stitching', description: 'Automated laser pattern cutting and heavy-duty bar-tack sewing on automated assembly lines.' },
      { id: 'step-4', stepNumber: '04', title: 'QC Inspection & Express Dispatch', description: '100% finished inspection, poly-bag packaging, and door-step freight shipment with live tracking.' },
    ],
    testimonialsTitle: 'What Corporate Clients Say',
    testimonialsSubtitle: 'Trusted by leading MNCs, tech enterprises, and educational institutions nationwide.',
    testimonials: [
      { id: 'test-1', name: 'Rajesh Sharma', role: 'Head of Talent Engagement', company: 'Infosys Limited', content: 'LTS BAGS manufactured 1,200 custom executive tech backpacks for our new joinee onboarding kits. The 1680D fabric quality, 3D logo embroidery, and padded laptop protection exceeded our expectations. On-time delivery!', rating: 5 },
      { id: 'test-2', name: 'Ananya Deshmukh', role: 'Corporate Procurement Manager', company: 'TCS Innovation Labs', content: 'Outstanding build quality and zipper durability! We ordered 500 weekender duffel bags for our annual leadership retreat. Highly professional communication and genuine factory pricing.', rating: 5 },
      { id: 'test-3', name: 'Vikram Mehta', role: 'Marketing Director', company: 'Reliance Retail Merchandising', content: 'We sourced 10,000 eco canvas totes for a national promotional campaign. The screen printing crispness and stitch strength were perfect. LTS BAGS is our go-to bulk manufacturer.', rating: 5 },
    ],
    clientLogos: [
      { id: 'client-1', companyName: 'Infosys', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300' },
      { id: 'client-2', companyName: 'TCS', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300' },
      { id: 'client-3', companyName: 'Wipro', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300' },
      { id: 'client-4', companyName: 'Reliance', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300' },
    ],
    ctaTitle: 'Ready to Order Custom Corporate Bags in Bulk?',
    ctaDescription: 'Request a customized factory quotation with your logo specs, sample request, and bulk volume discount within 24 hours.',
    ctaButtonText: 'Request Wholesale Quote',
    ctaButtonUrl: '/contact',
    blogTitle: 'Bag Manufacturing Insights & B2B Guides',
    blogSubtitle: 'Expert articles on material selection, QC protocols, and corporate gifting trends.',
  },
  about: {
    headline: 'About LTS BAGS PRIVATE LIMITED',
    subtitle: "India's Premier OEM/ODM Custom Bag Manufacturing Factory & Wholesale Exporter",
    storyTitle: 'Our Manufacturing Legacy & Heritage',
    storyContent: 'Founded over 15 years ago, LTS BAGS PRIVATE LIMITED has grown from a specialized stitching workshop into a state-of-the-art ISO 9001:2015 certified bag manufacturing powerhouse. Equipped with automated CNC fabric cutters, 3D computer embroidery machines, heavy-duty bar-tack sewing setups, and an in-house quality testing lab, we serve over 500 corporate clients, MNCs, government bodies, and retail distributors across India and abroad.',
    missionTitle: 'Our Mission',
    missionContent: 'To engineer superior quality, ergonomically designed, and aesthetically crafted custom bags that empower corporate brands to showcase their identity with pride, backed by guaranteed timelines and factory-direct pricing.',
    visionTitle: 'Our Vision',
    visionContent: 'To be the most trusted global B2B bag manufacturing partner known for relentless material innovation, sustainable production practices, and customer-first service excellence.',
    factoryCapacityTitle: 'Factory Scale & Daily Capacity',
    factoryCapacityDetails: 'Spanning over 25,000 sq. ft. of modern production space with 150+ skilled craftsmen and automated machinery, our unit produces over 10,000 bags daily across backpacks, briefcases, duffels, and tote lines.',
    qualityPolicyTitle: 'Zero-Defect Quality Policy',
    qualityPolicyDetails: 'Every raw fabric roll is tested for tensile strength and water repellency before entering cutting lines. Every finished bag undergoes 100% inspection for seam density, zipper action, strap strength, and alignment.',
  },
  footer: {
    aboutBrief: 'LTS BAGS PRIVATE LIMITED is a premier custom bag manufacturer and global bulk exporter. We specialize in corporate backpacks, executive laptop briefcases, travel duffels, and eco canvas totes with custom logo branding.',
    copyrightText: 'LTS BAGS PRIVATE LIMITED ®. All Rights Reserved.',
    quickLinksTitle: 'Quick Navigation',
    categoriesTitle: 'Bag Categories',
    contactTitle: 'Manufacturing Unit',
  },
};

const INITIAL_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Premium Custom Bag Manufacturing For Corporate Brands',
    description: 'Direct factory supply of executive laptop bags, corporate tech backpacks, heavy travel duffels, and eco canvas totes.',
    imageUrl: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Request Bulk Quote',
    buttonUrl: '/contact',
    badgeText: 'ISO 9001:2015 CERTIFIED PLANT',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-2',
    title: 'Executive Tech Backpacks & Briefcases with Custom Logos',
    description: 'Engineered with high-density ballistic nylon, anti-theft compartments, custom 3D embroidery, and fast turnaround times.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Explore Product Catalog',
    buttonUrl: '/products',
    badgeText: 'DIRECT FACTORY WHOLESALE',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-3',
    title: 'Heavy Duty Travel Duffels & Custom Eco Canvas Totes',
    description: 'Crafted for corporate gifting, sports events, and employee onboarding kits. Guaranteed quality and low minimum order quantities.',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'View Categories',
    buttonUrl: '/categories',
    badgeText: 'BULK B2B ORDERS',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-4',
    title: 'Custom School & College Backpacks Direct Factory Supply',
    description: 'Durable water-resistant polyesters, reinforced padded shoulder straps, custom school crest embroidery, and bulk pricing.',
    imageUrl: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Order School Bags',
    buttonUrl: '/products?category=school-bags',
    badgeText: 'INSTITUTIONAL SUPPLIER',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-5',
    title: 'Corporate Conference & Event Seminar Folder Bags',
    description: 'Professional document pouches, conference messenger bags, and custom promotional totes for global summits and tradeshows.',
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Event Bags Wholesale',
    buttonUrl: '/contact',
    badgeText: 'EVENT & TRADE SHOW SPECIALIST',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-6',
    title: 'Eco-Friendly Jute & Cotton Canvas Promotional Totes',
    description: 'Sustainable 100% natural organic cotton and golden jute shopping bags with high-resolution screen printing.',
    imageUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Eco Tote Collection',
    buttonUrl: '/products?category=eco-totes',
    badgeText: '100% SUSTAINABLE MATERIALS',
    displayOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-7',
    title: 'Premium Leatherette & Vegan Leather Executive Briefcases',
    description: 'Sophisticated handcrafted leatherette laptop bags designed for executive leadership gifting and VIP corporate kits.',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Executive Leatherette',
    buttonUrl: '/products?category=leatherette',
    badgeText: 'VIP EXECUTIVE GIFTING',
    displayOrder: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-8',
    title: 'Heavy Duty Gym, Sports & Fitness Duffel Bags',
    description: 'Separate shoe compartment, wet pouch isolation, high-tensile zips, and custom athletic club logo branding.',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Sports Bags Line',
    buttonUrl: '/products?category=sports-duffels',
    badgeText: 'ATHLETIC & GYM MERCH',
    displayOrder: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-9',
    title: 'Promotional Lightweight Drawstring Backpacks & Pouches',
    description: 'Ultra-lightweight 210D polyester drawstring bags for marathon runs, marketing campaigns, and brand giveaways.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Promotional Drawstrings',
    buttonUrl: '/products?category=drawstring-bags',
    badgeText: 'PROMOTIONAL MERCHANDISE',
    displayOrder: 9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-10',
    title: 'Complete Corporate Onboarding Welcome Kit Bag Sets',
    description: 'Customized combo packs featuring backpack, organizer pouch, stainless bottle holder, and branded laptop sleeve.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1600',
    buttonText: 'Custom Kit Solutions',
    buttonUrl: '/contact',
    badgeText: 'ONBOARDING COMBO KITS',
    displayOrder: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_CATEGORIES: Category[] = COMPLETE_CATEGORIES_DATA;


const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack',
    slug: 'apex-pro-tech-laptop-backpack',
    categoryId: 'cat-2',
    categoryName: 'Corporate Backpacks',
    images: [
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Premium 1680D water-resistant ballistic nylon executive backpack with high-density EVA laptop padding, hidden anti-theft pocket, and USB charge port.',
    fullDesc: 'Engineered specifically for corporate onboarding kits and executive travel, the Apex Pro Tech Laptop Backpack blends sophisticated aesthetics with extreme durability. Crafted from high-grade 1680D Ballistic Nylon with water-repellent coating, it features a dedicated TSA-friendly 15.6" laptop cradle with 3D shock-absorbing foam lining. Complete with ergonomic mesh shoulder straps, luggage pass-through strap, and customizable metal logo branding badge.',
    features: [
      'High-Density EVA Foam Padding for 15.6" Laptops & 11" Tablets',
      'Water-Resistant 1680D Ballistic Matt Polyester Fabric',
      'External USB Smart Charging Port with Pass-Through Cable',
      'Anti-Theft Hidden Zippered Pocket on Back Panel',
      'Heavy Duty YKK Metal Zippers with Molded Rubber Pullers',
      'Custom Logo Options: Rubber Badge, Metal Plate, Embroidery, Screen Printing'
    ],
    materials: '1680D Ballistic Polyester, EVA Foam Core, Breathable Honeycomb Mesh',
    moq: 100,
    specifications: [
      { label: 'Capacity', value: '28 Liters' },
      { label: 'Laptop Compatibility', value: 'Up to 15.6 Inch' },
      { label: 'Dimensions', value: '46cm x 32cm x 18cm' },
      { label: 'Weight', value: '890 grams' },
      { label: 'Custom Branding', value: 'Embroidery, Rubber Logo, Metal Badge, Screen Print' },
      { label: 'Warranty', value: '1 Year Factory Manufacturing Warranty' },
    ],
    isFeatured: true,
    status: 'ACTIVE',
    metaTitle: 'Apex Pro Tech Laptop Backpack | Custom Corporate B2B Manufacturer',
    metaDescription: 'Bulk executive 15.6" laptop backpack manufacturer. Water-resistant 1680D nylon, USB port, TSA padding. Ideal for corporate onboarding kits.',
    metaKeywords: 'custom laptop backpack, corporate onboarding bag, B2B backpack manufacturer, bulk branded laptop bag',
    imageAltText: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack in Charcoal Gray',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Apex Voyager Leatherette Weekender Duffel Bag',
    slug: 'apex-voyager-leatherette-duffel-bag',
    categoryId: 'cat-3',
    categoryName: 'Duffel & Travel Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Luxury vegan leatherette weekender duffel with dedicated shoe compartment, waterproof interior lining, and debossed company logo capability.',
    fullDesc: 'The Apex Voyager Leatherette Duffel Bag is designed for corporate rewards, executive gifts, and luxury travel promotions. Built using scratch-resistant PU leatherette and reinforced brass alloy hardware, this 42-liter travel holdall includes an isolated ventilated shoe compartment, padded shoulder strap, and internal zipper organizer.',
    features: [
      'Premium Scratch-Resistant Vegan PU Leatherette Outer Shell',
      'Separate Side-Access Ventilated Shoe & Laundry Pocket',
      'Reinforced Rolled Handles & Detachable Padded Shoulder Strap',
      'Waterproof Interior Nylon Lining with Zip Compartments',
      'Solid Brass Finish Metal Buckles & Bottom Protection Feet',
      'Debossed or Foil-Stamped Corporate Logo Placement'
    ],
    materials: 'Premium Vegan Leatherette (PU), Heavy Duty Brass Hardware, Satin Poly Lining',
    moq: 50,
    specifications: [
      { label: 'Capacity', value: '42 Liters' },
      { label: 'Dimensions', value: '52cm x 28cm x 26cm' },
      { label: 'Weight', value: '1.2 kg' },
      { label: 'Shoe Pocket', value: 'Fits up to US Size 12 Shoes' },
      { label: 'Branding Type', value: 'Debossing, Foil Stamping, Metal Plate, Laser Engraving' },
    ],
    isFeatured: true,
    status: 'ACTIVE',
    metaTitle: 'Apex Voyager Leatherette Travel Duffel Bag | Wholesale B2B Supply',
    metaDescription: 'Luxury leatherette weekender duffel bag manufacturer for corporate gifting and rewards. Custom debossed logo and shoe compartment.',
    metaKeywords: 'custom leatherette duffel, corporate travel bag manufacturer, wholesale holdall bag, B2B luxury travel bag',
    imageAltText: 'Apex Voyager Luxury Vegan Leatherette Weekender Travel Duffel Bag',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'EcoGuard Organic Cotton Canvas Tote Bag',
    slug: 'ecoguard-organic-cotton-canvas-tote',
    categoryId: 'cat-4',
    categoryName: 'Eco Canvas & Tote Bags',
    images: [
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Heavyweight 320 GSM GOTS certified organic cotton canvas tote bag with gusseted bottom and full-color eco-friendly screen printing.',
    fullDesc: 'A staple for eco-conscious brands, trade show exhibitions, and retail merchandise. Made from 100% natural unbleached organic cotton canvas, the EcoGuard Tote features cross-stitched reinforced handles and a wide 12cm bottom gusset for maximum capacity.',
    features: [
      '100% GOTS Certified Organic Natural Cotton Canvas (320 GSM)',
      'Cross-Stitched X-Reinforced Shoulder Straps for up to 15kg Load',
      'Eco-Friendly Water-Based Screen Printing & Heat Transfer Printing',
      'Internal Key Loop & Small Zip Accessory Pocket Options',
      'Washable, Reusable, & 100% Biodegradable'
    ],
    materials: '320 GSM Organic Unbleached Cotton Canvas',
    moq: 200,
    specifications: [
      { label: 'Dimensions', value: '40cm x 38cm x 12cm Gusset' },
      { label: 'Handle Drop', value: '28cm (Shoulder Length)' },
      { label: 'Fabric Weight', value: '12 oz / 320 GSM Canvas' },
      { label: 'Print Options', value: 'AZO-Free Water-Based Screen Print, DTF, Embroidery' },
    ],
    isFeatured: true,
    status: 'ACTIVE',
    metaTitle: 'EcoGuard Organic Cotton Canvas Tote Bag Manufacturer | Wholesale',
    metaDescription: 'Bulk custom organic canvas tote bag manufacturer. 320 GSM heavy cotton, GOTS certified, custom screen printing for events.',
    metaKeywords: 'canvas tote bag manufacturer, custom branded cotton tote, eco tote wholesale, trade show tote supplier',
    imageAltText: 'EcoGuard Organic Cotton Canvas Tote Bag with Custom Printed Logo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Apex Executive Convertible Messenger Briefcase',
    slug: 'apex-executive-convertible-messenger-briefcase',
    categoryId: 'cat-1',
    categoryName: 'Executive Laptop Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: '3-in-1 convertible laptop briefcase, shoulder messenger, and hidden backpack with expandability zip and weather protection cover.',
    fullDesc: 'Designed for versatility in executive mobility, the Apex Convertible Briefcase easily switches between a formal briefcase, messenger bag, and backpack. Features hidden back straps, expandable 5cm gusset, and waterproof zip closures.',
    features: [
      '3-in-1 Versatile Wear: Hand Briefcase, Shoulder Messenger, & Backpack',
      'Expandable Zipper Mechanism Adds 30% Extra Storage Volume',
      'High Density Micro-Fleece Laptop Sleeve Padding',
      'Trolley Strap Attachment for Airline Carry-On Luggage',
      'Organized Front Pocket for Pens, Cables, Powerbank, & Passport'
    ],
    materials: '900D Matte Nylon Fabric with Water-Repellent PU Coating',
    moq: 100,
    specifications: [
      { label: 'Laptop Compartment', value: 'Up to 16 Inch MacBook & Windows Laptops' },
      { label: 'Dimensions', value: '43cm x 31cm x 14cm (Expanded 19cm)' },
      { label: 'Weight', value: '980 grams' },
      { label: 'Hardware', value: 'Rust-Proof Matte Black Zinc Alloy' },
    ],
    isFeatured: false,
    status: 'ACTIVE',
    metaTitle: 'Apex Convertible Messenger Laptop Briefcase | Wholesale B2B',
    metaDescription: 'Manufacturer of 3-in-1 convertible executive laptop briefcases for business professionals and corporate clients.',
    metaKeywords: 'convertible briefcase manufacturer, custom messenger laptop bag, 3in1 business bag wholesale',
    imageAltText: 'Apex Executive Convertible Messenger Briefcase in Midnight Black',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Apex Endurance Sports Gym Duffel with Shoe Tunnel',
    slug: 'apex-endurance-sports-gym-duffel',
    categoryId: 'cat-3',
    categoryName: 'Duffel & Travel Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'High-tensile polyester fitness gym duffel with water-resistant wet pouch, shoe tunnel, and high-visibility reflective piping.',
    fullDesc: 'Built for sports academies, fitness clubs, and corporate wellness initiatives, this duffel combines tough 600D ripstop fabric with a specialized waterproof interior compartment for wet towels and clothes.',
    features: [
      '600D Heavy Duty Ripstop Polyester Fabric',
      'Side Shoe Pocket with Air Mesh Breathability Vents',
      'Internal Waterproof TPU Pocket for Wet Gym Apparel',
      '360-Degree Reflective Safety Strips for Night Visibility',
      'Adjustable Padded Shoulder Strap with Non-Slip Grip Pad'
    ],
    materials: '600D Honeycomb Ripstop Polyester, Waterproof TPU Lining',
    moq: 150,
    specifications: [
      { label: 'Capacity', value: '35 Liters' },
      { label: 'Dimensions', value: '48cm x 26cm x 25cm' },
      { label: 'Weight', value: '650 grams' },
      { label: 'Special Features', value: 'Wet/Dry Compartment, Shoe Tunnel' },
    ],
    isFeatured: false,
    status: 'ACTIVE',
    metaTitle: 'Apex Endurance Gym Duffel Bag Manufacturer | Sports Wholesale',
    metaDescription: 'Custom sports gym duffel bags manufactured with shoe tunnel and wet pouch. Ideal for fitness clubs and corporate sports events.',
    metaKeywords: 'gym duffel manufacturer, custom sports bag, wholesale duffel bag with shoe pocket',
    imageAltText: 'Apex Endurance Sports Gym Duffel Bag with Shoe Compartment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Apex SpeedLite Event Drawstring Sackpack',
    slug: 'apex-speedlite-event-drawstring-sackpack',
    categoryId: 'cat-5',
    categoryName: 'Promotional Drawstring Bags',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=1000',
    ],
    shortDesc: 'Durable 210D polyester cinch bag with front zippered mesh pocket, headphone port, and thick double drawstring cords.',
    fullDesc: 'The ultimate promotional bag for marathons, sports tournaments, trade shows, and brand giveaways. Features reinforced PU leather metal eyelets and a spacious front zipper pocket for phone and keys.',
    features: [
      'Tough 210D Water-Resistant Polyester Construction',
      'Front Zippered Mesh Pocket for Easy Access Essentials',
      'Extra Thick 8mm Comfort Drawstring Cords',
      'Reinforced Metal Grommets with PU Leather Triangles',
      'Vibrant Silk Screen Printing & Sublimation Capabilities'
    ],
    materials: '210D PU Coated Polyester, Nylon Cords',
    moq: 500,
    specifications: [
      { label: 'Dimensions', value: '43cm x 34cm' },
      { label: 'Cord Thickness', value: '8mm Woven Poly Cords' },
      { label: 'Print Area', value: '25cm x 20cm Large Front Surface' },
    ],
    isFeatured: false,
    status: 'ACTIVE',
    metaTitle: 'Apex SpeedLite Drawstring Bag Bulk Manufacturer | Event Cinch Pack',
    metaDescription: 'Bulk custom drawstring bags for events and marathons. Water-resistant 210D polyester, zip pocket, low cost per unit.',
    metaKeywords: 'custom cinch bag, promotional drawstring bag manufacturer, bulk event bags',
    imageAltText: 'Apex SpeedLite Event Drawstring Bag with Front Zippered Pocket',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'How to Choose the Right Bag Manufacturer in Mumbai',
    slug: 'how-to-choose-bag-manufacturer-mumbai',
    excerpt: 'Key criteria for selecting a reliable B2B bag factory in Mumbai: verifying factory facilities, auditing machinery, assessing sample lead times, and reviewing QC protocols.',
    content: `
# How to Choose the Right Bag Manufacturer in Mumbai

Mumbai, particularly the industrial clusters of Dharavi, Kurla, and Bhiwandi, is the epicentre of India's custom bag manufacturing and export ecosystem. However, navigating through hundreds of suppliers, middlemen, and trading companies requires a structured evaluation framework.

## 1. Differentiate Between Real Manufacturers and Middlemen
A genuine manufacturer operates an in-house production setup with dedicated fabric-cutting tables, programmable stitching machines, and finishing stations. Middlemen and trading agencies often lack direct control over production schedules, leading to delayed orders and inconsistent quality.
- **Action Step:** Request a physical factory visit or live video tour of the cutting and stitching floor before releasing payment.

## 2. In-House Customization and Branding Capabilities
Corporate gifting and private-label brands require specialized branding methods:
- **3D Computerized Embroidery:** For tech backpacks and school crests.
- **Silk Screen & Heat-Transfer Printing:** For promotional tote and drawstring bags.
- **Debossed Leather Patches & Metal Badges:** For executive briefcases and luxury duffels.
Ensure the factory manages branding in-house or with dedicated local finishing partners to prevent multi-week delays.

## 3. Sample Prototyping Speed and Physical Sign-Off
Never approve mass production without inspecting a physical golden sample. Professional Mumbai factories deliver custom samples within 3 to 5 business days, allowing you to test zipper fluidity, seam density, and internal compartment ergonomics.

## 4. Minimum Order Quantities (MOQ) and Scalability
Evaluate whether the supplier accommodates tiered production runs. Look for factories offering low initial MOQs (50–100 units) for corporate events, with the infrastructure to scale to 10,000+ units for national campaigns.

## 5. Transparent Production Lead Times & Logistics
A dedicated factory will clearly outline the production timeline:
1. Sample Approval: Days 1–4
2. Material Sourcing & CNC Pattern Cutting: Days 5–8
3. Assembly Stitching & Bar-Tack Enforcement: Days 9–12
4. QC Audit, Packaging & Dispatch: Days 13–15
    `,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS Engineering Team',
    category: 'Procurement Guide',
    publishedAt: '2026-08-01T10:00:00.000Z',
    metaTitle: 'How to Choose the Right Bag Manufacturer in Mumbai | B2B Guide',
    metaDescription: 'Complete checklist for selecting a trusted bag manufacturer in Mumbai: factory audits, sample timelines, branding methods, and QC testing.',
    metaKeywords: 'bag manufacturer in Mumbai, how to choose bag factory, custom bag manufacturer India, LTS BAGS PRIVATE LIMITED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-2',
    title: '1680D vs 600D vs 1000D Nylon: Which Material is Best for Corporate Bags?',
    slug: '1680d-vs-600d-vs-1000d-nylon-corporate-bags-material-guide',
    excerpt: 'Detailed technical comparison of Denier ratings, tensile strength, abrasion resistance, and water repellency for custom corporate backpacks and briefcases.',
    content: `
# 1680D vs 600D vs 1000D Nylon: Which Material is Best for Corporate Bags?

The "D" in fabric specifications stands for **Denier**, a textile unit representing the linear mass density of fibers (defined as mass in grams per 9,000 meters of thread). A higher denier number indicates a thicker, heavier, and more abrasion-resistant yarn.

---

### 1. 1680D Ballistic Nylon (The Executive Standard)
Originally engineered for flak jackets, 1680D nylon features a tight basket-weave construction.
- **Tensile & Tear Resistance:** Highest in the industry; virtually rip-proof.
- **Water Repellency:** Laminated with PU/TPU back coatings to shed water droplets.
- **Aesthetic:** Clean, matte executive texture.
- **Best Suited For:** Executive laptop backpacks, corporate onboarding bags, and executive messenger briefcases.

---

### 2. 600D Polyester (The Versatile Workhorse)
600D is the global industry standard for mass-market bags, school bags, and promotional giveaways.
- **Weight:** Moderately lightweight, offering high user comfort.
- **Printability:** Outstanding surface for vibrant multi-color screen printing.
- **Cost Factor:** 30–40% more cost-effective than high-denier ballistic nylon.
- **Best Suited For:** School backpacks, gym duffels, trade show merchandise, and sports bags.

---

### 3. 1000D Cordura-Style Fabric (The Rugged Outdoor Choice)
1000D texturized nylon provides extreme abrasive resistance against concrete, asphalt, and rough surfaces.
- **Texture:** Slightly rough, textured hand-feel.
- **Durability:** Unmatched resistance to scraping and outdoor wear.
- **Best Suited For:** Heavy travel holdalls, equipment cases, and tactical duffels.

---

### Summary Recommendation
- For **Executive IT Backpacks & Client Gifts**: Choose **1680D Ballistic Nylon**.
- For **Educational & Institutional School Bags**: Choose **600D to 900D Coated Polyester**.
- For **Heavy-Duty Travel Holdalls**: Choose **1000D Cordura-Style or 1680D Nylon**.
    `,
    image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS Materials Lab',
    category: 'Material Sourcing',
    publishedAt: '2026-07-28T09:00:00.000Z',
    metaTitle: '1680D vs 600D vs 1000D Nylon Comparison | Bag Fabric Guide',
    metaDescription: 'Technical comparison of 1680D ballistic nylon, 600D polyester, and 1000D Cordura for custom B2B bag manufacturing in India.',
    metaKeywords: '1680D nylon, 600D polyester, 1000D cordura, bag material guide, corporate backpack fabrics',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-3',
    title: 'Step-by-Step Guide to Custom Bag Manufacturing in India',
    slug: 'step-by-step-guide-custom-bag-manufacturing-india',
    excerpt: 'From initial tech-pack drafting and fabric selection to sample approvals, bulk stitching, QC audits, and pan-India logistics.',
    content: `
# Step-by-Step Guide to Custom Bag Manufacturing in India

Custom bag manufacturing requires precise technical planning between the client and the factory. Here is how our OEM/ODM process operates from initial concept to delivery.

## Step 1: Technical Brief & Spec Drafting
The client provides:
- Bag type (backpack, duffel, tote, messenger)
- Target dimensions (Height x Width x Depth in cm)
- Fabric preferences (1680D nylon, organic canvas, vegan leatherette)
- Branding artwork (high-res AI/PDF vector format)
- Target quantity and delivery timeline

## Step 2: Pattern Engineering & Sample Prototyping
Our master pattern engineers create paper patterns and CNC laser templates. A complete physical prototype is assembled with all zippers, linings, and logo branding within 3 to 5 business days for hands-on inspection.

## Step 3: Fabric Sourcing & Precision Cutting
Upon sample approval, raw fabric bolts are inspected for color shade uniformity and coated for water resistance. Automated multi-ply cutting tables cut thousands of exact pattern components.

## Step 4: Line Stitching & Bar-Tack Reinforcement
Assembly occurs across specialized sewing cells:
- Computerized programmable pattern stitchers for logo patches
- Heavy-duty walking-foot sewing machines for heavy canvas and ballistic nylon
- Bar-tack reinforcement on all load-bearing stress points (handles, shoulder straps)

## Step 5: In-Line QC, Finishing & Dispatch
Every bag is inspected for loose threads, zipper function, and dimensional accuracy. Units are polybagged with desiccant silica gel packets and packed into 5-ply corrugated export cartons for freight delivery.
    `,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS Production Management',
    category: 'Manufacturing Process',
    publishedAt: '2026-07-24T11:00:00.000Z',
    metaTitle: 'Step-by-Step Guide to Custom Bag Manufacturing in India',
    metaDescription: 'A complete walkthrough of custom bag manufacturing in India: design specs, sampling, bulk cutting, stitching lines, and quality control.',
    metaKeywords: 'custom bag manufacturing process, bag factory workflow India, OEM bag production guide',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-4',
    title: 'Why Mumbai is the Hub for Bag Manufacturing in India',
    slug: 'why-mumbai-is-hub-bag-manufacturing-india',
    excerpt: 'An overview of Mumbai’s deep textile supply chains, skilled artisan ecosystem, direct port connectivity, and fast turnaround advantages.',
    content: `
# Why Mumbai is the Hub for Bag Manufacturing in India

Mumbai has earned its reputation as the commercial and manufacturing capital of India for luggage, leather goods, corporate backpacks, and textile bags.

## 1. Deep Ecosystem of Raw Material Sourcing
Mumbai hosts major textile markets (such as Mangaldas Market, Mulji Jetha Market, and Crawford Market) alongside dedicated hardware suppliers for heavy zippers (YKK), metal pullers, EVA foams, and technical webbing. This eliminates weeks of raw material transit time.

## 2. Generations of Skilled Craftsmanship
Areas like Dharavi and Kurla represent specialized industrial clusters with generations of skilled pattern masters, cutters, and precision stitchers who excel at working with heavy synthetic fabrics, leatherette, and natural jute.

## 3. World-Class Multimodal Logistics
With Nhava Sheva (JNPT) port for sea freight and Chhatrapati Shivaji Maharaj International Airport for air cargo, Mumbai-based factories offer unmatched export connectivity to North America, Europe, the Middle East, and Southeast Asia.

## 4. Rapid Turnaround for Corporate Hubs
Located at the heart of India's corporate enterprises (BKC, Lower Parel, Nariman Point, and Pune IT corridors), Mumbai manufacturers can deliver urgent corporate event orders within days.
    `,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS Industry Insights',
    category: 'Industry Insights',
    publishedAt: '2026-07-20T08:30:00.000Z',
    metaTitle: 'Why Mumbai is the Hub for Bag Manufacturing in India | B2B Insights',
    metaDescription: 'Discover why Mumbai leads India in bag manufacturing: raw material ecosystems, artisan craftsmanship, port logistics, and fast corporate turnaround.',
    metaKeywords: 'bag manufacturing hub Mumbai, Dharavi bag factory, Mumbai bag manufacturer, India luggage exporter',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-5',
    title: 'MOQ, Lead Times, and Pricing: What to Expect from a Bag Factory',
    slug: 'moq-lead-times-pricing-bag-factory-guide',
    excerpt: 'Understand how minimum order quantities, production lead times, and tiered volume pricing work when sourcing custom bags directly from a factory.',
    content: `
# MOQ, Lead Times, and Pricing: What to Expect from a Bag Factory

When purchasing bags in bulk for corporate gifting, institutional uniforms, or retail distribution, understanding factory operational economics helps you secure the best pricing and delivery terms.

---

### 1. Understanding Minimum Order Quantities (MOQ)
Factory MOQs are determined by the minimum dye-lot of fabrics, hardware procurement, and machine setup time.
- **Standard Stock Fabrics (e.g., 600D, 1680D in Black/Navy):** MOQ is typically 50 to 100 units.
- **Custom Pantoned Dyed Fabrics:** MOQ starts at 500 to 1,000 units.
- **Fully Custom Molded Hardware:** MOQ is usually 1,000+ units.

---

### 2. Standard Production Lead Times
- **Physical Sampling:** 3 to 5 business days.
- **Small to Mid Batches (100–500 units):** 10 to 14 business days.
- **Large Production Runs (1,000–10,000 units):** 18 to 25 business days.
- **Fast-Track Expedited Service:** 5 to 7 days for urgent corporate conferences.

---

### 3. How Direct Factory Tiered Pricing Works
Direct factory pricing eliminates middleman commissions. Price per unit decreases substantially as batch volume increases:
- **100 units:** Base wholesale tier.
- **500 units:** ~12–15% cost savings per unit due to bulk cutting efficiency.
- **1,000+ units:** ~20–25% cost savings from bulk fabric procurement.
    `,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS Commercial Desk',
    category: 'Procurement Guide',
    publishedAt: '2026-07-16T12:00:00.000Z',
    metaTitle: 'MOQ, Lead Times & Pricing from a Bag Factory | Buyer Guide',
    metaDescription: 'Learn what to expect regarding MOQs, manufacturing lead times, and tiered pricing when ordering custom bags from a factory in India.',
    metaKeywords: 'bag factory MOQ, custom bag lead times, wholesale bag pricing India, bulk bag manufacturing costs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-6',
    title: 'Top Customization Options for Corporate Gifting Bags',
    slug: 'top-customization-options-corporate-gifting-bags',
    excerpt: 'Explore branding methods for custom corporate bags: 3D embroidery, rubber patches, metal badge engraving, debossing, and custom zipper pullers.',
    content: `
# Top Customization Options for Corporate Gifting Bags

The branding method you choose directly defines the perceived value of your corporate gifting bags and employee onboarding merchandise.

---

### 1. High-Density 3D Logo Embroidery
- **Best For:** Corporate tech backpacks, sports duffels, and school crests.
- **Look & Feel:** Raised, textured, multi-color thread work that never fades or peels over years of heavy daily use.

---

### 2. Molded Rubber & PVC Badges
- **Best For:** Commuter backpacks, sports holdalls, and trendy youth brands.
- **Look & Feel:** Contemporary, weather-proof, and flexible. Allows sharp micro-details and 3D relief effects.

---

### 3. Laser-Etched Metal Badges
- **Best For:** Executive laptop bags, premium briefcases, and VIP leadership gifts.
- **Look & Feel:** High-end brushed metal plate (matte black, silver, gunmetal, or gold) laser-engraved with your company insignia.

---

### 4. Blind Debossing & Foil Stamping
- **Best For:** Vegan PU leatherette duffels, executive organizers, and portfolios.
- **Look & Feel:** Subtle, elegant, heat-pressed indentation giving a discreet luxury aesthetic.

---

### 5. Custom Metal Zipper Pullers & Lining Fabrics
- **Custom Pullers:** Zinc-alloy zipper pullers molded with your corporate logo.
- **Custom Interior Lining:** All-over subtle monochrome printed company monogram lining for bespoke brand identity.
    `,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS Design Studio',
    category: 'Branding & Design',
    publishedAt: '2026-07-12T14:00:00.000Z',
    metaTitle: 'Top Customization Options for Corporate Bags | LTS BAGS',
    metaDescription: 'Compare 3D embroidery, metal badges, rubber patches, and debossing for custom corporate gifting bags and employee welcome kits.',
    metaKeywords: 'corporate bag customization, 3D logo embroidery bags, custom metal badges, branded corporate backpacks',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-7',
    title: 'How to Order School Bags in Bulk: Complete Buyer’s Guide',
    slug: 'how-to-order-school-bags-in-bulk-buyers-guide',
    excerpt: 'A comprehensive institutional procurement guide on stress testing, ergonomic back padding, fabric durability, and school crest embroidery.',
    content: `
# How to Order School Bags in Bulk: Complete Buyer’s Guide

Ordering school bags for academic institutions, coaching centers, and educational trusts requires prioritizing structural durability, student ergonomics, and strict delivery schedules ahead of the academic term.

## 1. Ergonomic Spinal Support for Growing Students
School bags must support significant textbook weight. Look for:
- S-shaped contoured shoulder straps padded with high-density EVA foam.
- Breathable 3D air-mesh back panels to prevent sweating.
- Adjustable sternum chest straps to distribute weight across the torso.

## 2. Fabric Specifications & Abrasion Resistance
- Use **600D to 1000D high-density coated polyester** that resists tearing and abrasion when dragged across playground surfaces.
- Ensure the base panel features double-layered fabric or a molded rubber skid plate.

## 3. Stress-Point Bar-Tack Reinforcement
The top grab handle and upper shoulder strap anchors bear the highest load. Ensure your manufacturer applies heavy-duty multi-stitch bar-tacking tested to hold at least 15 to 20 kg.

## 4. Uniform Matching & School Crest Embroidery
Provide vector artwork for your school crest. Computerized multi-head embroidery ensures exact color reproduction and razor-sharp lettering across thousands of units.

## 5. Planning Lead Times for Academic Season
Peak school manufacturing season runs from January to May. Place bulk orders at least 30 to 45 days in advance to ensure on-time delivery before school reopening.
    `,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS Institutional Division',
    category: 'Institutional Supply',
    publishedAt: '2026-07-08T09:00:00.000Z',
    metaTitle: 'How to Order School Bags in Bulk | School Buyer Guide',
    metaDescription: 'Essential guide for schools and institutions purchasing bags in bulk: ergonomic requirements, fabric choices, stress-point stitching, and planning lead times.',
    metaKeywords: 'bulk school bags, school bag manufacturer Mumbai, wholesale student backpacks, institutional bag supplier',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-8',
    title: 'Quality Control Checklist for B2B Bag Manufacturing',
    slug: 'quality-control-checklist-b2b-bag-manufacturing',
    excerpt: 'Detailed AQL 2.5 quality control checklist covering tensile seam tests, zipper cycle stress, drop tests, and barcode packaging inspections.',
    content: `
# Quality Control Checklist for B2B Bag Manufacturing

To ensure zero defect rates across thousands of units, professional bag manufacturers enforce multi-stage Quality Assurance (QA) and Quality Control (QC) protocols based on international AQL 2.5 standards.

---

### Stage 1: Inbound Raw Material Inspection
- [x] **Tensile & Tear Strength:** Fabric rolls tested under tension before cutting.
- [x] **Colorfastness & UV Rating:** Verified against shade fading from sun exposure and washing.
- [x] **Water Resistance:** Hydrostatic head pressure test on PU/TPU coated backings.

---

### Stage 2: In-Process Assembly Audit
- [x] **Pattern Alignment:** CNC cut pieces verified against technical drawings.
- [x] **Stitch Density:** 8 to 10 stitches per inch using high-tensile bonded nylon thread.
- [x] **Bar-Tack Enforcement:** Visual and mechanical pull verification on all handle and strap anchors.

---

### Stage 3: Hardware & Zipper Functionality
- [x] **Zipper Cycling:** Smooth opening and closing under maximum compartment expansion without teeth snagging.
- [x] **Buckle & D-Ring Load:** Plastic and metal hardware tested against sudden impact and 25kg tension.

---

### Stage 4: Finished Bag Drop & Load Testing
- [x] **20kg Dynamic Drop Test:** Bag loaded with 20kg weight and dropped from 1.2 meters to ensure zero seam slippage.
- [x] **Handle Jerk Test:** 1,000 continuous machine-driven vertical jerks simulating daily commute strain.

---

### Stage 5: Final Packaging & Export Audit
- [x] **Clean Finishing:** Removal of all loose thread ends and fabric dust.
- [x] **Protective Packaging:** Individual poly-bagging with moisture-absorbing silica gel.
- [x] **Carton Integrity:** 5-ply heavy corrugated cartons strapped with security tape.
    `,
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1000',
    author: 'LTS BAGS QC Laboratory',
    category: 'Manufacturing QC',
    publishedAt: '2026-07-04T11:30:00.000Z',
    metaTitle: 'Quality Control Checklist for B2B Bag Manufacturing | LTS BAGS',
    metaDescription: 'Discover the AQL 2.5 quality control checklist used in professional bag manufacturing: tensile tests, zipper cycling, load drop tests, packaging audits.',
    metaKeywords: 'bag quality control, bag manufacturing QC checklist, AQL 2.5 bag testing, wholesale luggage inspection',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    name: 'Rajesh Sharma',
    company: 'Infosys Talent Engagement',
    email: 'r.sharma@infosys-example.com',
    mobile: '+91 98765 43210',
    productRequirement: 'Apex Pro Tech Laptop Backpack',
    productId: 'prod-1',
    quantity: 1200,
    message: 'We require 1200 units of custom executive laptop backpacks for our Q3 employee onboarding kits with embroidered company logo. Please provide quotation and sample delivery timeline.',
    status: 'NEW',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'enq-102',
    name: 'Sarah Jenkins',
    company: 'Apex Logistics & Freight',
    email: 's.jenkins@apexlogistics-example.com',
    mobile: '+1 415 555 0192',
    productRequirement: 'Apex Voyager Leatherette Duffel Bag',
    productId: 'prod-2',
    quantity: 300,
    message: 'Looking for 300 units of weekender duffel bags with debossed corporate logo for executive retreat gifts. Need express air delivery.',
    status: 'QUOTED',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-101',
    quoteNumber: 'QT-2026-101',
    enquiryId: 'enq-101',
    clientName: 'Rajesh Sharma',
    companyName: 'Infosys Talent Engagement',
    clientEmail: 'r.sharma@infosys-example.com',
    clientMobile: '+91 98765 43210',
    items: [
      {
        id: 'item-1',
        productName: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack',
        description: '1680D Ballistic Nylon, 3D Embroidered Company Logo, Custom Zipper Pullers',
        quantity: 1200,
        unitPrice: 850,
        gstPercent: 18,
        amount: 1020000,
      },
    ],
    subtotal: 1020000,
    gstAmount: 183600,
    discount: 20000,
    totalAmount: 1183600,
    termsAndConditions: '1. 50% Advance with Purchase Order, balance 50% prior to dispatch.\n2. Delivery timeline: 12-15 days from sample sign-off.\n3. Price includes custom logo embroidery and individual polybag packing.',
    notes: 'Sample approved by client on 02 August 2026.',
    validUntil: '2026-08-31',
    status: 'SENT',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'quote-102',
    quoteNumber: 'QT-2026-102',
    enquiryId: 'enq-102',
    clientName: 'Sarah Jenkins',
    companyName: 'Apex Logistics & Freight',
    clientEmail: 's.jenkins@apexlogistics-example.com',
    clientMobile: '+1 415 555 0192',
    items: [
      {
        id: 'item-2',
        productName: 'Apex Voyager Leatherette Weekender Duffel Bag',
        description: 'Debossed Corporate Logo, Brass Finish Hardware, Shoe Compartment',
        quantity: 300,
        unitPrice: 1250,
        gstPercent: 18,
        amount: 375000,
      },
    ],
    subtotal: 375000,
    gstAmount: 67500,
    discount: 10000,
    totalAmount: 432500,
    termsAndConditions: '1. 50% Advance payment required for production start.\n2. Express air freight extra as per actuals.',
    notes: 'Client requested debossed logo proof before mass cutting.',
    validUntil: '2026-08-25',
    status: 'ACCEPTED',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-101',
    paymentNumber: 'PAY-2026-001',
    quotationId: 'quote-102',
    quoteNumber: 'QT-2026-102',
    clientName: 'Sarah Jenkins',
    companyName: 'Apex Logistics & Freight',
    amount: 216250,
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'UTR9823148123',
    paymentDate: '2026-08-05',
    status: 'VERIFIED',
    notes: '50% advance deposit received via NEFT/RTGS.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'med-1',
    title: 'Apex Pro Tech Laptop Backpack - Front View',
    url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
    category: 'PRODUCTS',
    fileSize: '1.2 MB',
    dimensions: '1920x1080',
    altText: 'Pro tech laptop backpack image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    title: 'Apex Voyager Leatherette Duffel Bag - Studio Shot',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
    category: 'PRODUCTS',
    fileSize: '1.5 MB',
    dimensions: '1920x1080',
    altText: 'Leatherette weekender duffel bag image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-3',
    title: 'EcoGuard Organic Cotton Canvas Tote - Eco Series',
    url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=1000',
    category: 'PRODUCTS',
    fileSize: '950 KB',
    dimensions: '1600x1200',
    altText: 'Organic canvas tote bag image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-4',
    title: 'LTS Factory CNC Pattern Cutting Machine',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
    category: 'FACTORY',
    fileSize: '2.1 MB',
    dimensions: '1920x1200',
    altText: 'CNC pattern cutting machine at LTS BAGS plant',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-5',
    title: 'Hero Banner - Corporate Custom Bag Lineup',
    url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1600',
    category: 'HERO',
    fileSize: '2.8 MB',
    dimensions: '1920x1080',
    altText: 'Hero slider banner for corporate custom bags',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-6',
    title: 'ISO 9001:2015 Quality Certificate Seal',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    category: 'CERTIFICATES',
    fileSize: '450 KB',
    dimensions: '800x800',
    altText: 'ISO 9001 certification seal image',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_ADMIN_SALT = 'lts_salt_9833598338';
const DEFAULT_ADMIN_HASH = crypto.pbkdf2Sync('admin123', DEFAULT_ADMIN_SALT, 100000, 64, 'sha512').toString('hex');

const INITIAL_USERS: AdminUser[] = [
  {
    id: 'user-super-admin-1',
    name: 'LTS BAGS Super Admin',
    email: 'admin@ltsbags.com',
    passwordHash: DEFAULT_ADMIN_HASH,
    salt: DEFAULT_ADMIN_SALT,
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-content-mgr-2',
    name: 'Content & Catalog Manager',
    email: 'content@ltsbags.com',
    passwordHash: DEFAULT_ADMIN_HASH,
    salt: DEFAULT_ADMIN_SALT,
    role: 'CONTENT_MANAGER',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-sales-mgr-3',
    name: 'B2B Sales & RFQ Manager',
    email: 'sales.lead@ltsbags.com',
    passwordHash: DEFAULT_ADMIN_HASH,
    salt: DEFAULT_ADMIN_SALT,
    role: 'SALES_MANAGER',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is the Minimum Order Quantity (MOQ) for custom bag manufacturing?',
    answer: 'Our standard Minimum Order Quantity (MOQ) starts from 50 to 100 units for corporate backpacks, executive laptop bags, and travel duffels with custom company logo embroidery or screen printing. For promotional drawstring bags and tote bags, the MOQ is 200 to 500 units.',
    category: 'Ordering & MOQ',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    question: 'How long does physical sample development and mass production take?',
    answer: 'Pre-production physical sample turnaround is 3 to 5 business days after artwork approval. Once the physical sample is signed off, standard bulk manufacturing takes 10 to 18 business days depending on order volume (up to 50,000 units). Express expedited production is available for urgent events.',
    category: 'Production & Delivery',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-3',
    question: 'What customization and branding options are available?',
    answer: 'We provide end-to-end custom branding: Computerized High-Density 3D Embroidery, Multi-Color Screen Printing, Laser-Etched Metal Plates, Heat-Debossed Leatherette Badges, High-Frequency Rubber Patches, Custom Molded Zipper Pullers, and Custom Monogram Interior Lining Fabric.',
    category: 'Customization & Branding',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-4',
    question: 'Which raw materials do you use for durable corporate bags?',
    answer: 'We maintain extensive inventory of premium fabrics including 1680D Ballistic Nylon, 1000D Cordura-grade Polyester, 600D Diamond Ripstop, Vegan PU Leatherette, GOTS-Certified Organic Canvas, Juco, and Waterproof TPU coated textiles. All hardware uses rust-proof zinc alloy and YKK / heavy-duty SBS zippers.',
    category: 'Materials & Quality',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-5',
    question: 'Do you deliver across India and handle international export shipping?',
    answer: 'Yes. We deliver pan-India via express surface and air freight with live dispatch tracking (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad). We also handle export documentation, sea containers, and air cargo for global clients in UAE, USA, Europe, and Africa.',
    category: 'Shipping & Logistics',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-6',
    question: 'Can we visit your manufacturing facility in Dharavi, Mumbai?',
    answer: 'Yes, corporate procurement teams, institutions, and buying agents are welcome to visit our manufacturing floor and showroom at FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI, MUMBAI 400017, MAHARASHTRA, INDIA. Please schedule an appointment with our sales team.',
    category: 'Factory & Company',
    displayOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Rajesh Sharma',
    role: 'VP Procurement & Talent Engagement',
    company: 'Infosys Limited',
    content: 'LTS BAGS manufactured 2,500 executive 1680D nylon laptop backpacks for our annual corporate onboarding. Stitching quality, EVA back support, and 3D embroidery detail were exceptional. Delivered 5 days ahead of schedule.',
    review: 'LTS BAGS manufactured 2,500 executive 1680D nylon laptop backpacks for our annual corporate onboarding. Stitching quality, EVA back support, and 3D embroidery detail were exceptional. Delivered 5 days ahead of schedule.',
    rating: 5,
    source: 'Verified Customer',
    verificationStatus: 'VERIFIED',
    publishStatus: 'PUBLISHED',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test-2',
    name: 'Ananya Deshmukh',
    role: 'Corporate Procurement Manager',
    company: 'TCS Innovation Labs',
    content: 'Outstanding build quality and zipper durability! We ordered 800 weekender travel duffel bags for our international leadership retreat. Highly professional communication and transparent factory pricing.',
    review: 'Outstanding build quality and zipper durability! We ordered 800 weekender travel duffel bags for our international leadership retreat. Highly professional communication and transparent factory pricing.',
    rating: 5,
    source: 'Verified Customer',
    verificationStatus: 'VERIFIED',
    publishStatus: 'PUBLISHED',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test-3',
    name: 'Vikram Mehta',
    role: 'Marketing Director',
    company: 'Reliance Retail Merchandising',
    content: 'We sourced 15,000 organic cotton canvas totes for a national eco promotional campaign. The reactive screen printing crispness and seam load strength were flawless. LTS BAGS is our trusted bulk manufacturing partner.',
    review: 'We sourced 15,000 organic cotton canvas totes for a national eco promotional campaign. The reactive screen printing crispness and seam load strength were flawless. LTS BAGS is our trusted bulk manufacturing partner.',
    rating: 5,
    source: 'Verified Customer',
    verificationStatus: 'VERIFIED',
    publishStatus: 'PUBLISHED',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test-4',
    name: 'Priya Sundaram',
    role: 'Director of Operations',
    company: 'Horizon International School',
    content: 'We ordered 3,500 customized student backpacks with ergonomic spinal padding and embroidered school crests. Zero defects reported across all grade batches. Outstanding institutional supplier in Mumbai.',
    review: 'We ordered 3,500 customized student backpacks with ergonomic spinal padding and embroidered school crests. Zero defects reported across all grade batches. Outstanding institutional supplier in Mumbai.',
    rating: 5,
    source: 'Direct Feedback',
    verificationStatus: 'VERIFIED',
    publishStatus: 'PUBLISHED',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_NAVIGATION: NavigationMenuConfig = {
  headerNav: [
    { id: 'nav-prod', label: 'All Bags & Catalog', url: '/products', displayOrder: 1, isEnabled: true },
    { id: 'nav-cat', label: 'Categories', url: '/categories', displayOrder: 2, isEnabled: true },
    { id: 'nav-cust', label: 'Custom Branding', url: '/customization', displayOrder: 3, isEnabled: true },
    { id: 'nav-mfg', label: 'Manufacturing & QC', url: '/manufacturing', displayOrder: 4, isEnabled: true },
    { id: 'nav-fac', label: 'Factory Tour', url: '/factory-tour', displayOrder: 5, isEnabled: true },
    { id: 'nav-abt', label: 'About Factory', url: '/about', displayOrder: 6, isEnabled: true },
    { id: 'nav-blg', label: 'B2B Insights', url: '/blog', displayOrder: 7, isEnabled: true },
    { id: 'nav-cnt', label: 'Contact & RFQ', url: '/contact', displayOrder: 8, isEnabled: true },
  ],
  footerNav: [
    { id: 'fnav-rfq', label: 'Request Factory Quotation', url: '/contact', displayOrder: 1, isEnabled: true },
    { id: 'fnav-corp', label: 'Corporate Laptop Backpacks', url: '/category/laptop-bags', displayOrder: 2, isEnabled: true },
    { id: 'fnav-duf', label: 'Travel & Gym Duffels', url: '/category/travel-bags', displayOrder: 3, isEnabled: true },
    { id: 'fnav-tote', label: 'Eco Canvas Totes', url: '/category/tote-bags', displayOrder: 4, isEnabled: true },
    { id: 'fnav-mat', label: 'Material Selection Guide', url: '/blog/1680d-vs-600d-vs-1000d-nylon-corporate-bags-material-guide', displayOrder: 5, isEnabled: true },
    { id: 'fnav-qc', label: 'AQL 2.5 Quality Inspection', url: '/blog/quality-control-checklist-b2b-bag-manufacturing', displayOrder: 6, isEnabled: true },
    { id: 'fnav-fac', label: 'Factory Infrastructure', url: '/factory-tour', displayOrder: 7, isEnabled: true },
  ],
  quickLinks: [
    { id: 'qlink-1', label: 'Direct WhatsApp Quotation', url: 'https://wa.me/919833598338?text=Hello%20LTS%20Bags,%20I%20need%20a%20wholesale%20quote', displayOrder: 1, isEnabled: true, isExternal: true },
    { id: 'qlink-2', label: 'Download Product Catalogue (PDF)', url: '/catalogue.pdf', displayOrder: 2, isEnabled: true },
    { id: 'qlink-3', label: 'Schedule Factory Visit in Mumbai', url: '/contact', displayOrder: 3, isEnabled: true },
  ],
  importantLinks: [
    { id: 'imp-1', label: 'Privacy Policy', url: '/privacy-policy', displayOrder: 1, isEnabled: true },
    { id: 'imp-2', label: 'Terms of Supply & Warranty', url: '/terms', displayOrder: 2, isEnabled: true },
    { id: 'imp-3', label: 'Sitemap XML', url: '/sitemap.xml', displayOrder: 3, isEnabled: true },
  ],
};

let inMemoryCache: DatabaseSchema | null = null;

function ensureDataFile(): DatabaseSchema {
  if (inMemoryCache) {
    return inMemoryCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        categories: INITIAL_CATEGORIES,
        products: INITIAL_PRODUCTS,
        blogs: INITIAL_BLOGS,
        enquiries: INITIAL_ENQUIRIES,
        settings: INITIAL_SETTINGS,
        slides: INITIAL_SLIDES,
        quotations: INITIAL_QUOTATIONS,
        payments: INITIAL_PAYMENTS,
        media: INITIAL_MEDIA,
        users: INITIAL_USERS,
        faqs: INITIAL_FAQS,
        testimonials: INITIAL_TESTIMONIALS,
        navigation: INITIAL_NAVIGATION,
        auditLogs: [],
        sessions: [],
      };
      saveData(initialData);
      inMemoryCache = initialData;
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    if (!raw || !raw.trim()) {
      throw new Error('Empty database file encountered');
    }
    const parsed = JSON.parse(raw) as DatabaseSchema;
    let dirty = false;

    // Ensure users exist
    if (!parsed.users || parsed.users.length === 0) {
      parsed.users = INITIAL_USERS;
      dirty = true;
    }

    // Ensure FAQs exist
    if (!parsed.faqs || parsed.faqs.length === 0) {
      parsed.faqs = INITIAL_FAQS;
      dirty = true;
    }

    // Ensure Testimonials exist
    if (!parsed.testimonials || parsed.testimonials.length === 0) {
      parsed.testimonials = INITIAL_TESTIMONIALS;
      dirty = true;
    }

    // Ensure Navigation exists
    if (!parsed.navigation) {
      parsed.navigation = INITIAL_NAVIGATION;
      dirty = true;
    }

    // Ensure sessions and audit logs array
    if (!parsed.sessions) {
      parsed.sessions = [];
      dirty = true;
    }
    if (!parsed.auditLogs) {
      parsed.auditLogs = [];
      dirty = true;
    }

    // Ensure all categories exist & have strictly unique IDs and slugs
    const sanitizedCategories: Category[] = [];
    const seenCatSlugs = new Set<string>();
    const seenCatIds = new Set<string>();

    const masterMap = new Map<string, Category>();
    for (const initCat of INITIAL_CATEGORIES) {
      masterMap.set(initCat.slug.toLowerCase().trim(), initCat);
      masterMap.set(initCat.id.toLowerCase().trim(), initCat);
    }

    // First process existing categories
    for (const c of (parsed.categories || [])) {
      const slug = c.slug?.toLowerCase().trim();
      if (!slug || seenCatSlugs.has(slug)) continue;
      seenCatSlugs.add(slug);

      let finalId = c.id;
      if (!finalId || seenCatIds.has(finalId)) {
        finalId = `cat-${slug}`;
        dirty = true;
      }
      seenCatIds.add(finalId);

      const master = masterMap.get(slug) || masterMap.get(finalId);
      if (master) {
        sanitizedCategories.push({
          ...master,
          ...c,
          id: finalId,
          slug,
          parentId: c.parentId !== undefined ? c.parentId : master.parentId,
          parentSlug: c.parentSlug !== undefined ? c.parentSlug : master.parentSlug,
          parentCategory: c.parentCategory !== undefined ? c.parentCategory : master.parentCategory,
          sortOrder: c.sortOrder !== undefined ? c.sortOrder : master.sortOrder,
          level: c.level || master.level,
          metaTitle: c.metaTitle || master.metaTitle,
          metaDescription: c.metaDescription || master.metaDescription,
          metaKeywords: c.metaKeywords || master.metaKeywords,
        });
      } else {
        sanitizedCategories.push({ ...c, id: finalId, slug });
      }
    }

    // Merge any missing initial categories
    for (const initCat of INITIAL_CATEGORIES) {
      const slug = initCat.slug.toLowerCase().trim();
      if (!seenCatSlugs.has(slug)) {
        let finalId = initCat.id;
        if (seenCatIds.has(finalId)) {
          finalId = `cat-${slug}`;
        }
        seenCatSlugs.add(slug);
        seenCatIds.add(finalId);
        sanitizedCategories.push({ ...initCat, id: finalId, slug });
        dirty = true;
      }
    }
    if (parsed.categories?.length !== sanitizedCategories.length || dirty) {
      parsed.categories = sanitizedCategories;
      dirty = true;
    }

    // Ensure all blogs exist & have strictly unique IDs and slugs
    const sanitizedBlogs: Blog[] = [];
    const seenBlogSlugs = new Set<string>();
    const seenBlogIds = new Set<string>();

    for (const b of (parsed.blogs || [])) {
      const slug = b.slug?.toLowerCase().trim();
      if (!slug || seenBlogSlugs.has(slug)) continue;
      seenBlogSlugs.add(slug);

      let finalId = b.id;
      if (!finalId || seenBlogIds.has(finalId)) {
        finalId = `blog-${slug}`;
        dirty = true;
      }
      seenBlogIds.add(finalId);
      sanitizedBlogs.push({ ...b, id: finalId, slug });
    }

    for (const initBlog of INITIAL_BLOGS) {
      const slug = initBlog.slug.toLowerCase().trim();
      if (!seenBlogSlugs.has(slug)) {
        let finalId = initBlog.id;
        if (seenBlogIds.has(finalId)) {
          finalId = `blog-${slug}`;
        }
        seenBlogSlugs.add(slug);
        seenBlogIds.add(finalId);
        sanitizedBlogs.push({ ...initBlog, id: finalId, slug });
        dirty = true;
      }
    }
    if (parsed.blogs?.length !== sanitizedBlogs.length || dirty) {
      parsed.blogs = sanitizedBlogs;
      dirty = true;
    }

    // Ensure products have unique IDs
    const sanitizedProducts: Product[] = [];
    const seenProdSlugs = new Set<string>();
    const seenProdIds = new Set<string>();
    for (const p of (parsed.products || [])) {
      const slug = p.slug?.toLowerCase().trim();
      if (!slug || seenProdSlugs.has(slug)) continue;
      seenProdSlugs.add(slug);
      let finalId = p.id;
      if (!finalId || seenProdIds.has(finalId)) {
        finalId = `prod-${slug}`;
        dirty = true;
      }
      seenProdIds.add(finalId);
      sanitizedProducts.push({ ...p, id: finalId, slug });
    }
    for (const initProd of INITIAL_PRODUCTS) {
      const slug = initProd.slug.toLowerCase().trim();
      if (!seenProdSlugs.has(slug)) {
        let finalId = initProd.id;
        if (seenProdIds.has(finalId)) {
          finalId = `prod-${slug}`;
        }
        seenProdSlugs.add(slug);
        seenProdIds.add(finalId);
        sanitizedProducts.push({ ...initProd, id: finalId, slug });
        dirty = true;
      }
    }
    if (parsed.products?.length !== sanitizedProducts.length || dirty) {
      parsed.products = sanitizedProducts;
      dirty = true;
    }

    if (!parsed.slides || parsed.slides.length === 0) {
      parsed.slides = INITIAL_SLIDES;
      dirty = true;
    }
    if (!parsed.quotations || parsed.quotations.length === 0) {
      parsed.quotations = INITIAL_QUOTATIONS;
      dirty = true;
    }
    if (!parsed.payments || parsed.payments.length === 0) {
      parsed.payments = INITIAL_PAYMENTS;
      dirty = true;
    }
    if (!parsed.media || parsed.media.length === 0) {
      parsed.media = INITIAL_MEDIA;
      dirty = true;
    }
    
    inMemoryCache = parsed;

    if (dirty) {
      saveData(parsed);
    }
    return parsed;
  } catch (error) {
    console.error('Error reading DB file, using fallback initial data safely:', error);
    const fallbackData: DatabaseSchema = {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      blogs: INITIAL_BLOGS,
      enquiries: INITIAL_ENQUIRIES,
      slides: INITIAL_SLIDES,
      quotations: INITIAL_QUOTATIONS,
      payments: INITIAL_PAYMENTS,
      media: INITIAL_MEDIA,
      settings: INITIAL_SETTINGS,
      users: INITIAL_USERS,
      faqs: INITIAL_FAQS,
      testimonials: INITIAL_TESTIMONIALS,
      navigation: INITIAL_NAVIGATION,
      auditLogs: [],
      sessions: [],
    };
    inMemoryCache = fallbackData;
    return fallbackData;
  }
}

function saveData(data: DatabaseSchema): void {
  try {
    inMemoryCache = data;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = path.join(DATA_DIR, `db.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 7)}`);
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error saving DB file atomically:', error);
  }
}

const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  'backpack-bags': 'backpacks',
  'corporate-backpacks': 'backpacks',
  'backpack': 'backpacks',
  'laptop-bag': 'laptop-office-bags',
  'laptop-bags': 'laptop-office-bags',
  'executive-laptop-bags': 'laptop-office-bags',
  'office-bags': 'laptop-office-bags',
  'school-college-bags': 'school-college-bags',
  'school-bags': 'school-college-bags',
  'school-bag': 'school-college-bags',
  'corporate-bag': 'corporate-promotional-bags',
  'corporate-bags': 'corporate-promotional-bags',
  'promotional-drawstring-bags': 'corporate-promotional-bags',
  'promotional-bags': 'corporate-promotional-bags',
  'duffel-travel-bags': 'travel-bags',
  'travel-bag': 'travel-bags',
  'duffel-bags': 'travel-duffel-bags',
  'duffels': 'travel-duffel-bags',
  'eco-canvas-tote-bags': 'tote-shopping-bags',
  'canvas-totes': 'tote-shopping-bags',
  'totes': 'tote-shopping-bags',
  'tote-bags': 'tote-shopping-bags',
  'sports-bags': 'sports-gym-bags',
  'gym-bags': 'sports-gym-bags',
  'college-bags': 'school-college-bags',
  'jute-bags': 'jute-eco-bags',
  'sling-bags': 'sling-shoulder-bags',
  'lunch-bags': 'lunch-utility-bags',
  'custom-bags': 'custom-manufacturing',
  'oem-bags': 'custom-manufacturing',
};

export const db = {
  // Categories
  getCategories(): Category[] {
    const data = ensureDataFile();
    return data.categories;
  },
  getMainCategories(): Category[] {
    const data = ensureDataFile();
    return data.categories
      .filter((c) => !c.parentId)
      .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
  },
  getSubcategories(parentIdOrSlug: string): Category[] {
    const data = ensureDataFile();
    const parent = data.categories.find((c) => c.id === parentIdOrSlug || c.slug === parentIdOrSlug);
    if (!parent) return [];
    return data.categories
      .filter((c) => c.parentId === parent.id || c.parentSlug === parent.slug)
      .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
  },
  getCategoryHierarchy(): Category[] {
    const data = ensureDataFile();
    const mainCategories = data.categories
      .filter((c) => !c.parentId)
      .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    
    return mainCategories.map((main) => ({
      ...main,
      subcategories: data.categories
        .filter((c) => c.parentId === main.id || c.parentSlug === main.slug)
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)),
    }));
  },
  getCategoryById(id: string): Category | undefined {
    const data = ensureDataFile();
    const directMatch = data.categories.find((c) => c.id === id);
    if (directMatch) return directMatch;
    // Fallback if caller passed a slug
    return data.categories.find((c) => c.slug === id.toLowerCase().trim());
  },
  getCategoryBySlug(slug: string): Category | undefined {
    const data = ensureDataFile();
    const normalized = slug.toLowerCase().trim();
    const directMatch = data.categories.find((c) => c.slug === normalized || c.id === slug);
    if (directMatch) return directMatch;

    const targetSlug = CATEGORY_SLUG_ALIASES[normalized];
    if (targetSlug) {
      const aliasMatch = data.categories.find((c) => c.slug === targetSlug);
      if (aliasMatch) return aliasMatch;
    }

    return data.categories.find((c) => 
      c.slug.includes(normalized) || normalized.includes(c.slug) || c.name.toLowerCase().includes(normalized)
    );
  },
  getCategoryByParentAndSubSlug(parentSlug: string, subSlug: string): { parent?: Category; subcategory?: Category } {
    const data = ensureDataFile();
    const parent = this.getCategoryBySlug(parentSlug);
    if (!parent) return {};
    const normSub = subSlug.toLowerCase().trim();
    const subcategory = data.categories.find(
      (c) => (c.parentId === parent.id || c.parentSlug === parent.slug) && (c.slug === normSub || c.id === normSub)
    ) || data.categories.find((c) => c.slug === normSub);
    return { parent, subcategory };
  },
  saveCategory(category: Partial<Category> & { name: string }): Category {
    const data = ensureDataFile();
    const existingIndex = category.id ? data.categories.findIndex((c) => c.id === category.id) : -1;
    const now = new Date().toISOString();

    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (existingIndex >= 0) {
      const updated: Category = {
        ...data.categories[existingIndex],
        ...category,
        slug,
        updatedAt: now,
      };
      data.categories[existingIndex] = updated;
      saveData(data);
      return updated;
    } else {
      const newCat: Category = {
        id: 'cat-' + Date.now(),
        name: category.name,
        slug,
        description: category.description || '',
        image: category.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
        metaTitle: category.metaTitle || `${category.name} Manufacturer & Wholesale Supplier`,
        metaDescription: category.metaDescription || `Custom bulk manufacturer of ${category.name}. High quality OEM/ODM manufacturing.`,
        metaKeywords: category.metaKeywords || `${category.name}, wholesale, custom bag manufacturer`,
        createdAt: now,
        updatedAt: now,
      };
      data.categories.push(newCat);
      saveData(data);
      return newCat;
    }
  },
  deleteCategory(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.categories.length;
    data.categories = data.categories.filter((c) => c.id !== id);
    if (data.categories.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Products
  getProducts(): Product[] {
    const data = ensureDataFile();
    return data.products;
  },
  getProductBySlug(slug: string): Product | undefined {
    const data = ensureDataFile();
    if (!slug) return undefined;
    const normalized = slug.toLowerCase().trim();
    const exact = data.products.find((p) => p.slug === normalized || p.slug === slug || p.id === slug);
    if (exact) return exact;
    
    // Fallback: match partial keywords
    return data.products.find((p) => {
      const pSlug = p.slug.toLowerCase();
      const pName = p.name.toLowerCase();
      return pSlug.includes(normalized) || normalized.includes(pSlug) || pName.includes(normalized);
    });
  },
  getProductById(id: string): Product | undefined {
    const data = ensureDataFile();
    if (!id) return undefined;
    return data.products.find((p) => p.id === id || p.slug === id);
  },
  getProductsByCategory(categoryIdOrSlug: string): Product[] {
    const data = ensureDataFile();
    if (!categoryIdOrSlug) return [];
    const matchedCategory = data.categories.find(
      (c) => c.id === categoryIdOrSlug || c.slug === categoryIdOrSlug || c.slug === categoryIdOrSlug.toLowerCase().trim()
    );
    const catId = matchedCategory ? matchedCategory.id : categoryIdOrSlug;
    return data.products.filter((p) => p.categoryId === catId || p.categoryId === categoryIdOrSlug || (matchedCategory && p.categoryId === matchedCategory.slug));
  },
  getProductsByCategoryOrSubcategory(categoryIdOrSlug: string): Product[] {
    const data = ensureDataFile();
    if (!categoryIdOrSlug) return [];
    const cat = this.getCategoryBySlug(categoryIdOrSlug) || data.categories.find((c) => c.id === categoryIdOrSlug);
    if (!cat) return this.getProductsByCategory(categoryIdOrSlug);

    const relevantCategoryIds = new Set<string>([cat.id, cat.slug]);
    if (!cat.parentId) {
      const subs = data.categories.filter((c) => c.parentId === cat.id || c.parentSlug === cat.slug);
      subs.forEach((s) => {
        relevantCategoryIds.add(s.id);
        relevantCategoryIds.add(s.slug);
      });
    }

    const matchedProducts = data.products.filter((p) => {
      if (relevantCategoryIds.has(p.categoryId)) return true;
      if (p.subcategory && relevantCategoryIds.has(p.subcategory)) return true;
      if (p.categoryName && (p.categoryName.toLowerCase() === cat.name.toLowerCase() || p.categoryName.toLowerCase().includes(cat.name.toLowerCase()))) return true;
      return false;
    });

    if (matchedProducts.length > 0) return matchedProducts;
    return this.getProductsByCategory(categoryIdOrSlug);
  },
  saveProduct(product: Partial<Product> & { name: string; categoryId: string }): Product {
    const data = ensureDataFile();
    const existingIndex = product.id ? data.products.findIndex((p) => p.id === product.id) : -1;
    const now = new Date().toISOString();

    const category = data.categories.find((c) => c.id === product.categoryId);
    const categoryName = category ? category.name : product.categoryName || 'General';
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (existingIndex >= 0) {
      const updated: Product = {
        ...data.products[existingIndex],
        ...product,
        categoryName,
        slug,
        updatedAt: now,
      };
      data.products[existingIndex] = updated;
      saveData(data);
      return updated;
    } else {
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        name: product.name,
        slug,
        categoryId: product.categoryId,
        categoryName,
        images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000'],
        shortDesc: product.shortDesc || '',
        fullDesc: product.fullDesc || '',
        features: product.features || ['High Quality Material', 'Custom Logo Printing Available'],
        materials: product.materials || 'High Tensile Polyester / Leatherette',
        moq: product.moq || 100,
        specifications: product.specifications || [{ label: 'Warranty', value: '1 Year' }],
        isFeatured: Boolean(product.isFeatured),
        status: product.status || 'ACTIVE',
        metaTitle: product.metaTitle || `${product.name} | Custom B2B Bag Manufacturer`,
        metaDescription: product.metaDescription || `Bulk manufacturer of ${product.name}. Direct factory prices, low MOQ, custom branding.`,
        metaKeywords: product.metaKeywords || `${product.name}, custom bag manufacturer, wholesale bag`,
        imageAltText: product.imageAltText || product.name,
        createdAt: now,
        updatedAt: now,
      };
      data.products.push(newProd);
      saveData(data);
      return newProd;
    }
  },
  deleteProduct(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);
    if (data.products.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Blogs
  getBlogs(): Blog[] {
    const data = ensureDataFile();
    return data.blogs;
  },
  getBlogById(id: string): Blog | undefined {
    const data = ensureDataFile();
    return data.blogs.find((b) => b.id === id);
  },
  getBlogBySlug(slug: string): Blog | undefined {
    const data = ensureDataFile();
    return data.blogs.find((b) => b.slug === slug);
  },
  saveBlog(blog: Partial<Blog> & { title: string }): Blog {
    const data = ensureDataFile();
    const existingIndex = blog.id ? data.blogs.findIndex((b) => b.id === blog.id) : -1;
    const now = new Date().toISOString();
    const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (existingIndex >= 0) {
      const updated: Blog = {
        ...data.blogs[existingIndex],
        ...blog,
        slug,
        updatedAt: now,
      };
      data.blogs[existingIndex] = updated;
      saveData(data);
      return updated;
    } else {
      const newBlog: Blog = {
        id: 'blog-' + Date.now(),
        title: blog.title,
        slug,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        image: blog.image || 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
        author: blog.author || 'ApexBags Editorial',
        category: blog.category || 'Industry Insights',
        publishedAt: blog.publishedAt || now,
        metaTitle: blog.metaTitle || `${blog.title} | ApexBags Blog`,
        metaDescription: blog.metaDescription || blog.excerpt || 'B2B bag manufacturing industry insights.',
        metaKeywords: blog.metaKeywords || 'bag manufacturing, corporate gifts, B2B luggage',
        createdAt: now,
        updatedAt: now,
      };
      data.blogs.push(newBlog);
      saveData(data);
      return newBlog;
    }
  },
  deleteBlog(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.blogs.length;
    data.blogs = data.blogs.filter((b) => b.id !== id);
    if (data.blogs.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    const data = ensureDataFile();
    return data.enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getEnquiryById(id: string): Enquiry | undefined {
    const data = ensureDataFile();
    return data.enquiries.find((e) => e.id === id);
  },
  createEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Enquiry {
    const data = ensureDataFile();
    const now = new Date().toISOString();
    const newEnq: Enquiry = {
      id: 'enq-' + Date.now(),
      ...enquiry,
      status: 'NEW',
      createdAt: now,
      updatedAt: now,
    };
    data.enquiries.unshift(newEnq);
    saveData(data);
    return newEnq;
  },
  updateEnquiryStatus(id: string, status: Enquiry['status'], notes?: string, assignedTo?: string): Enquiry | undefined {
    const data = ensureDataFile();
    const item = data.enquiries.find((e) => e.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      if (assignedTo !== undefined) item.assignedTo = assignedTo;
      item.updatedAt = new Date().toISOString();
      saveData(data);
      return item;
    }
    return undefined;
  },
  updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | undefined {
    const data = ensureDataFile();
    const index = data.enquiries.findIndex((e) => e.id === id);
    if (index >= 0) {
      const updated: Enquiry = {
        ...data.enquiries[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      data.enquiries[index] = updated;
      saveData(data);
      return updated;
    }
    return undefined;
  },
  deleteEnquiry(id: string): boolean {
    const data = ensureDataFile();
    const lenBefore = data.enquiries.length;
    data.enquiries = data.enquiries.filter((e) => e.id !== id);
    if (data.enquiries.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Overview Stats
  getStats() {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    return {
      totalProducts: data.products.length,
      totalCategories: data.categories.length,
      totalBlogs: data.blogs.length,
      totalEnquiries: data.enquiries.length,
      totalSlides: slides.length,
      activeSlides: slides.filter((s) => s.isActive).length,
      newEnquiriesCount: data.enquiries.filter((e) => e.status === 'NEW').length,
    };
  },

  // Site Settings & Logo
  getSettings(): SiteSettings {
    const data = ensureDataFile();
    const raw = data.settings || INITIAL_SETTINGS;
    
    // Merge defaults so older database JSON files don't throw undefined errors for missing content blocks
    const settings: SiteSettings = {
      ...INITIAL_SETTINGS,
      ...raw,
      metrics: { ...INITIAL_SETTINGS.metrics, ...(raw.metrics || {}) },
      certifications: raw.certifications && raw.certifications.length > 0 ? raw.certifications : INITIAL_CERTIFICATIONS,
      factoryGallery: raw.factoryGallery && raw.factoryGallery.length > 0 ? raw.factoryGallery : INITIAL_FACTORY_GALLERY,
      contactInfo: { ...INITIAL_SETTINGS.contactInfo, ...(raw.contactInfo || {}) },
      homepage: { 
        ...INITIAL_SETTINGS.homepage, 
        ...(raw.homepage || {}),
        stats: raw.homepage?.stats || INITIAL_SETTINGS.homepage?.stats || [],
        whyChooseFeatures: raw.homepage?.whyChooseFeatures || INITIAL_SETTINGS.homepage?.whyChooseFeatures || [],
        processSteps: raw.homepage?.processSteps || INITIAL_SETTINGS.homepage?.processSteps || [],
        testimonials: raw.homepage?.testimonials || INITIAL_SETTINGS.homepage?.testimonials || [],
        clientLogos: raw.homepage?.clientLogos || INITIAL_SETTINGS.homepage?.clientLogos || [],
      },
      about: { ...INITIAL_SETTINGS.about, ...(raw.about || {}) },
      footer: { ...INITIAL_SETTINGS.footer, ...(raw.footer || {}) },
      seoDefaults: { ...INITIAL_SETTINGS.seoDefaults, ...(raw.seoDefaults || {}) },
      imageProcessing: {
        autoProcessing: raw.imageProcessing?.autoProcessing ?? true,
        autoBackgroundRemoval: raw.imageProcessing?.autoBackgroundRemoval ?? true,
        autoUpscaling: raw.imageProcessing?.autoUpscaling ?? true,
        targetResolution: raw.imageProcessing?.targetResolution || 2000,
        outputFormat: raw.imageProcessing?.outputFormat || 'webp',
        quality: raw.imageProcessing?.quality || 'high',
        paddingPercent: raw.imageProcessing?.paddingPercent !== undefined ? raw.imageProcessing.paddingPercent : 8,
        bgRemovalProvider: raw.imageProcessing?.bgRemovalProvider || 'smart_ai',
        upscaleProvider: raw.imageProcessing?.upscaleProvider || 'smart_ai',
        bgRemovalApiKey: raw.imageProcessing?.bgRemovalApiKey || '',
        upscalingApiKey: raw.imageProcessing?.upscalingApiKey || '',
        preserveOriginals: raw.imageProcessing?.preserveOriginals ?? true,
      },
    };

    // Auto-clean old relative /uploads/ paths that break in Cloud Run static server
    if (settings.logoUrl && settings.logoUrl.startsWith('/uploads/')) {
      settings.logoUrl = '';
      data.settings = settings;
      saveData(data);
    }
    return settings;
  },
  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    const data = ensureDataFile();
    const current = data.settings || INITIAL_SETTINGS;

    let mergedImageProcessing = current.imageProcessing;
    if (newSettings.imageProcessing) {
      const incoming = newSettings.imageProcessing;
      const currentIp = current.imageProcessing || {
        autoProcessing: true,
        autoBackgroundRemoval: true,
        autoUpscaling: true,
        targetResolution: 2000,
        outputFormat: 'webp',
        quality: 'high',
        paddingPercent: 8,
        bgRemovalProvider: 'smart_ai',
        upscaleProvider: 'smart_ai',
        bgRemovalApiKey: '',
        upscalingApiKey: '',
        preserveOriginals: true,
      };

      // Preserve existing key if mask string or not provided
      const resolvedBgKey =
        incoming.bgRemovalApiKey === undefined ||
        incoming.bgRemovalApiKey === '••••••••' ||
        incoming.bgRemovalApiKey === '••••••••••••••••'
          ? currentIp.bgRemovalApiKey
          : incoming.bgRemovalApiKey;

      const resolvedUpscaleKey =
        incoming.upscalingApiKey === undefined ||
        incoming.upscalingApiKey === '••••••••' ||
        incoming.upscalingApiKey === '••••••••••••••••'
          ? currentIp.upscalingApiKey
          : incoming.upscalingApiKey;

      mergedImageProcessing = {
        ...currentIp,
        ...incoming,
        bgRemovalApiKey: resolvedBgKey,
        upscalingApiKey: resolvedUpscaleKey,
      };
    }

    const updated: SiteSettings = {
      ...current,
      ...newSettings,
      imageProcessing: mergedImageProcessing,
      updatedAt: new Date().toISOString(),
    };
    data.settings = updated;
    saveData(data);
    return updated;
  },

  // Hero Slides
  getSlides(activeOnly = false): HeroSlide[] {
    const data = ensureDataFile();
    let slides = data.slides || INITIAL_SLIDES;
    if (activeOnly) {
      slides = slides.filter((s) => s.isActive);
    }
    return slides.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  getSlideById(id: string): HeroSlide | null {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    return slides.find((s) => s.id === id) || null;
  },

  createSlide(slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>): HeroSlide {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const maxOrder = slides.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0);
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      ...slideData,
      displayOrder: slideData.displayOrder !== undefined ? slideData.displayOrder : maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    slides.push(newSlide);
    data.slides = slides;
    saveData(data);
    return newSlide;
  },

  updateSlide(id: string, updates: Partial<Omit<HeroSlide, 'id' | 'createdAt'>>): HeroSlide | null {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const index = slides.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: HeroSlide = {
      ...slides[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    slides[index] = updated;
    data.slides = slides;
    saveData(data);
    return updated;
  },

  deleteSlide(id: string): boolean {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const filtered = slides.filter((s) => s.id !== id);
    if (filtered.length !== slides.length) {
      data.slides = filtered;
      saveData(data);
      return true;
    }
    return false;
  },

  reorderSlides(slideOrders: { id: string; displayOrder: number }[]): boolean {
    const data = ensureDataFile();
    const slides = data.slides || INITIAL_SLIDES;
    const orderMap = new Map(slideOrders.map((item) => [item.id, item.displayOrder]));
    slides.forEach((slide) => {
      if (orderMap.has(slide.id)) {
        slide.displayOrder = orderMap.get(slide.id)!;
        slide.updatedAt = new Date().toISOString();
      }
    });
    data.slides = slides;
    saveData(data);
    return true;
  },

  // Quotations
  getQuotations(): Quotation[] {
    const data = ensureDataFile();
    return data.quotations || INITIAL_QUOTATIONS;
  },
  getQuotationById(id: string): Quotation | undefined {
    const data = ensureDataFile();
    const quotes = data.quotations || INITIAL_QUOTATIONS;
    return quotes.find((q) => q.id === id);
  },
  saveQuotation(quote: Partial<Quotation> & { clientName: string; totalAmount: number }): Quotation {
    const data = ensureDataFile();
    const quotes = data.quotations || INITIAL_QUOTATIONS;
    const index = quote.id ? quotes.findIndex((q) => q.id === quote.id) : -1;
    const now = new Date().toISOString();

    if (index >= 0) {
      const updated: Quotation = {
        ...quotes[index],
        ...quote,
        updatedAt: now,
      };
      quotes[index] = updated;
      data.quotations = quotes;
      saveData(data);
      return updated;
    } else {
      const newQuote: Quotation = {
        id: 'quote-' + Date.now(),
        quoteNumber: quote.quoteNumber || 'QT-2026-' + (quotes.length + 101),
        enquiryId: quote.enquiryId,
        clientName: quote.clientName,
        companyName: quote.companyName || '',
        clientEmail: quote.clientEmail || '',
        clientMobile: quote.clientMobile || '',
        items: quote.items || [],
        subtotal: quote.subtotal || 0,
        gstAmount: quote.gstAmount || 0,
        discount: quote.discount || 0,
        totalAmount: quote.totalAmount,
        termsAndConditions: quote.termsAndConditions || 'Standard 50% advance, balance on dispatch.',
        notes: quote.notes || '',
        validUntil: quote.validUntil || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        status: quote.status || 'DRAFT',
        createdAt: now,
        updatedAt: now,
      };
      quotes.unshift(newQuote);
      data.quotations = quotes;
      saveData(data);
      return newQuote;
    }
  },
  deleteQuotation(id: string): boolean {
    const data = ensureDataFile();
    const quotes = data.quotations || INITIAL_QUOTATIONS;
    const filtered = quotes.filter((q) => q.id !== id);
    if (filtered.length !== quotes.length) {
      data.quotations = filtered;
      saveData(data);
      return true;
    }
    return false;
  },

  // Payments
  getPayments(): Payment[] {
    const data = ensureDataFile();
    return data.payments || INITIAL_PAYMENTS;
  },
  savePayment(payment: Partial<Payment> & { clientName: string; amount: number }): Payment {
    const data = ensureDataFile();
    const payments = data.payments || INITIAL_PAYMENTS;
    const index = payment.id ? payments.findIndex((p) => p.id === payment.id) : -1;
    const now = new Date().toISOString();

    if (index >= 0) {
      const updated: Payment = {
        ...payments[index],
        ...payment,
        updatedAt: now,
      };
      payments[index] = updated;
      data.payments = payments;
      saveData(data);
      return updated;
    } else {
      const newPay: Payment = {
        id: 'pay-' + Date.now(),
        paymentNumber: payment.paymentNumber || 'PAY-2026-' + String(payments.length + 1).padStart(3, '0'),
        quotationId: payment.quotationId,
        quoteNumber: payment.quoteNumber,
        clientName: payment.clientName,
        companyName: payment.companyName || '',
        amount: payment.amount,
        paymentMethod: payment.paymentMethod || 'BANK_TRANSFER',
        transactionRef: payment.transactionRef || 'N/A',
        paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
        status: payment.status || 'VERIFIED',
        notes: payment.notes || '',
        createdAt: now,
        updatedAt: now,
      };
      payments.unshift(newPay);
      data.payments = payments;
      saveData(data);
      return newPay;
    }
  },
  deletePayment(id: string): boolean {
    const data = ensureDataFile();
    const payments = data.payments || INITIAL_PAYMENTS;
    const filtered = payments.filter((p) => p.id !== id);
    if (filtered.length !== payments.length) {
      data.payments = filtered;
      saveData(data);
      return true;
    }
    return false;
  },

  // Media
  getMedia(): MediaAsset[] {
    const data = ensureDataFile();
    return data.media || INITIAL_MEDIA;
  },
  saveMedia(asset: Partial<MediaAsset> & { title: string; url: string }): MediaAsset {
    const data = ensureDataFile();
    const media = data.media || INITIAL_MEDIA;
    const index = asset.id ? media.findIndex((m) => m.id === asset.id) : -1;

    if (index >= 0) {
      const updated: MediaAsset = {
        ...media[index],
        ...asset,
      };
      media[index] = updated;
      data.media = media;
      saveData(data);
      return updated;
    } else {
      const newMedia: MediaAsset = {
        id: 'med-' + Date.now(),
        title: asset.title,
        url: asset.url,
        category: asset.category || 'PRODUCTS',
        fileSize: asset.fileSize || '1.0 MB',
        dimensions: asset.dimensions || '1920x1080',
        altText: asset.altText || asset.title,
        createdAt: new Date().toISOString(),
      };
      media.unshift(newMedia);
      data.media = media;
      saveData(data);
      return newMedia;
    }
  },
  deleteMedia(id: string): boolean {
    const data = ensureDataFile();
    const media = data.media || INITIAL_MEDIA;
    const filtered = media.filter((m) => m.id !== id);
    if (filtered.length !== media.length) {
      data.media = filtered;
      saveData(data);
      return true;
    }
    return false;
  },

  // Clients
  getClients(onlyActive = false): Client[] {
    const data = ensureDataFile();
    const clients = data.clients || INITIAL_CLIENTS;
    const list = onlyActive ? clients.filter((c) => c.isActive) : clients;
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  getClientById(id: string): Client | undefined {
    const data = ensureDataFile();
    const clients = data.clients || INITIAL_CLIENTS;
    return clients.find((c) => c.id === id);
  },

  saveClient(clientData: Partial<Client> & { name: string; logoUrl: string }): Client {
    const data = ensureDataFile();
    const clients = data.clients || INITIAL_CLIENTS;
    const now = new Date().toISOString();
    const index = clientData.id ? clients.findIndex((c) => c.id === clientData.id) : -1;

    if (index >= 0) {
      const updated: Client = {
        ...clients[index],
        ...clientData,
        updatedAt: now,
      };
      clients[index] = updated;
      data.clients = clients;
      saveData(data);
      return updated;
    } else {
      const maxOrder = clients.reduce((max, c) => (c.displayOrder > max ? c.displayOrder : max), 0);
      const newClient: Client = {
        id: 'client-' + Date.now(),
        name: clientData.name,
        logoUrl: clientData.logoUrl,
        websiteUrl: clientData.websiteUrl || '',
        displayOrder: clientData.displayOrder !== undefined ? clientData.displayOrder : maxOrder + 1,
        isActive: clientData.isActive !== undefined ? clientData.isActive : true,
        createdAt: now,
        updatedAt: now,
      };
      clients.push(newClient);
      data.clients = clients;
      saveData(data);
      return newClient;
    }
  },

  deleteClient(id: string): boolean {
    const data = ensureDataFile();
    const clients = data.clients || INITIAL_CLIENTS;
    const filtered = clients.filter((c) => c.id !== id);
    if (filtered.length !== clients.length) {
      data.clients = filtered;
      saveData(data);
      return true;
    }
    return false;
  },

  reorderClients(orders: { id: string; displayOrder: number }[]): boolean {
    const data = ensureDataFile();
    const clients = data.clients || INITIAL_CLIENTS;
    const orderMap = new Map(orders.map((o) => [o.id, o.displayOrder]));

    clients.forEach((c) => {
      if (orderMap.has(c.id)) {
        c.displayOrder = orderMap.get(c.id)!;
        c.updatedAt = new Date().toISOString();
      }
    });

    data.clients = clients;
    saveData(data);
    return true;
  },

  // Factory Gallery (12 Departments)
  getFactoryGallery(department?: string, onlyActive = false): FactoryGalleryItem[] {
    const data = ensureDataFile();
    const items = data.settings?.factoryGallery || INITIAL_FACTORY_GALLERY;
    let list = items;
    if (onlyActive) {
      list = list.filter((item) => item.isActive);
    }
    if (department && department !== 'ALL') {
      list = list.filter((item) => item.department.toLowerCase() === department.toLowerCase());
    }
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  saveFactoryGalleryItem(itemData: Partial<FactoryGalleryItem> & { imageUrl: string; department: FactoryDepartment; caption: string }): FactoryGalleryItem {
    const data = ensureDataFile();
    const settings = data.settings || INITIAL_SETTINGS;
    const gallery = settings.factoryGallery || INITIAL_FACTORY_GALLERY;
    const now = new Date().toISOString();
    const index = itemData.id ? gallery.findIndex((g) => g.id === itemData.id) : -1;

    if (index >= 0) {
      const updated: FactoryGalleryItem = {
        ...gallery[index],
        ...itemData,
        updatedAt: now,
      };
      gallery[index] = updated;
      settings.factoryGallery = gallery;
      data.settings = settings;
      saveData(data);
      return updated;
    } else {
      const maxOrder = gallery.reduce((max, g) => (g.displayOrder > max ? g.displayOrder : max), 0);
      const newItem: FactoryGalleryItem = {
        id: 'fac-' + Date.now(),
        imageUrl: itemData.imageUrl,
        caption: itemData.caption,
        department: itemData.department,
        altText: itemData.altText || itemData.caption,
        displayOrder: itemData.displayOrder !== undefined ? itemData.displayOrder : maxOrder + 1,
        isActive: itemData.isActive !== undefined ? itemData.isActive : true,
        createdAt: now,
        updatedAt: now,
      };
      gallery.push(newItem);
      settings.factoryGallery = gallery;
      data.settings = settings;
      saveData(data);
      return newItem;
    }
  },

  deleteFactoryGalleryItem(id: string): boolean {
    const data = ensureDataFile();
    const settings = data.settings || INITIAL_SETTINGS;
    const gallery = settings.factoryGallery || INITIAL_FACTORY_GALLERY;
    const filtered = gallery.filter((g) => g.id !== id);
    if (filtered.length !== gallery.length) {
      settings.factoryGallery = filtered;
      data.settings = settings;
      saveData(data);
      return true;
    }
    return false;
  },

  // Certifications
  getCertifications(onlyActive = false): Certification[] {
    const data = ensureDataFile();
    const certs = data.settings?.certifications || INITIAL_CERTIFICATIONS;
    const list = onlyActive ? certs.filter((c) => c.isActive) : certs;
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  saveCertification(certData: Partial<Certification> & { name: string; issuingOrganization: string; certificateNumber: string; expiryDate: string }): Certification {
    const data = ensureDataFile();
    const settings = data.settings || INITIAL_SETTINGS;
    const certs = settings.certifications || INITIAL_CERTIFICATIONS;
    const now = new Date().toISOString();
    const index = certData.id ? certs.findIndex((c) => c.id === certData.id) : -1;

    if (index >= 0) {
      const updated: Certification = {
        ...certs[index],
        ...certData,
        updatedAt: now,
      };
      certs[index] = updated;
      settings.certifications = certs;
      data.settings = settings;
      saveData(data);
      return updated;
    } else {
      const maxOrder = certs.reduce((max, c) => (c.displayOrder > max ? c.displayOrder : max), 0);
      const newCert: Certification = {
        id: 'cert-' + Date.now(),
        name: certData.name,
        issuingOrganization: certData.issuingOrganization,
        certificateNumber: certData.certificateNumber,
        issueDate: certData.issueDate || now.split('T')[0],
        expiryDate: certData.expiryDate,
        imageUrl: certData.imageUrl || '',
        pdfUrl: certData.pdfUrl || '',
        description: certData.description || '',
        displayOrder: certData.displayOrder !== undefined ? certData.displayOrder : maxOrder + 1,
        isActive: certData.isActive !== undefined ? certData.isActive : true,
        createdAt: now,
        updatedAt: now,
      };
      certs.push(newCert);
      settings.certifications = certs;
      data.settings = settings;
      saveData(data);
      return newCert;
    }
  },

  deleteCertification(id: string): boolean {
    const data = ensureDataFile();
    const settings = data.settings || INITIAL_SETTINGS;
    const certs = settings.certifications || INITIAL_CERTIFICATIONS;
    const filtered = certs.filter((c) => c.id !== id);
    if (filtered.length !== certs.length) {
      settings.certifications = filtered;
      data.settings = settings;
      saveData(data);
      return true;
    }
    return false;
  },

  // Admin Users Management
  getAdminUsers(): AdminUser[] {
    const data = ensureDataFile();
    return (data.users || INITIAL_USERS).map((u) => ({
      ...u,
      // Never leak passwordHash or salt in general listings
      passwordHash: '[PROTECTED]',
      salt: '[PROTECTED]',
    }));
  },

  getAdminUserById(id: string): AdminUser | undefined {
    const data = ensureDataFile();
    return (data.users || INITIAL_USERS).find((u) => u.id === id);
  },

  getAdminUserByEmail(email: string): AdminUser | undefined {
    const data = ensureDataFile();
    const normalized = email.toLowerCase().trim();
    return (data.users || INITIAL_USERS).find((u) => u.email.toLowerCase().trim() === normalized);
  },

  saveAdminUser(userData: Partial<AdminUser> & { email: string; name: string; role: AdminUser['role'] }): AdminUser {
    const data = ensureDataFile();
    if (!data.users) data.users = [...INITIAL_USERS];
    const now = new Date().toISOString();
    const existingIndex = userData.id ? data.users.findIndex((u) => u.id === userData.id) : -1;

    if (existingIndex >= 0) {
      const existing = data.users[existingIndex];
      const updated: AdminUser = {
        ...existing,
        ...userData,
        passwordHash: userData.passwordHash || existing.passwordHash,
        salt: userData.salt || existing.salt,
        updatedAt: now,
      };
      data.users[existingIndex] = updated;
      saveData(data);
      return { ...updated, passwordHash: '[PROTECTED]', salt: '[PROTECTED]' };
    } else {
      const salt = userData.salt || crypto.randomBytes(16).toString('hex');
      const hash = userData.passwordHash || crypto.pbkdf2Sync('admin123', salt, 100000, 64, 'sha512').toString('hex');
      const newUser: AdminUser = {
        id: 'user-' + Date.now(),
        name: userData.name,
        email: userData.email.toLowerCase().trim(),
        passwordHash: hash,
        salt: salt,
        role: userData.role,
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        createdAt: now,
        updatedAt: now,
      };
      data.users.push(newUser);
      saveData(data);
      return { ...newUser, passwordHash: '[PROTECTED]', salt: '[PROTECTED]' };
    }
  },

  updateAdminPassword(userId: string, newHash: string, newSalt: string): boolean {
    const data = ensureDataFile();
    if (!data.users) data.users = [...INITIAL_USERS];
    const userIndex = data.users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      data.users[userIndex].passwordHash = newHash;
      data.users[userIndex].salt = newSalt;
      data.users[userIndex].updatedAt = new Date().toISOString();
      saveData(data);
      return true;
    }
    return false;
  },

  deleteAdminUser(id: string): boolean {
    const data = ensureDataFile();
    if (!data.users) data.users = [...INITIAL_USERS];
    const userToDelete = data.users.find((u) => u.id === id);
    if (!userToDelete) return false;
    // Protect the primary super admin from deletion
    if (userToDelete.email === 'admin@ltsbags.com') return false;

    const lenBefore = data.users.length;
    data.users = data.users.filter((u) => u.id !== id);
    if (data.users.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Sessions
  createSession(session: AdminSession): AdminSession {
    const data = ensureDataFile();
    if (!data.sessions) data.sessions = [];
    // Keep sessions array clean (max 500)
    if (data.sessions.length > 500) {
      const now = Date.now();
      data.sessions = data.sessions.filter((s) => new Date(s.expiresAt).getTime() > now);
    }
    data.sessions.push(session);
    saveData(data);
    return session;
  },

  getSessionByToken(token: string): AdminSession | undefined {
    const data = ensureDataFile();
    if (!data.sessions) return undefined;
    return data.sessions.find((s) => s.token === token);
  },

  deleteSession(token: string): boolean {
    const data = ensureDataFile();
    if (!data.sessions) return false;
    const lenBefore = data.sessions.length;
    data.sessions = data.sessions.filter((s) => s.token !== token);
    if (data.sessions.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Audit Logs
  createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const data = ensureDataFile();
    if (!data.auditLogs) data.auditLogs = [];
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      ...log,
      createdAt: new Date().toISOString(),
    };
    data.auditLogs.unshift(newLog);
    // Keep max 2,000 logs
    if (data.auditLogs.length > 2000) {
      data.auditLogs = data.auditLogs.slice(0, 2000);
    }
    saveData(data);
    return newLog;
  },

  getAuditLogs(limit = 100, action?: string, resource?: string): AuditLog[] {
    const data = ensureDataFile();
    let logs = data.auditLogs || [];
    if (action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (resource) {
      logs = logs.filter((l) => l.resource.toLowerCase().includes(resource.toLowerCase()));
    }
    return logs.slice(0, limit);
  },

  // FAQs
  getFaqs(onlyActive = false): FaqItem[] {
    const data = ensureDataFile();
    const faqs = data.faqs || INITIAL_FAQS;
    const list = onlyActive ? faqs.filter((f) => f.isActive) : faqs;
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  getFaqById(id: string): FaqItem | undefined {
    const data = ensureDataFile();
    return (data.faqs || INITIAL_FAQS).find((f) => f.id === id);
  },

  saveFaq(faqData: Partial<FaqItem> & { question: string; answer: string }): FaqItem {
    const data = ensureDataFile();
    if (!data.faqs) data.faqs = [...INITIAL_FAQS];
    const now = new Date().toISOString();
    const index = faqData.id ? data.faqs.findIndex((f) => f.id === faqData.id) : -1;

    if (index >= 0) {
      const updated: FaqItem = {
        ...data.faqs[index],
        ...faqData,
        updatedAt: now,
      };
      data.faqs[index] = updated;
      saveData(data);
      return updated;
    } else {
      const maxOrder = data.faqs.reduce((max, f) => (f.displayOrder > max ? f.displayOrder : max), 0);
      const newFaq: FaqItem = {
        id: 'faq-' + Date.now(),
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category || 'General',
        displayOrder: faqData.displayOrder !== undefined ? faqData.displayOrder : maxOrder + 1,
        isActive: faqData.isActive !== undefined ? faqData.isActive : true,
        createdAt: now,
        updatedAt: now,
      };
      data.faqs.push(newFaq);
      saveData(data);
      return newFaq;
    }
  },

  deleteFaq(id: string): boolean {
    const data = ensureDataFile();
    if (!data.faqs) data.faqs = [...INITIAL_FAQS];
    const lenBefore = data.faqs.length;
    data.faqs = data.faqs.filter((f) => f.id !== id);
    if (data.faqs.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Testimonials
  getTestimonials(onlyPublished = false): TestimonialItem[] {
    const data = ensureDataFile();
    const testimonials = data.testimonials || INITIAL_TESTIMONIALS;
    const list = onlyPublished 
      ? testimonials.filter((t) => t.publishStatus !== 'DRAFT' && t.isActive !== false) 
      : testimonials;
    return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  getTestimonialById(id: string): TestimonialItem | undefined {
    const data = ensureDataFile();
    return (data.testimonials || INITIAL_TESTIMONIALS).find((t) => t.id === id);
  },

  saveTestimonial(tData: Partial<TestimonialItem> & { name: string; company: string; content?: string; review?: string }): TestimonialItem {
    const data = ensureDataFile();
    if (!data.testimonials) data.testimonials = [...INITIAL_TESTIMONIALS];
    const now = new Date().toISOString();
    const index = tData.id ? data.testimonials.findIndex((t) => t.id === tData.id) : -1;
    const reviewText = tData.content || tData.review || '';

    if (index >= 0) {
      const updated: TestimonialItem = {
        ...data.testimonials[index],
        ...tData,
        content: reviewText,
        review: reviewText,
        updatedAt: now,
      };
      data.testimonials[index] = updated;
      saveData(data);
      return updated;
    } else {
      const maxOrder = data.testimonials.reduce((max, t) => ((t.displayOrder || 0) > max ? (t.displayOrder || 0) : max), 0);
      const newTest: TestimonialItem = {
        id: 'test-' + Date.now(),
        name: tData.name,
        role: tData.role || 'Procurement Specialist',
        company: tData.company,
        content: reviewText,
        review: reviewText,
        rating: tData.rating || 5,
        avatarUrl: tData.avatarUrl || tData.photoUrl || '',
        photoUrl: tData.photoUrl || tData.avatarUrl || '',
        source: tData.source || 'Verified Customer',
        verificationStatus: tData.verificationStatus || 'VERIFIED',
        publishStatus: tData.publishStatus || 'PUBLISHED',
        displayOrder: tData.displayOrder !== undefined ? tData.displayOrder : maxOrder + 1,
        isActive: tData.isActive !== undefined ? tData.isActive : true,
        createdAt: now,
        updatedAt: now,
      };
      data.testimonials.push(newTest);
      saveData(data);
      return newTest;
    }
  },

  deleteTestimonial(id: string): boolean {
    const data = ensureDataFile();
    if (!data.testimonials) data.testimonials = [...INITIAL_TESTIMONIALS];
    const lenBefore = data.testimonials.length;
    data.testimonials = data.testimonials.filter((t) => t.id !== id);
    if (data.testimonials.length !== lenBefore) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Navigation Menus
  getNavigation(): NavigationMenuConfig {
    const data = ensureDataFile();
    return data.navigation || INITIAL_NAVIGATION;
  },

  saveNavigation(navConfig: NavigationMenuConfig): NavigationMenuConfig {
    const data = ensureDataFile();
    data.navigation = {
      ...navConfig,
      updatedAt: new Date().toISOString(),
    };
    saveData(data);
    return data.navigation;
  },

  // Product Advanced Actions
  duplicateProduct(id: string): Product | undefined {
    const data = ensureDataFile();
    const source = data.products.find((p) => p.id === id);
    if (!source) return undefined;

    const now = new Date().toISOString();
    const newId = 'prod-' + Date.now();
    const newSlug = `${source.slug}-copy-${Math.random().toString(36).substring(2, 6)}`;
    const duplicate: Product = {
      ...source,
      id: newId,
      name: `${source.name} (Copy)`,
      slug: newSlug,
      status: 'DRAFT',
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
    };

    data.products.push(duplicate);
    saveData(data);
    return duplicate;
  },

  duplicateBlog(id: string): Blog | undefined {
    const data = ensureDataFile();
    const source = data.blogs.find((b) => b.id === id);
    if (!source) return undefined;

    const now = new Date().toISOString();
    const newId = 'blog-' + Date.now();
    const newSlug = `${source.slug}-copy-${Math.random().toString(36).substring(2, 6)}`;
    const duplicate: Blog = {
      ...source,
      id: newId,
      title: `${source.title} (Draft Copy)`,
      slug: newSlug,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };

    data.blogs.push(duplicate);
    saveData(data);
    return duplicate;
  },

  // Backup & Snapshot
  createBackupSnapshot(): { timestamp: string; data: DatabaseSchema } {
    const data = ensureDataFile();
    // Strip sensitive passwords from backup export
    const safeData: DatabaseSchema = {
      ...data,
      users: (data.users || []).map((u) => ({ ...u, passwordHash: '[REDACTED]', salt: '[REDACTED]' })),
      sessions: [],
    };
    return {
      timestamp: new Date().toISOString(),
      data: safeData,
    };
  },

  restoreFromBackup(backupJson: DatabaseSchema): boolean {
    try {
      const current = ensureDataFile();
      const merged: DatabaseSchema = {
        ...current,
        categories: backupJson.categories || current.categories,
        products: backupJson.products || current.products,
        blogs: backupJson.blogs || current.blogs,
        enquiries: backupJson.enquiries || current.enquiries,
        settings: backupJson.settings || current.settings,
        slides: backupJson.slides || current.slides,
        quotations: backupJson.quotations || current.quotations,
        payments: backupJson.payments || current.payments,
        media: backupJson.media || current.media,
        faqs: backupJson.faqs || current.faqs,
        testimonials: backupJson.testimonials || current.testimonials,
        navigation: backupJson.navigation || current.navigation,
        // preserve current active users and sessions to avoid admin lockout
        users: current.users,
        sessions: current.sessions,
        auditLogs: current.auditLogs,
      };
      saveData(merged);
      return true;
    } catch (err) {
      console.error('Failed to restore backup:', err);
      return false;
    }
  },
};

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Infosys Limited',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.infosys.com',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-2',
    name: 'Tata Consultancy Services (TCS)',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.tcs.com',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-3',
    name: 'Wipro Technologies',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.wipro.com',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-4',
    name: 'Reliance Industries Limited',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.ril.com',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-5',
    name: 'HDFC Bank Limited',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.hdfcbank.com',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-6',
    name: 'Mahindra & Mahindra',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.mahindra.com',
    displayOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Language & Translation Database Helper Methods
export function getLanguageSettings(): LanguageSettings {
  const db = ensureDataFile();
  if (!db.languageSettings) {
    db.languageSettings = {
      languages: INITIAL_LANGUAGES,
      defaultLanguage: 'en',
      uiTranslations: INITIAL_TRANSLATIONS_MAP,
    };
    saveData(db);
  }
  return db.languageSettings;
}

export function updateLanguageSettings(settings: Partial<LanguageSettings>): LanguageSettings {
  const db = ensureDataFile();
  const current = getLanguageSettings();
  db.languageSettings = {
    ...current,
    ...settings,
  };
  saveData(db);
  return db.languageSettings;
}

export function saveUiTranslation(langCode: string, key: string, value: string): void {
  const db = ensureDataFile();
  const current = getLanguageSettings();
  const lang = langCode.toLowerCase();
  
  if (!current.uiTranslations) {
    current.uiTranslations = { ...INITIAL_TRANSLATIONS_MAP };
  }
  if (!current.uiTranslations[lang]) {
    current.uiTranslations[lang] = {};
  }
  
  current.uiTranslations[lang][key] = value;
  db.languageSettings = current;
  saveData(db);
}

export function saveBatchUiTranslations(langCode: string, translations: Record<string, string>): void {
  const db = ensureDataFile();
  const current = getLanguageSettings();
  const lang = langCode.toLowerCase();

  if (!current.uiTranslations) {
    current.uiTranslations = { ...INITIAL_TRANSLATIONS_MAP };
  }
  if (!current.uiTranslations[lang]) {
    current.uiTranslations[lang] = {};
  }

  current.uiTranslations[lang] = {
    ...current.uiTranslations[lang],
    ...translations,
  };

  db.languageSettings = current;
  saveData(db);
}

export function getEntityTranslations(entityType?: string, entityId?: string, langCode?: string): EntityTranslation[] {
  const db = ensureDataFile();
  let list = db.entityTranslations || [];

  if (entityType) {
    list = list.filter((t) => t.entityType === entityType);
  }
  if (entityId) {
    list = list.filter((t) => t.entityId === entityId);
  }
  if (langCode) {
    list = list.filter((t) => t.langCode.toLowerCase() === langCode.toLowerCase());
  }

  return list;
}

export function getEntityTranslation(entityType: 'product' | 'category' | 'blog' | 'slide', entityId: string, langCode: string): EntityTranslation | undefined {
  const db = ensureDataFile();
  const list = db.entityTranslations || [];
  return list.find(
    (t) =>
      t.entityType === entityType &&
      t.entityId === entityId &&
      t.langCode.toLowerCase() === langCode.toLowerCase()
  );
}

export function saveEntityTranslation(translation: Partial<EntityTranslation> & { entityType: 'product' | 'category' | 'blog' | 'slide'; entityId: string; langCode: string }): EntityTranslation {
  const db = ensureDataFile();
  if (!db.entityTranslations) {
    db.entityTranslations = [];
  }

  const existingIndex = db.entityTranslations.findIndex(
    (t) =>
      t.entityType === translation.entityType &&
      t.entityId === translation.entityId &&
      t.langCode.toLowerCase() === translation.langCode.toLowerCase()
  );

  const updated: EntityTranslation = {
    id: existingIndex >= 0 ? db.entityTranslations[existingIndex].id : `trans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    entityType: translation.entityType,
    entityId: translation.entityId,
    langCode: translation.langCode.toLowerCase(),
    title: translation.title,
    name: translation.name,
    shortDesc: translation.shortDesc,
    fullDesc: translation.fullDesc,
    content: translation.content,
    excerpt: translation.excerpt,
    materials: translation.materials,
    metaTitle: translation.metaTitle,
    metaDescription: translation.metaDescription,
    metaKeywords: translation.metaKeywords,
    slug: translation.slug,
    specifications: translation.specifications,
    features: translation.features,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    db.entityTranslations[existingIndex] = updated;
  } else {
    db.entityTranslations.push(updated);
  }

  saveData(db);
  return updated;
}

export function getTranslatedProduct(product: Product, langCode: string): Product {
  if (!langCode || langCode.toLowerCase() === 'en') return product;
  const trans = getEntityTranslation('product', product.id, langCode);
  if (!trans) return product;

  return {
    ...product,
    name: trans.name || trans.title || product.name,
    shortDesc: trans.shortDesc || product.shortDesc,
    fullDesc: trans.fullDesc || product.fullDesc,
    materials: trans.materials || product.materials,
    metaTitle: trans.metaTitle || product.metaTitle,
    metaDescription: trans.metaDescription || product.metaDescription,
    metaKeywords: trans.metaKeywords || product.metaKeywords,
    slug: trans.slug || product.slug,
    specifications: trans.specifications && trans.specifications.length > 0 ? trans.specifications : product.specifications,
    features: trans.features && trans.features.length > 0 ? trans.features : product.features,
  };
}

export function getTranslatedCategory(category: Category, langCode: string): Category {
  if (!langCode || langCode.toLowerCase() === 'en') return category;
  const trans = getEntityTranslation('category', category.id, langCode);
  if (!trans) return category;

  return {
    ...category,
    name: trans.name || trans.title || category.name,
    description: trans.shortDesc || trans.fullDesc || category.description,
    metaTitle: trans.metaTitle || category.metaTitle,
    metaDescription: trans.metaDescription || category.metaDescription,
    metaKeywords: trans.metaKeywords || category.metaKeywords,
    slug: trans.slug || category.slug,
  };
}

export function getTranslatedBlog(blog: Blog, langCode: string): Blog {
  if (!langCode || langCode.toLowerCase() === 'en') return blog;
  const trans = getEntityTranslation('blog', blog.id, langCode);
  if (!trans) return blog;

  return {
    ...blog,
    title: trans.title || trans.name || blog.title,
    excerpt: trans.excerpt || trans.shortDesc || blog.excerpt,
    content: trans.content || trans.fullDesc || blog.content,
    metaTitle: trans.metaTitle || blog.metaTitle,
    metaDescription: trans.metaDescription || blog.metaDescription,
    metaKeywords: trans.metaKeywords || blog.metaKeywords,
    slug: trans.slug || blog.slug,
  };
}

