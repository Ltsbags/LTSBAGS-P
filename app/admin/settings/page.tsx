'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import AdminHeader from '@/components/AdminHeader';
import Logo from '@/components/Logo';
import { 
  Upload, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  Award, 
  Plus, 
  Trash2, 
  Star, 
  Globe, 
  Image as ImageIcon,
  LayoutGrid,
  Check,
  ChevronRight,
  Factory,
  Truck,
  Layers,
  Sliders,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Search,
  Code,
  Copy
} from 'lucide-react';
import { SiteSettings, StatItem, FeatureItem, ProcessStepItem, TestimonialItem, ClientLogoItem } from '@/lib/types';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'brand' | 'contact' | 'homepage' | 'features' | 'testimonials' | 'about' | 'footer' | 'metrics' | 'seo'>('brand');
  const [isGeneratingSitemap, setIsGeneratingSitemap] = useState<boolean>(false);
  const [sitemapStats, setSitemapStats] = useState<{ totalUrls?: number; counts?: any; generatedAt?: string } | null>(null);
  
  // Factory Metrics & Trust Claims
  const [yearsExperience, setYearsExperience] = useState('15+ Years');
  const [factoryArea, setFactoryArea] = useState('25,000+ Sq. Ft.');
  const [dailyCapacity, setDailyCapacity] = useState('10,000+ Bags/Day');
  const [monthlyCapacity, setMonthlyCapacity] = useState('250,000+ Bags/Month');
  const [workforce, setWorkforce] = useState('150+ Skilled Artisans');
  const [minOrderQuantity, setMinOrderQuantity] = useState('50 - 100 Units');
  const [onTimeDeliveryRate, setOnTimeDeliveryRate] = useState('99.8%');
  const [countriesServed, setCountriesServed] = useState('15+ Countries');
  const [certificationsList, setCertificationsList] = useState('ISO 9001:2015, AQL 2.5 QC');
  const [qualityStandards, setQualityStandards] = useState('100% In-Line & Final Inspection');
  const [clientSectionMode, setClientSectionMode] = useState<'CLIENTS' | 'INDUSTRIES_SERVED'>('INDUSTRIES_SERVED');
  const [clientSectionTitle, setClientSectionTitle] = useState('Businesses & Industries We Serve');

  // Settings state
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoText, setLogoText] = useState<string>('LTS BAGS');
  const [logoSubtitle, setLogoSubtitle] = useState<string>('PRIVATE LIMITED');

  // Contact Info
  const [companyName, setCompanyName] = useState('LTS BAGS PRIVATE LIMITED');
  const [tagline, setTagline] = useState('Premier OEM/ODM Custom Bag Manufacturer & Global Exporter');
  const [phone1, setPhone1] = useState('+91 98335 98338');
  const [phone2, setPhone2] = useState('+91 96199 61971');
  const [email1, setEmail1] = useState('info@ltsbags.com');
  const [email2, setEmail2] = useState('sales@ltsbags.com');
  const [factoryAddress, setFactoryAddress] = useState('FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI, MUMBAI 400017, MAHARASHTRA, INDIA');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED');
  const [workingHours, setWorkingHours] = useState('Mon - Sat: 9:00 AM - 7:00 PM IST');
  const [gstNumber, setGstNumber] = useState('27AAGCL1568H1ZC');
  const [isoCertificate, setIsoCertificate] = useState('ISO 9001:2015 Certified Manufacturing Facility');
  const [socialLinkedin, setSocialLinkedin] = useState('https://linkedin.com/company/ltsbags');
  const [socialFacebook, setSocialFacebook] = useState('https://facebook.com/ltsbags');
  const [socialInstagram, setSocialInstagram] = useState('https://instagram.com/ltsbags');
  const [socialYoutube, setSocialYoutube] = useState('https://youtube.com/@ltsbags');
  const [socialWhatsapp, setSocialWhatsapp] = useState('+919833598338');

  // Homepage
  const [stats, setStats] = useState<StatItem[]>([]);
  const [categoriesTitle, setCategoriesTitle] = useState('Explore Product Categories');
  const [categoriesSubtitle, setCategoriesSubtitle] = useState('Direct factory supply across corporate, educational, travel, and promotional bag collections.');
  const [featuredTitle, setFeaturedTitle] = useState('Featured Wholesale Products');
  const [featuredSubtitle, setFeaturedSubtitle] = useState('Hand-picked bestsellers for corporate gifting, employee onboarding kits, and institutional orders.');
  const [whyChooseTitle, setWhyChooseTitle] = useState('Why Choose LTS BAGS Factory');
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState('State-of-the-art machinery, rigorous quality assurance, and end-to-end custom branding solutions.');
  const [whyChooseFeatures, setWhyChooseFeatures] = useState<FeatureItem[]>([]);
  const [processTitle, setProcessTitle] = useState('Our 4-Step Bulk Production Workflow');
  const [processSubtitle, setProcessSubtitle] = useState('From concept design and material selection to high-speed stitching and final quality dispatch.');
  const [processSteps, setProcessSteps] = useState<ProcessStepItem[]>([]);
  const [testimonialsTitle, setTestimonialsTitle] = useState('What Corporate Clients Say');
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState('Trusted by leading MNCs, tech enterprises, and educational institutions nationwide.');
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [clientLogos, setClientLogos] = useState<ClientLogoItem[]>([]);
  const [ctaTitle, setCtaTitle] = useState('Ready to Order Custom Corporate Bags in Bulk?');
  const [ctaDescription, setCtaDescription] = useState('Request a customized factory quotation with your logo specs, sample request, and bulk volume discount within 24 hours.');
  const [ctaButtonText, setCtaButtonText] = useState('Request Wholesale Quote');
  const [ctaButtonUrl, setCtaButtonUrl] = useState('/contact');
  const [blogTitle, setBlogTitle] = useState('Bag Manufacturing Insights & B2B Guides');
  const [blogSubtitle, setBlogSubtitle] = useState('Expert articles on material selection, QC protocols, and corporate gifting trends.');

  // About Page
  const [aboutHeadline, setAboutHeadline] = useState('About LTS BAGS PRIVATE LIMITED');
  const [aboutSubtitle, setAboutSubtitle] = useState("India's Premier OEM/ODM Custom Bag Manufacturing Factory & Wholesale Exporter");
  const [aboutStoryTitle, setAboutStoryTitle] = useState('Our Manufacturing Legacy & Heritage');
  const [aboutStoryContent, setAboutStoryContent] = useState('');
  const [aboutMissionTitle, setAboutMissionTitle] = useState('Our Mission');
  const [aboutMissionContent, setAboutMissionContent] = useState('');
  const [aboutVisionTitle, setAboutVisionTitle] = useState('Our Vision');
  const [aboutVisionContent, setAboutVisionContent] = useState('');
  const [aboutFactoryCapacityTitle, setAboutFactoryCapacityTitle] = useState('Factory Scale & Daily Capacity');
  const [aboutFactoryCapacityDetails, setAboutFactoryCapacityDetails] = useState('');
  const [aboutQualityPolicyTitle, setAboutQualityPolicyTitle] = useState('Zero-Defect Quality Policy');
  const [aboutQualityPolicyDetails, setAboutQualityPolicyDetails] = useState('');

  // Footer Content
  const [footerAboutBrief, setFooterAboutBrief] = useState('');
  const [footerCopyrightText, setFooterCopyrightText] = useState('LTS BAGS PRIVATE LIMITED ®. All Rights Reserved.');
  const [footerQuickLinksTitle, setFooterQuickLinksTitle] = useState('Quick Navigation');
  const [footerCategoriesTitle, setFooterCategoriesTitle] = useState('Bag Categories');
  const [footerContactTitle, setFooterContactTitle] = useState('Manufacturing Unit');

  // SEO & Webmaster Verification
  const [googleSiteVerification, setGoogleSiteVerification] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch current settings on load
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: SiteSettings) => {
        if (data) {
          if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
          if (data.logoText) setLogoText(data.logoText);
          if (data.logoSubtitle) setLogoSubtitle(data.logoSubtitle);

          if (data.contactInfo) {
            const c = data.contactInfo;
            if (c.companyName) setCompanyName(c.companyName);
            if (c.tagline) setTagline(c.tagline);
            if (c.phone1) setPhone1(c.phone1);
            if (c.phone2) setPhone2(c.phone2);
            if (c.email1) setEmail1(c.email1);
            if (c.email2) setEmail2(c.email2);
            if (c.factoryAddress) setFactoryAddress(c.factoryAddress);
            if (c.googleMapsUrl) setGoogleMapsUrl(c.googleMapsUrl);
            if (c.workingHours) setWorkingHours(c.workingHours);
            if (c.gstNumber) setGstNumber(c.gstNumber);
            if (c.isoCertificate) setIsoCertificate(c.isoCertificate);
            if (c.socialLinkedin) setSocialLinkedin(c.socialLinkedin);
            if (c.socialFacebook) setSocialFacebook(c.socialFacebook);
            if (c.socialInstagram) setSocialInstagram(c.socialInstagram);
            if (c.socialYoutube) setSocialYoutube(c.socialYoutube);
            if (c.socialWhatsapp) setSocialWhatsapp(c.socialWhatsapp);
          }

          if (data.homepage) {
            const h = data.homepage;
            if (h.stats) setStats(h.stats);
            if (h.categoriesTitle) setCategoriesTitle(h.categoriesTitle);
            if (h.categoriesSubtitle) setCategoriesSubtitle(h.categoriesSubtitle);
            if (h.featuredTitle) setFeaturedTitle(h.featuredTitle);
            if (h.featuredSubtitle) setFeaturedSubtitle(h.featuredSubtitle);
            if (h.whyChooseTitle) setWhyChooseTitle(h.whyChooseTitle);
            if (h.whyChooseSubtitle) setWhyChooseSubtitle(h.whyChooseSubtitle);
            if (h.whyChooseFeatures) setWhyChooseFeatures(h.whyChooseFeatures);
            if (h.processTitle) setProcessTitle(h.processTitle);
            if (h.processSubtitle) setProcessSubtitle(h.processSubtitle);
            if (h.processSteps) setProcessSteps(h.processSteps);
            if (h.testimonialsTitle) setTestimonialsTitle(h.testimonialsTitle);
            if (h.testimonialsSubtitle) setTestimonialsSubtitle(h.testimonialsSubtitle);
            if (h.testimonials) setTestimonials(h.testimonials);
            if (h.clientLogos) setClientLogos(h.clientLogos);
            if (h.ctaTitle) setCtaTitle(h.ctaTitle);
            if (h.ctaDescription) setCtaDescription(h.ctaDescription);
            if (h.ctaButtonText) setCtaButtonText(h.ctaButtonText);
            if (h.ctaButtonUrl) setCtaButtonUrl(h.ctaButtonUrl);
            if (h.blogTitle) setBlogTitle(h.blogTitle);
            if (h.blogSubtitle) setBlogSubtitle(h.blogSubtitle);
          }

          if (data.about) {
            const a = data.about;
            if (a.headline) setAboutHeadline(a.headline);
            if (a.subtitle) setAboutSubtitle(a.subtitle);
            if (a.storyTitle) setAboutStoryTitle(a.storyTitle);
            if (a.storyContent) setAboutStoryContent(a.storyContent);
            if (a.missionTitle) setAboutMissionTitle(a.missionTitle);
            if (a.missionContent) setAboutMissionContent(a.missionContent);
            if (a.visionTitle) setAboutVisionTitle(a.visionTitle);
            if (a.visionContent) setAboutVisionContent(a.visionContent);
            if (a.factoryCapacityTitle) setAboutFactoryCapacityTitle(a.factoryCapacityTitle);
            if (a.factoryCapacityDetails) setAboutFactoryCapacityDetails(a.factoryCapacityDetails);
            if (a.qualityPolicyTitle) setAboutQualityPolicyTitle(a.qualityPolicyTitle);
            if (a.qualityPolicyDetails) setAboutQualityPolicyDetails(a.qualityPolicyDetails);
          }

          if (data.footer) {
            const f = data.footer;
            if (f.aboutBrief) setFooterAboutBrief(f.aboutBrief);
            if (f.copyrightText) setFooterCopyrightText(f.copyrightText);
            if (f.quickLinksTitle) setFooterQuickLinksTitle(f.quickLinksTitle);
            if (f.categoriesTitle) setFooterCategoriesTitle(f.categoriesTitle);
            if (f.contactTitle) setFooterContactTitle(f.contactTitle);
          }

          if (data.metrics) {
            const m = data.metrics;
            if (m.yearsExperience) setYearsExperience(m.yearsExperience);
            if (m.factoryArea) setFactoryArea(m.factoryArea);
            if (m.dailyCapacity) setDailyCapacity(m.dailyCapacity);
            if (m.monthlyCapacity) setMonthlyCapacity(m.monthlyCapacity);
            if (m.workforce) setWorkforce(m.workforce);
            if (m.minOrderQuantity) setMinOrderQuantity(m.minOrderQuantity);
            if (m.onTimeDeliveryRate) setOnTimeDeliveryRate(m.onTimeDeliveryRate);
            if (m.countriesServed) setCountriesServed(m.countriesServed);
            if (m.certificationsList) setCertificationsList(m.certificationsList);
            if (m.qualityStandards) setQualityStandards(m.qualityStandards);
            if (m.clientSectionMode) setClientSectionMode(m.clientSectionMode);
            if (m.clientSectionTitle) setClientSectionTitle(m.clientSectionTitle);
          }

          if (data.seoDefaults) {
            if (data.seoDefaults.googleSiteVerification) setGoogleSiteVerification(data.seoDefaults.googleSiteVerification);
            if (data.seoDefaults.googleAnalyticsId) setGoogleAnalyticsId(data.seoDefaults.googleAnalyticsId);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logo' | 'clientLogo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'Please select a valid image file (PNG, JPG, SVG, WEBP).' });
      return;
    }

    setIsUploading(true);
    setNotification(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        if (targetField === 'logo') {
          setLogoUrl(data.url);
          setNotification({ type: 'success', message: 'Logo uploaded! Click "Save Website Content" to publish changes.' });
        }
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to upload image.' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setNotification({ type: 'error', message: 'An unexpected error occurred during image upload.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAllSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    const payload: SiteSettings = {
      logoUrl,
      logoText,
      logoSubtitle,
      contactInfo: {
        companyName,
        tagline,
        logoUrl,
        phone1,
        phone2,
        email1,
        email2,
        factoryAddress,
        googleMapsUrl,
        workingHours,
        gstNumber,
        isoCertificate,
        socialLinkedin,
        socialFacebook,
        socialInstagram,
        socialYoutube,
        socialWhatsapp,
      },
      homepage: {
        stats,
        categoriesTitle,
        categoriesSubtitle,
        featuredTitle,
        featuredSubtitle,
        whyChooseTitle,
        whyChooseSubtitle,
        whyChooseFeatures,
        processTitle,
        processSubtitle,
        processSteps,
        testimonialsTitle,
        testimonialsSubtitle,
        testimonials,
        clientLogos,
        ctaTitle,
        ctaDescription,
        ctaButtonText,
        ctaButtonUrl,
        blogTitle,
        blogSubtitle,
      },
      about: {
        headline: aboutHeadline,
        subtitle: aboutSubtitle,
        storyTitle: aboutStoryTitle,
        storyContent: aboutStoryContent,
        missionTitle: aboutMissionTitle,
        missionContent: aboutMissionContent,
        visionTitle: aboutVisionTitle,
        visionContent: aboutVisionContent,
        factoryCapacityTitle: aboutFactoryCapacityTitle,
        factoryCapacityDetails: aboutFactoryCapacityDetails,
        qualityPolicyTitle: aboutQualityPolicyTitle,
        qualityPolicyDetails: aboutQualityPolicyDetails,
      },
      footer: {
        aboutBrief: footerAboutBrief,
        copyrightText: footerCopyrightText,
        quickLinksTitle: footerQuickLinksTitle,
        categoriesTitle: footerCategoriesTitle,
        contactTitle: footerContactTitle,
      },
      metrics: {
        yearsExperience,
        factoryArea,
        dailyCapacity,
        monthlyCapacity,
        workforce,
        minOrderQuantity,
        onTimeDeliveryRate,
        countriesServed,
        certificationsList,
        certifications: certificationsList,
        qualityStandards,
        clientSectionMode,
        clientSectionTitle,
      },
      seoDefaults: {
        siteUrl: 'https://ltsbags.com',
        googleSiteVerification: (() => {
          const raw = googleSiteVerification.trim();
          // Extract content value if the user accidentally pasted the whole <meta> tag
          const metaMatch = raw.match(/content=["']([^"']+)["']/i);
          return metaMatch ? metaMatch[1] : raw;
        })(),
        googleAnalyticsId: googleAnalyticsId.trim(),
      },
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification({ 
          type: 'success', 
          message: 'Website content updated successfully! All public pages and components have been updated automatically.' 
        });
      } else {
        const errorData = await res.json();
        setNotification({ type: 'error', message: errorData.error || 'Failed to save settings.' });
      }
    } catch (err) {
      console.error('Save error:', err);
      setNotification({ type: 'error', message: 'An error occurred while saving website content.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions for stats management
  const addStat = () => {
    setStats([...stats, { id: 'stat-' + Date.now(), label: 'New Metric', value: '100+', sublabel: 'Metric description' }]);
  };
  const updateStat = (id: string, field: keyof StatItem, value: string) => {
    setStats(stats.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const deleteStat = (id: string) => {
    setStats(stats.filter(s => s.id !== id));
  };

  // Helper functions for features
  const addFeature = () => {
    setWhyChooseFeatures([...whyChooseFeatures, { id: 'feat-' + Date.now(), title: 'New Quality Feature', description: 'Detailed feature description', iconName: 'ShieldCheck' }]);
  };
  const updateFeature = (id: string | undefined, field: keyof FeatureItem, value: string) => {
    if (!id) return;
    setWhyChooseFeatures(whyChooseFeatures.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  const deleteFeature = (id?: string) => {
    if (!id) return;
    setWhyChooseFeatures(whyChooseFeatures.filter(f => f.id !== id));
  };

  // Helper functions for process steps
  const addProcessStep = () => {
    const nextNum = (processSteps.length + 1).toString().padStart(2, '0');
    setProcessSteps([...processSteps, { id: 'step-' + Date.now(), stepNumber: nextNum, title: 'New Production Step', description: 'Step description' }]);
  };
  const updateProcessStep = (id: string | undefined, field: keyof ProcessStepItem, value: string) => {
    if (!id) return;
    setProcessSteps(processSteps.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const deleteProcessStep = (id?: string) => {
    if (!id) return;
    setProcessSteps(processSteps.filter(p => p.id !== id));
  };

  // Helper functions for testimonials
  const addTestimonial = () => {
    setTestimonials([...testimonials, { id: 'test-' + Date.now(), name: 'Client Name', role: 'Procurement Head', company: 'Company Name', content: 'Great manufacturing quality and prompt delivery.', rating: 5 }]);
  };
  const updateTestimonial = (id: string, field: keyof TestimonialItem, value: any) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
  };
  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  // Helper functions for client logos
  const addClientLogo = () => {
    setClientLogos([...clientLogos, { id: 'client-' + Date.now(), companyName: 'Partner Enterprise', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300' }]);
  };
  const updateClientLogo = (id: string, field: keyof ClientLogoItem, value: string) => {
    setClientLogos(clientLogos.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  const deleteClientLogo = (id: string) => {
    setClientLogos(clientLogos.filter(c => c.id !== id));
  };

  const handleGenerateSitemap = async () => {
    setIsGeneratingSitemap(true);
    try {
      const res = await fetch('/api/admin/generate-sitemap', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSitemapStats(data);
        setNotification({
          type: 'success',
          message: `✅ sitemap.xml generated successfully with ${data.totalUrls || 0} total URLs indexed (${data.counts?.products || 0} products, ${data.counts?.categories || 0} categories, ${data.counts?.blogs || 0} blogs)!`,
        });
      } else {
        throw new Error(data.error || 'Failed to generate sitemap');
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: 'Failed to generate sitemap.xml: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setIsGeneratingSitemap(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
        <AdminHeader activeTab="settings" />
        <main className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-600">Loading website content from database...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader activeTab="settings" />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Top Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-100 text-sky-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-sky-200 uppercase tracking-wider">
                  CMS Management
                </span>
                <h1 className="text-2xl font-black text-slate-900 font-serif">
                  Global Website Content & Business Information
                </h1>
              </div>
              <p className="text-slate-500 text-xs mt-1">
                Manage static headings, contact phone numbers, factory address, testimonials, features, and page sections dynamically.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveAllSettings()}
                disabled={isSaving}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Website Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 shadow-xs transition-all ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs font-medium leading-relaxed">
                {notification.message}
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex flex-wrap gap-1 shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('brand')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'brand'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Logo & Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'contact'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Company & Contact Info</span>
            </button>

            <button
              onClick={() => setActiveTab('homepage')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'homepage'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Homepage Headings & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'features'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Why Choose Us & Process</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'testimonials'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Testimonials & Clients</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>About Us Page</span>
            </button>

            <button
              onClick={() => setActiveTab('footer')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'footer'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Footer Content</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'metrics'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Factory className="w-4 h-4 text-amber-500" />
              <span>Factory Metrics &amp; Claims</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'seo'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>SEO &amp; XML Sitemap</span>
            </button>
          </div>

          {/* TAB 1: Brand & Logo */}
          {activeTab === 'brand' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 font-serif">Brand Logo & Typography</h3>
                  <p className="text-slate-500 text-xs">Configure the main company logo image or text emblem.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Primary Name</label>
                    <input
                      type="text"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={logoSubtitle}
                      onChange={(e) => setLogoSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload Custom Brand Logo Image</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, 'logo')}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isUploading ? 'Uploading Image...' : 'Choose Logo File'}</span>
                      </button>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="text-rose-600 hover:text-rose-700 text-xs font-semibold"
                        >
                          Clear Custom Logo Image
                        </button>
                      )}
                    </div>
                  </div>

                  {logoUrl && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Or Logo Image URL</label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Box */}
              <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
                <span className="text-sky-400 font-mono text-[10px] uppercase font-bold tracking-widest bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                  Header & Footer Logo Preview
                </span>

                <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center">
                  <Logo size="lg" theme="dark" showSubtitle={true} />
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                  <Logo size="lg" theme="light" showSubtitle={true} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Company & Contact Info */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-serif">Corporate Contact Details & Social Handles</h3>
                <p className="text-slate-500 text-xs">This information is displayed in the Header, Footer, Contact Page, and Floating Action Buttons.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone / Sales Hotline</label>
                  <input
                    type="text"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Official Email</label>
                  <input
                    type="email"
                    value={email1}
                    onChange={(e) => setEmail1(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sales Enquiry Email</label>
                  <input
                    type="email"
                    value={email2}
                    onChange={(e) => setEmail2(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GST / Business Tax Registration ID</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ISO / QC Certificate Badge Text</label>
                  <input
                    type="text"
                    value={isoCertificate}
                    onChange={(e) => setIsoCertificate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Factory & Registered Address</label>
                  <textarea
                    rows={2}
                    value={factoryAddress}
                    onChange={(e) => setFactoryAddress(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps Profile URL</label>
                  <input
                    type="text"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Factory Working Hours</label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Direct Number (e.g., +919833598338)</label>
                  <input
                    type="text"
                    value={socialWhatsapp}
                    onChange={(e) => setSocialWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Company Page URL</label>
                  <input
                    type="text"
                    value={socialLinkedin}
                    onChange={(e) => setSocialLinkedin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Homepage Sections & Stats */}
          {activeTab === 'homepage' && (
            <div className="space-y-8">
              {/* Stats Section */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Homepage Key Highlight Stats</h3>
                    <p className="text-slate-500 text-xs">Metrics displayed in the hero section banner.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addStat}
                    className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 border border-sky-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.map((st) => (
                    <div key={st.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => deleteStat(st.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Stat Value</label>
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => updateStat(st.id, 'value', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-sky-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Label</label>
                          <input
                            type="text"
                            value={st.label}
                            onChange={(e) => updateStat(st.id, 'label', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Sublabel / Context</label>
                        <input
                          type="text"
                          value={st.sublabel}
                          onChange={(e) => updateStat(st.id, 'sublabel', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Headings & Subtitles */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 font-serif">Homepage Section Titles</h3>
                  <p className="text-slate-500 text-xs">Customize headings for Categories, Featured Products, Blog, and CTA.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categories Section Title</label>
                    <input
                      type="text"
                      value={categoriesTitle}
                      onChange={(e) => setCategoriesTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categories Subtitle</label>
                    <input
                      type="text"
                      value={categoriesSubtitle}
                      onChange={(e) => setCategoriesSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Featured Products Title</label>
                    <input
                      type="text"
                      value={featuredTitle}
                      onChange={(e) => setFeaturedTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Featured Products Subtitle</label>
                    <input
                      type="text"
                      value={featuredSubtitle}
                      onChange={(e) => setFeaturedSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CTA Callout Heading</label>
                    <input
                      type="text"
                      value={ctaTitle}
                      onChange={(e) => setCtaTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CTA Primary Button Label</label>
                    <input
                      type="text"
                      value={ctaButtonText}
                      onChange={(e) => setCtaButtonText(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">CTA Banner Description</label>
                    <textarea
                      rows={2}
                      value={ctaDescription}
                      onChange={(e) => setCtaDescription(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Why Choose Us & Process */}
          {activeTab === 'features' && (
            <div className="space-y-8">
              {/* Features List */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Why Choose Us Feature Cards</h3>
                    <p className="text-slate-500 text-xs">Highlights detailing factory capabilities, MOQs, and quality control.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 border border-sky-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whyChooseFeatures.map((ft) => (
                    <div key={ft.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => deleteFeature(ft.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Feature Title</label>
                        <input
                          type="text"
                          value={ft.title}
                          onChange={(e) => updateFeature(ft.id, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={ft.description}
                          onChange={(e) => updateFeature(ft.id, 'description', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manufacturing Steps */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Manufacturing Production Steps</h3>
                    <p className="text-slate-500 text-xs">Step-by-step workflow from design brief to dispatch.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addProcessStep}
                    className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 border border-sky-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processSteps.map((stp) => (
                    <div key={stp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => deleteProcessStep(stp.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Step #</label>
                          <input
                            type="text"
                            value={stp.stepNumber}
                            onChange={(e) => updateProcessStep(stp.id, 'stepNumber', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold text-center"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Step Title</label>
                          <input
                            type="text"
                            value={stp.title}
                            onChange={(e) => updateProcessStep(stp.id, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={stp.description}
                          onChange={(e) => updateProcessStep(stp.id, 'description', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Testimonials & Client Logos */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8">
              {/* Testimonials */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Corporate Client Testimonials</h3>
                    <p className="text-slate-500 text-xs">Customer feedback from MNC procurement officers and brand heads.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addTestimonial}
                    className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 border border-sky-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => deleteTestimonial(t.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Client Name</label>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Designation / Role</label>
                          <input
                            type="text"
                            value={t.role}
                            onChange={(e) => updateTestimonial(t.id, 'role', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase">Company Name</label>
                          <input
                            type="text"
                            value={t.company}
                            onChange={(e) => updateTestimonial(t.id, 'company', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase">Review / Feedback</label>
                        <textarea
                          rows={2}
                          value={t.content}
                          onChange={(e) => updateTestimonial(t.id, 'content', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: About Us Page */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-serif">About Us Page Content</h3>
                <p className="text-slate-500 text-xs">Manage company story, mission, vision, and factory capacity details.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Page Main Headline</label>
                    <input
                      type="text"
                      value={aboutHeadline}
                      onChange={(e) => setAboutHeadline(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Page Subtitle</label>
                    <input
                      type="text"
                      value={aboutSubtitle}
                      onChange={(e) => setAboutSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Manufacturing Legacy & Story</label>
                  <textarea
                    rows={4}
                    value={aboutStoryContent}
                    onChange={(e) => setAboutStoryContent(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Mission</label>
                    <textarea
                      rows={3}
                      value={aboutMissionContent}
                      onChange={(e) => setAboutMissionContent(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Vision</label>
                    <textarea
                      rows={3}
                      value={aboutVisionContent}
                      onChange={(e) => setAboutVisionContent(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Factory Capacity & Infrastructure</label>
                  <textarea
                    rows={3}
                    value={aboutFactoryCapacityDetails}
                    onChange={(e) => setAboutFactoryCapacityDetails(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Zero-Defect Quality Policy</label>
                  <textarea
                    rows={3}
                    value={aboutQualityPolicyDetails}
                    onChange={(e) => setAboutQualityPolicyDetails(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Footer Content */}
          {activeTab === 'footer' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-serif">Footer Information & Copyright</h3>
                <p className="text-slate-500 text-xs">Static copy rendered at the bottom of every page.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Footer Short Bio / Company Overview</label>
                  <textarea
                    rows={3}
                    value={footerAboutBrief}
                    onChange={(e) => setFooterAboutBrief(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Footer Copyright Line</label>
                  <input
                    type="text"
                    value={footerCopyrightText}
                    onChange={(e) => setFooterCopyrightText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Factory Metrics & Claims */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                      <Factory className="w-5 h-5 text-amber-600" /> Real Manufacturing Metrics &amp; Trust Claims
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Set authentic, verifiable factory capacity figures, minimum order limits, quality protocol, and client transparency toggles.
                    </p>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-amber-200">
                    B2B Trust Authority
                  </span>
                </div>

                {/* Capacity & Production Numbers */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    1. Factory Scale &amp; Production Capacity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Years of Manufacturing Experience</label>
                      <input
                        type="text"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="e.g. 15+ Years"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Factory Floor Space / Area</label>
                      <input
                        type="text"
                        value={factoryArea}
                        onChange={(e) => setFactoryArea(e.target.value)}
                        placeholder="e.g. 25,000+ Sq. Ft."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Daily Bag Production Capacity</label>
                      <input
                        type="text"
                        value={dailyCapacity}
                        onChange={(e) => setDailyCapacity(e.target.value)}
                        placeholder="e.g. 10,000+ Bags/Day"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Throughput Capacity</label>
                      <input
                        type="text"
                        value={monthlyCapacity}
                        onChange={(e) => setMonthlyCapacity(e.target.value)}
                        placeholder="e.g. 250,000+ Bags/Month"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Skilled Workforce / Artisans</label>
                      <input
                        type="text"
                        value={workforce}
                        onChange={(e) => setWorkforce(e.target.value)}
                        placeholder="e.g. 150+ Skilled Artisans"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
                      <input
                        type="text"
                        value={minOrderQuantity}
                        onChange={(e) => setMinOrderQuantity(e.target.value)}
                        placeholder="e.g. 50 - 100 Units"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Quality & Reliability Claims */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    2. Quality Control &amp; Delivery SLA
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">On-Time Dispatch Rate</label>
                      <input
                        type="text"
                        value={onTimeDeliveryRate}
                        onChange={(e) => setOnTimeDeliveryRate(e.target.value)}
                        placeholder="e.g. 99.8%"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Countries / Regions Supplied</label>
                      <input
                        type="text"
                        value={countriesServed}
                        onChange={(e) => setCountriesServed(e.target.value)}
                        placeholder="e.g. 15+ Countries"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Quality Inspection Protocol</label>
                      <input
                        type="text"
                        value={qualityStandards}
                        onChange={(e) => setQualityStandards(e.target.value)}
                        placeholder="e.g. 100% In-Line & Final Inspection (AQL 2.5)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Key Compliance Badges</label>
                      <input
                        type="text"
                        value={certificationsList}
                        onChange={(e) => setCertificationsList(e.target.value)}
                        placeholder="e.g. ISO 9001:2015, MSME Registered"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Authenticity Toggle */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    3. Client Claims &amp; Social Proof Authenticity
                  </h4>
                  
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                    <div className="text-xs text-amber-900 font-medium">
                      ⚠️ <strong>B2B Verification Rule:</strong> If you do not have written consent to display specific corporate client logos, switch mode to <strong>Industries &amp; Business Sectors Served</strong> to maintain 100% truth in marketing.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Social Proof Section Mode</label>
                        <select
                          value={clientSectionMode}
                          onChange={(e) => setClientSectionMode(e.target.value as 'CLIENTS' | 'INDUSTRIES_SERVED')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                        >
                          <option value="INDUSTRIES_SERVED">Industries &amp; Sectors We Supply (Recommended)</option>
                          <option value="CLIENTS">Verified Official Client Logos</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Section Display Title</label>
                        <input
                          type="text"
                          value={clientSectionTitle}
                          onChange={(e) => setClientSectionTitle(e.target.value)}
                          placeholder="e.g. Industries &amp; Corporate Sectors We Supply"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4 shadow-sm">
                  <h4 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                    Live Verified Metrics Card
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Experience</span>
                      <span className="text-base font-bold text-white font-mono">{yearsExperience}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Facility Area</span>
                      <span className="text-base font-bold text-amber-400 font-mono">{factoryArea}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Daily Output</span>
                      <span className="text-base font-bold text-sky-400 font-mono">{dailyCapacity}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Workforce</span>
                      <span className="text-base font-bold text-emerald-400 font-mono">{workforce}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div>MOQ: <span className="text-slate-200 font-bold">{minOrderQuantity}</span></div>
                    <div>Dispatch SLA: <span className="text-emerald-400 font-bold">{onTimeDeliveryRate}</span></div>
                    <div>Quality: <span className="text-slate-200">{qualityStandards}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SEO, Google Search Console & XML Sitemap */}
          {activeTab === 'seo' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                
                {/* Google Search Console & Webmaster Verification */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                        <Search className="w-5 h-5 text-sky-600" /> Google Search Console &amp; Verification
                      </h3>
                      <p className="text-slate-500 text-xs">
                        Verify site ownership in Google Search Console and track search engine indexing for <code className="font-mono text-sky-700">https://ltsbags.com</code>.
                      </p>
                    </div>
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-sky-200">
                      SEO Webmaster
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Google Site Verification */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Google Search Console Verification (HTML Tag or Code)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={googleSiteVerification}
                          onChange={(e) => setGoogleSiteVerification(e.target.value)}
                          placeholder="e.g. google1234567890abcdef or <meta name='google-site-verification' content='...' />"
                          className="w-full font-mono text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Paste the verification string from Search Console or the entire <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code> tag. It will be injected automatically into the site <code className="text-slate-700">&lt;head&gt;</code>.
                      </p>
                    </div>

                    {/* Google Analytics GA4 Measurement ID */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Google Analytics 4 (GA4) / GTM ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={googleAnalyticsId}
                        onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                        placeholder="e.g. G-XXXXXXXXXX"
                        className="w-full font-mono text-xs px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Engine Sitemap & Indexing */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                        <Globe className="w-5 h-5 text-emerald-600" /> Search Engine Sitemap &amp; Indexing
                      </h3>
                      <p className="text-slate-500 text-xs">
                        Automatically generated XML Sitemap for Google, Bing, and search engine crawlers.
                      </p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                      Live XML Ready
                    </span>
                  </div>

                  {/* Sitemap URLs Box with 1-Click Copy */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Official Live Sitemap Endpoint:</span>
                      <a
                        href="/sitemap.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                      >
                        <span>Open /sitemap.xml</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="font-mono text-xs bg-slate-900 text-emerald-400 p-3 rounded-lg border border-slate-800 break-all select-all flex items-center justify-between gap-3">
                      <span>https://ltsbags.com/sitemap.xml</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('https://ltsbags.com/sitemap.xml', 'sitemap')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1 shrink-0 transition-colors"
                      >
                        {copiedField === 'sitemap' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Robots.txt Configuration:</span>
                      <a
                        href="/robots.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                      >
                        <span>Open /robots.txt</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Actions & Regeneration */}
                  <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Regenerate &amp; Sync Sitemap.xml</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Scans all active products, category pages, blog articles, and core landing pages to rebuild the XML index.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateSitemap}
                        disabled={isGeneratingSitemap}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGeneratingSitemap ? 'animate-spin' : ''}`} />
                        <span>{isGeneratingSitemap ? 'Generating Index...' : 'Regenerate Sitemap Now'}</span>
                      </button>
                    </div>

                    {sitemapStats && (
                      <div className="bg-white p-3.5 rounded-lg border border-sky-200 text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-200">
                        <div className="font-bold text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Latest Sitemap Build Successful
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                          <div className="bg-slate-50 p-2 rounded border">Products: <span className="font-bold text-sky-700">{sitemapStats.counts?.products || 0}</span></div>
                          <div className="bg-slate-50 p-2 rounded border">Categories: <span className="font-bold text-sky-700">{sitemapStats.counts?.categories || 0}</span></div>
                          <div className="bg-slate-50 p-2 rounded border">Blogs: <span className="font-bold text-sky-700">{sitemapStats.counts?.blogs || 0}</span></div>
                          <div className="bg-slate-50 p-2 rounded border">Total URLs: <span className="font-bold text-emerald-700">{sitemapStats.totalUrls || 0}</span></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Developer CLI Commands */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-slate-500" /> CLI Script Commands
                    </h4>
                    <div className="bg-slate-900 text-slate-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="text-slate-400"># Run automated sitemap build script:</div>
                      <div className="text-emerald-400">npm run sitemap</div>
                      <div className="text-slate-400 pt-1"># Or direct node execution:</div>
                      <div className="text-sky-300">node scripts/generate-sitemap.mjs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Guide */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Search className="w-4 h-4 text-sky-600" /> Google Search Console Setup Steps
                  </h4>
                  <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <strong className="text-slate-800 block">Step 1: Open Google Search Console</strong>
                      <p className="text-[11px]">Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-semibold underline inline-flex items-center gap-0.5">search.google.com <ExternalLink className="w-2.5 h-2.5" /></a> and sign in with your Google account.</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <strong className="text-slate-800 block">Step 2: Add Property</strong>
                      <p className="text-[11px]">Choose <strong>URL prefix</strong> and enter:</p>
                      <div className="font-mono text-[11px] bg-slate-900 text-emerald-300 px-2 py-1 rounded flex items-center justify-between">
                        <span>https://ltsbags.com</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('https://ltsbags.com', 'domain')}
                          className="text-[10px] text-slate-300 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700"
                        >
                          {copiedField === 'domain' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <strong className="text-slate-800 block">Step 3: Verify Ownership</strong>
                      <p className="text-[11px]">Select <strong>HTML tag</strong> method, copy the verification code/tag and paste it into the <em>Google Search Console Verification</em> box on the left, then click <strong>Save All Website Content</strong>.</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <strong className="text-slate-800 block">Step 4: Submit Sitemap</strong>
                      <p className="text-[11px]">In Search Console left menu, click <strong>Indexing &gt; Sitemaps</strong>, type <code className="font-mono bg-white px-1 py-0.5 rounded border text-sky-700 font-bold">sitemap.xml</code> and click <strong>Submit</strong>.</p>
                    </div>
                  </div>

                  <div className="text-[11px] bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-200">
                    💡 <strong>Real-time Updates:</strong> Whenever you add or edit products in the Admin Catalog, the live dynamic sitemap at <code className="font-mono">/sitemap.xml</code> updates immediately.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Floating Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveAllSettings()}
              disabled={isSaving}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Website Content...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save All Website Content</span>
                </>
              )}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
