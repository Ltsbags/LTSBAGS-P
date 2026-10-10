import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center my-12">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black font-mono">
            404
          </div>
          <h1 className="text-3xl font-black font-serif text-slate-900">Page Not Found</h1>
          <p className="text-slate-600 text-sm">
            The page or product category you are looking for does not exist or has been relocated.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4 text-[#72AFDB]" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/products"
              className="bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Package className="w-4 h-4 text-white" />
              <span>Browse Catalog</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
              Popular Product Lines
            </span>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link href="/products/backpacks" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#72AFDB] hover:text-[#72AFDB] transition-colors">
                Backpacks
              </Link>
              <Link href="/products/laptop-office-bags" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#72AFDB] hover:text-[#72AFDB] transition-colors">
                Laptop Bags
              </Link>
              <Link href="/products/school-college-bags" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#72AFDB] hover:text-[#72AFDB] transition-colors">
                School Bags
              </Link>
              <Link href="/products/travel-bags" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#72AFDB] hover:text-[#72AFDB] transition-colors">
                Travel Bags
              </Link>
              <Link href="/products/jute-eco-bags" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#72AFDB] hover:text-[#72AFDB] transition-colors">
                Jute & Eco Bags
              </Link>
              <Link href="/request-a-quote" className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-bold hover:bg-sky-100 transition-colors">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
