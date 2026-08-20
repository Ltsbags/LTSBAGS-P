import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import SchemaScript from '@/components/SchemaScript';
import { Category, Product } from '@/lib/types';
import { generateBreadcrumbSchema, generateFaqSchema, getBaseUrl } from '@/lib/seo';
import { 
  ShieldCheck, 
  Sparkles, 
  Package, 
  Clock, 
  Layers, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Plane,
  Building2,
  Gift
} from 'lucide-react';

interface CategoryLandingViewProps {
  category: Category;
  products: Product[];
  allCategories: Category[];
}

interface CategoryDetailMeta {
  h1: string;
  badge: string;
  leadParagraph: string;
  materials: { name: string; desc: string }[];
  applications: { title: string; desc: string; iconName: string }[];
  customizations: string[];
  dimensions: string[];
  moq: string;
  leadTime: string;
  sampleTurnaround: string;
  faqs: { question: string; answer: string }[];
}

function getCategoryDetails(slug: string, catName: string): CategoryDetailMeta {
  const s = slug.toLowerCase();
  
  if (s.includes('backpack')) {
    return {
      h1: 'Backpack Bag Manufacturer in Mumbai | Custom & Wholesale',
      badge: 'B2B Custom Backpack Manufacturing',
      leadParagraph: 'LTS BAGS PRIVATE LIMITED manufactures high-grade custom backpacks for corporate enterprises, educational institutions, retail private-labels, and event distributors. Produced in Dharavi, Mumbai with heavy-duty bar-tack stitching, ergonomic air-mesh shoulder straps, and custom brand embossing.',
      materials: [
        { name: '1680D Ballistic Nylon', desc: 'Maximum tear and abrasion resistance with a luxurious matte texture for executive backpacks.' },
        { name: '600D & 900D Honeycomb Ripstop', desc: 'Lightweight, durable, water-resistant coated polyester ideal for daily commuters.' },
        { name: '1000D Cordura Style Weave', desc: 'Heavy-duty rugged construction for extreme durability and heavy load transport.' },
        { name: 'Water-Repellent TPU Laminate', desc: 'Weatherproof exterior coating protecting electronics and papers from Mumbai monsoons.' },
      ],
      applications: [
        { title: 'Corporate Onboarding Kits', desc: 'Standard employee welcome backpacks with padded 15.6" laptop compartments and 3D embroidery.', iconName: 'Briefcase' },
        { title: 'School & University Campuses', desc: 'Multi-compartment student bags with reinforced base corners and reflective safety strips.', iconName: 'GraduationCap' },
        { title: 'Brand Retail Merchandising', desc: 'Custom OEM bags manufactured to private label specifications with custom tags and barcodes.', iconName: 'Building2' },
        { title: 'Promotional & Sports Events', desc: 'Branded giveaways for annual marathons, tech summits, and dealer conferences.', iconName: 'Gift' },
      ],
      customizations: [
        'High-density 3D Logo Embroidery',
        'Multi-color Silk Screen & Rubber Badge Printing',
        'Custom Molded Metal & Zinc Alloy Zipper Pullers',
        'Integrated USB Charging Port & Cable Routing',
        'Hidden Anti-Theft Backpack Compartments',
        'Custom Woven Brand Labels and Care Tags',
      ],
      dimensions: [
        'Standard Daypack: 42cm x 30cm x 14cm (18-22 Liters)',
        'Executive Laptop Pack: 46cm x 32cm x 18cm (25-30 Liters)',
        'Multi-Day Travel Pack: 52cm x 34cm x 22cm (35-40 Liters)',
        'Custom Dimensions engineered to your exact tech-pack',
      ],
      moq: '50 to 100 units per design variant',
      leadTime: '10 to 14 working days after sample sign-off',
      sampleTurnaround: '3 to 5 business days for physical prototype',
      faqs: [
        {
          question: 'What is the minimum order quantity (MOQ) for custom backpacks in Mumbai?',
          answer: 'Our standard MOQ starts from 50 to 100 units depending on the bag construction complexity and custom fabric specifications. We also accommodate initial sampling prototypes.'
        },
        {
          question: 'Can you manufacture custom backpacks with our corporate logo and color theme?',
          answer: 'Yes. We offer complete custom branding including 3D embroidery, silk screen printing, rubber badges, custom-colored fabric panels, and engraved metal zipper pullers.'
        },
        {
          question: 'Do you provide physical pre-production samples before mass manufacturing?',
          answer: 'Yes. We produce a physical golden sample bag for your tactile approval, ensuring material density, stitch quality, zipper action, and logo scaling match your expectations.'
        },
        {
          question: 'How do you test the stitch strength and load capacity of backpacks?',
          answer: 'Every batch undergoes multi-point quality control including seam tensile testing, zipper fatigue cycles, and 20kg load-drop tests to ensure handles and shoulder straps never rip.'
        },
      ],
    };
  }

  if (s.includes('laptop') || s.includes('office')) {
    return {
      h1: 'Laptop & Office Bag Manufacturer in Mumbai | B2B Wholesale',
      badge: 'Executive Laptop Bags & Messenger Cases',
      leadParagraph: 'LTS BAGS PRIVATE LIMITED is a dedicated manufacturer of executive laptop briefcases, messenger bags, and padded sleeves in Mumbai. Tailored for corporate gifting, IT enterprises, and business executives requiring premium device protection.',
      materials: [
        { name: '1680D Ballistic Nylon', desc: 'High-density executive weave with water-repellent backing and refined executive appearance.' },
        { name: 'Vegan PU Leatherette', desc: 'Premium grain faux leather for sophisticated corporate leadership gifting.' },
        { name: 'High-Density EVA Foam Padding', desc: 'Shock-absorbing internal cage protecting 13", 14", 15.6", and 16" laptops from drops.' },
        { name: 'Smooth Microfiber & Velvet Lining', desc: 'Scratch-free interior lining preventing scuffs on laptops and tablets.' },
      ],
      applications: [
        { title: 'IT & Corporate Employee Kits', desc: 'Sleek executive laptop bags customized with company logo for newly onboarded staff.', iconName: 'Briefcase' },
        { title: 'Executive & VIP Client Gifts', desc: 'Luxury vegan leatherette briefcases with subtle debossed logo branding.', iconName: 'Gift' },
        { title: 'Business Travel & Commutes', desc: 'Trolley pass-through sleeve straps allowing easy mounting onto roller luggage handles.', iconName: 'Plane' },
        { title: 'Conference & Delegation Kits', desc: 'Document messenger bags for annual general meetings and corporate summits.', iconName: 'Building2' },
      ],
      customizations: [
        'Debossed & Heat-Stamped Leather Patches',
        'Laser-Etched Metal Badges with Matte Finish',
        'Padded Velvet Tech Organizer Pockets',
        'Luggage Trolley Pass-Through Sleeve on Back',
        'Detachable Ergonomic Shoulder Strap with Padded Grip',
        'YKK Heavy-Duty Zippers with Custom Metal Pullers',
      ],
      dimensions: [
        'Slim 14" Laptop Sleeve: 36cm x 26cm x 3cm',
        'Executive 15.6" Briefcase: 41cm x 30cm x 9cm (Expandable to 14cm)',
        'Double-Gusset 16" Messenger: 43cm x 32cm x 13cm',
        'Custom sizing according to specific laptop & device specs',
      ],
      moq: '50 to 100 units per model',
      leadTime: '10 to 12 working days for mass production',
      sampleTurnaround: '3 to 4 business days',
      faqs: [
        {
          question: 'Can laptop bags accommodate 16-inch laptops with chargers and files?',
          answer: 'Yes, our executive briefcases feature multi-gusset compartments with dedicated padded sleeves for 14-16" laptops, charger pockets, mouse pouches, and document dividers.'
        },
        {
          question: 'What branding options look best on executive corporate laptop bags?',
          answer: 'For premium nylon and leatherette laptop bags, we recommend debossed patches, matte metal plates, or subtle tonal 3D embroidery.'
        },
        {
          question: 'Do you supply corporate laptop bags across India?',
          answer: 'Yes, we supply pan-India with express road, rail, and air dispatch to Mumbai, Pune, Bangalore, Delhi NCR, Hyderabad, Chennai, Ahmedabad, and all states.'
        },
      ],
    };
  }

  if (s.includes('school') || s.includes('college')) {
    return {
      h1: 'School & College Bag Manufacturer in Mumbai | Institutional Supply',
      badge: 'Durable Student Backpacks & School Bags',
      leadParagraph: 'Direct factory manufacturing of ergonomic school bags and college backpacks for educational institutions, academies, and coaching institutes across India. Built with heavy-duty polyester, reinforced double stitching, and custom school crest embroidery.',
      materials: [
        { name: 'Heavy 600D & 1000D Polyester', desc: 'Abrasion-resistant fabric capable of carrying heavy textbooks and stationery daily.' },
        { name: 'Waterproof PVC/PU Inner Coating', desc: 'Protects school books from water spills and rain.' },
        { name: 'Breathable Honeycomb Air Mesh', desc: 'Thick back and shoulder padding to minimize spinal fatigue for growing students.' },
        { name: 'Reinforced Rubber Base Plate', desc: 'Prevents bottom wear and tear when placed on classroom floors.' },
      ],
      applications: [
        { title: 'School Annual Uniform Kits', desc: 'Custom school crest embroidered bags distributed at academic term starts.', iconName: 'GraduationCap' },
        { title: 'College & University Merch', desc: 'Trendy multi-pocket campus backpacks with laptop sleeves and water bottle side mesh.', iconName: 'Briefcase' },
        { title: 'Coaching & Test Prep Institutes', desc: 'Uniform student backpacks featuring large front logo print and study material slots.', iconName: 'Building2' },
        { title: 'Educational CSR Initiatives', desc: 'Cost-effective, highly durable bags for NGO student distribution programs.', iconName: 'Gift' },
      ],
      customizations: [
        'School Crest Embroidery & Silk Screen Printing',
        'Custom Zipper Pullers with School Name',
        'High-Visibility Night Reflective Strips',
        'Internal Name & Roll Number Identity Tag',
        'Heavy-Duty Dual Bottle Holders & Key Leash',
      ],
      dimensions: [
        'Junior School (KG - Class 4): 36cm x 26cm x 12cm',
        'Middle / Senior School (Class 5 - 10): 44cm x 31cm x 16cm',
        'College & University: 48cm x 33cm x 20cm (3 Compartments)',
      ],
      moq: '100 units per colorway',
      leadTime: '12 to 18 working days depending on batch volume',
      sampleTurnaround: '4 business days',
      faqs: [
        {
          question: 'Can you match our exact school uniform color scheme?',
          answer: 'Yes, we source fabrics in customized school color combinations (Navy Blue, Maroon, Bottle Green, Grey, Royal Blue, Black, and multi-tone panels).'
        },
        {
          question: 'What is the durability warranty on school bag stitching?',
          answer: 'All stress points (top handle, shoulder straps, base corners) are reinforced with industrial bar-tack stitching tested for 15kg+ daily student weight.'
        },
      ],
    };
  }

  if (s.includes('corporate') || s.includes('promotional')) {
    return {
      h1: 'Corporate & Promotional Bag Manufacturer in Mumbai',
      badge: 'Custom Corporate Gifts & Promotional Merchandise',
      leadParagraph: 'LTS BAGS PRIVATE LIMITED designs and manufactures tailored corporate gifting bags, conference pouches, seminar kits, and promotional giveaway bags with premium brand customization.',
      materials: [
        { name: '1680D Ballistic & 900D Matte Poly', desc: 'Premium executive look with exceptional durability.' },
        { name: 'Organic Cotton Canvas & Jute', desc: 'Eco-conscious materials ideal for sustainable corporate gifting.' },
        { name: '210D Water-Resistant Polyester', desc: 'Economical, lightweight material for large-scale marathon and trade show giveaways.' },
      ],
      applications: [
        { title: 'Annual Corporate Conferences', desc: 'Custom delegate seminar folders and messenger bags with summit branding.', iconName: 'Briefcase' },
        { title: 'Trade Shows & Product Launches', desc: 'High-visibility branded promotional bags for expo visitor distribution.', iconName: 'Gift' },
        { title: 'Employee Milestones & Rewards', desc: 'Premium executive duffels and laptop kits for festive and performance gifting.', iconName: 'Building2' },
      ],
      customizations: [
        '3D Precision Embroidery & Rubber Logos',
        'High-Definition Screen & Heat Transfer Printing',
        'Custom Corporate Colors & Contrast Piping',
        'Branded Gift Box & Individual Polybag Packaging',
      ],
      dimensions: [
        'Standard Event Messenger: 39cm x 29cm x 8cm',
        'Corporate Welcome Pack: 45cm x 32cm x 16cm',
        'Custom specifications supported',
      ],
      moq: '50 to 100 units',
      leadTime: '7 to 12 working days',
      sampleTurnaround: '3 to 4 business days',
      faqs: [
        {
          question: 'Can you handle urgent corporate event delivery in Mumbai?',
          answer: 'Yes, we have fast-track production lines for urgent corporate conference and trade show orders with expedited 5-7 day turnaround upon request.'
        },
      ],
    };
  }

  if (s.includes('tote') || s.includes('jute') || s.includes('canvas')) {
    return {
      h1: 'Canvas & Jute Bag Manufacturer in Mumbai | Eco Totes Wholesale',
      badge: 'Sustainable Cotton Canvas & Jute Bags',
      leadParagraph: 'Eco-friendly bag manufacturing using 100% natural organic cotton canvas and laminated golden jute. Perfect for retail shopping, trade exhibitions, hotel amenities, and sustainable corporate gifting.',
      materials: [
        { name: '8oz to 16oz Heavy Cotton Canvas', desc: 'Natural off-white, bleached white, or dyed organic canvas with soft, durable handfeel.' },
        { name: 'Natural Golden Jute / Juco Weave', desc: '100% biodegradable, vegetable-fiber woven textile with interior water-resistant lamination.' },
        { name: 'Cotton Webbing & Vegan Leather Handles', desc: 'Comfortable cross-stitched handles capable of carrying heavy grocery and retail goods.' },
      ],
      applications: [
        { title: 'Retail Fashion & Brand Shopping Bags', desc: 'Custom printed canvas shopper totes for boutique stores and eco brands.', iconName: 'Gift' },
        { title: 'Exhibitions & Global Summits', desc: 'Lightweight sustainable carry bags for literature and product samples.', iconName: 'Briefcase' },
        { title: 'Hospitality & Luxury Resorts', desc: 'Beach totes and spa bags branded with hotel insignia.', iconName: 'Building2' },
      ],
      customizations: [
        'Multi-Color Eco-Friendly Silk Screen Printing',
        'Rotary Digital All-Over Fabric Print',
        'Interior Zippered Valuables Pouch & Magnetic Snap Button',
        'Padded Cotton Rope or Vegan Leather Handles',
      ],
      dimensions: [
        'Standard Flat Tote: 38cm x 42cm',
        'Gusset Shopping Tote: 40cm x 35cm x 12cm',
        'Large Beach / Grocery Bag: 46cm x 38cm x 15cm',
      ],
      moq: '100 to 200 units',
      leadTime: '8 to 12 working days',
      sampleTurnaround: '2 to 4 business days',
      faqs: [
        {
          question: 'Are your canvas and jute bags 100% biodegradable and eco-friendly?',
          answer: 'Yes, we use 100% natural cotton canvas and pure golden jute with eco-certified water-based inks for sustainable brand initiatives.'
        },
      ],
    };
  }

  if (s.includes('travel') || s.includes('duffle') || s.includes('duffel') || s.includes('sports') || s.includes('gym')) {
    return {
      h1: 'Travel & Gym Duffle Bag Manufacturer in Mumbai | B2B Wholesale',
      badge: 'Heavy Duty Duffles & Sports Travel Bags',
      leadParagraph: 'LTS BAGS PRIVATE LIMITED manufactures high-capacity travel duffels, weekender holdalls, and athletic gym bags with separate shoe compartments, wet pouches, and rugged hardware.',
      materials: [
        { name: '1680D Ballistic & 600D Ripstop Polyester', desc: 'Tough, tear-proof fabrics engineered for rough airport handling and daily gym workouts.' },
        { name: 'Waterproof TPU Wet Pouch', desc: 'Isolates wet clothes, swimwear, and towels from the main compartment.' },
        { name: 'Reinforced Metal Hardware & YKK Zips', desc: 'Heavy swivel snap hooks, steel D-rings, and luggage-grade zipper chains.' },
      ],
      applications: [
        { title: 'Corporate Wellness & Sports Teams', desc: 'Branded gym duffels for marathon kits, athletic clubs, and corporate tournaments.', iconName: 'Gift' },
        { title: 'Executive Travel & Weekend Getaways', desc: 'Premium faux leather and ballistic nylon holdalls for business trips.', iconName: 'Plane' },
        { title: 'Institutional & Defense Transport Bags', desc: 'Extra-large high-volume kit bags with heavy load-bearing webbing.', iconName: 'Briefcase' },
      ],
      customizations: [
        'Isolated Side Shoe Tunnel with Air Vents',
        'Padded Adjustable Shoulder Straps with Grip Pad',
        '360-Degree Reflective Night Piping',
        'Debossed Leather & 3D Rubber Logos',
      ],
      dimensions: [
        'Compact Gym Duffel: 45cm x 25cm x 24cm (27 Liters)',
        'Standard Weekend Travel Duffel: 52cm x 28cm x 27cm (40 Liters)',
        'Heavy Gear Expedition Bag: 65cm x 35cm x 34cm (75 Liters)',
      ],
      moq: '50 to 100 units',
      leadTime: '10 to 14 working days',
      sampleTurnaround: '3 to 5 business days',
      faqs: [
        {
          question: 'Can gym duffle bags include ventilated shoe compartments?',
          answer: 'Yes, our sports duffel models feature a dedicated side shoe tunnel with brass eyelet mesh vents to keep footwear isolated and fresh.'
        },
      ],
    };
  }

  // Default Custom OEM/ODM Category Specs
  return {
    h1: `${catName} Manufacturer in Mumbai | Custom & Wholesale`,
    badge: `B2B ${catName} Production`,
    leadParagraph: `LTS BAGS PRIVATE LIMITED manufactures high-grade custom ${catName} in Mumbai, India. We offer direct factory wholesale pricing, low MOQ, sample prototyping, and full OEM/ODM customization.`,
    materials: [
      { name: '1680D Ballistic Nylon', desc: 'Top-tier executive fabric with scratch resistance and water repellency.' },
      { name: 'Heavy Duty Polyester (600D / 900D / 1200D)', desc: 'Versatile, high tensile strength fabric with custom color dyeing.' },
      { name: 'Cotton Canvas & Natural Jute', desc: 'Eco-conscious, biodegradable sustainable materials.' },
      { name: 'PU Vegan Leatherette', desc: 'Luxury leather alternative for executive gifts and premium bags.' },
    ],
    applications: [
      { title: 'Corporate Gifting & Onboarding', desc: 'Custom branded bags for employees, clients, and corporate celebrations.', iconName: 'Briefcase' },
      { title: 'Institutional & Campus Supply', desc: 'High-durability bulk bags for schools, colleges, and training institutes.', iconName: 'GraduationCap' },
      { title: 'Retail Private Label', desc: 'Custom OEM/ODM bag production manufactured to exact brand specifications.', iconName: 'Building2' },
      { title: 'Trade Shows & Promotions', desc: 'High-visibility giveaway bags for events, exhibitions, and campaigns.', iconName: 'Gift' },
    ],
    customizations: [
      '3D Computerized Logo Embroidery',
      'High-Density Silk Screen & Heat Transfer Printing',
      'Custom Embossed & Debossed Leather Patches',
      'Engraved Metal Badges and Custom Pullers',
      'Custom Internal Dividers, Organizers, and Pockets',
    ],
    dimensions: [
      'Standard sizes engineered for specific bag application',
      'Custom dimensions manufactured according to your tech-pack specs',
    ],
    moq: '50 to 100 units per model',
    leadTime: '10 to 14 working days after sample sign-off',
    sampleTurnaround: '3 to 5 business days',
    faqs: [
      {
        question: `What is the minimum order quantity for ${catName}?`,
        answer: 'Our standard MOQ is between 50 and 100 units depending on the bag design and material requirements.'
      },
      {
        question: `Can you customize ${catName} with our company logo and brand colors?`,
        answer: 'Yes, we offer complete OEM/ODM customization including embroidery, screen printing, custom hardware, and fabric matching.'
      },
      {
        question: 'Do you deliver across India and handle international export?',
        answer: 'Yes, we supply pan-India with safe carton packaging and door-to-door freight dispatch, along with international export services.'
      },
    ],
  };
}

export default function CategoryLandingView({ category, products, allCategories }: CategoryLandingViewProps) {
  const details = getCategoryDetails(category.slug, category.name);
  const baseUrl = getBaseUrl();
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Products', url: '/products' },
    { name: category.name, url: `/category/${category.slug}` },
  ]);

  const faqSchema = generateFaqSchema(details.faqs);

  const relatedCategories = allCategories
    .filter((c) => c.id !== category.id)
    .slice(0, 6);

  const whatsappMessage = encodeURIComponent(
    `Hello LTS BAGS PRIVATE LIMITED (MumbaiBags.com), I am interested in bulk order / custom manufacturing for: ${category.name}. Please share catalogue and pricing.`
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <SchemaScript schema={breadcrumbSchema} />
      <SchemaScript schema={faqSchema} />
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO HEADER WITH NATURAL SEO H1 */}
        <section className="bg-slate-900 text-white py-12 sm:py-16 border-b border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Breadcrumbs
              items={[
                { name: 'Products', url: '/products' },
                { name: category.name, url: `/category/${category.slug}` },
              ]}
            />
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30 inline-block">
                  {details.badge}
                </span>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans leading-tight">
                  {details.h1}
                </h1>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {details.leadParagraph}
                </p>

                {/* Key Quick Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold bg-slate-800/90 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
                    <ShieldCheck className="w-4 h-4 text-[#72AFDB]" /> Direct Mumbai Factory Rates
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold bg-slate-800/90 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Package className="w-4 h-4 text-amber-400" /> Low MOQ: {details.moq}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold bg-slate-800/90 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Clock className="w-4 h-4 text-emerald-400" /> Sample: {details.sampleTurnaround}
                  </span>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold text-sm transition-all shadow-md shadow-[#72AFDB]/20"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Get Wholesale Quote</span>
                  </Link>

                  <a
                    href={`https://wa.me/919833598338?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Inquiry</span>
                  </a>

                  <Link
                    href="/factory-tour"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700"
                  >
                    <span>View Factory Tour</span>
                  </Link>
                </div>

              </div>

              {/* Category Cover Image */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl overflow-hidden border border-slate-700 aspect-4/3 shadow-2xl relative bg-slate-800">
                  <Image
                    src={category.image}
                    alt={`${category.name} manufacturing plant at LTS BAGS Mumbai`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-xs font-semibold text-slate-200 flex items-center justify-between">
                    <span>LTS Bags Factory Unit</span>
                    <span className="text-[#72AFDB]">Dharavi, Mumbai</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. AVAILABLE PRODUCT MODELS */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-wider font-mono">
                  Catalog Showcase
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans mt-1">
                  Production Models for {category.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                  Showing ready-to-customize base designs. All models support custom fabrics, branding, and size modifications.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#72AFDB] hover:text-[#5C9BC7] hover:underline"
              >
                <span>Need a custom design not listed? Request Custom Tech-Pack</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <Package className="w-12 h-12 text-[#72AFDB] mx-auto opacity-80" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Custom OEM Manufacturing Available
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
                  We manufacture custom {category.name} directly from your sample, artwork, or technical specifications. Contact our Mumbai production team for quotation and prototyping.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#72AFDB] text-white font-bold text-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Send Custom Specs</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. B2B APPLICATIONS & USE CASES */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
                Industry Solutions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                Applications &amp; B2B Use Cases
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                Where our bulk {category.name} are deployed across enterprises and institutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {details.applications.map((app, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-[#72AFDB] transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#72AFDB]/10 flex items-center justify-center text-[#72AFDB]">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base font-sans">
                      {app.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {app.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MATERIALS, CUSTOMIZATION, AND PRODUCTION SPECS */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Materials Card */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#72AFDB]/10 flex items-center justify-center text-[#72AFDB]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                      Tested Raw Materials
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Available Fabric Grades</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs">
                  {details.materials.map((mat, idx) => (
                    <li key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <strong className="text-slate-900 dark:text-slate-100 block text-xs font-bold mb-0.5">
                        {mat.name}
                      </strong>
                      <span className="text-slate-600 dark:text-slate-400 leading-relaxed block">
                        {mat.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customization Options */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                      Custom Branding
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">In-House Embellishments</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  {details.customizations.map((cust, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#72AFDB] shrink-0 mt-0.5" />
                      <span>{cust}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Standard &amp; Custom Sizing
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {details.dimensions.map((dim, idx) => (
                      <li key={idx}>&bull; {dim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Manufacturing Metrics & Order Terms */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                        Order Specifications
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">B2B Manufacturing Terms</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        Minimum Order Quantity (MOQ)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {details.moq}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        Bulk Production Lead Time
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {details.leadTime}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        Sample Prototyping Turnaround
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {details.sampleTurnaround}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        Packaging &amp; Dispatch
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        1 pc/polybag, 25-50 pcs/5-ply corrugated export carton with moisture desiccant.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <Link
                    href="/contact"
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Quotation for {category.name}</span>
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 5. FREQUENTLY ASKED QUESTIONS SPECIFIC TO THIS CATEGORY */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
                Procurement FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                Frequently Asked Questions: {category.name}
              </h2>
            </div>

            <div className="space-y-4">
              {details.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                >
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#72AFDB] shrink-0 mt-1" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed pl-6.5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. RELATED CATEGORIES INTERNAL LINKING */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                Explore Other Bag Manufacturing Collections
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Complete B2B product lines manufactured directly at our Mumbai factory.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedCategories.map((relCat) => (
                <Link
                  key={relCat.id}
                  href={`/category/${relCat.slug}`}
                  className="group bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-[#72AFDB] hover:shadow-md transition-all text-center flex flex-col items-center justify-between space-y-2"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={relCat.image}
                      alt={relCat.name}
                      fill
                      sizes="120px"
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-[#72AFDB] transition-colors leading-tight line-clamp-2">
                    {relCat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
