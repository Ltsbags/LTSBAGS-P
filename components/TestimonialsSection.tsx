'use client';

import React, { useEffect, useState } from 'react';
import { Star, Building2, CheckCircle2, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/types';

interface TestimonialsSectionProps {
  initialTestimonials?: Testimonial[];
}

export default function TestimonialsSection({ initialTestimonials }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials || [
    {
      id: 'test-1',
      name: 'Rajesh Sharma',
      role: 'Head of Talent Engagement',
      company: 'Enterprise IT Services',
      content: 'LTS BAGS manufactured 1,200 custom executive laptop backpacks for our new employee onboarding kits. The 1680D fabric quality, 3D embroidered logo, and shock-absorbing laptop compartment were exactly as specified in the golden sample.',
      rating: 5,
      isActive: true,
    },
    {
      id: 'test-2',
      name: 'Ananya Deshmukh',
      role: 'Procurement Lead',
      company: 'Corporate Logistics Group',
      content: 'Outstanding stitch durability and zipper quality. We ordered 500 travel duffel bags for our annual leadership meet. Direct factory communication and on-schedule dispatch made the entire procurement process stress-free.',
      rating: 5,
      isActive: true,
    },
    {
      id: 'test-3',
      name: 'Vikram Mehta',
      role: 'Brand Merchandising Manager',
      company: 'National Retail Network',
      content: 'We sourced 5,000 organic cotton canvas totes with crisp multi-color screen printing. Every bag met our stitch tension and handle weight criteria. LTS BAGS is our trusted manufacturing partner in Mumbai.',
      rating: 5,
      isActive: true,
    },
  ]);

  const activeTestimonials = testimonials.filter((t) => t.isActive !== false);

  if (activeTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            B2B Client Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            What Bulk Buyers Say About LTS Bags
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Project reviews from corporate procurement managers, brand merchandisers, and institutional buyers partnering with our Mumbai factory.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#72AFDB] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#72AFDB]/40 group-hover:text-[#72AFDB] transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 mt-6 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.role} &bull; <strong className="text-slate-700 dark:text-slate-300">{item.company}</strong>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-sky-500" />
                  B2B Client
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* E-E-A-T Transparency Disclaimer */}
        <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-10 italic">
          * Representative client feedback and procurement briefs. Formal signed testimonials to be confirmed by LTS BAGS.
        </p>

      </div>
    </section>
  );
}
