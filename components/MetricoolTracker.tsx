'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { METRICOOL_CONFIG } from '@/lib/metricool.config';

/**
 * Metricool Website Analytics Tracker Component
 * 
 * - Loads the official Metricool JavaScript tracking code asynchronously.
 * - Uses Next.js recommended `next/script` with `strategy="afterInteractive"`
 *   to avoid blocking page rendering and maintain optimal Web Vitals.
 * - STRICT ISOLATION: Excluded from all Admin Panel routes (`/admin/*`).
 * - Automatically tracks all public pages (Home, Categories, Products, Blogs, About, Contact, etc.).
 */
export default function MetricoolTracker() {
  const pathname = usePathname();

  // STRICT REQUIREMENT 8 & 9: Do NOT add the Metricool tracker to the Admin Panel.
  // The public website and Admin Panel must remain separate.
  if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return null;
  }

  // Check if tracking is disabled or no valid tracker hash has been configured
  const trackerHash = METRICOOL_CONFIG.trackerHash;
  if (!METRICOOL_CONFIG.enabled || !trackerHash) {
    return null;
  }

  return (
    <Script
      id="metricool-analytics-tracker"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"${trackerHash}"})});`,
      }}
    />
  );
}
