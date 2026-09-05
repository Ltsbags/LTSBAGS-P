'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Phone,
  Mail,
  User,
  Package,
  Calendar,
  MapPin,
  Palette,
  Layers,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  X,
  FileCheck
} from 'lucide-react';
import { VERIFIED_BUSINESS_INFO, getContextualWhatsAppUrl } from '@/lib/business-info';

export default function FactoryQuoteSection() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    // Step 1: Contact & Volume
    fullName: '',
    companyName: '',
    whatsappNumber: '',
    email: '',
    productCategory: 'Corporate Backpacks',
    quantity: '100',

    // Step 2: Specifications & Delivery
    material: '1680D Ballistic Nylon (Heavy Duty)',
    colour: 'Black',
    customLogo: '3D High-Density Embroidery',
    deliveryLocation: 'Mumbai, Maharashtra, India',
    requiredDeliveryDate: '',
    additionalRequirements: '',
  });

  const [referenceFile, setReferenceFile] = useState<{ name: string; size: number; base64?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Corporate Backpacks',
    'Executive Laptop Bags',
    'School Bags & Bookpacks',
    'Duffle & Travel Bags',
    'Gym & Sports Holdalls',
    'Tote Bags (Canvas & Cotton)',
    'Jute & Juco Shopping Bags',
    'Promotional & Drawstring Bags',
    'Custom OEM/ODM Bags',
  ];

  const materials = [
    '1680D Ballistic Nylon (Heavy Duty)',
    '1000D Cordura Style Nylon',
    '900D/600D Matte Polyester',
    '100% Organic Cotton Canvas (12oz–16oz)',
    'Natural Jute / Juco Fabric',
    'Vegan PU Leatherette',
    'Waterproof Ripstop Fabric',
    'Custom Blend (To Specification)',
  ];

  const logoOptions = [
    '3D High-Density Embroidery',
    'Silk Screen Printing (Water-Based / Plastisol)',
    'Molded Silicone / Rubber Badge',
    'Heat Debossed Leather Patch',
    'Laser Engraved Metal Plate',
    'Woven Brand Tag',
    'No Logo / Plain',
  ];

  // Auto-restore form progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lts_quote_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Auto-save form progress to localStorage
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      try {
        localStorage.setItem('lts_quote_draft', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Please provide your Full Name.');
      return false;
    }
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.trim().length < 8) {
      setError('Please provide a valid WhatsApp / Phone Number with country code.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid Corporate or Personal Email address.');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setError('Please specify an estimated order quantity (Minimum 50 units).');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      // Scroll to form header
      const el = document.getElementById('quote-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(1);
  };

  // File Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller file or send via WhatsApp.');
      return;
    }

    // Validate format (PNG, JPG, PDF, AI, CDR, ZIP)
    const validExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.ai', '.cdr', '.zip'];
    const fileNameLower = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!isValid) {
      setError('Invalid file format. Allowed formats: PNG, JPG, PDF, AI, CDR, ZIP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceFile({
        name: file.name,
        size: file.size,
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setReferenceFile(null);
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullMessage = `[Product Category: ${formData.productCategory}]
[Quantity: ${formData.quantity} Units]
[Material: ${formData.material}]
[Colour: ${formData.colour}]
[Logo/Branding: ${formData.customLogo}]
[Delivery Destination: ${formData.deliveryLocation || 'Dharavi / Mumbai'}]
[Target Date: ${formData.requiredDeliveryDate || 'Standard'}]
[Attached File: ${referenceFile ? referenceFile.name : 'None'}]
[Additional Notes: ${formData.additionalRequirements || 'None'}]`;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          company: formData.companyName || 'Not Specified',
          email: formData.email,
          mobile: formData.whatsappNumber,
          whatsapp: formData.whatsappNumber,
          productRequirement: `${formData.productCategory} (${formData.quantity} Units)`,
          quantity: parseInt(formData.quantity) || 100,
          material: formData.material,
          color: formData.colour,
          logoBranding: formData.customLogo,
          deliveryLocation: formData.deliveryLocation,
          deliveryDate: formData.requiredDeliveryDate,
          message: fullMessage,
          source: 'Homepage 2-Step Quote Form',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request. Please try again.');
      }

      setSuccess(true);
      try {
        localStorage.removeItem('lts_quote_draft');
      } catch {
        // Ignore
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please submit or message us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const directWhatsAppUrl = getContextualWhatsAppUrl({
    categoryName: formData.productCategory,
    quantity: formData.quantity,
    material: formData.material,
    location: formData.deliveryLocation,
    intent: 'quote',
  });

  return (
    <section id="quote-form-section" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Direct Factory Quotation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Request an Official B2B Manufacturing Quote
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Get transparent per-unit factory pricing, fabric sample timelines, and bulk production scheduling within 24 hours.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          
          {/* STEP INDICATOR HEADER */}
          {!success && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <span className={currentStep === 1 ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-400'}>
                  Step 1: Contact &amp; Volume
                </span>
                <span className={currentStep === 2 ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-400'}>
                  Step 2: Technical Specifications
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: currentStep === 1 ? '50%' : '100%' }}
                />
              </div>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS STATE */}
          {success ? (
            <div className="py-8 text-center space-y-5 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-sans">
                Quote Request Successfully Submitted!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Our commercial engineering team at Dharavi, Mumbai has received your specifications for <strong>{formData.quantity} units of {formData.productCategory}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Response Time:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Within 24 Business Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Confirmation Sent To:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">WhatsApp Updates:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formData.whatsappNumber}</span>
                </div>
              </div>

              {/* Fast Track WhatsApp CTA */}
              <div className="pt-2 space-y-3">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>FAST-TRACK ON WHATSAPP WITH DRAWINGS</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setCurrentStep(1);
                    setReferenceFile(null);
                  }}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:underline font-mono"
                >
                  Submit another quote inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit} className="space-y-6">
              
              {/* ================= STEP 1: CONTACT & VOLUME ================= */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Step 1: Contact Details &amp; Quantity
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      We require your official contact channels to prepare formal quotes and provide sample updates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Company / Organization Name</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* WhatsApp / Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>WhatsApp / Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="procurement@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Product Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>Product Category *</span>
                      </label>
                      <select
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      >
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Estimated Quantity */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Estimated Quantity (Units) *</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="50"
                        step="10"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        placeholder="100"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Standard factory MOQ is 50 to 100 units depending on design.
                      </span>
                    </div>
                  </div>

                  {/* Step 1 Action Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Step 2: Specifications</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: SPECIFICATIONS & DELIVERY ================= */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Step 2: Technical Specifications &amp; Delivery
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Select material preferences, upload design sketches, and specify delivery requirements.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="text-xs font-bold text-slate-500 hover:text-amber-500 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Step 1</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Material Preference */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Material Preference</span>
                      </label>
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      >
                        {materials.map((mat, idx) => (
                          <option key={idx} value={mat}>{mat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Color Preference */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-slate-400" />
                        <span>Color Preference</span>
                      </label>
                      <input
                        type="text"
                        name="colour"
                        value={formData.colour}
                        onChange={handleInputChange}
                        placeholder="e.g. Classic Black, Navy Blue, Custom Pantone"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Logo / Branding Type */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                        <span>Logo / Branding Type</span>
                      </label>
                      <select
                        name="customLogo"
                        value={formData.customLogo}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      >
                        {logoOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Delivery Location */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Delivery Location (City, State, Country)</span>
                      </label>
                      <input
                        type="text"
                        name="deliveryLocation"
                        value={formData.deliveryLocation}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai, Maharashtra, India or Dubai, UAE"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Required Delivery Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Required Delivery Date (Optional)</span>
                      </label>
                      <input
                        type="date"
                        name="requiredDeliveryDate"
                        value={formData.requiredDeliveryDate}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Reference File / Tech Pack Upload */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reference Image / Tech Pack</span>
                      </label>
                      
                      {referenceFile ? (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="truncate font-medium text-slate-800 dark:text-slate-200">{referenceFile.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({Math.round(referenceFile.size / 1024)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1 text-slate-400 hover:text-rose-500"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs text-slate-600 dark:text-slate-300">
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span>Attach File (PNG, JPG, PDF, AI, CDR, ZIP)</span>
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.pdf,.ai,.cdr,.zip"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Max file size: 10MB.
                      </span>
                    </div>
                  </div>

                  {/* Additional Requirements Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Additional Requirements / Custom Specifications
                    </label>
                    <textarea
                      name="additionalRequirements"
                      rows={3}
                      value={formData.additionalRequirements}
                      onChange={handleInputChange}
                      placeholder="Specify pocket layouts, laptop sleeve dimensions, special zipper requirements, or packaging needs..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Form Submission Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Step 1</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span>Processing Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>SUBMIT FACTORY QUOTE REQUEST</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>

        {/* Reassurance Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono text-center">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Zero Spam Guarantee
          </span>
          <span>•</span>
          <span>Official GST Tax Invoice</span>
          <span>•</span>
          <span>Dharavi, Mumbai Manufacturing Floor</span>
        </div>

      </div>
    </section>
  );
}
