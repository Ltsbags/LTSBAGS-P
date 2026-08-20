'use client';

import React, { useState } from 'react';
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
  Palette
} from 'lucide-react';

export default function FactoryQuoteSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    whatsappNumber: '',
    email: '',
    productCategory: 'Corporate Backpacks',
    productName: '',
    quantity: '100',
    material: '1680D Ballistic Nylon',
    colour: 'Black',
    customLogo: '3D High-Density Embroidery',
    deliveryLocation: 'Mumbai, Maharashtra',
    requiredDeliveryDate: '',
    additionalRequirements: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Backpack Bags',
    'School Bags',
    'Laptop Bags',
    'Corporate Bags',
    'Office Bags',
    'Duffle Bags',
    'Travel Bags',
    'Gym Bags',
    'Sports Bags',
    'Tote Bags',
    'Jute Bags',
    'Canvas Bags',
    'Sling Bags',
    'Lunch Bags',
    'Promotional Bags',
    'Custom Bags',
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Basic validation
      if (!formData.fullName || !formData.whatsappNumber || !formData.email) {
        throw new Error('Please fill in all required contact information.');
      }

      // Convert files to base64 or description if provided
      let logoName = logoFile ? logoFile.name : 'None';
      let refName = referenceFile ? referenceFile.name : 'None';

      const fullMessage = `[Product: ${formData.productCategory} - ${formData.productName || 'Custom Model'}]
[Material: ${formData.material}]
[Colour: ${formData.colour}]
[Logo Type: ${formData.customLogo}]
[Logo File Attached: ${logoName}]
[Reference Image: ${refName}]
[Delivery Location: ${formData.deliveryLocation}]
[Required Date: ${formData.requiredDeliveryDate || 'Standard'}]
[Notes: ${formData.additionalRequirements || 'None'}]`;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          company: formData.companyName,
          email: formData.email,
          mobile: formData.whatsappNumber,
          productRequirement: `${formData.productCategory} (${formData.quantity} Units)`,
          quantity: formData.quantity,
          message: fullMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        companyName: '',
        whatsappNumber: '',
        email: '',
        productCategory: 'Corporate Backpacks',
        productName: '',
        quantity: '100',
        material: '1680D Ballistic Nylon',
        colour: 'Black',
        customLogo: '3D High-Density Embroidery',
        deliveryLocation: '',
        requiredDeliveryDate: '',
        additionalRequirements: '',
      });
      setLogoFile(null);
      setReferenceFile(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quote-form-section" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Factory Direct Quotation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Get an Official B2B Manufacturing Quote
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Fill in your 15-point specification requirement to receive direct factory unit pricing and pre-production sampling timelines within 24 hours.
          </p>
        </div>

        {/* Main Form Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          
          {success ? (
            <div className="py-12 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-sans">
                Quote Request Received!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Thank you. Our factory engineering and commercial estimator team will review your specifications, verify fabric availability, and provide an official quotation within 24 business hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another Requirement
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Contact Information (Fields 1 - 4) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[#72AFDB] font-mono font-bold text-xs">01</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-sans">
                    Contact &amp; Company Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      1. Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      2. Company / Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Infosys / TCS / Self"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      3. WhatsApp / Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      required
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="+91 98335 98338"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      4. Corporate Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="rahul@company.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Product Specifications (Fields 5 - 10) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[#72AFDB] font-mono font-bold text-xs">02</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-sans">
                    Bag Specifications &amp; Branding
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      5. Product Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      6. Product Name / Reference Model
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apex 15.6 Laptop Backpack"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      7. Target Quantity (Units) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="50"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="100"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Note: MOQ varies per style (50 - 100 units).</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      8. Material Preference
                    </label>
                    <select
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    >
                      {materials.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      9. Bag Colour / Pantone Code
                    </label>
                    <input
                      type="text"
                      name="colour"
                      value={formData.colour}
                      onChange={handleInputChange}
                      placeholder="e.g. Navy Blue / Black / Pantone 286C"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      10. Custom Logo Branding Method
                    </label>
                    <select
                      name="customLogo"
                      value={formData.customLogo}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    >
                      {logoOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Files & Delivery (Fields 11 - 15) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[#72AFDB] font-mono font-bold text-xs">03</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-sans">
                    Artwork &amp; Logistics
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      11. Upload Logo (Vector / PNG)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf,.ai,.eps,.svg"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-[#72AFDB] file:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      12. Upload Reference Design / Sample
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setReferenceFile(e.target.files?.[0] || null)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-[#72AFDB] file:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      13. Delivery Destination Location
                    </label>
                    <input
                      type="text"
                      name="deliveryLocation"
                      value={formData.deliveryLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai / Bengaluru / Export"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      14. Required Delivery Target Date
                    </label>
                    <input
                      type="date"
                      name="requiredDeliveryDate"
                      value={formData.requiredDeliveryDate}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    15. Additional Manufacturing Requirements / Notes
                  </label>
                  <textarea
                    rows={3}
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleInputChange}
                    placeholder="Specify pocket requirements, TSA locks, zipper preferences, individual box packaging, or specific target unit pricing..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#72AFDB]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Direct Factory NDA &amp; Pricing Confidentiality</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Quote Request...' : 'Get Factory Quote'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
