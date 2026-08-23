import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import AiChatbot from '@/components/AiChatbot';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import MetricoolTracker from '@/components/MetricoolTracker';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'LTS BAGS PRIVATE LIMITED - Custom B2B Bag Manufacturer & Wholesale Supplier',
    description: 'Premier custom B2B bag manufacturer & wholesale supplier for corporate backpacks, laptop briefcases, travel duffels, and eco totes.',
    path: '',
  }),
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BVRDE41G94"
          strategy="afterInteractive"
        />
        <Script
          id="google-tag-gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-BVRDE41G94');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="relative antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <FloatingContactButtons />
            <AiChatbot />
            <MetricoolTracker />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



