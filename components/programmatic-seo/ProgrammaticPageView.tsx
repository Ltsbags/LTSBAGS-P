'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  MessageCircle, 
  Send, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Factory, 
  FileText, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  Box,
  MapPin,
  Check,
  ChevronDown,
  Phone,
  Mail,
  Download
} from 'lucide-react';
import { SeoPage } from '@/lib/programmatic-seo/types';
import { VERIFIED_BUSINESS_INFO } from '@/lib/business-info';
import QuoteModal from '@/components/QuoteModal';

interface ProgrammaticPageViewProps {
  page: SeoPage;
}

export default function ProgrammaticPageView({ page }: ProgrammaticPageViewProps) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Track lead events
  const trackLead = async (eventType: string) => {
    try {
      fetch('/api/leads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          page_slug: page.slug,
          page_title: page.h1,
          product: page.product_id,
          location: page.location_id,
          industry: page.industry_id,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }),
      });
    } catch (e) {
      // Non-blocking
    }
  };

  // Construct contextual WhatsApp URL
  const locationLabel = page.location_id ? page.location_id.charAt(0).toUpperCase() + page.location_id.slice(1) : 'India';
  const whatsappMessage = encodeURIComponent(
    `Hello LTS BAGS, I am looking for ${page.h1}.\n\n` +
    `Product Type: ${page.product_id || 'Custom Bags'}\n` +
    `Delivery Destination: ${locationLabel}\n` +
    `Expected Quantity: 100+ Units\n\n` +
    `I would like to discuss specifications, receive a quotation, and review physical samples.`
  );
  const whatsappUrl = `https://wa.me/919167198755?text=${whatsappMessage}`;

  // Structured Data: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ltsbags.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Custom Bag Manufacturing',
        item: 'https://ltsbags.com/manufacturing',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.h1,
        item: page.canonical_url || `https://ltsbags.com/${page.slug}`,
      },
    ],
  };

  // Structured Data: FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq?.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })) || [],
  };

  // Structured Data: Organization / LocalBusiness / Product
  const mainSchema = {
    '@context': 'https://schema.org',
    '@type': page.schema_type === 'LocalBusiness' ? 'LocalBusiness' : 'Organization',
    name: 'LTS BAGS PRIVATE LIMITED',
    url: 'https://ltsbags.com',
    logo: 'https://ltsbags.com/logo.png',
    image: page.featured_image,
    description: page.meta_description,
    telephone: '+919167198755',
    email: 'info@ltsbags.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Floor-G, A341/2/3, Ganesh Sai Kripa CHS, Sant Rohidas Marg, Mukund Nagar, Dharavi',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400017',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.0435,
      longitude: 72.8567,
    },
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />

      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li>
              <Link href="/manufacturing" className="hover:text-primary transition-colors">
                Manufacturing
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[280px] sm:max-w-md">
              {page.h1}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dharavi Mumbai Factory Direct</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                  <Award className="w-3.5 h-3.5" />
                  <span>AQL 2.5 Quality Inspection</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>14+ Years Manufacturing</span>
                </span>
              </div>

              {/* H1 Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {page.h1}
              </h1>

              {/* Intro Content */}
              <div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {page.intro_content?.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Commercial Value Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Minimum Order</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{page.specifications?.moq || '50 - 100 Units'}</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Physical Sample</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{page.specifications?.sample_timeline || '5 - 7 Days'}</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Logistics</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Pan-India & Export</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  onClick={() => {
                    trackLead('quote_modal_open');
                    setQuoteModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{page.cta_text || 'Request Factory Direct Quote'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLead('whatsapp_click')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Design on WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Right Column: Featured Visual & Specifications Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={page.featured_image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000'}
                    alt={page.image_alt || page.h1}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-primary/90 px-2.5 py-1 rounded">
                      LTS BAGS FACTORY DIRECT
                    </span>
                    <h2 className="text-base font-bold mt-1 text-white truncate">
                      {page.h1}
                    </h2>
                    <p className="text-xs text-slate-200">
                      Manufactured in Dharavi, Mumbai • Certified AQL 2.5 Standard
                    </p>
                  </div>
                </div>

                {/* Quick Spec Highlights */}
                <div className="p-5 space-y-3 bg-white dark:bg-slate-900 text-xs">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Custom Branding: </span>
                      <span className="text-slate-600 dark:text-slate-300">{page.specifications?.branding_options?.slice(0, 3).join(', ') || 'Embroidery, Debossing, Screen Print'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Available Fabrics: </span>
                      <span className="text-slate-600 dark:text-slate-300">{page.specifications?.materials?.slice(0, 3).join(', ') || 'Ballistic Nylon, Polyester, Canvas'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Sample Lead Time: </span>
                      <span className="text-slate-600 dark:text-slate-300">{page.specifications?.sample_timeline || '5-7 business days'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Section: Technical Specifications Grid */}
      <section className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              ENGINEERED QUALITY & SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Technical Specifications & Commercial Terms
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every bag model is engineered with heavy-duty fabrics, reinforced stress joints, and strict quality tolerances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Spec Box 1: Materials */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>Available Materials</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {page.specifications?.materials?.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spec Box 2: Branding Options */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Branding & Logo Methods</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {page.specifications?.branding_options?.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spec Box 3: Hardware & Closures */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Box className="w-4 h-4" />
                <span>Hardware & Zippers</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {page.specifications?.hardware?.map((h, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spec Box 4: Commercial Timelines */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Order Timelines</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Physical Sampling:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{page.specifications?.sample_timeline || '5 - 7 Business Days'}</div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Bulk Production:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{page.specifications?.bulk_timeline || '15 - 25 Business Days'}</div>
                </div>
              </div>
            </div>

            {/* Spec Box 5: Quality Assurance */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>Quality Control Standard</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <p><b>AQL 2.5 Standard:</b> 100% in-line sewing checks, zipper pull fatigue test, seam burst load testing.</p>
                <p><b>Packaging:</b> Individual polybag with silica gel, 7-ply heavy export cartons.</p>
              </div>
            </div>

            {/* Spec Box 6: Logistics & Delivery */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Truck className="w-4 h-4" />
                <span>Fulfillment & Delivery</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <p><b>Domestic India:</b> Insured door-to-door express transport with live tracking across all commercial centers.</p>
                <p><b>Export Supply:</b> Nhava Sheva (JNPT) sea freight & Mumbai air cargo container stuffing.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section: Manufacturing Workflow */}
      <section className="py-14 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              END-TO-END OEM/ODM PROCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              How We Manufacture Your Custom Bags
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              From tech-pack consultation to final bulk carton dispatch, our streamlined 4-step workflow guarantees consistency and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-primary/30 dark:text-primary/20 block mb-2 font-mono">01</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Tech Pack & Consultation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review your CAD drawings, reference images, or dimensional specs. We verify fabric denier, pocket partitions, and hardware.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-primary/30 dark:text-primary/20 block mb-2 font-mono">02</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Raw Material Sourcing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Procure high-tensile certified fabrics, match Pantone colors, and cast custom-branded zipper pullers and badges.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-primary/30 dark:text-primary/20 block mb-2 font-mono">03</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Golden Physical Sample</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Craft a full physical prototype in 5-7 business days for your tactile review, zipper smoothness, and stitch inspection.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-primary/30 dark:text-primary/20 block mb-2 font-mono">04</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Bulk Stitching & AQL 2.5 QC</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated cutting, bar-tack sewing on industrial machines, comprehensive AQL 2.5 defect inspection, and scheduled dispatch.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section: Location Context & Physical Factory Verification */}
      {page.location_content && (
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                    <MapPin className="w-4 h-4" />
                    <span>PRODUCTION & LOGISTICS INTELLIGENCE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {page.location_id === 'mumbai' 
                      ? 'Dharavi, Mumbai Manufacturing Facility & Sample Room' 
                      : `Direct Factory Supply to ${page.location_id ? page.location_id.toUpperCase() : 'Your City'}`}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {page.location_content}
                  </p>
                  <p className="text-xs text-slate-400">
                    Physical Plant: Floor-G, A341/2/3, Ganesh Sai Kripa CHS, Sant Rohidas Marg, Mukund Nagar, Dharavi, Mumbai 400017
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href="tel:+919167198755"
                    onClick={() => trackLead('phone_click')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Sales (+91 91671 98755)</span>
                  </a>
                  <Link
                    href="/factory-tour"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Factory className="w-3.5 h-3.5" />
                    <span>View Factory Tour</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section: Frequently Asked Questions (Accordion) */}
      <section className="py-14 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              BUYER COMMON QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Clear, transparent answers about custom manufacturing, minimum order quantities, and sample timelines.
            </p>
          </div>

          <div className="space-y-3">
            {page.faq?.map((faqItem, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    aria-expanded={isOpen}
                  >
                    <span>{faqItem.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faqItem.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Final Conversion CTA */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Factory className="w-3.5 h-3.5" />
            <span>DIRECT B2B FACTORY PRICING</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Ready to Manufacture Your Custom Bags?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Share your reference sketch, quantity requirement, or tech-pack. Our engineering team provides physical sample prototypes in 5 to 7 business days.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                trackLead('quote_modal_open_bottom');
                setQuoteModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-xl shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Request Factory Direct Quote</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLead('whatsapp_click_bottom')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Design on WhatsApp</span>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span>• Direct Factory Pricing</span>
            <span>• Physical Sample in 5-7 Days</span>
            <span>• Low MOQ (50-100 Pcs)</span>
            <span>• Full GST Tax Invoices</span>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLead('whatsapp_mobile_bar')}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
          <button
            onClick={() => {
              trackLead('quote_mobile_bar');
              setQuoteModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary text-white font-bold text-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Get Quote</span>
          </button>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={page.h1}
      />
    </div>
  );
}
