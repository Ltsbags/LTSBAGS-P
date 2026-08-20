import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomizationSection from '@/components/CustomizationSection';
import SchemaScript from '@/components/SchemaScript';
import { generatePageMetadata } from '@/lib/seo';
import { Palette } from 'lucide-react';

export const metadata = generatePageMetadata({
  title: 'Custom Bag Manufacturing & OEM/ODM Services | LTS BAGS PRIVATE LIMITED',
  description: 'Custom logo printing, 3D embroidery, Pantone fabric matching, private label branding, and custom bag pattern design for corporate clients.',
  path: '/customization',
});

export default function CustomizationPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-slate-950 text-[#333333] dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-[#333333] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#67B0DF]/20 border border-[#67B0DF]/40 text-[#67B0DF] font-mono text-xs uppercase tracking-widest font-bold">
              <Palette className="w-4 h-4 text-[#67B0DF]" />
              BESPOKE BRANDING & TAILORING
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
              CUSTOM BAG MANUFACTURING & OEM / ODM
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              From logo embroidery and custom colorways to private label hangtags and bespoke compartment layouts, LTS BAGS builds your bags exactly to your brand specifications.
            </p>
          </div>
        </section>

        <CustomizationSection />
      </main>

      <Footer />
    </div>
  );
}
