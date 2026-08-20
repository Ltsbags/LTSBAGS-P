'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Clock,
  Send
} from 'lucide-react';

export default function HowToOrderSection() {
  const steps = [
    {
      num: '01',
      title: 'Submit RFQ & Design Specs',
      desc: 'Share your bag model, target fabric (1680D nylon, canvas, PU), custom logo branding preference, target price, and estimated order volume (MOQ: 50–100 units).',
      badge: 'Step 1: Consultation',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Formal Quote & Digital Tech Mockup',
      desc: 'Our commercial team prepares an itemized factory quotation with volume tier discounts and a digital 2D/3D mockup showing exact logo placement within 24 business hours.',
      badge: 'Step 2: Quotation',
      icon: MessageSquare,
    },
    {
      num: '03',
      title: 'Physical Golden Sample Approval',
      desc: 'We manufacture and courier a physical pre-production sample bag with your actual embroidery/silicone badge for physical inspection of stitching and zippers.',
      badge: 'Step 3: Sample Verification',
      icon: Package,
    },
    {
      num: '04',
      title: 'Bulk Production & QC Dispatch',
      desc: 'Upon sample approval and production advance, our automated factory completes precision cutting, bar-tack stitching, 100% AQL 2.5 QC, and door delivery across India & global ports.',
      badge: 'Step 4: Fulfillment',
      icon: Truck,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>B2B Procurement Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-serif">
            How to Order Bulk Custom Bags
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Our streamlined 4-step OEM/ODM manufacturing workflow guarantees transparency, millimeter-exact quality, and on-time dispatch for corporate buyers.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 flex flex-col justify-between space-y-4 group hover:shadow-xl hover:shadow-sky-500/5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-sky-400 group-hover:scale-110 transition-transform">
                      {s.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    {s.badge}
                  </span>

                  <h3 className="text-base font-bold text-white font-serif leading-snug">
                    {s.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center text-[11px] text-slate-500 group-hover:text-sky-400 font-medium">
                  <span>Guaranteed SLA Delivery</span>
                  <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-sky-950/60 via-slate-950 to-indigo-950/60 p-6 sm:p-8 rounded-2xl border border-sky-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white font-serif">
              Ready to start with a Pre-Production Sample?
            </h4>
            <p className="text-slate-400 text-xs">
              Fast sample dispatch within 3–5 working days with your corporate logo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/request-a-quote"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all font-sans"
            >
              <Send className="w-4 h-4" />
              <span>Request Formal Quote & Sample</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
