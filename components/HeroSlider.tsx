'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Send, ArrowRight, Award, Pause, Play } from 'lucide-react';
import { HeroSlide } from '@/lib/types';
import QuoteModal from './QuoteModal';

interface HeroSliderProps {
  initialSlides?: HeroSlide[];
  autoplayInterval?: number;
}

export default function HeroSlider({
  initialSlides = [],
  autoplayInterval = 5000,
}: HeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(() => 
    initialSlides.length > 0 ? initialSlides.filter((s) => s.isActive) : []
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(initialSlides.length === 0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (initialSlides.length > 0) return;

    async function fetchSlides() {
      try {
        const res = await fetch('/api/slides?active=true');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSlides(data);
          }
        }
      } catch {
        // Silently retain defaults
      } finally {
        setIsLoading(false);
      }
    }

    fetchSlides();
  }, [initialSlides]);

  const activeSlides = slides.filter((s) => s.isActive);

  const goToNext = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const goToPrev = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused || isHovered) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused, isHovered, autoplayInterval, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch Swipe Handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goToNext();
    else if (distance < -minSwipeDistance) goToPrev();
  };

  // Title formatting helper to highlight keywords like MANUFACTURER in #67B0DF
  const renderFormattedTitle = (title: string) => {
    const keywords = ['MANUFACTURER', 'MANUFACTURING', 'EXCLUSIVE', 'CUSTOM', 'EXECUTIVE', 'WHOLESALE', 'EXPORT'];
    let formatted = title;
    
    // Check if title contains any keyword
    const upperTitle = title.toUpperCase();
    const foundKeyword = keywords.find(k => upperTitle.includes(k));

    if (foundKeyword) {
      const parts = title.split(new RegExp(`(${foundKeyword})`, 'i'));
      return (
        <span>
          {parts.map((part, i) => 
            part.toUpperCase() === foundKeyword ? (
              <span key={i} className="text-[#72AFDB] underline decoration-[#72AFDB]/30 underline-offset-8">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </span>
      );
    }
    return title;
  };

  if (isLoading) {
    return (
      <div className="w-full h-[520px] sm:h-[600px] lg:h-[650px] bg-slate-900 animate-pulse flex items-center justify-center text-[#A5A5A5]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#72AFDB] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading LTS BAGS slides...</p>
        </div>
      </div>
    );
  }

  if (activeSlides.length === 0) return null;

  return (
    <>
      <section
        className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] bg-[#1E293B] overflow-hidden text-white select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-label="LTS BAGS B2B Hero Slider"
      >
        {/* Subtle Background Monogram Branding */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center overflow-hidden z-0">
          <div className="text-[28vw] font-black text-white font-sans tracking-widest select-none">
            LTS BAGS
          </div>
        </div>

        {/* Slide Images Container */}
        <div className="relative w-full h-full">
          {activeSlides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
                aria-hidden={!isActive}
              >
                {/* Background Image */}
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || 'LTS BAGS Custom Bag Manufacturing'}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  referrerPolicy="no-referrer"
                  className="object-cover object-center filter brightness-[0.55] scale-100 transition-transform duration-1000"
                />

                {/* Dark Gradient Overlay for Maximum Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E293B]/95 via-[#1E293B]/85 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-[#1E293B]/40" />

                {/* Slide Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl space-y-4 sm:space-y-6">
                      {/* Badge */}
                      {slide.badgeText && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#72AFDB]/15 border border-[#72AFDB]/40 text-[#72AFDB] font-mono text-xs uppercase tracking-widest font-bold shadow-sm backdrop-blur-sm">
                          <Award className="w-4 h-4 text-[#72AFDB] shrink-0" />
                          <span>{slide.badgeText}</span>
                        </div>
                      )}

                      {/* Main Slide Title */}
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-[1.12]">
                        {renderFormattedTitle(slide.title)}
                      </h2>

                      {/* Description */}
                      {slide.description && (
                        <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3 max-w-xl font-normal">
                          {slide.description}
                        </p>
                      )}

                      {/* CTAs */}
                      <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link
                          href="/products"
                          className="bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer shadow-[#72AFDB]/25"
                        >
                          <span>EXPLORE PRODUCTS</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </Link>

                        <button
                          onClick={() => setQuoteModalOpen(true)}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                        >
                          <Send className="w-4 h-4 text-[#72AFDB]" />
                          <span>REQUEST A QUOTE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              type="button"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-[#72AFDB] text-white transition-all shadow-xl backdrop-blur-md group focus:outline-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={goToNext}
              type="button"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-[#72AFDB] text-white transition-all shadow-xl backdrop-blur-md group focus:outline-none"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Bottom Dot Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto pointer-events-none">
          <div className="pointer-events-auto">
            <button
              onClick={() => setIsPaused(!isPaused)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-slate-700/60 text-xs font-mono text-slate-300 hover:text-white transition-colors backdrop-blur-md"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#72AFDB]" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{isPaused ? 'Paused' : 'Playing'}</span>
            </button>
          </div>

          {activeSlides.length > 1 && (
            <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-800 shadow-lg">
              {activeSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  type="button"
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-8 h-2.5 bg-[#72AFDB]'
                      : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="pointer-events-auto hidden sm:block">
            <div className="text-xs font-mono text-slate-400 bg-black/60 border border-slate-700/60 px-3 py-1.5 rounded-full backdrop-blur-md">
              <span className="text-[#67B0DF] font-bold">{currentIndex + 1}</span> / {activeSlides.length}
            </div>
          </div>
        </div>
      </section>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </>
  );
}
