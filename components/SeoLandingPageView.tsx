'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Box
} from 'lucide-react';
import { SeoLandingPage } from '@/lib/seo-landing-pages';
import { VERIFIED_BUSINESS_INFO, getContextualWhatsAppUrl } from '@/lib/business-info';
import QuoteModal from '@/components/QuoteModal';

interface SeoLandingPageViewProps {
  page: SeoLandingPage;
}

export default function SeoLandingPageView({ page }: SeoLandingPageViewProps) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const whatsappUrl = getContextualWhatsAppUrl({
    categoryName: page.h1,
    intent: 'quote',
  });

  // Breadcrumb schema
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
        name: 'Manufacturing & B2B Solutions',
        item: 'https://ltsbags.com/manufacturing',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.h1,
        item: `https://ltsbags.com/${page.slug}`,
      },
    ],
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={page.h1}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0A1128] text-white pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#72AFDB_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/manufacturing" className="hover:text-amber-400 transition-colors">B2B Manufacturing</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-400 font-semibold">{page.h1}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#72AFDB]/10 border border-[#72AFDB]/30 text-[#72AFDB] text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{page.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              {page.h1}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8">
              {page.heroSubheadline}
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>REQUEST FACTORY QUOTE</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WHATSAPP INQUIRY</span>
              </a>

              <Link
                href="/factory-tour"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-colors"
              >
                <Factory className="w-4 h-4 text-[#72AFDB]" />
                <span>VIEW FACTORY</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Manufacturer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom OEM / ODM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Physical Golden Sample</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pan-India & Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPREHENSIVE OVERVIEW & INTRODUCTION */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Detailed Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Manufacturing Authority & B2B Reliability</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Industrial Bag Manufacturing for Discerning B2B Buyers
              </h2>
              {page.introParagraphs.map((para, idx) => (
                <p key={idx} className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  {para}
                </p>
              ))}

              <div className="pt-4 flex items-center gap-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex-1">
                  <span className="block text-xs uppercase font-mono text-slate-500 dark:text-slate-400">Registered Factory Site</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{VERIFIED_BUSINESS_INFO.address.shortLocation}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex-1">
                  <span className="block text-xs uppercase font-mono text-slate-500 dark:text-slate-400">Quality Standard</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{VERIFIED_BUSINESS_INFO.compliance.aqlStandard}</span>
                </div>
              </div>
            </div>

            {/* Right: Key Highlights Cards */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Why Procure From LTS BAGS?
              </h3>
              {page.keyHighlights.map((highlight, idx) => (
                <div 
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 transition-colors"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {highlight.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. TECHNICAL SPECIFICATIONS & PRODUCTION CAPABILITIES */}
      <section className="py-16 sm:py-20 bg-slate-100/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Technical Rigor
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Manufacturing Specifications & Capabilities
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every detail is engineered to technical tolerances matching corporate, institutional, and export guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Materials */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Available Fabrics & Materials</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {page.specificationsSummary.materials.map((mat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hardware & Zippers */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Hardware & Structural Components</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {page.specificationsSummary.hardware.map((hw, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{hw}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Branding & Logo Options */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Custom Branding Techniques</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {page.specificationsSummary.brandingOptions.map((brand, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span>{brand}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline & MOQ Summary Box */}
          <div className="mt-8 bg-[#0A1128] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-slate-800">
              <div className="text-xs font-mono uppercase text-slate-400 mb-1">Minimum Order Quantity</div>
              <div className="text-lg font-bold text-amber-400">{page.specificationsSummary.moq}</div>
              <div className="text-[11px] text-slate-400 mt-1">Flexible for pilot batches</div>
            </div>
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-slate-800">
              <div className="text-xs font-mono uppercase text-slate-400 mb-1">Sample Lead Time</div>
              <div className="text-lg font-bold text-white">{page.specificationsSummary.sampleTimeline}</div>
              <div className="text-[11px] text-slate-400 mt-1">Physical golden sample delivered</div>
            </div>
            <div className="p-4">
              <div className="text-xs font-mono uppercase text-slate-400 mb-1">Bulk Production Time</div>
              <div className="text-lg font-bold text-emerald-400">{page.specificationsSummary.bulkTimeline}</div>
              <div className="text-[11px] text-slate-400 mt-1">Based on batch quantity & approval</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 5-STEP PRODUCTION WORKFLOW */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Structured Quality Control
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              End-to-End Manufacturing Workflow
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              From concept tech pack to final dispatch, our factory maintains rigorous milestone checkpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {page.manufacturingWorkflow.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 relative group hover:border-amber-500 transition-colors flex flex-col"
              >
                <div className="text-2xl font-mono font-extrabold text-amber-500/80 mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Banner Callout */}
          <div className="mt-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Have an urgent event or bulk deadline?</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Our Dharavi manufacturing lines can accommodate expedited production schedules upon review.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap cursor-pointer"
            >
              Discuss Urgent Timelines
            </button>
          </div>
        </div>
      </section>

      {/* 5. B2B SECTORS & APPLICATIONS */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Commercial Applications
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Who We Manufacture For
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Tailored volume solutions built to the rigorous procurement standards of varied business sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {page.b2bUseCases.map((useCase, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {useCase.sector}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {useCase.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono block mb-1">Recommended Configuration:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{useCase.popularModels}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQS ACCORDION */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Buyer Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Common procurement inquiries regarding minimums, samples, logistics, and customization.
            </p>
          </div>

          <div className="space-y-4">
            {page.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3 text-sm sm:text-base">
                      <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                      {faq.question}
                    </span>
                    <span className={`text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. RELATED INTERNAL LINKS & CATEGORIES */}
      <section className="py-12 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Explore Related Manufacturing Services
            </h3>
            <Link 
              href="/products" 
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {page.relatedLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center justify-between"
              >
                <span>{link.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL FACTORY CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-[#0A1128] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Engineer Your Custom Bag Order?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8">
            Connect directly with the manufacturing team at LTS BAGS. Share your drawings, tech packs, or volume target for an accurate factory quotation within hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>GET FACTORY QUOTE NOW</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>

          <div className="mt-8 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6 font-mono">
            <span>Direct Call: {VERIFIED_BUSINESS_INFO.contact.primaryPhone}</span>
            <span>•</span>
            <span>Email: {VERIFIED_BUSINESS_INFO.contact.primaryEmail}</span>
            <span>•</span>
            <span>Location: {VERIFIED_BUSINESS_INFO.address.shortLocation}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
