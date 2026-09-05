import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, CheckCircle2, ArrowRight, MessageCircle, FileText, Factory, ShieldCheck } from 'lucide-react';
import { getSeoIndustry } from '@/lib/programmatic-seo/data/industries';
import { SEO_PRODUCTS } from '@/lib/programmatic-seo/data/products';
import { seoStorage } from '@/lib/programmatic-seo/storage';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getSeoIndustry(slug);
  if (!industry) return {};

  return generatePageMetadata({
    title: `${industry.name} Custom Bag Manufacturer in India | OEM Factory | LTS BAGS`,
    description: `Specialized custom bag manufacturing for ${industry.name.toLowerCase()} in India. Direct Mumbai factory pricing, custom branding, durable materials, and low MOQ.`,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getSeoIndustry(slug);

  if (!industry) {
    notFound();
  }

  // Find programmatic pages targeting this industry
  const allPages = seoStorage.getAllPages();
  const industryPages = allPages.filter(
    (p) => p.industry_id === industry.id && p.status === 'PUBLISHED'
  );

  const whatsappMessage = encodeURIComponent(
    `Hello LTS BAGS, I am interested in custom bags for the ${industry.name} sector. Please share relevant designs, pricing, and MOQ.`
  );
  const whatsappUrl = `https://wa.me/919167198755?text=${whatsappMessage}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/industries" className="hover:text-primary">Industries</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{industry.name}</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Briefcase className="w-3.5 h-3.5" />
              <span>INDUSTRY OEM/ODM SOLUTION</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Factory className="w-3.5 h-3.5" />
              <span>MUMBAI PRODUCTION PLANT</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Custom Bag Manufacturing for {industry.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
            {industry.overview}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire for {industry.name}</span>
            </a>
            <Link
              href="/request-a-quote"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Request Factory Quotation</span>
            </Link>
          </div>
        </div>

        {/* Technical Capabilities & Buyer Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sector Buyer Requirements We Fulfill
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {industry.typical_buyer_requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Specialized Engineering & Customizations
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {industry.typical_customizations.map((cust, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{cust}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Products for this Industry */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Recommended Bag Models for {industry.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEO_PRODUCTS.map((prod) => {
              const matchedPage = industryPages.find((p) => p.product_id === prod.id);
              const targetUrl = matchedPage ? `/${matchedPage.slug}` : `/products/${prod.id}`;

              return (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary transition-all"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                      {prod.description}
                    </p>
                    <div className="text-[11px] text-slate-500 pt-1">
                      MOQ: <span className="font-semibold text-slate-800 dark:text-slate-200">{prod.moq}</span>
                    </div>
                  </div>

                  <Link
                    href={targetUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
