'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  Mail, 
  Menu, 
  X, 
  Send, 
  Globe,
  Search,
  Linkedin,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import QuoteModal from './QuoteModal';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import SearchModal from './SearchModal';
import { useLanguage } from './LanguageProvider';
import { CompanyContactInfo } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<Partial<CompanyContactInfo>>({
    phone1: '+91 9833598338',
    phone2: '+91 9619961971',
    email1: 'info@ltsbags.com',
    socialLinkedin: 'https://linkedin.com/company/ltsbags',
    socialFacebook: 'https://facebook.com/ltsbags',
    socialInstagram: 'https://instagram.com/ltsbags',
    socialYoutube: 'https://youtube.com/@ltsbags',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.contactInfo) {
          setContactInfo((prev) => ({ ...prev, ...data.contactInfo }));
        }
      })
      .catch(() => {
        // Silently retain defaults
      });
  }, []);

  // Keyboard shortcut (Cmd+K / Ctrl+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: t('nav.home', 'Home'), href: '/' },
    { name: t('nav.about', 'About Us'), href: '/about' },
    { name: t('nav.products', 'Products'), href: '/products' },
    { name: t('nav.categories', 'Categories'), href: '/categories' },
    { name: t('nav.customization', 'Customization'), href: '/customization' },
    { name: t('nav.manufacturing', 'Manufacturing'), href: '/manufacturing' },
    { name: 'Factory Tour', href: '/factory-tour' },
    { name: t('nav.clients', 'Our Clients'), href: '/clients' },
    { name: t('nav.contact', 'Contact Us'), href: '/contact' },
  ];

  return (
    <>
      {/* Top Two-Level Header: Info Bar */}
      <div className="bg-[#1A020A] text-white text-xs py-2 px-4 border-b border-[#2D0A16] shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Contact Phones & Email */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-5">
            {contactInfo.phone1 && (
              <a href={`tel:${contactInfo.phone1.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 text-white/95 hover:text-white transition-colors font-medium">
                <Phone className="w-3.5 h-3.5 text-white/80" />
                <span>{contactInfo.phone1}</span>
              </a>
            )}
            {contactInfo.phone2 && (
              <a href={`tel:${contactInfo.phone2.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 text-white/95 hover:text-white transition-colors font-medium">
                <Phone className="w-3.5 h-3.5 text-white/80" />
                <span>{contactInfo.phone2}</span>
              </a>
            )}
            {contactInfo.email1 && (
              <a href={`mailto:${contactInfo.email1}`} className="hidden sm:flex items-center gap-1.5 text-white/95 hover:text-white transition-colors font-medium">
                <Mail className="w-3.5 h-3.5 text-white/80" />
                <span>{contactInfo.email1}</span>
              </a>
            )}
          </div>

          {/* Right: Tagline, Social Media & Language Selector */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-white/90">
            <span className="hidden xl:inline-block text-[11px] font-medium text-white/85 border-r border-white/25 pr-4">
              Export Quality Bags Manufacturer in Mumbai, India
            </span>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 text-white/85">
              {contactInfo.socialLinkedin && (
                <a href={contactInfo.socialLinkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="LinkedIn">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {contactInfo.socialFacebook && (
                <a href={contactInfo.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Facebook">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {contactInfo.socialInstagram && (
                <a href={contactInfo.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Instagram">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {contactInfo.socialYoutube && (
                <a href={contactInfo.socialYoutube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="YouTube">
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="pl-2 border-l border-white/25 shrink-0">
              <LanguageSelector variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Logo size="md" theme="auto" showIcon={false} showSubtitle={false} />
            </Link>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs xl:text-sm font-bold uppercase tracking-wider transition-colors duration-150 py-2 relative ${
                      isActive
                        ? 'text-[#72AFDB]'
                        : 'text-[#333333] dark:text-slate-200 hover:text-[#72AFDB] dark:hover:text-[#72AFDB]'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#72AFDB] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons: Search & Request Quote */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#F0F7FC] dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-[#72AFDB] border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer group"
                title="Search products, models, categories (⌘K / Ctrl+K)"
              >
                <Search className="w-4 h-4 text-[#72AFDB] group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-slate-500 dark:text-slate-400">Search models...</span>
                <span className="xl:hidden">Search</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-slate-900 text-[#A5A5A5] rounded border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => {
                  setSelectedProductForQuote('');
                  setQuoteModalOpen(true);
                }}
                className="bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-[#72AFDB]/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Quote</span>
              </button>
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={() => setSearchModalOpen(true)}
                aria-label="Search catalog"
                className="p-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#72AFDB] transition-colors cursor-pointer"
                title="Search Products"
              >
                <Search className="w-5 h-5 text-[#72AFDB]" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Quick Search Bar */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-[#72AFDB] transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#72AFDB]" />
                <span>Search bag models & categories...</span>
              </div>
              <span className="text-[10px] text-[#72AFDB] font-bold bg-[#72AFDB]/10 px-2 py-0.5 rounded-md">
                Search
              </span>
            </button>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-colors ${
                      isActive
                        ? 'bg-[#F0F6FA] dark:bg-slate-800 text-[#72AFDB]'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSelectedProductForQuote('');
                  setQuoteModalOpen(true);
                }}
                className="w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Request a Quote</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedProduct={selectedProductForQuote}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
