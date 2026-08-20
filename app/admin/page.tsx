'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminRootPage() {
  const router = useRouter();
  const { user, loading } = useAdminAuth({ requireAuth: false });

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <span>Loading LTS BAGS Admin Portal...</span>
    </div>
  );
}
