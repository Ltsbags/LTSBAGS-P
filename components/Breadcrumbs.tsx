import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-xs font-medium text-slate-600 my-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-slate-500 hover:text-amber-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url + index} className="inline-flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1" />
              {isLast ? (
                <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-slate-500 hover:text-amber-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
