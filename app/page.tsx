import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import WhyChooseUs from '@/components/WhyChooseUs';
import ManufacturingProcess from '@/components/ManufacturingProcess';
import HowToOrderSection from '@/components/HowToOrderSection';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateOrganizationSchema } from '@/lib/seo';
import { 
  Briefcase, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Package, 
  Layers, 
  Building2, 
  Users, 
  Award, 
  PhoneCall,
  Clock,
  ChevronRight,
  Sparkles,
  CreditCard
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'LTS BAGS PRIVATE LIMITED - Custom B2B Bag Manufacturer & Wholesale Supplier',
  description: 'Leading OEM & ODM manufacturer of corporate backpacks, executive laptop briefcases, travel duffels, and eco canvas totes with custom logo branding and direct factory pricing.',
  path: '/',
});

export default function HomePage() {
  const categories = db.getCategories();
  const featuredProducts = db.getProducts().filter((p) => p.isFeatured || p.moq <= 100).slice(0, 6);
  const latestBlogs = db.getBlogs().slice(0, 3);
  const slides = db.getSlides(true);
  const settings = db.getSettings();
  const orgSchema = generateOrganizationSchema();

  const homepage = settings.homepage;
  const contact = settings.contactInfo;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <SchemaScript schema={orgSchema} />
      <Navbar />

      <main className="flex-1">
        
        {/* HOMEPAGE HERO IMAGE SLIDER */}
        <HeroSlider initialSlides={slides} autoplayInterval={5000} />

        {/* STATS STRIP */}
        <section className="bg-sky-600 dark:bg-sky-700 text-white py-8 border-y border-sky-700 dark:border-sky-800 shadow-inner transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {(homepage?.stats && homepage.stats.length > 0 ? homepage.stats : [
                { id: 's1', value: '15+ Years', label: 'Manufacturing Experience' },
                { id: 's2', value: '5,000,000+', label: 'Bags Shipped Globally' },
                { id: 's3', value: '1,200+', label: 'Corporate Clients' },
                { id: 's4', value: '99.4%', label: 'On-Time Dispatch Rate' }
              ]).map((st, i) => (
                <div key={st.id || i}>
                  <p className="text-3xl sm:text-4xl font-black font-serif">{st.value}</p>
                  <p className="text-sky-100 text-xs font-medium uppercase tracking-wider mt-1">{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES SECTION */}
        <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-widest font-mono bg-sky-50 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  Product Categories
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-serif mt-2">
                  Specialized Bag Manufacturing Categories
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                View Full Catalog <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group bg-slate-50 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-16/10 overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold font-serif group-hover:text-sky-300 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* FEATURED PRODUCTS CATALOG PREVIEW */}
        <section className="py-20 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-widest font-mono bg-sky-100/80 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-300 dark:border-sky-800">
                Top B2B Sellers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-serif">
                Featured Custom Bag Models
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Tested and trusted by leading MNCs, IT corporations, sports leagues, and educational institutions. Custom logo printing and sample prototyping available.
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
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                <span>Browse All Custom Bags & Specs</span>
                <ArrowRight className="w-4 h-4 text-sky-400 dark:text-sky-200" />
              </Link>
            </div>

          </div>
        </section>

        {/* WHY CHOOSE US */}
        <WhyChooseUs />

        {/* MANUFACTURING PROCESS */}
        <ManufacturingProcess />

        {/* B2B HOW TO ORDER WORKFLOW */}
        <HowToOrderSection />

        {/* LATEST BLOGS */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-widest font-mono bg-sky-100/80 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-300 dark:border-sky-800">
                  Manufacturing Insights
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-serif mt-2">
                  B2B Bag Buying Guides & Industry News
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Read All Articles <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col"
                >
                  <Link href={`/blog/${blog.slug}`} className="aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                        {blog.category}
                      </span>
                      <Link href={`/blog/${blog.slug}`}>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      <Link href={`/blog/${blog.slug}`} className="text-sky-700 dark:text-sky-400 font-bold hover:underline">
                        Read Guide →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* CONTACT / QUOTE CTA */}
        <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
              <PhoneCall className="w-4 h-4 text-sky-400" />
              Instant Factory Consultation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif">
              {homepage?.ctaTitle || 'Ready to Order Custom Bags for Your Brand?'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {homepage?.ctaDescription || 'Send us your bag design drawings, sample requests, or target budget. Our sales team will deliver custom samples and transparent factory unit pricing within 24 hours.'}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
              >
                <Send className="w-5 h-5" />
                <span>Submit Wholesale Quote Form</span>
              </Link>
              {contact?.phone1 && (
                <a
                  href={`tel:${contact.phone1.replace(/\s+/g, '')}`}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-base"
                >
                  <PhoneCall className="w-4 h-4 text-[#72AFDB]" />
                  <span>Call Sales: {contact.phone1}</span>
                </a>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
