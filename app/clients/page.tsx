import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchemaScript from '@/components/SchemaScript';
import { db } from '@/lib/db';
import { generatePageMetadata, generateOrganizationSchema } from '@/lib/seo';
import { 
  Building2, 
  ExternalLink, 
  Send, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Factory, 
  Briefcase,
  Users,
  ChevronRight,
  Globe
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Our Corporate Clients & Brand Partners | LTS BAGS PRIVATE LIMITED',
  description: 'Trusted OEM/ODM bulk bag manufacturer for leading MNCs, IT corporations, financial institutions, educational hubs, and global brands.',
  path: '/clients',
});

export default function ClientsPage() {
  const activeClients = db.getClients(true);
  const orgSchema = generateOrganizationSchema();
  const settings = db.getSettings();
  const contact = settings.contactInfo;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <SchemaScript schema={orgSchema} />
      <Navbar />

      <main className="flex-1">
        
        {/* HERO HEADER */}
        <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Corporate Trust & Brand Portfolio</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif">
                Our Corporate Clients
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We are proud to be the preferred OEM & ODM custom bag manufacturer for leading multinational corporations, tech giants, financial institutions, sports organizations, and educational campuses across India and worldwide.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 500+ Active Corporate Accounts
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Factory className="w-4 h-4 text-sky-400" /> 10,000+ Daily Production Unit Capacity
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Award className="w-4 h-4 text-amber-400" /> ISO 9001:2015 Certified Plant
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CLIENT LOGOS DISPLAY SECTION */}
        <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-sky-700 dark:text-sky-300 font-bold text-xs uppercase tracking-widest font-mono bg-sky-50 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                Client Brand Showcase
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-serif">
                Trusted by Industry Leaders
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                Custom laptop backpacks, executive briefcases, travel duffels, and onboarding gift kits crafted with precision branding.
              </p>
            </div>

            {/* LOGOS RESPONSIVE GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {activeClients.map((client) => (
                <div
                  key={client.id}
                  className="group bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:border-sky-400 dark:hover:border-sky-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between gap-3 text-center"
                >
                  {/* Logo Container with Aspect-Ratio & Object-Contain */}
                  <div className="w-full h-20 sm:h-24 flex items-center justify-center p-2 relative rounded-xl bg-slate-50/80 dark:bg-slate-900/50 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.logoUrl}
                      alt={`${client.name} Client Logo`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Name & Website */}
                  <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs font-serif line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {client.name}
                    </h3>

                    {client.websiteUrl && (
                      <a
                        href={client.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 hover:underline mt-1 font-medium"
                      >
                        <Globe className="w-3 h-3 text-sky-500 shrink-0" />
                        <span>Visit Site</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* TRUST HIGHLIGHT STATS */}
            <div className="mt-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-1">
                <p className="text-3xl font-black text-sky-600 dark:text-sky-400 font-serif">15+ Years</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Factory Experience</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Serving corporate brands nationwide since 2011</p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-4 sm:pt-0 sm:pl-6">
                <p className="text-3xl font-black text-sky-600 dark:text-sky-400 font-serif">99.8%</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">On-Time Dispatch</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Strict adherence to event timelines and delivery dates</p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-4 sm:pt-0 sm:pl-6">
                <p className="text-3xl font-black text-sky-600 dark:text-sky-400 font-serif">100% Quality QC</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Zero Defect Guarantee</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">5-step stress, zipper pull & seam load inspection</p>
              </div>
            </div>

          </div>
        </section>

        {/* CTA SECTION FOR NEW CLIENTS */}
        <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
              <Users className="w-4 h-4 text-amber-400" />
              Join Our Corporate Client List
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-serif">
              Become an LTS BAGS Corporate Client Today
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Looking for custom branded backpacks for employee onboarding, annual summits, or retail distribution? Get physical sample bags and transparent bulk factory quotes within 24 hours.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Request Custom Bulk Quote</span>
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <span>Explore Products</span>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
