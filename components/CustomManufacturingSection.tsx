'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Gift, 
  Tag, 
  Store, 
  Layers, 
  GraduationCap, 
  Megaphone, 
  Trophy, 
  Plane, 
  Globe2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Send,
  MessageCircle,
  FileCheck
} from 'lucide-react';
import QuoteModal from './QuoteModal';
import { getContextualWhatsAppUrl } from '@/lib/business-info';

interface B2BSectorData {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  whatWeManufacture: string;
  customizationDetails: string;
  brandingOptions: string;
  moq: string;
  samplingTime: string;
  bulkTime: string;
  recommendedProducts: string[];
}

const B2B_SECTORS: B2BSectorData[] = [
  {
    id: 'corp-procurement',
    name: 'Corporate Procurement',
    badge: 'Enterprise IT & MNCs',
    icon: Building2,
    whatWeManufacture: 'Executive laptop backpacks, hybrid briefcases, tech messenger bags, and multi-piece employee welcome sets.',
    customizationDetails: 'Custom 14"-17" padded laptop cradles, trolley pass-through straps, concealed passport pockets, and water-repellent fabrics.',
    brandingOptions: 'High-definition 3D embroidery, laser-etched metal plates, debossed leatherette patches, and custom inner linings.',
    moq: '50 - 100 Units',
    samplingTime: '5 - 7 Business Days',
    bulkTime: '15 - 20 Days (Pan-India split warehouse delivery)',
    recommendedProducts: ['Executive Laptop Backpack', 'Convertible Tech Briefcase', 'Onboarding Welcome Kit'],
  },
  {
    id: 'corp-gifting',
    name: 'Corporate Gifting',
    badge: 'Agencies & Rewards',
    icon: Gift,
    whatWeManufacture: 'Luxury vegan leather duffels, festive gift bags, tech organizer folios, and premium weekender holdalls.',
    customizationDetails: 'Understated tone-on-tone branding, individual gift box presentation packaging, satin ribbon accents, and thank-you card inserts.',
    brandingOptions: 'Subtle blind debossing, metallic foil stamping, laser engraved metal pullers, and damask woven labels.',
    moq: '50 Units',
    samplingTime: '5 - 7 Business Days',
    bulkTime: '12 - 18 Days (Festive priority scheduling)',
    recommendedProducts: ['Vegan Leather Weekender', 'Melange Travel Duffle', 'Executive Laptop Sleeve'],
  },
  {
    id: 'private-label',
    name: 'Private Label Brands',
    badge: 'D2C & Lifestyle Brands',
    icon: Tag,
    whatWeManufacture: 'Turnkey retail collections across streetwear backpacks, minimalist totes, crossbody sling bags, and outdoor rucksacks.',
    customizationDetails: 'Custom fabric development, proprietary pattern drafting, bespoke zinc alloy zipper pullers, and custom printed interior linings.',
    brandingOptions: 'Custom woven seam labels, molded silicone badges, high-density screen printing, and branded hangtags with EAN barcodes.',
    moq: '100 Units per colorway',
    samplingTime: '5 - 7 Days (Physical golden sample)',
    bulkTime: '20 - 25 Days (Retail ready packaging)',
    recommendedProducts: ['Urban Commuter Backpack', 'Gusseted Canvas Tote', 'Crossbody Sling Bag'],
  },
  {
    id: 'retailers',
    name: 'Retailers & Department Stores',
    badge: 'Multi-Store Chains',
    icon: Store,
    whatWeManufacture: 'Fast-moving retail bag lines: everyday casual backpacks, women\'s canvas shoppers, gym duffels, and sling packs.',
    customizationDetails: 'Price-point optimization, retail rack display compatibility, standardized dimensional cartons, and scannable inventory tags.',
    brandingOptions: 'Retail hangtags, swift-tach fasteners, printed barcode stickers, and custom store brand labels.',
    moq: '100 - 250 Units',
    samplingTime: '5 - 7 Days',
    bulkTime: '15 - 22 Days',
    recommendedProducts: ['Everyday Daypack', 'Shopping Canvas Carryall', 'Compact Gym Duffel'],
  },
  {
    id: 'wholesalers',
    name: 'Wholesalers & Distributors',
    badge: 'Bulk Stockists',
    icon: Layers,
    whatWeManufacture: 'Standardized high-turnover school bags, heavy duffels, commercial messenger bags, and plain stock bags ready for local printing.',
    customizationDetails: 'High-volume production runs with maximum economies of scale, unbranded bulk cartons, and containerized dispatch.',
    brandingOptions: 'Unbranded neutral labels or distributor-specific private mark.',
    moq: '250 - 500 Units',
    samplingTime: '3 - 5 Days',
    bulkTime: '15 - 25 Days (Staggered dispatch available)',
    recommendedProducts: ['Standard Student Backpack', 'Heavy-Duty Barrel Duffel', 'Promotional Tote Pack'],
  },
  {
    id: 'schools',
    name: 'Schools & Educational Institutions',
    badge: 'Schools & Colleges',
    icon: GraduationCap,
    whatWeManufacture: 'Ergonomic student bookbags, kindergarten bags, coaching institute backpacks, and college laptop rucksacks.',
    customizationDetails: 'Reflective safety piping, double-reinforced bottom panels, water bottle side mesh, and anatomical spine support padding.',
    brandingOptions: 'Detailed school crest embroidery, multi-color school crest screen printing, and student name ID tags.',
    moq: '100 Units per design',
    samplingTime: '5 - 7 Days',
    bulkTime: '15 - 25 Days (Pre-academic session advance booking)',
    recommendedProducts: ['Ergonomic School Backpack', 'Junior Daypack', 'Coaching Institute Techpack'],
  },
  {
    id: 'promotional',
    name: 'Promotional Companies & Agencies',
    badge: 'Campaign Marketing',
    icon: Megaphone,
    whatWeManufacture: 'Lightweight drawstring backpacks, exhibition conference delegate folders, foldable shopping bags, and event merchandise.',
    customizationDetails: 'Engineered for maximum visible logo surface area, cost-optimized fabric selection, and lightweight transit efficiency.',
    brandingOptions: 'Edge-to-edge screen printing, vibrant heat-transfer graphics, and full-color sublimation.',
    moq: '100 Units',
    samplingTime: '3 - 5 Days',
    bulkTime: '10 - 15 Days (Urgent event deadlines accommodated)',
    recommendedProducts: ['Drawstring Marathon Bag', 'Conference Delegate Bag', 'Eco Shopping Tote'],
  },
  {
    id: 'sports',
    name: 'Sports Academies & Athletic Clubs',
    badge: 'Fitness & Sports',
    icon: Trophy,
    whatWeManufacture: 'Heavy athletic kit bags, football/cricket holdalls, ventilated gym duffels with shoe tunnels, and team swim bags.',
    customizationDetails: 'Waterproof tarpaulin bases, ventilated wet laundry compartments, wrap-around load webbing, and water bottle holsters.',
    brandingOptions: 'Club emblem embroidery, individual player squad numbers, and sponsor sublimation printing.',
    moq: '50 - 100 Units',
    samplingTime: '5 - 7 Days',
    bulkTime: '15 - 20 Days',
    recommendedProducts: ['Pro Athlete Kit Holdall', 'Ventilated Gym Duffel', 'Sports Team Rucksack'],
  },
  {
    id: 'travel',
    name: 'Travel Companies & Tour Operators',
    badge: 'Tourism & Treks',
    icon: Plane,
    whatWeManufacture: 'Travel rucksacks, airline cabin carry-on weekenders, expandable duffels, and custom passport/document organizer pouches.',
    customizationDetails: 'Airline carry-on compliance sizing (40L/45L), lockable double zipper sliders, integrated rain covers, and luggage sleeves.',
    brandingOptions: 'Woven travel patches, reflective logo printing, and customized luggage identification tags.',
    moq: '50 - 100 Units',
    samplingTime: '5 - 7 Days',
    bulkTime: '15 - 22 Days',
    recommendedProducts: ['Cabin-Size Travel Duffel', 'Expedition Rucksack 45L', 'RFID Travel Document Folio'],
  },
  {
    id: 'export',
    name: 'Export Buyers & Global Importers',
    badge: 'International Trade',
    icon: Globe2,
    whatWeManufacture: 'Full-container OEM/ODM orders across canvas shopping totes, executive laptop backpacks, and eco-friendly jute/juco bags.',
    customizationDetails: 'Strict adherence to buyer technical specs, REACH / California Prop 65 compliant fabrics, and export palletization.',
    brandingOptions: 'Buyer-specified custom hardware, woven labels, care tags, and bilingual packaging manuals.',
    moq: '500 - 1,000 Units (FCL / LCL shipments)',
    samplingTime: '7 - 10 Days with international express courier',
    bulkTime: '25 - 35 Days (Ex-factory Mumbai / FOB Nhava Sheva Port)',
    recommendedProducts: ['Organic Canvas Shopper', 'Ballistic Laptop Backpack', 'Heavy Travel Holdall'],
  },
];

export default function CustomManufacturingSection() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeSectorId, setActiveSectorId] = useState<string>('corp-procurement');
  const [preselectedProduct, setPreselectedProduct] = useState<string>('Custom Bag Manufacturing');

  const activeSector = B2B_SECTORS.find((s) => s.id === activeSectorId) || B2B_SECTORS[0];
  const ActiveIcon = activeSector.icon;

  const whatsappUrl = getContextualWhatsAppUrl({
    categoryName: `${activeSector.name} Manufacturing`,
    intent: 'quote',
  });

  const handleOpenQuote = (sectorName: string) => {
    setPreselectedProduct(`${sectorName} Solution`);
    setQuoteModalOpen(true);
  };

  return (
    <section className="py-20 bg-slate-100/60 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10 Dedicated B2B Customer Segments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Specialized OEM & ODM Bag Manufacturing for Every B2B Sector
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Different industries have distinct procurement protocols, certification requirements, and branding standards. Select your sector below to see our tailored manufacturing capabilities.
          </p>
        </div>

        {/* Horizontal Scrollable/Grid Sector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {B2B_SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isActive = sector.id === activeSectorId;
            return (
              <button
                key={sector.id}
                onClick={() => setActiveSectorId(sector.id)}
                className={`px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#0A1128] text-white border-amber-500 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{sector.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Sector Detailed Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Sector Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {activeSector.badge}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {activeSector.name} Solutions
                  </h3>
                </div>
              </div>

              {/* What We Manufacture */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-500 dark:text-slate-400">
                  What LTS BAGS Manufactures For You:
                </h4>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {activeSector.whatWeManufacture}
                </p>
              </div>

              {/* Customization & Branding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Typical Customization:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeSector.customizationDetails}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Branding Options:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeSector.brandingOptions}
                  </p>
                </div>
              </div>

              {/* Recommended Models */}
              <div className="pt-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block mb-2">
                  Popular Models For This Sector:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeSector.recommendedProducts.map((prod, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Key Commercial Terms & CTAs */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/70 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Commercial Parameters
              </h4>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Minimum Order Quantity (MOQ):</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">{activeSector.moq}</span>
                </div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Sample Development:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-right">{activeSector.samplingTime}</span>
                </div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Bulk Production Time:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">{activeSector.bulkTime}</span>
                </div>
              </div>

              {/* Sector Specific CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenQuote(activeSector.name)}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>REQUEST QUOTE FOR {activeSector.name.toUpperCase()}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>DISCUSS ON WHATSAPP</span>
                </a>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-mono">
                Direct factory manufacturing in Dharavi, Mumbai • GST Tax Invoice
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Banner with Tech Pack Callout */}
        <div className="bg-[#0A1128] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-amber-400 text-xs font-bold font-mono uppercase tracking-wider">
              Have a Custom Blueprint or Physical Sample?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-sans text-white">
              Send Us Your Design or Tech Pack
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Our Dharavi pattern masters can replicate existing physical samples or develop brand-new patterns from your CAD files with full factory direct pricing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenQuote('Custom Design Tech Pack')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Tech Pack</span>
            </button>
            <Link
              href="/customization"
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all"
            >
              View Customization Guide
            </Link>
          </div>
        </div>

      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={preselectedProduct}
      />
    </section>
  );
}
