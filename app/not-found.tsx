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
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/products"
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-300 transition-colors"
            >
              <Package className="w-4 h-4 text-amber-600" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
