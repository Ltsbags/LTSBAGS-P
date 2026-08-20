'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  MessageCircle, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { CompanyContactInfo } from '@/lib/types';

export default function CatalogueSection() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    phone1: '+91 9833598338',
    socialWhatsapp: '+919833598338',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.contactInfo) {
          setContact((prev) => ({ ...prev, ...data.contactInfo }));
        }
      })
      .catch(() => {});
  }, []);

  const whatsappNumber = (contact.socialWhatsapp || '+919833598338').replace(/[^\d]/g, '');
  const whatsappCatalogueUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello LTS Bags, please send me your latest B2B Product Catalogue PDF with factory specifications.'
  )}`;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setDownloading(true);

    try {
      // Record lead in database
      if (email || whatsapp) {
        await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Catalogue Requester',
            email: email || 'catalogue@ltsbags.com',
            mobile: whatsapp || '+91 9833598338',
            productRequirement: 'Complete B2B Bag Catalogue Download',
            quantity: 'Catalogue',
            message: `Catalogue downloaded by Email: ${email}, WhatsApp: ${whatsapp}`,
          }),
        });
      }

      // Trigger catalogue download route
      window.open('/api/catalogue/download', '_blank');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      window.open('/api/catalogue/download', '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="py-20 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#1E293B] text-white rounded-3xl p-8 sm:p-12 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#72AFDB]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#72AFDB]/15 border border-[#72AFDB]/30 text-[#72AFDB] font-mono text-xs uppercase tracking-widest font-bold">
                <BookOpen className="w-4 h-4 text-[#72AFDB]" />
                <span>2026 B2B Manufacturing Edition</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-sans">
                Download Our Bag Catalogue
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Explore our full range of corporate backpacks, executive laptop bags, duffel travel bags, eco totes, and school bags with detailed dimensions, fabric options, and MOQ guidelines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>16 Product Category Specs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fabric Swatches &amp; GSM Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Branding Method Comparisons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Factory Direct MOQ Tiers</span>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="/api/catalogue/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Catalogue</span>
                </a>

                <a
                  href={whatsappCatalogueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Get Catalogue on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right: Instant PDF Request Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#72AFDB]/20 text-[#72AFDB] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Instant Digital Copy
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sent directly to your Email / WhatsApp
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div className="py-6 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="text-lg font-bold text-white">Catalogue Ready!</h4>
                    <p className="text-xs text-slate-300">
                      Your download has started. Our sales team has also emailed you the complete PDF spec sheet.
                    </p>
                    <a
                      href="/api/catalogue/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#72AFDB] hover:underline pt-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Click here if download did not start</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleDownload} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Corporate Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#72AFDB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+91 98335 98338"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#72AFDB]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={downloading}
                      className="w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloading ? 'Preparing PDF...' : 'Download Full Catalogue (PDF)'}</span>
                    </button>

                    <p className="text-[10px] text-slate-400 text-center">
                      🔒 No spam. We respect your corporate privacy.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
