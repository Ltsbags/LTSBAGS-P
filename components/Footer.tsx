'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  Clock, 
  ArrowRight,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  CreditCard
} from 'lucide-react';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from './LanguageProvider';
import { CompanyContactInfo, FooterContent } from '@/lib/types';

export default function Footer() {
  const { t } = useLanguage();
  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    companyName: 'LTS BAGS PRIVATE LIMITED',
    phone1: '+91 9833598338',
    phone2: '+91 9619961971',
    email1: 'info@ltsbags.com',
    factoryAddress: 'Mumbai, Maharashtra, India',
    googleMapsUrl: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    gstNumber: '27AAGCL1568H1ZC',
    isoCertificate: 'ISO 9001:2015 Certified Factory',
    socialLinkedin: 'https://linkedin.com/company/ltsbags',
    socialFacebook: 'https://facebook.com/ltsbags',
    socialInstagram: 'https://instagram.com/ltsbags',
    socialYoutube: 'https://youtube.com/@ltsbags',
  });

  const [footerContent, setFooterContent] = useState<Partial<FooterContent>>({
    aboutBrief: 'LTS BAGS PRIVATE LIMITED is a premier B2B custom bag manufacturer and global exporter in Mumbai, India. We specialize in corporate backpacks, executive laptop briefcases, travel duffels, eco jute and canvas totes.',
    copyrightText: 'Copyright © LTS BAGS PRIVATE LIMITED. All Rights Reserved.',
    quickLinksTitle: 'Quick Links',
    categoriesTitle: 'Categories',
    contactTitle: 'Contact Us',
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
        if (data?.footer) {
          setFooterContent((prev) => ({ ...prev, ...data.footer }));
        }
      })
      .catch(() => {
        // Silently retain defaults
      });
  }, []);

  return (
    <footer className="bg-[#1E293B] text-white pt-16 pb-8 border-t border-slate-750">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-700/80">
          
          {/* Col 1: Company */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="lg" theme="dark" />
            </Link>

            <p className="text-[#A5A5A5] text-xs leading-relaxed max-w-sm">
              {footerContent.aboutBrief}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-[#72AFDB]/30 text-[#72AFDB] font-semibold">
                <Award className="w-3.5 h-3.5 text-[#72AFDB]" /> {contact.isoCertificate || 'ISO 9001:2015 Certified'}
              </span>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <h3 className="text-[#72AFDB] font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-700 pb-2">
              Products
            </h3>
            <ul className="space-y-2 text-xs text-[#A5A5A5]">
              <li><Link href="/products" className="hover:text-[#72AFDB] transition-colors">Executive Laptop Bags</Link></li>
              <li><Link href="/products" className="hover:text-[#72AFDB] transition-colors">Corporate Backpacks</Link></li>
              <li><Link href="/products" className="hover:text-[#72AFDB] transition-colors">Duffel Travel Bags</Link></li>
              <li><Link href="/products" className="hover:text-[#72AFDB] transition-colors">Eco Jute Totes</Link></li>
              <li><Link href="/products" className="hover:text-[#72AFDB] transition-colors">School & College Bags</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h3 className="text-[#72AFDB] font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-700 pb-2">
              Categories
            </h3>
            <ul className="space-y-2 text-xs text-[#A5A5A5]">
              <li><Link href="/categories" className="hover:text-[#72AFDB] transition-colors">Backpack Bags</Link></li>
              <li><Link href="/categories" className="hover:text-[#72AFDB] transition-colors">Duffle Bags</Link></li>
              <li><Link href="/categories" className="hover:text-[#72AFDB] transition-colors">Jute Bags</Link></li>
              <li><Link href="/categories" className="hover:text-[#72AFDB] transition-colors">Laptop Bags</Link></li>
              <li><Link href="/categories" className="hover:text-[#72AFDB] transition-colors">Sports & Travel Bags</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-[#72AFDB] font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-[#A5A5A5]">
              <li><Link href="/" className="hover:text-[#72AFDB] transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-[#72AFDB] transition-colors">About Us</Link></li>
              <li><Link href="/factory-tour" className="hover:text-[#72AFDB] transition-colors">Factory Tour</Link></li>
              <li><Link href="/request-a-quote" className="hover:text-[#72AFDB] transition-colors font-bold text-sky-400">Request a Quote</Link></li>
              <li><Link href="/customization" className="hover:text-[#72AFDB] transition-colors">Customization</Link></li>
              <li><Link href="/manufacturing" className="hover:text-[#72AFDB] transition-colors">Manufacturing</Link></li>
              <li><Link href="/clients" className="hover:text-[#72AFDB] transition-colors">Our Clients</Link></li>
              <li><Link href="/blog" className="hover:text-[#72AFDB] transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-[#72AFDB] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact & Social */}
          <div className="space-y-3">
            <h3 className="text-[#72AFDB] font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-700 pb-2">
              Contact
            </h3>
            <ul className="space-y-2.5 text-xs text-[#A5A5A5]">
              <li className="font-bold text-white">LTS BAGS PRIVATE LIMITED</li>
              {contact.gstNumber && (
                <li className="text-[11px] text-[#72AFDB] font-mono">
                  GSTIN: {contact.gstNumber}
                </li>
              )}
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#72AFDB]" />
                <a href="tel:+919833598338" className="hover:text-white">+91 9833598338</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#72AFDB]" />
                <a href="tel:+919619961971" className="hover:text-white">+91 9619961971</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#72AFDB]" />
                <a href="mailto:info@ltsbags.com" className="hover:text-white">info@ltsbags.com</a>
              </li>
              {contact.googleMapsUrl && (
                <li className="pt-1">
                  <a href={contact.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#72AFDB] hover:underline flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> View Google Maps Location
                  </a>
                </li>
              )}
            </ul>

            {/* Social Media */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">Social Media</span>
              <div className="flex items-center gap-3 text-slate-300">
                {contact.socialLinkedin && (
                  <a href={contact.socialLinkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:text-[#72AFDB] hover:bg-slate-700 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {contact.socialFacebook && (
                  <a href={contact.socialFacebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:text-[#72AFDB] hover:bg-slate-700 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {contact.socialInstagram && (
                  <a href={contact.socialInstagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:text-[#72AFDB] hover:bg-slate-700 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {contact.socialYoutube && (
                  <a href={contact.socialYoutube} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:text-[#72AFDB] hover:bg-slate-700 transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A5A5A5]">
          <p>Copyright © {new Date().getFullYear()} <strong className="text-white">LTS BAGS PRIVATE LIMITED</strong>. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <LanguageSelector variant="footer" />
            <Link href="/privacy-policy" className="hover:text-[#72AFDB] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#72AFDB] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
