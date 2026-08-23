'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex items-center justify-center min-h-screen p-6 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Application Error</h2>
          <p className="text-sm text-slate-600">
            A critical error occurred while rendering the page.
          </p>
          <button
            onClick={() => reset()}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
