'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Client } from '@/lib/types';

interface ClientLogosSectionProps {
  initialClients?: Client[];
}

export default function ClientLogosSection({ initialClients }: ClientLogosSectionProps) {
  const [clients, setClients] = useState<Client[]>(initialClients || []);
  const [loading, setLoading] = useState(!initialClients);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (initialClients) return;

    fetch('/api/clients?active=true')
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setClients(data.filter((c: Client) => c.isActive !== false));
        }
      })
      .catch(() => {
        setClients([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialClients]);

  const activeClients = clients.filter((c) => c.isActive !== false);

  // If no active clients or disabled, do not render clutter
  if (!loading && activeClients.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-widest font-mono bg-[#72AFDB]/10 px-3.5 py-1 rounded-full border border-[#72AFDB]/30">
            Enterprise Trust
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Trusted by Businesses &amp; Institutions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Delivering bulk customized bags for corporate gifting programs, educational campuses, and retail private labels.
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {activeClients.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center h-24 hover:border-[#72AFDB] hover:shadow-md transition-all duration-300 group"
            >
              {client.logoUrl ? (
                <div className="relative w-full h-12 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    fill
                    sizes="150px"
                    referrerPolicy="no-referrer"
                    className="object-contain object-center"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Building2 className="w-5 h-5 text-slate-400 group-hover:text-[#72AFDB] transition-colors" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans">
                    {client.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
