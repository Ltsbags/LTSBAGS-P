'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Award, 
  User, 
  Package, 
  Phone, 
  Mail, 
  Clock, 
  Layers, 
  Printer, 
  MessageCircle,
  PhoneCall,
  Check
} from 'lucide-react';
import { Category, Product, CompanyContactInfo } from '@/lib/types';
import { VERIFIED_BUSINESS_INFO, getContextualWhatsAppUrl } from '@/lib/business-info';

export default function RequestQuoteClient() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams ? searchParams.get('product') || '' : '';
  const initialCategory = searchParams ? searchParams.get('category') || '' : '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    phone1: VERIFIED_BUSINESS_INFO.contact.primaryPhone,
    socialWhatsapp: VERIFIED_BUSINESS_INFO.contact.whatsappNumberRaw,
  });

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    mobile: '',
    category: initialCategory,
    productRequirement: initialProduct,
    quantity: '100',
    targetPrice: '',
    brandingType: '3D High-Density Embroidery',
    targetFabric: '1680D Ballistic Nylon (Heavy Duty)',
    deliveryTimeline: 'Standard (15-20 Days)',
    deliveryLocation: '',
    sampleRequired: false,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ])
      .then(([cats, prods, sets]) => {
        if (Array.isArray(cats)) setCategories(cats);
        if (Array.isArray(prods)) setProducts(prods);
        if (sets?.contactInfo) setContact(sets.contactInfo);
      })
      .catch((err) => {
        console.error('Failed to load quote dependencies:', err);
      });
  }, []);

  const quantityPresets = ['50', '100', '250', '500', '1000', '2500+'];
  const brandingOptions = [
    '3D High-Density Embroidery',
    'Silk Screen Printing',
    'Debossed PU Leather Patch',
    'Raised Silicone / Rubber Badge',
    'Laser Engraved Metal Plate',
    'Full Sublimation Print',
  ];
  const fabricOptions = [
    '1680D Ballistic Nylon (Heavy Duty)',
    '1000D Cordura Style Nylon',
    '600D Polyester (Classic)',
    '100% Organic Cotton Canvas (Eco)',
    'Vegan PU Leatherette',
    'Waterproof Ripstop Fabric',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const detailedMessage = `[Target Fabric: ${formData.targetFabric}] [Branding: ${formData.brandingType}] [Timeline: ${formData.deliveryTimeline}] \n\nClient Notes: ${formData.message}`;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          mobile: formData.mobile,
          category: formData.category,
          productRequirement: formData.productRequirement || formData.category || 'Custom Bag Batch',
          quantity: formData.quantity,
          targetPrice: formData.targetPrice,
          material: formData.targetFabric,
          printingType: formData.brandingType,
          sampleRequired: formData.sampleRequired,
          deliveryLocation: formData.deliveryLocation,
          source: formData.sampleRequired ? 'SAMPLE_REQUEST' : 'FORM',
          message: detailedMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote enquiry');
      }

      setSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        mobile: '',
        category: '',
        productRequirement: '',
        quantity: '100',
        targetPrice: '',
        brandingType: '3D High-Density Embroidery',
        targetFabric: '1680D Ballistic Nylon (Heavy Duty)',
        deliveryTimeline: 'Standard (15-20 Days)',
        deliveryLocation: '',
        sampleRequired: false,
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error submitting quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = getContextualWhatsAppUrl({
    categoryName: formData.category,
    productName: formData.productRequirement,
    quantity: formData.quantity,
    material: formData.targetFabric,
    location: formData.deliveryLocation,
    intent: formData.sampleRequired ? 'sample' : 'quote'
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left / Main: Quote Form */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono">
            Direct Factory Pricing Form
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-serif mt-1">
            Configure Your Batch Specifications
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">
            Fill in your project requirements below. All quotes include direct ex-factory pricing and complimentary pre-production digital proofing.
          </p>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quote Request Received!</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Thank you! Your custom bag specifications have been logged in our manufacturing queue. Our senior sales estimator will prepare a detailed itemized PDF quotation within 24 business hours.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-[#72AFDB] dark:hover:bg-[#5C9BC7] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
            >
              Submit Another Quote Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Contact Info Group */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <User className="w-4 h-4 text-[#72AFDB]" /> 1. Contact & Corporate Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. TechCorp Solutions Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Product & Quantity */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Package className="w-4 h-4 text-[#72AFDB]" /> 2. Bag Style & Batch Volume
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Bag Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, productRequirement: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Fully Custom Bag Design">Fully Custom Tech Pack / Unique Design</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specific Product Model / Bag Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Executive 15.6 Laptop Backpack"
                    value={formData.productRequirement}
                    onChange={(e) => setFormData({ ...formData, productRequirement: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Quantity Presets */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Order Quantity (Units) *
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {quantityPresets.map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setFormData({ ...formData, quantity: qty.replace('+', '') })}
                      className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        formData.quantity === qty.replace('+', '')
                          ? 'bg-[#72AFDB] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {qty} Units
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  min="50"
                  placeholder="Or enter custom number (e.g. 350)"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* 3. Custom Branding & Material Specifications */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#72AFDB]" /> 3. Material & Custom Logo Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Fabric / Material
                  </label>
                  <select
                    value={formData.targetFabric}
                    onChange={(e) => setFormData({ ...formData, targetFabric: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {fabricOptions.map((fab) => (
                      <option key={fab} value={fab}>{fab}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Branding Technique
                  </label>
                  <select
                    value={formData.brandingType}
                    onChange={(e) => setFormData({ ...formData, brandingType: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {brandingOptions.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Unit Budget / Price Range (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹350 - ₹500 / $5 - $8 per unit"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Destination City / Port
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Bengaluru, Dubai, London"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              {/* Sample Batch Request Checkbox */}
              <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sampleRequired}
                    onChange={(e) => setFormData({ ...formData, sampleRequired: e.target.checked })}
                    className="w-4 h-4 mt-0.5 text-purple-600 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Request Pre-Production Physical Sample Batch
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal block mt-0.5">
                      Check this box if you require a physical sample with custom embroidery/print dispatched to your office for board/client approval before bulk cutting.
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customization Details & Delivery Deadline *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Specify target dimensions, lining color preferences, special compartment requirements (e.g. 17-inch padded sleeve, USB port, TSA lock), delivery city/country, and target budget..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#72AFDB] outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs leading-relaxed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#72AFDB]/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Generating Quote Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Custom Quote Request</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center">
              🔒 Confidential B2B Pricing. We never share client contact details or tech specs with third parties.
            </p>
          </form>
        )}
      </div>

      {/* Right: Factory Direct Assurance Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Quick WhatsApp Box */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800/80 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">Fast Track Inquiry</span>
              <h4 className="text-lg font-bold">Need a Quote in 1 Hour?</h4>
            </div>
          </div>
          <p className="text-emerald-200 text-xs leading-relaxed">
            Chat directly with our factory sales engineers on WhatsApp for immediate fabric availability, instant pricing estimates, and catalog PDFs.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp Now</span>
          </a>
        </div>

        {/* Manufacturing Guarantees */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#72AFDB]" /> Factory Direct Assurances
          </h4>

          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Pre-Production Samples:</strong> Physical golden sample dispatched within 5-7 working days before bulk stitching.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Zero-Defect Quality Control:</strong> Strict AQL 2.5 testing on tensile strap pull, zipper stress, and seam load.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Direct Factory Margins:</strong> 100% genuine OEM/ODM manufacturing in Mumbai without trading markups.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Export & Logistics Support:</strong> Door-to-door delivery with GST compliance and sea/air freight clearance.</span>
            </li>
          </ul>
        </div>

        {/* Call Helpline */}
        {contact.phone1 && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-3">
            <span className="text-[#72AFDB] font-mono text-[10px] uppercase font-bold tracking-wider">Direct Sales Hotline</span>
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-[#72AFDB]" />
              <div>
                <a href={`tel:${contact.phone1.replace(/\s+/g, '')}`} className="text-base font-bold text-white hover:text-[#72AFDB] transition-colors">
                  {contact.phone1}
                </a>
                <p className="text-[11px] text-slate-400">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
