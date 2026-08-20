'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CompanyContactInfo } from '@/lib/types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Award,
  User,
  Package
} from 'lucide-react';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams ? searchParams.get('product') || '' : '';

  const [formData, setFormData] = useState(() => ({
    name: '',
    company: '',
    email: '',
    mobile: '',
    productRequirement: initialProduct,
    quantity: '100',
    message: '',
  }));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        mobile: '',
        productRequirement: '',
        quantity: '100',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-amber-700 font-bold text-xs uppercase tracking-widest font-mono">
          Direct Factory Quote Form
        </span>
        <h2 className="text-2xl font-black text-slate-900 font-serif mt-1">
          Request Instant B2B Quotation
        </h2>
        <p className="text-slate-600 text-xs mt-1">
          Fill in your custom bag specifications. Our sales managers will send a detailed unit price quote within 24 hours.
        </p>
      </div>

      {success ? (
        <div className="py-12 text-center space-y-4 bg-emerald-50/50 rounded-xl border border-emerald-200 p-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Quote Request Submitted!</h3>
          <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
            Your enquiry has been saved in our factory database. Our corporate sales executive will review your fabric, dimensions, and logo printing specifications and reach out shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors"
          >
            Submit Another Specification
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Company / Organization
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Nexus Technologies Ltd"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Business Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
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
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Product Requirement / Bag Model *
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive 15.6 Inch Laptop Backpack"
                  value={formData.productRequirement}
                  onChange={(e) => setFormData({ ...formData, productRequirement: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Quantity Required *
              </label>
              <input
                type="number"
                required
                min="50"
                placeholder="100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Customization Details & Delivery Deadline *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Specify target fabric (1680D nylon, 600D poly, organic canvas), logo type (embroidery, metal badge, rubber patch), delivery location, and target price..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Saving Specification to Database...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Wholesale Quote Specification</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [contact, setContact] = useState<Partial<CompanyContactInfo>>({
    companyName: 'LTS BAGS PRIVATE LIMITED',
    tagline: 'Premier OEM/ODM Custom Bag Manufacturer & Global Exporter',
    phone1: '+91 98335 98338',
    phone2: '+91 96199 61971',
    email1: 'info@ltsbags.com',
    factoryAddress: 'FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI, MUMBAI 400017, MAHARASHTRA, INDIA',
    googleMapsUrl: 'https://www.google.com/search?kgmid=%2Fg%2F11qpsqysys&hl=en-IN&q=LTS%20BAGS%20PRIVATE%20LIMITED',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    gstNumber: '27AAGCL1568H1ZC',
    isoCertificate: 'ISO 9001:2015 Certified Manufacturing Facility',
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
      })
      .catch(() => {
        // Silently retain defaults
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        
        {/* Banner */}
        <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'Contact Us', url: '/contact' }]} />
            <div className="mt-3 max-w-3xl space-y-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Direct Factory Sales Office
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-white">
                Contact {contact.companyName}
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                {contact.tagline || 'Connect with our team for custom bag manufacturing, OEM/ODM orders, bulk inquiries, and sample prototyping.'}
              </p>
            </div>
          </div>
        </section>

        {/* Form and Contact Info Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Contact Details */}
              <div className="lg:col-span-5 space-y-8">
                
                <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6 shadow-xs">
                  <h3 className="text-xl font-bold text-slate-900 font-serif border-b border-slate-100 pb-3">
                    Corporate & Manufacturing Contact
                  </h3>

                  <ul className="space-y-5 text-xs text-slate-600">
                    <li className="flex items-start gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold text-sm">Company Name</strong>
                        <span className="text-slate-700 font-semibold">{contact.companyName}</span>
                        {contact.gstNumber && (
                          <span className="block text-[11px] text-slate-500 mt-0.5 font-mono">
                            GSTIN: {contact.gstNumber}
                          </span>
                        )}
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold text-sm mb-1">Phone Numbers</strong>
                        <div className="space-y-1">
                          {contact.phone1 && (
                            <a href={`tel:${contact.phone1.replace(/\s+/g, '')}`} className="text-amber-700 hover:underline font-bold block text-xs">
                              {contact.phone1}
                            </a>
                          )}
                          {contact.phone2 && (
                            <a href={`tel:${contact.phone2.replace(/\s+/g, '')}`} className="text-amber-700 hover:underline font-bold block text-xs">
                              {contact.phone2}
                            </a>
                          )}
                        </div>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold text-sm">Email Address</strong>
                        <div className="space-y-0.5">
                          {contact.email1 && (
                            <a href={`mailto:${contact.email1}`} className="text-amber-700 hover:underline font-bold text-xs block">
                              {contact.email1}
                            </a>
                          )}
                          {contact.email2 && (
                            <a href={`mailto:${contact.email2}`} className="text-amber-700 hover:underline font-bold text-xs block">
                              {contact.email2}
                            </a>
                          )}
                        </div>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold text-sm">Operating Hours</strong>
                        <span>{contact.workingHours}</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Google Maps Location Card */}
                {contact.googleMapsUrl && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-serif">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <span>Find Us On Google Maps</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Locate <strong>{contact.companyName}</strong> directly on Google Maps for office directions, reviews, and manufacturing hub details.
                    </p>
                    <a
                      href={contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-sm"
                    >
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>Open Location on Google Maps</span>
                    </a>
                  </div>
                )}

                {/* Trust Box */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <Award className="w-4 h-4" /> B2B Factory Assurance
                  </div>
                  <h4 className="font-bold text-base font-serif">{contact.isoCertificate || '100% Guaranteed Quality & On-Time Delivery'}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {contact.companyName} provides direct factory pricing, strict QC checks, and bulk production handling for corporate client projects.
                  </p>
                </div>

              </div>


              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <Suspense fallback={<div className="p-8 text-center">Loading contact form...</div>}>
                  <ContactFormInner />
                </Suspense>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
