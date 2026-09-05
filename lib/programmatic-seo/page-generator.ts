import { SeoPage, PageType } from './types';
import { getSeoProduct } from './data/products';
import { getSeoLocation } from './data/locations';
import { getSeoIndustry } from './data/industries';
import { getSeoMaterial } from './data/materials';
import { getSeoApplication } from './data/applications';
import { evaluatePageQuality } from './quality-gate';

export interface GeneratePageOptions {
  page_type: PageType;
  product_id?: string;
  location_id?: string;
  industry_id?: string;
  material_id?: string;
  application_id?: string;
  custom_slug?: string;
  status?: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED';
}

export function generateProgrammaticPage(
  options: GeneratePageOptions,
  existingPages: SeoPage[] = []
): SeoPage {
  const { page_type, product_id, location_id, industry_id, material_id, application_id } = options;

  const product = product_id ? getSeoProduct(product_id) : undefined;
  const location = location_id ? getSeoLocation(location_id) : undefined;
  const industry = industry_id ? getSeoIndustry(industry_id) : undefined;
  const material = material_id ? getSeoMaterial(material_id) : undefined;
  const application = application_id ? getSeoApplication(application_id) : undefined;

  let slug = options.custom_slug || '';
  let h1 = '';
  let seo_title = '';
  let meta_description = '';
  let intro_content: string[] = [];
  let product_overview = '';
  let manufacturing_content = '';
  let customization_content = '';
  let applications_content = '';
  let location_content = '';
  let industry_content = '';
  let cta_text = 'Request Factory Direct Quote';
  let schema_type: SeoPage['schema_type'] = 'Product';

  // 1. PRODUCT + LOCATION
  if (page_type === 'product_location' && product && location) {
    const isMumbai = location.is_factory_hq;
    slug = slug || `${product.id === 'backpacks' ? 'custom-backpack' : product.id}-manufacturer-${location.slug}`;
    
    if (isMumbai) {
      h1 = `${product.name} Manufacturer in Mumbai`;
      seo_title = `${product.name} Manufacturer in Mumbai | Factory Direct | LTS BAGS`;
      meta_description = `Leading ${product.name.toLowerCase()} manufacturer in Mumbai. We produce high-durability custom ${product.name.toLowerCase()}s at our Dharavi plant with low MOQ & fast sampling.`;
      intro_content = [
        `Looking for a reliable ${product.name.toLowerCase()} manufacturer in Mumbai? LTS BAGS PRIVATE LIMITED manufactures high-durability, custom engineered ${product.name.toLowerCase()}s directly from our manufacturing facility in Dharavi, Mumbai.`,
        `We work closely with corporate enterprises across BKC, Lower Parel, and Nariman Point, alongside educational institutions and brand founders who demand exceptional stitching standards, direct factory wholesale pricing, and rapid local fulfillment.`,
        `Every ${product.name.toLowerCase()} is crafted under our ISO 9001:2015 certified production processes, featuring heavy-duty materials, reinforced stress points, and custom client branding.`
      ];
      location_content = `Factory & Sample Showroom: Floor-G, A341/2/3, Ganesh Sai Kripa CHS, Sant Rohidas Marg, Mukund Nagar, Dharavi, Mumbai 400017. Schedule an in-person visit or request doorstep sample delivery in Mumbai.`;
      schema_type = 'LocalBusiness';
    } else {
      h1 = `${product.name} Manufacturer Serving ${location.city}`;
      seo_title = `${product.name} Manufacturer Serving ${location.city} | LTS BAGS Factory`;
      meta_description = `Custom ${product.name.toLowerCase()} manufacturer supplying buyers in ${location.city}. Direct from our Mumbai factory with fast insured express delivery and low MOQ.`;
      intro_content = [
        `Supplying corporate procurement teams, institutions, and brand owners in ${location.city} with direct-from-factory custom ${product.name.toLowerCase()}s from our central manufacturing facility in Dharavi, Mumbai.`,
        `${location.business_relevance}`,
        `We provide buyers in ${location.city} with direct factory pricing with zero middleman commissions, physical golden samples delivered to your office in 5 to 7 days, and reliable insured door-to-door bulk logistics.`
      ];
      location_content = `Manufactured at LTS BAGS Mumbai plant. ${location.shipping_information}`;
      schema_type = 'Product';
    }

    product_overview = `${product.description} Available in customized fabric weights, corporate color schemes, and specialized pocket partitions.`;
    manufacturing_content = `In-house pattern development, automated fabric cutting, high-tension industrial stitching, bar-tacking on all load joints, and AQL 2.5 quality control.`;
    customization_content = `Select from ${product.branding_options.join(', ')}. Custom dimensions and Pantone color matching available.`;
    applications_content = product.applications.join(', ');
  }

  // 2. PRODUCT + INDUSTRY
  else if (page_type === 'product_industry' && product && industry) {
    slug = slug || `${industry.slug}-${product.slug}-manufacturer`;
    h1 = `${industry.name} ${product.name} Manufacturer in India`;
    seo_title = `${industry.name} ${product.name} Manufacturer | B2B Factory | LTS BAGS`;
    meta_description = `Custom ${product.name.toLowerCase()} manufacturer tailored for ${industry.name.toLowerCase()} in India. High-durability designs, custom branding, and direct factory pricing.`;
    intro_content = [
      `${industry.overview}`,
      `LTS BAGS PRIVATE LIMITED operates as a dedicated manufacturing partner for the ${industry.name} sector in India, producing heavy-duty custom ${product.name.toLowerCase()}s engineered to satisfy industry-specific durability standards and brand aesthetics.`,
      `From our manufacturing facility in Dharavi, Mumbai, we supply corporate organizations, brand merchandisers, and institutions nationwide with supportive MOQs starting at 50-100 units, prompt sampling, and certified AQL 2.5 quality assurance.`
    ];
    product_overview = `Customized ${product.name.toLowerCase()}s optimized for ${industry.name}. Features: ${industry.typical_customizations.join(', ')}.`;
    manufacturing_content = `Heavy-ply nylon thread stitching, reinforced anchor points, multi-stage inspection, and tested weight tolerances.`;
    customization_content = `Branding tailored for ${industry.name}: ${product.branding_options.join(', ')}.`;
    applications_content = industry.applications.join(', ');
    industry_content = `Buyer requirements: ${industry.typical_buyer_requirements.join(', ')}.`;
    schema_type = 'Product';
  }

  // 3. PRODUCT + MATERIAL
  else if (page_type === 'product_material' && product && material) {
    slug = slug || `${material.slug}-${product.slug}-manufacturer`;
    h1 = `Custom ${material.name} ${product.name} Manufacturer in India`;
    seo_title = `${material.name} ${product.name} Manufacturer | Direct Factory | LTS BAGS`;
    meta_description = `Manufacturer of custom ${material.name.toLowerCase()} ${product.name.toLowerCase()}s in India. High-durability stitching, custom printing & direct factory wholesale rates.`;
    intro_content = [
      `${material.material_characteristics}`,
      `LTS BAGS PRIVATE LIMITED specializes in manufacturing high-performance ${product.name.toLowerCase()}s using ${material.name} at our Mumbai production facility.`,
      `Whether you require rugged tear-resistant workwear gear, eco-conscious retail merchandise, or sleek executive accessories, our pattern masters craft finished bags that maximize the natural strengths of ${material.name}.`
    ];
    product_overview = `${product.name} engineered with ${material.name}. Durability: ${material.durability}`;
    manufacturing_content = `Precision cutting suited to ${material.name}, specialized needles and thread tensions, reinforced seam overlocking, and tensile testing.`;
    customization_content = `Customization options: ${material.customization_options.join(', ')}.`;
    applications_content = material.typical_bag_applications.join(', ');
    schema_type = 'Product';
  }

  // 4. PRODUCT + APPLICATION
  else if (page_type === 'product_application' && product && application) {
    slug = slug || `custom-${product.slug}-for-${application.slug}`;
    h1 = `Custom ${product.name}s for ${application.name}`;
    seo_title = `Custom ${product.name}s for ${application.name} | Direct Factory LTS BAGS`;
    meta_description = `Custom ${product.name.toLowerCase()}s manufactured specifically for ${application.name.toLowerCase()}. Direct Mumbai factory wholesale rates and low MOQ.`;
    intro_content = [
      `${application.description}`,
      `LTS BAGS PRIVATE LIMITED crafts purpose-built ${product.name.toLowerCase()}s designed to fulfill the exact functional and branding requirements of ${application.name.toLowerCase()}.`,
      `Manufactured in our Dharavi, Mumbai production facility with strict AQL 2.5 quality control, our bags ensure high perceived value, ergonomic comfort, and long-term durability.`
    ];
    product_overview = `Tailored ${product.name.toLowerCase()}s built for ${application.name}. Key features include: ${application.key_features.join(', ')}.`;
    manufacturing_content = `Double-stitched load seams, bar-tacking, impact-resistant foam padding, and moisture-sealed packaging.`;
    customization_content = `Custom branding via ${product.branding_options.join(', ')}. Individual packaging options available.`;
    applications_content = `Targeted buyers: ${application.buyer_types.join(', ')}.`;
    schema_type = 'Product';
  }

  // 5. MANUFACTURING SERVICE FALLBACK
  else {
    slug = slug || 'custom-bag-manufacturer-india';
    h1 = 'Custom Bag Manufacturer in India';
    seo_title = 'Custom Bag Manufacturer in India | OEM & Bulk Factory | LTS BAGS';
    meta_description = 'LTS BAGS is a leading custom bag manufacturer in India based in Mumbai. OEM/ODM backpacks, laptop bags, and tote bags with low MOQ & pan-India delivery.';
    intro_content = [
      'LTS BAGS PRIVATE LIMITED is a specialized custom bag manufacturer based in Dharavi, Mumbai, India.',
      'We partner with corporate brands, educational institutions, retail labels, and international exporters who require dependable bulk production, stringent quality control, and direct factory wholesale pricing.',
      'From custom pattern engineering to final container stuffing, our Mumbai workshop provides end-to-end manufacturing solutions.'
    ];
    product_overview = 'Custom backpacks, corporate briefcases, travel duffels, and natural tote bags.';
    manufacturing_content = 'In-house pattern cutting, heavy-tension industrial sewing, and AQL 2.5 inspection.';
    customization_content = 'Embroidery, debossing, screen printing, and custom hardware.';
    applications_content = 'Corporate gifting, school uniforms, retail brands, and trade fairs.';
    schema_type = 'Organization';
  }

  // Common specifications
  const specs = {
    materials: product ? product.materials : ['1680D Ballistic Nylon', '900D Polyester', 'Heavy Cotton Canvas', 'Natural Jute'],
    hardware: ['Heavy duty nylon coil zippers', 'POM ergonomic buckles', 'Zinc alloy sliders', 'Anodized D-rings'],
    branding_options: product ? product.branding_options : ['3D Embroidery', 'Debossed leatherette badge', 'Screen print', 'Metal plate engraving'],
    moq: product ? product.moq : '50 - 100 Units',
    sample_timeline: '5 - 7 Business Days',
    bulk_timeline: '15 - 25 Business Days',
    packaging: product ? product.packaging : 'Individual polybag, export 7-ply cartons',
    export_compliance: 'IEC Code, GST Compliant, Certificate of Origin, AQL 2.5 Standard'
  };

  // Generate 3-4 high-intent buyer FAQs
  const faq = [
    {
      question: `What is your minimum order quantity (MOQ) for ${h1.toLowerCase()}?`,
      answer: `Our MOQ starts at ${specs.moq}. This enables corporate procurement heads, startups, and institutions to test and launch custom designs with low inventory commitments.`
    },
    {
      question: `How fast can you craft and deliver a physical pre-production sample?`,
      answer: `We craft physical golden pre-production samples with your exact logo branding and fabric selection in 5 to 7 business days, dispatched directly to your office for tactile review before bulk production starts.`
    },
    {
      question: `Where is your manufacturing facility located?`,
      answer: `Our production plant and sample development studio are located at Floor-G, A341/2/3, Ganesh Sai Kripa CHS, Sant Rohidas Marg, Mukund Nagar, Dharavi, Mumbai 400017. Buyers are welcome to schedule in-person factory visits.`
    },
    {
      question: `Can you match our exact corporate Pantone colors and tech pack?`,
      answer: `Yes, we can produce bags strictly from your CAD drawing or tech pack, including custom Pantone dyed fabric panels, custom zipper pullers, and certified AQL 2.5 defect-free inspection.`
    }
  ];

  const now = new Date().toISOString();
  const canonical_url = `https://ltsbags.com/${slug}`;

  const generatedPage: SeoPage = {
    id: `seo-page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    page_type,
    product_id,
    location_id,
    industry_id,
    material_id,
    application_id,
    slug,
    url: canonical_url,
    h1,
    seo_title,
    meta_description,
    intro_content,
    product_overview,
    manufacturing_content,
    customization_content,
    applications_content,
    location_content: location_content || undefined,
    industry_content: industry_content || undefined,
    specifications: specs,
    faq,
    cta_text,
    featured_image: product?.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
    image_alt: `${h1} manufactured by LTS BAGS Mumbai`,
    canonical_url,
    robots_index: true,
    robots_follow: true,
    og_title: seo_title,
    og_description: meta_description,
    og_image: product?.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
    schema_type,
    status: options.status || 'DRAFT',
    quality_score: 0,
    duplicate_score: 0,
    created_at: now,
    updated_at: now,
  };

  // Run quality assessment
  const quality = evaluatePageQuality(generatedPage, existingPages);
  generatedPage.quality_score = quality.score;
  generatedPage.duplicate_score = quality.duplicate_risk === 'HIGH' ? 80 : quality.duplicate_risk === 'MEDIUM' ? 50 : 10;
  generatedPage.robots_index = quality.is_indexable;
  generatedPage.quality_flags = quality.failed_checks;

  return generatedPage;
}
