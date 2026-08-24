import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import FeatureStrip from '@/components/FeatureStrip';
import ProductCard from '@/components/ProductCard';
import CustomManufacturingSection from '@/components/CustomManufacturingSection';
import FactoryGallerySection from '@/components/FactoryGallerySection';
import WhyChooseUs from '@/components/WhyChooseUs';
import ManufacturingProcess from '@/components/ManufacturingProcess';
import CustomizationSection from '@/components/CustomizationSection';
import HowToOrderSection from '@/components/HowToOrderSection';
import ClientLogosSection from '@/components/ClientLogosSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CatalogueSection from '@/components/CatalogueSection';
import FaqSection from '@/components/FaqSection';
import FactoryQuoteSection from '@/components/FactoryQuoteSection';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';
import { 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Package
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'LTS BAGS PRIVATE LIMITED | Custom Bag Manufacturer in Mumbai, India',
  description: 'Custom bag manufacturer in Mumbai, India. Manufacturing backpacks, school bags, laptop bags, corporate bags, travel bags, duffle bags, tote bags, jute bags, promotional bags and custom bags for bulk orders with OEM/ODM customization and direct factory pricing.',
  path: '/',
});

export default function HomePage() {
  const categoryHierarchy = db.getCategoryHierarchy();
  const featuredProducts = db.getProducts().filter((p) => p.isFeatured || p.moq <= 100).slice(0, 6);
  const slides = db.getSlides(true);
  const settings = db.getSettings();
  const orgSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <SchemaScript schema={orgSchema} />
      <SchemaScript schema={webSiteSchema} />
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <HeroSlider initialSlides={slides} autoplayInterval={5000} />

        {/* 2. TRUST / CREDIBILITY STRIP */}
        <FeatureStrip />

        {/* 3. PRODUCT CATEGORIES (Complete Category Hierarchy) */}
        <section id="categories-section" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
                  Bulk Product Lines
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans mt-2">
                  Explore Our Bag Categories
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Engineered for corporate gifting, educational institutions, retail private-labels, and industrial applications.
                </p>
              </div>
              <Link
                href="/products"
                className="text-[#72AFDB] hover:text-[#5C9BC7] font-bold text-sm flex items-center gap-1 hover:underline shrink-0"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryHierarchy.map((cat) => (
                <div
                  key={cat.id}
                  className="group bg-slate-50 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 hover:border-[#72AFDB] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <Link href={`/products/${cat.slug}`} className="block">
                    <div className="aspect-16/10 overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        referrerPolicy="no-referrer"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-lg font-bold font-sans group-hover:text-[#72AFDB] transition-colors leading-tight">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Subcategories pill links */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Popular Subcategories:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.slice(0, 4).map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/products/${cat.slug}/${sub.slug}`}
                              className="text-[11px] font-medium bg-white dark:bg-slate-900 hover:bg-[#72AFDB] hover:text-white dark:hover:bg-[#72AFDB] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          {cat.subcategories.length > 4 && (
                            <Link
                              href={`/products/${cat.slug}`}
                              className="text-[11px] font-medium text-[#72AFDB] px-1 py-1 hover:underline"
                            >
                              +{cat.subcategories.length - 4} more
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-bold text-[#72AFDB] pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                      <Link href={`/products/${cat.slug}`} className="hover:underline">
                        Explore Collection
                      </Link>
                      <Link href={`/products/${cat.slug}`} aria-label={`Explore ${cat.name}`}>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. FEATURED PRODUCTS CATALOG */}
        <section className="py-20 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
                Top B2B Sellers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                Featured Custom Bag Models
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Proven models manufactured for leading IT corporations, universities, sports academies, and retail distributors with low MOQ options and custom logo application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                <Package className="w-4 h-4" />
                <span>Browse All Custom Bags &amp; Specifications</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* 5. CUSTOM BAG MANUFACTURING SECTION (OEM / ODM For Diverse Sectors) */}
        <CustomManufacturingSection />

        {/* 6. FACTORY SECTION / INSIDE OUR BAG MANUFACTURING FACILITY */}
        <FactoryGallerySection />

        {/* 7. WHY CHOOSE LTS BAGS? (8 CARDS) */}
        <WhyChooseUs />

        {/* 8. MANUFACTURING PROCESS (FROM DESIGN TO DELIVERY - 9 STEPS) */}
        <ManufacturingProcess />

        {/* 9. CUSTOMIZATION SECTION (12 OPTIONS) */}
        <CustomizationSection />

        {/* 10. BULK ORDER PROCESS (6 STEPS) */}
        <HowToOrderSection />

        {/* 11. CLIENT LOGOS / TRUSTED BY BUSINESSES */}
        <ClientLogosSection />

        {/* 11. TESTIMONIALS SECTION */}
        <TestimonialsSection />

        {/* 12. CATALOGUE DOWNLOAD SECTION */}
        <CatalogueSection />

        {/* 13. FAQ SECTION (11 B2B QUESTIONS) */}
        <FaqSection />

        {/* 14. B2B QUOTE FORM (15 FIELDS & FACTORY DIRECT CONFIRMATION) */}
        <FactoryQuoteSection />

      </main>

      <Footer />
    </div>
  );
}

