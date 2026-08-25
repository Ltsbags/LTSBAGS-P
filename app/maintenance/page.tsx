import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Wrench, Phone, Mail, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Scheduled Maintenance | LTS Bags Factory',
  description: 'Our website is undergoing scheduled maintenance and product catalog updates. We will be back online shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  const settings = db.getSettings();
  const contact = settings.contactInfo;
  const maintenance = settings.maintenance || {
    enabled: false,
    title: 'Scheduled Factory System Maintenance',
    message: 'We are currently upgrading our B2B catalog and quotation portal to serve you better. Our manufacturing units and dispatch operations are operating normally.',
    estimatedEndTime: 'Expected back online shortly',
    contactPhone: contact?.phone1 || '+91 98335 98338',
    contactEmail: contact?.email1 || 'info@ltsbags.com',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 px-6 py-5 bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white font-serif shadow-lg shadow-sky-600/30">
              LTS
            </div>
            <div>
              <span className="font-serif font-black text-lg text-white tracking-tight">LTS BAGS</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-sky-400 font-mono font-medium">B2B Manufacturing</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-inner">
            <Wrench className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>System Upgrade In Progress</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
              {maintenance.title || 'Scheduled System Maintenance'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              {maintenance.message || 'We are currently enhancing our website catalog, pricing algorithms, and sample request workflows. Our factory production and physical shipments remain fully operational.'}
            </p>
          </div>

          {/* Urgent Inquiries Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" /> Direct Factory Sales
              </div>
              <p className="text-xs text-slate-400">For urgent bulk production briefs & quotes:</p>
              <a
                href={`tel:${(maintenance.contactPhone || contact?.phone1 || '+919833598338').replace(/\s+/g, '')}`}
                className="text-sm font-bold text-white hover:text-sky-400 transition-colors block font-mono"
              >
                {maintenance.contactPhone || contact?.phone1 || '+91 98335 98338'}
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" /> Email Enquiries
              </div>
              <p className="text-xs text-slate-400">Send purchase orders & tech packs to:</p>
              <a
                href={`mailto:${maintenance.contactEmail || contact?.email1 || 'info@ltsbags.com'}`}
                className="text-sm font-bold text-white hover:text-sky-400 transition-colors block font-mono truncate"
              >
                {maintenance.contactEmail || contact?.email1 || 'info@ltsbags.com'}
              </a>
            </div>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="pt-2">
            <a
              href={`https://wa.me/${(contact?.socialWhatsapp || '+919833598338').replace(/[^0-9]/g, '')}?text=Hello%20LTS%20Bags%20Team%2C%20I%20am%20inquiring%20about%20custom%20bag%20manufacturing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all group"
            >
              <span>Chat Directly on WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 9001:2015 Certified Manufacturing Facility — Mumbai, India</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-400 bg-slate-900/30">
        <p>© {new Date().getFullYear()} LTS BAGS PRIVATE LIMITED. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
