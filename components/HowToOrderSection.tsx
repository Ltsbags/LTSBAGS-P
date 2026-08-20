'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Factory, 
  ShieldCheck, 
  Truck, 
  Send,
  ArrowRight
} from 'lucide-react';
import QuoteModal from './QuoteModal';

export default function HowToOrderSection() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const steps = [
    {
      stepNumber: '01',
      title: 'Requirement',
      description: 'Share your product style, required quantity, target material, and logo artwork.',
      icon: FileText,
    },
    {
      stepNumber: '02',
      title: 'Quotation',
      description: 'Receive transparent factory unit pricing based on quantity tier and customization specs.',
      icon: DollarSign,
    },
    {
      stepNumber: '03',
      title: 'Sample Approval',
      description: 'Review and approve the physical pre-production golden sample before mass production.',
      icon: CheckCircle,
    },
    {
      stepNumber: '04',
      title: 'Bulk Production',
      description: 'Bulk CNC cutting, stitching, and logo application begin upon sample sign-off.',
      icon: Factory,
    },
    {
      stepNumber: '05',
      title: 'Quality Check',
      description: '100% inspection for seam strength, zipper action, stress load, and alignment accuracy.',
      icon: ShieldCheck,
    },
    {
      stepNumber: '06',
      title: 'Dispatch',
      description: 'Carton packaging, moisture protection, and door-to-door delivery across India & global export.',
      icon: Truck,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Simplified Ordering
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            How to Place a Bulk Bag Order (6 Steps)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            A seamless, transparent B2B workflow designed to eliminate misunderstandings and guarantee on-time delivery.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#72AFDB] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-[#72AFDB]">
                      {step.stepNumber}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs group-hover:bg-[#72AFDB] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg font-sans group-hover:text-[#72AFDB] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-[#72AFDB] font-semibold">
                  <span>Step {step.stepNumber} of 06</span>
                  <span className="text-slate-400">Direct Process</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-md cursor-pointer hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>Start Step 01: Share Your Requirement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct="Bulk Bag Manufacturing Order"
      />
    </section>
  );
}
