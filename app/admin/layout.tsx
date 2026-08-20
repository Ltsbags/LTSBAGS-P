import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LTS BAGS - Operations & Catalog Admin Portal',
  description: 'Secure Admin Management Dashboard for LTS BAGS PRIVATE LIMITED',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {children}
    </div>
  );
}
