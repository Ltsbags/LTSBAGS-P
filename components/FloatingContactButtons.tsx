'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Send, X, FileText } from 'lucide-react';
import { CompanyContactInfo } from '@/lib/types';
import QuoteModal from './QuoteModal';

export default function FloatingContactButtons() {
  const pathname = usePathname();
  const [showPhoneMenu, setShowPhoneMenu] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    phone1: '+91 9833598338',
    phone2: '+91 9619961971',
    socialWhatsapp: '+919833598338',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.contactInfo) {
          setContact((prev) => ({ ...prev, ...data.contactInfo }));
        }
      })
      .catch(() => {
        // Silently retain defaults
      });
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const primaryPhoneDisplay = contact.phone1 || '+91 9833598338';
  const secondaryPhoneDisplay = contact.phone2 || '+91 9619961971';
  const primaryPhoneClean = primaryPhoneDisplay.replace(/[^\d+]/g, '');
  const secondaryPhoneClean = secondaryPhoneDisplay.replace(/[^\d+]/g, '');

  const whatsappNumberClean = (contact.socialWhatsapp || primaryPhoneClean).replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumberClean}?text=${encodeURIComponent(
    'Hello LTS BAGS PRIVATE LIMITED (ltsbags.com), I am looking for custom bag manufacturing and bulk wholesale pricing.'
  )}`;

  return (
    <>
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />

      {/* 1. DESKTOP FLOATING BUTTONS (Hidden on mobile) */}
      <div className="hidden sm:flex fixed bottom-20 right-6 z-40 flex-col items-end gap-3 pointer-events-auto print:hidden">
        
        {/* Expanded Phone Numbers Popover */}
        {showPhoneMenu && (
          <div className="bg-[#1E293B] text-white p-4 rounded-2xl shadow-2xl border border-slate-700 w-64 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#72AFDB] font-mono">
                Call Factory Direct
              </span>
              <button
                onClick={() => setShowPhoneMenu(false)}
                className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${primaryPhoneClean}`}
                className="flex items-center gap-2 p-2.5 bg-slate-800 hover:bg-[#72AFDB] rounded-xl transition-colors font-bold text-slate-100 group/btn"
              >
                <Phone className="w-4 h-4 text-[#72AFDB] group-hover/btn:text-white" />
                <span>{primaryPhoneDisplay}</span>
              </a>
              <a
                href={`tel:${secondaryPhoneClean}`}
                className="flex items-center gap-2 p-2.5 bg-slate-800 hover:bg-[#72AFDB] rounded-xl transition-colors font-bold text-slate-100 group/btn"
              >
                <Phone className="w-4 h-4 text-[#72AFDB] group-hover/btn:text-white" />
                <span>{secondaryPhoneDisplay}</span>
              </a>
            </div>
            <p className="text-[10px] text-[#A5A5A5] text-center">
              LTS BAGS Mumbai Sales Desk
            </p>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3">
          {/* Quick Quote Trigger Button */}
          <button
            onClick={() => setQuoteModalOpen(true)}
            aria-label="Request Quick B2B Quote"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg hover:scale-105 transition-all duration-300 border-2 border-white/20 cursor-pointer shadow-amber-500/30"
          >
            <FileText className="w-5 h-5 text-slate-950" />
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-[#1E293B] text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
              Quick Quote Form
            </span>
          </button>

          {/* Call Button */}
          <button
            onClick={() => setShowPhoneMenu(!showPhoneMenu)}
            aria-label="Call LTS BAGS PRIVATE LIMITED"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white shadow-lg hover:scale-105 transition-all duration-300 border-2 border-white/20 cursor-pointer shadow-[#72AFDB]/30"
          >
            <Phone className="w-5 h-5 text-white" />
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-[#1E293B] text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
              Call Us: +91 9833598338
            </span>
          </button>

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp with LTS BAGS"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:scale-105 transition-all duration-300 border-2 border-white/20"
          >
            <MessageCircle className="w-6 h-6 text-white fill-current" />
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              WhatsApp Quote
            </span>
          </a>
        </div>

      </div>

      {/* 2. MOBILE STICKY BOTTOM CTA BAR (Only visible on screens < 640px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-3 flex items-center justify-between gap-2 shadow-2xl print:hidden safe-area-pb">
        
        {/* WhatsApp Mobile CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs tracking-tight shadow-md"
        >
          <MessageCircle className="w-4 h-4 fill-current shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Call Mobile CTA */}
        <a
          href={`tel:${primaryPhoneClean}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#72AFDB] active:bg-[#5C9BC7] text-white font-bold text-xs tracking-tight shadow-md"
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>Call Sales</span>
        </a>

        {/* Get Quote Mobile CTA */}
        <button
          onClick={() => setQuoteModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs tracking-tight shadow-md"
        >
          <Send className="w-4 h-4 shrink-0" />
          <span>Get Quote</span>
        </button>

      </div>
    </>
  );
}

