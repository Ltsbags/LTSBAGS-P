import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Truck, Factory, ShieldCheck, ArrowRight, MessageCircle, FileText } from 'lucide-react';
import { getSeoLocation, SEO_LOCATIONS } from '@/lib/programmatic-seo/data/locations';
import { SEO_PRODUCTS } from '@/lib/programmatic-seo/data/products';
import { seoStorage } from '@/lib/programmatic-seo/storage';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getSeoLocation(slug);
  if (!location) return {};

  const title = location.is_factory_hq
    ? `Custom Bag Manufacturer in Mumbai | Direct Dharavi Factory | LTS BAGS`
    : `Custom Bag Manufacturer Supplying ${location.city} | LTS BAGS Factory`;

  const description = location.is_factory_hq
    ? `ISO-certified custom bag manufacturer located in Dharavi, Mumbai. We manufacture backpacks, duffels, and corporate bags with direct factory pricing and low MOQ.`
    : `Custom bag manufacturing for corporate buyers and brands in ${location.city}. Produced at our Dharavi, Mumbai plant with express insured transport and low MOQ.`;

  return generatePageMetadata({
    title,
    description,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getSeoLocation(slug);

  if (!location) {
    notFound();
  }

  // Find programmatic pages targeting this location
  const allPages = seoStorage.getAllPages();
  const locationPages = allPages.filter(
    (p) => p.location_id === location.id && p.status === 'PUBLISHED'
  );

  const whatsappMessage = encodeURIComponent(
    `Hello LTS BAGS, I am looking for custom bag manufacturing delivered to ${location.city}. Please share your catalogue and MOQ details.`
  );
  const whatsappUrl = `https://wa.me/919167198755?text=${whatsappMessage}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-primary">Locations</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{location.city}</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location.city}, {location.state}</span>
            </span>
            {location.is_factory_hq ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Factory className="w-3.5 h-3.5" />
                <span>CENTRAL MANUFACTURING FACILITY</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Truck className="w-3.5 h-3.5" />
                <span>EXPRESS SUPPLY CORRIDOR</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {location.is_factory_hq
              ? `Custom Bag Manufacturer in Mumbai`
              : `Custom Bag Manufacturer Supplying ${location.city}`}
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
            {location.local_intro}
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
            {location.business_relevance}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire for {location.city} Delivery</span>
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

        {/* Truthful Manufacturing & Logistics Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                TRANSPARENT SOURCING & LOGISTICS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Factory Truthfulness Guarantee
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {location.is_factory_hq ? (
                  <>
                    Our physical factory and sampling studio are located at <b>Floor-G, A341/2/3, Ganesh Sai Kripa CHS, Sant Rohidas Marg, Mukund Nagar, Dharavi, Mumbai 400017</b>. Clients are welcome to schedule sample approvals or factory floor audits.
                  </>
                ) : (
                  <>
                    We do not make misleading claims of local factories in {location.city}. All bags are engineered and manufactured under strict AQL 2.5 standards at our <b>Dharavi, Mumbai manufacturing facility</b> and delivered directly to your doorstep in {location.city} with insured express road/air cargo.
                  </>
                )}
              </p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="text-slate-400 font-bold uppercase tracking-wider">Logistics Details:</div>
              <p className="text-slate-200">{location.shipping_information}</p>
              <div className="pt-2 text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Full Transit Insurance & GST Tax Invoice Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories for this Location */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Manufacturing Solutions for Buyers in {location.city}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEO_PRODUCTS.map((prod) => {
              // Check if a direct programmatic landing page exists
              const matchedPage = locationPages.find((p) => p.product_id === prod.id);
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
