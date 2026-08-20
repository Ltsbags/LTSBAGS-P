import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { 
  Factory, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Scissors, 
  Printer, 
  Package, 
  Truck, 
  Layers, 
  MapPin,
  Calendar,
  Users,
  Building2,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Factory Tour & Manufacturing Infrastructure | LTS BAGS Mumbai',
  description: 'Explore the 25,000+ sq. ft. ISO 9001:2015 certified bag manufacturing facility of LTS BAGS in Mumbai, India. Automated CNC cutting, Japanese sewing lines, 3D embroidery, and AQL 2.5 QC.',
  path: '/factory-tour',
});

export default function FactoryTourPage() {
  const gallery = db.getFactoryGallery(undefined, true);
  const certs = db.getCertifications(true);
  const settings = db.getSettings();
  const metrics = settings.metrics || {
    yearsExperience: '15+ Years',
    factoryArea: '25,000+ Sq. Ft.',
    dailyCapacity: '10,000+ Bags/Day',
    monthlyCapacity: '250,000+ Bags/Month',
    workforce: '150+ Skilled Artisans',
    minOrderQuantity: '50 - 100 Units',
    onTimeDeliveryRate: '99.8%',
    countriesServed: '15+ Countries',
    certifications: 'ISO 9001:2015, AQL 2.5 QC',
    qualityStandards: '100% In-Line & Final Inspection',
  };

  const departments = [
    { name: 'Cutting Department', icon: Scissors, desc: 'Automated multi-ply CNC fabric laser and die-cutting machines ensuring sub-millimeter precision.' },
    { name: 'Stitching & Assembly', icon: Factory, desc: 'Heavy-duty Juki & Brother industrial programmable bar-tack sewing stations with reinforced strap box-X stitching.' },
    { name: 'Custom Branding & Embroidery', icon: Printer, desc: 'Tajima high-speed multi-head 3D embroidery, heat-debossing, and eco-friendly screen printing setups.' },
    { name: 'Quality Assurance & Testing', icon: ShieldCheck, desc: 'Zipper cycle testing, fabric tensile tear-resistance testing, drop-load impact tests, and AQL 2.5 final inspection.' },
    { name: 'Finishing & Packaging', icon: Package, desc: 'Thread trimming, anti-moisture silica packing, barcode tagging, and double-wall heavy master carton boxing.' },
    { name: 'Storage & Global Dispatch', icon: Truck, desc: 'Palletized finished goods warehouse connected to JNPT Port and Mumbai Airport for expedited worldwide export.' },
  ];

  const orgSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Factory Tour & Infrastructure', url: '/factory-tour' },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SchemaScript schema={[orgSchema, breadcrumbSchema]} />
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="bg-slate-900 border-b border-slate-800 py-16 sm:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
              <Factory className="w-4 h-4 text-sky-400" />
              <span>Authentic Manufacturing Transparency</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight">
                Inside Our Bag Manufacturing Facility
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Operating a full-scale 25,000+ sq. ft. manufacturing unit in the Mumbai industrial belt, LTS BAGS PRIVATE LIMITED combines modern automated machinery with master artisan craftsmanship to fulfill high-volume OEM/ODM bag production.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Facility Area</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-serif">{metrics.factoryArea}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Daily Output</span>
                <span className="text-xl sm:text-2xl font-black text-sky-400 font-serif">{metrics.dailyCapacity}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Skilled Artisans</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-serif">{metrics.workforce}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Quality Benchmark</span>
                <span className="text-xl sm:text-2xl font-black text-purple-400 font-serif">ISO 9001:2015</span>
              </div>
            </div>

          </div>
        </section>

        {/* FACTORY INFRASTRUCTURE OVERVIEW */}
        <section className="py-16 sm:py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
                Specialized Production Units
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
                End-to-End Plant Infrastructure
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                From raw fabric rolls to master-carton container loading, every step is executed in-house for maximum quality control and on-time compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, i) => {
                const Icon = dept.icon;
                return (
                  <div
                    key={i}
                    className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-sky-500/60 transition-all duration-300 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white font-serif">{dept.name}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{dept.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Production Stage
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* VERIFIED FACTORY PHOTOGRAPHS ARCHIVE */}
        <section className="py-16 sm:py-24 bg-slate-900 border-t border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
                  Authentic Facility Archive
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-serif mt-1">
                  Plant & Department Gallery
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Real photographs of our cutting tables, heavy stitching lines, embroidery machines, and dispatch docks.
                </p>
              </div>

              <Link
                href="/request-a-quote"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 self-start md:self-auto transition-all shadow-md"
              >
                <span>Request Factory Visit & Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-500/50 transition-all duration-300 flex flex-col justify-between group shadow-sm"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.altText || item.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-xs text-sky-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-800">
                      {item.department}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* QUALITY CERTIFICATIONS & AUDIT COMPLIANCE */}
        <section className="py-16 sm:py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                International Standards
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
                Quality Certifications & Compliance
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Certified quality management protocols ensuring consistent tensile strength, seam reliability, and non-toxic materials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white font-serif">{cert.name}</h3>
                      <p className="text-xs text-amber-400/90 font-medium mt-0.5">{cert.issuingOrganization}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono">
                      <div className="text-slate-400">Cert No: <span className="text-slate-200 font-bold">{cert.certificateNumber}</span></div>
                      <div className="text-slate-400">Valid Through: <span className="text-emerald-400 font-bold">{cert.expiryDate}</span></div>
                    </div>

                    {cert.description && (
                      <p className="text-slate-400 text-xs leading-relaxed">{cert.description}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center text-[11px] text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active & Verified Status
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="bg-sky-950/60 border-t border-sky-900/40 py-16 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
              Schedule an On-Site Factory Audit or Sample Review
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              We welcome corporate procurement managers, brand merchandisers, and institutional buyers to inspect our production lines in Dharavi, Mumbai.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/request-a-quote"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <span>Request Formal Quotation & Tech Pack</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-6 py-3 rounded-xl text-xs border border-slate-700"
              >
                <span>Contact Factory Sales Team</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
