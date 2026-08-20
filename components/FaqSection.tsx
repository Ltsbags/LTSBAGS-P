'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, PhoneCall } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What is your Minimum Order Quantity (MOQ)?',
      answer: 'Our standard Minimum Order Quantity starts from 50 to 100 units per style depending on design complexity, material specifications, and customization techniques. Note: MOQ may vary depending on design, material and customization requirements.',
    },
    {
      question: 'Do you manufacture custom bags according to client tech packs?',
      answer: 'Yes. We are an OEM and ODM custom bag manufacturer. You can provide CAD drawings, tech packs, reference images, or physical samples, and our pattern masters will engineer the bag to your exact dimensional and aesthetic specifications.',
    },
    {
      question: 'Can I add my company logo or branding to the bags?',
      answer: 'Absolutely. We offer multiple in-house branding techniques including high-density 3D embroidery, precision silk screen printing, molded rubber/silicone badges, debossed PU leather patches, laser-engraved metal plates, and custom woven tags.',
    },
    {
      question: 'Can I provide my own custom design, fabric, and color scheme?',
      answer: 'Yes. You can specify exact Pantone shades for outer shell fabrics, inner polyester linings, zipper tapes, and webbing straps. We source customized fabrics to match your brand guidelines.',
    },
    {
      question: 'Do you provide physical sample bags before bulk manufacturing?',
      answer: 'Yes. We strongly encourage pre-production golden sample creation. Once initial design parameters and pricing are agreed upon, we manufacture a physical prototype for your hands-on inspection and sign-off before mass production begins.',
    },
    {
      question: 'What materials and fabrics are available for bag production?',
      answer: 'We work with a wide range of industrial textiles including 1680D Ballistic Nylon, 1000D Cordura, 600D/900D Polyester, 100% Organic Cotton Canvas (10oz–18oz), Natural Jute/Juco, Vegan PU Leatherette, Waterproof Ripstop, and EVA protective foam.',
    },
    {
      question: 'How long does the manufacturing process take from sample approval?',
      answer: 'Standard production turnaround is typically 12 to 20 business days following sample approval, depending on the order quantity, material availability, and customization requirements. Rush orders can be accommodated upon request.',
    },
    {
      question: 'Do you accept bulk orders for corporate gifting and institutions?',
      answer: 'Yes. Bulk manufacturing for corporate onboarding kits, IT employee gifts, university backpacks, annual conferences, and retail private labels represents our core B2B business.',
    },
    {
      question: 'Do you provide custom packaging, retail boxes, and hangtags?',
      answer: 'Yes. We offer individual dust-proof polybagging, barcode sticker application, customized full-color retail hangtags, silica moisture-absorbing packets, and heavy-duty 5-ply/7-ply corrugated master shipping cartons.',
    },
    {
      question: 'Do you supply and deliver outside Mumbai across India?',
      answer: 'Yes. We provide door-to-door transport and surface/air logistics to all states and union territories across India, including Bengaluru, Delhi NCR, Hyderabad, Chennai, Pune, Kolkata, and Ahmedabad.',
    },
    {
      question: 'Do you handle export orders and international freight documentation?',
      answer: 'Yes. We manufacture for overseas clients and handle export documentation, commercial invoicing, packing lists, and door-to-port or door-to-door air and sea freight forwarding to the Middle East, Europe, the USA, and Southeast Asia.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            B2B Bag Manufacturing FAQs
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Essential answers on MOQ, custom prototyping, material options, lead times, and factory dispatch.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base font-sans">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#72AFDB] text-white dark:bg-[#72AFDB]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Prompt */}
        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            Have a custom requirement not answered above?
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Call direct factory sales at <a href="tel:+919833598338" className="text-[#72AFDB] font-bold hover:underline">+91 98335 98338</a> or email <a href="mailto:info@ltsbags.com" className="text-[#72AFDB] font-bold hover:underline">info@ltsbags.com</a>.
          </p>
        </div>

      </div>
    </section>
  );
}
