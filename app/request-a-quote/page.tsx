import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import SchemaScript from '@/components/SchemaScript';
import { generatePageMetadata, generateOrganizationSchema } from '@/lib/seo';
import RequestQuoteClient from './RequestQuoteClient';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  PhoneCall, 
  MessageCircle,
  FileCheck,
  Truck,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Request a Wholesale Quote & Free Digital Mockup | LTS BAGS PRIVATE LIMITED',
  description: 'Get an official wholesale quotation and factory direct unit pricing for custom corporate backpacks, laptop bags, travel duffels, and promotional totes within 24 hours.',
  path: '/request-a-quote',
});

export default function RequestQuotePage() {
  const orgSchema = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <SchemaScript schema={orgSchema} />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Request a Quote', url: '/request-a-quote' },
            ]}
          />

          {/* Top Hero Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#72AFDB]/15 border border-[#72AFDB]/30 text-[#72AFDB] font-mono text-xs uppercase tracking-widest font-bold">
                <Sparkles className="w-4 h-4 text-[#72AFDB]" />
                <span>B2B Factory Direct Pricing</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif">
                Request a Custom Bulk Bag Quote
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Tell us your target bag style, logo customization specifications, and required volume. Our manufacturing estimators will prepare a comprehensive formal quotation and complimentary digital mockup within 24 hours.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Low MOQ from 50 Units
                </span>
                <span className="flex items-center gap-1.5 text-[#72AFDB]">
                  <FileCheck className="w-4 h-4 text-[#72AFDB]" /> Free Digital Logo Mockups
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Award className="w-4 h-4 text-amber-400" /> ISO 9001:2015 Certified Plant
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Form & Trust Sidebar */}
          <Suspense fallback={
            <div className="py-20 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
              Loading Quote Configurator...
            </div>
          }>
            <RequestQuoteClient />
          </Suspense>

        </div>
      </main>

      <Footer />
    </div>
  );
}
