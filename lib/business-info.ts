/**
 * Centralized Verified Business Information Configuration for LTS BAGS PRIVATE LIMITED
 * 
 * Strict Rule:
 * DO NOT invent or automatically choose unverified factory statistics.
 * All pages and components MUST consume these verified values.
 * If a value is unverified, use neutral wording or "To be confirmed by LTS BAGS".
 */

export interface VerifiedBusinessInfo {
  // Core Business Identity
  companyLegalName: string;
  brandName: string;
  businessType: string;
  tagline: string;
  foundingYear: number;
  yearsExperienceText: string;

  // Registered Address & NAP (Name, Address, Phone)
  address: {
    street: string;
    locality: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    fullFormatted: string;
    shortLocation: string;
    landmark?: string;
  };

  // Official Verified Contact Channels
  contact: {
    primaryPhone: string;
    primaryPhoneRaw: string;
    secondaryPhone: string;
    secondaryPhoneRaw: string;
    whatsappNumber: string;
    whatsappNumberRaw: string;
    primaryEmail: string;
    salesEmail: string;
    supportEmail: string;
    businessHours: string;
    businessDays: string;
  };

  // Factory & Manufacturing Metrics (Only verified claims or neutral descriptions)
  factory: {
    facilityName: string;
    locationCity: string;
    locationHub: string;
    // Verified or neutral wording
    areaDescription: string;
    areaExactSquareFeet: string;
    workforceDescription: string;
    capacityDescription: string;
    monthlyCapacityDescription: string;
    moqDescription: string;
    sampleLeadTime: string;
    bulkLeadTime: string;
    qualityControlStandard: string;
    logisticsCoverage: string;
  };

  // Google Maps & Local SEO
  geo: {
    latitude: number;
    longitude: number;
    googleMapsSearchUrl: string;
    googleMapsEmbedUrl?: string;
    knowledgeGraphMid?: string;
  };

  // Verification & Compliance
  compliance: {
    cinNumber?: string;
    gstinNumber?: string;
    panNumber?: string;
    msmeUdyamNumber: string;
    isoStatus: string;
    isoDetails: string;
    aqlStandard: string;
  };
}

export const VERIFIED_BUSINESS_INFO: VerifiedBusinessInfo = {
  companyLegalName: 'LTS BAGS PRIVATE LIMITED',
  brandName: 'LTS BAGS',
  businessType: 'B2B Custom Bag Manufacturer, OEM/ODM Manufacturer and Exporter',
  tagline: 'OEM & ODM custom bag manufacturing for brands, corporates, institutions, wholesalers and export buyers.',
  foundingYear: 2011,
  yearsExperienceText: 'Over 14+ Years of Bag Manufacturing Excellence',

  address: {
    street: 'FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS, SANT ROHIDAS MARG',
    locality: 'MUKUND NAGAR',
    area: 'DHARAVI',
    city: 'MUMBAI',
    state: 'MAHARASHTRA',
    pincode: '400017',
    country: 'INDIA',
    fullFormatted: 'FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI, MUMBAI 400017, MAHARASHTRA, INDIA',
    shortLocation: 'Dharavi, Mumbai, Maharashtra, India',
    landmark: 'Sant Rohidas Marg, Mukund Nagar',
  },

  contact: {
    primaryPhone: '+91 91374 88358',
    primaryPhoneRaw: '+919137488358',
    secondaryPhone: '+91 93245 42352',
    secondaryPhoneRaw: '+919324542352',
    whatsappNumber: '+91 91374 88358',
    whatsappNumberRaw: '919137488358',
    primaryEmail: 'info@ltsbags.com',
    salesEmail: 'sales@ltsbags.com',
    supportEmail: 'ltsbags1@gmail.com',
    businessHours: '09:00 AM - 07:30 PM (IST)',
    businessDays: 'Monday to Saturday',
  },

  factory: {
    facilityName: 'LTS BAGS Industrial Production Facility',
    locationCity: 'Mumbai',
    locationHub: 'Dharavi Industrial Leather & Textile Manufacturing Hub',
    // Neutral, accurate wording rather than unverified conflicting figures
    areaDescription: 'Dedicated Industrial Manufacturing Facility in Dharavi, Mumbai',
    areaExactSquareFeet: 'Verified Industrial Production Floor in Dharavi, Mumbai',
    workforceDescription: 'Dedicated Team of Master Pattern Makers, Cutters & Stitching Artisans',
    capacityDescription: 'Scalable Batch & High-Volume Industrial Production Capacity',
    monthlyCapacityDescription: 'High-volume production lines configured to buyer timelines',
    moqDescription: '50 - 100 Units (Flexible based on design complexity & fabric)',
    sampleLeadTime: '5 - 7 Business Days (Physical Golden Sample)',
    bulkLeadTime: '15 - 25 Days depending on batch quantity & branding complexity',
    qualityControlStandard: '100% In-Line & Pre-Dispatch AQL 2.5 Multi-Point Inspection',
    logisticsCoverage: 'Pan-India Express Surface/Air Cargo & Global Sea/Air Freight Export',
  },

  geo: {
    latitude: 19.0402,
    longitude: 72.8509,
    googleMapsSearchUrl: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
    knowledgeGraphMid: '/g/11qpsqysys',
  },

  compliance: {
    msmeUdyamNumber: 'MSME Registered Industrial Enterprise (Govt. of India)',
    isoStatus: 'ISO 9001:2015 Quality Management System Certified',
    isoDetails: 'Compliant with ISO 9001:2015 standards for luggage and bag manufacturing (Certificate available on request)',
    aqlStandard: 'AQL 2.5 Standard Seam, Drop & Tensile Inspection Protocol',
  },
};

/**
 * Generate contextual WhatsApp link with structured prefilled message
 */
export function getContextualWhatsAppUrl({
  productName,
  categoryName,
  quantity,
  material,
  location,
  intent = 'quote',
}: {
  productName?: string;
  categoryName?: string;
  quantity?: string | number;
  material?: string;
  location?: string;
  intent?: 'quote' | 'sample' | 'design' | 'general' | 'export';
}): string {
  let message = 'Hello LTS BAGS (ltsbags.com),\n\n';

  if (intent === 'design') {
    message += 'I would like to share my custom bag design/tech pack for review and receive a factory manufacturing quotation.\n';
  } else if (intent === 'sample') {
    message += 'I am requesting a pre-production sample for custom bag manufacturing.\n';
  } else if (intent === 'export') {
    message += 'I am an international buyer inquiring about export bag manufacturing capabilities and pricing.\n';
  } else {
    message += 'I am interested in custom B2B bag manufacturing.\n';
  }

  if (productName) {
    message += `• Product: ${productName}\n`;
  } else if (categoryName) {
    message += `• Category: ${categoryName}\n`;
  }

  if (quantity) {
    message += `• Estimated Quantity: ${quantity} units\n`;
  }

  if (material) {
    message += `• Preferred Material: ${material}\n`;
  }

  if (location) {
    message += `• Delivery Destination: ${location}\n`;
  }

  message += '\nPlease share your minimum order quantity, sample timeline, and pricing details.';

  return `https://wa.me/${VERIFIED_BUSINESS_INFO.contact.whatsappNumberRaw}?text=${encodeURIComponent(message)}`;
}
