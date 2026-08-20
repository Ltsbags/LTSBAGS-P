import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy | LTS BAGS PRIVATE LIMITED',
  description: 'Privacy policy and data protection terms for LTS BAGS PRIVATE LIMITED corporate client enquiries.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Breadcrumbs items={[{ name: 'Privacy Policy', url: '/privacy-policy' }]} />

          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h1 className="text-3xl font-black text-slate-900 font-serif">Privacy Policy</h1>
            <p className="text-slate-500 text-xs">Last updated: July 2026</p>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">1. Corporate Information Collection</h2>
              <p>
                LTS BAGS PRIVATE LIMITED collects corporate contact details (Name, Company, Email, Phone number, and product specifications) solely for the purpose of fulfilling wholesale bag manufacturing quotes, sample distribution, and corporate contract processing.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">2. Non-Disclosure & Intellectual Property</h2>
              <p>
                All custom logo vectors, tech packs, CAD designs, and trademark artwork uploaded or submitted to LTS BAGS PRIVATE LIMITED remain 100% the property of the client. We do not re-sell, disclose, or distribute client designs to third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">3. Data Security & Storage</h2>
              <p>
                Client enquiries and transaction records are encrypted and stored in secure cloud databases. We do not sell corporate contact databases to marketing aggregators.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 font-serif">4. Contacting Data Officer</h2>
              <p>
                For data erasure or non-disclosure agreement (NDA) execution requests, contact our compliance team at <a href="mailto:info@ltsbags.com" className="text-amber-700 hover:underline font-bold">info@ltsbags.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

