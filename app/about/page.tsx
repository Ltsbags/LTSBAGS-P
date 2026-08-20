'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import WhyChooseUs from '@/components/WhyChooseUs';
import ManufacturingProcess from '@/components/ManufacturingProcess';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Layers, 
  Send,
  PhoneCall,
  Target,
  Eye,
  Factory
} from 'lucide-react';
import { AboutPageContent, CompanyContactInfo } from '@/lib/types';

export default function AboutPage() {
  const [about, setAbout] = useState<Partial<AboutPageContent>>({
    headline: 'Over a Decade of Engineering Premium Luggage & Custom Corporate Bags',
    subtitle: 'Empowering international corporations, brand distributors, and retail chains with state-of-the-art bag production, strict quality control, and direct factory pricing.',
    storyContent: 'LTS BAGS PRIVATE LIMITED operates a modern manufacturing facility equipped with computerized pattern lasers, heavy-duty bar-tacking stitch machines, and automated hydraulic embossing presses. We specialize in OEM (Original Equipment Manufacturing) and ODM (Original Design Manufacturing) solutions for corporate employee onboarding kits, IT tech companies, university athletic programs, and retail bag exporters.',
    missionContent: 'To deliver world-class luggage and custom bag solutions with uncompromising quality, innovative craftsmanship, and reliable on-time execution for every B2B client globally.',
    visionContent: 'To be India\'s most trusted global partner in sustainable bag manufacturing, recognized for technological excellence, ethical production, and bespoke design versatility.',
    factoryCapacity: '50,000 Sq. Ft. Facility | 250+ Skilled Artisans | 100,000+ Units Monthly Capacity',
    qualityPolicy: 'ISO 9001:2015 & BSCI Compliant Plant. Every bag manufactured in our factory adheres to stringent ethical labor standards, zero child labor policies, and eco-conscious waste recycling. Fabrics undergo strict tensile and water-resistance testing.',
    aboutImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
  });

  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    companyName: 'LTS BAGS PRIVATE LIMITED',
    phone1: '+91 98335 98338',
    isoCertificate: 'ISO 9001:2015 & BSCI Compliant Plant',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.about) {
          setAbout((prev) => ({ ...prev, ...data.about }));
        }
        if (data?.contactInfo) {
          setContact((prev) => ({ ...prev, ...data.contactInfo }));
        }
      })
      .catch(() => {
        // Silently retain defaults
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* Page Banner Header */}
        <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'About Us', url: '/about' }]} />
            <div className="mt-4 max-w-3xl space-y-3">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Custom Bag Manufacturer
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-white">
                About {contact.companyName || 'LTS BAGS PRIVATE LIMITED'}
              </h1>
              <p className="text-slate-300 text-base leading-relaxed">
                {about.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Story & Factory Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-5">
                <span className="text-amber-700 font-bold text-xs uppercase tracking-widest font-mono bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  15+ Years Factory Excellence
                </span>
                <h2 className="text-3xl font-black text-slate-900 font-serif leading-tight">
                  {about.headline}
                </h2>
                
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-3">
                  {about.storyContent}
                </div>

                <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>50,000 Sq. Ft. Facility</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>250+ Skilled Artisans</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AQL 2.5 QC Standard</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Global Export Logistics</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                  <img
                    src={about.aboutImageUrl || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000'}
                    alt="LTS BAGS Manufacturing Workshop Floor"
                    referrerPolicy="no-referrer"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white space-y-1">
                      <p className="font-bold text-lg font-serif">State-of-the-Art Stitching & Pattern Lines</p>
                      <p className="text-xs text-slate-300">{about.factoryCapacity}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-14 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Our Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {about.missionContent}
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Our Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {about.visionContent}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <WhyChooseUs />

        {/* MANUFACTURING PROCESS */}
        <ManufacturingProcess />

        {/* CERTIFICATIONS & QUALITY POLICY */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 sm:p-12 border border-slate-700 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {contact.isoCertificate || 'ISO 9001:2015 Certified Plant'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">
                  Our Commitment to Quality, Durability & Ethical Workplace
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {about.qualityPolicy}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 px-6 rounded-xl text-center shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Factory Audit & Sample</span>
                </Link>
                {contact.phone1 && (
                  <a
                    href={`tel:${contact.phone1.replace(/\s+/g, '')}`}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl text-center border border-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>Speak with Direct Factory Sales</span>
                  </a>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
