'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('apex_admin_logged_in') === 'true';
    if (isLoggedIn) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
      Loading LTS BAGS Admin Portal...
    </div>
  );
}
