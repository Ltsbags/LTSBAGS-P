import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Terms & Conditions | LTS BAGS PRIVATE LIMITED Wholesale Manufacturing',
  description: 'Terms and conditions for B2B wholesale orders, MOQ requirements, sample production, and shipping policies with LTS BAGS PRIVATE LIMITED.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Breadcrumbs items={[{ name: 'Terms & Conditions', url: '/terms' }]} />

          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h1 className="text-3xl font-black text-slate-900 font-serif">B2B Terms & Conditions</h1>
            <p className="text-slate-500 text-xs">Last updated: July 2026</p>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">1. Wholesale Orders & Minimum Quantities</h2>
              <p>
                LTS BAGS PRIVATE LIMITED operates strictly as a B2B manufacturer. Minimum Order Quantity (MOQ) applies as specified per model (standard MOQ is 100 units). Pre-production physical golden samples require a nominal sampling deposit refundable against the final bulk production invoice.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">2. Custom Logo & Artwork Approvals</h2>
              <p>
                Production commences only after digital artwork proof or physical golden sample sign-off by the buyer. Color matching adheres to Pantone PMS standards within +/- 5% tolerance across fabric dye lots.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">3. Quality Inspection & Warranty</h2>
              <p>
                All finished shipments are inspected under strict quality control standards. Any manufacturing defect reported within 30 days of shipment receipt will be replaced or credited per contract SLA.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">4. Shipping & Freight Terms</h2>
              <p>
                Orders are offered under FOB (Free On Board), CIF, or Door-to-Door DDP terms per commercial invoice agreement.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

