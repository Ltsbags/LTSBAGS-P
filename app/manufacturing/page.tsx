import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ManufacturingProcess from '@/components/ManufacturingProcess';
import WhyChooseUs from '@/components/WhyChooseUs';
import SchemaScript from '@/components/SchemaScript';
import { generatePageMetadata } from '@/lib/seo';
import { Factory, ShieldCheck } from 'lucide-react';

export const metadata = generatePageMetadata({
  title: 'Our Manufacturing Facility & Process | LTS BAGS PRIVATE LIMITED',
  description: 'Inside LTS BAGS ISO 9001:2015 certified bag manufacturing unit in Mumbai, India. Daily capacity 10,000+ units, automated CNC cutting, 3D embroidery, and strict quality control.',
  path: '/manufacturing',
});

export default function ManufacturingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-slate-950 text-[#333333] dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-[#333333] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#67B0DF]/20 border border-[#67B0DF]/40 text-[#67B0DF] font-mono text-xs uppercase tracking-widest font-bold">
              <Factory className="w-4 h-4 text-[#67B0DF]" />
              ISO 9001:2015 CERTIFIED PLANT
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
              STATE-OF-THE-ART BAG MANUFACTURING
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Spanning 25,000+ sq. ft. in Mumbai, India with 150+ skilled craftsmen and automated machinery, producing over 10,000 custom bags daily.
            </p>
          </div>
        </section>

        <ManufacturingProcess />

        <WhyChooseUs />
      </main>

      <Footer />
    </div>
  );
}
