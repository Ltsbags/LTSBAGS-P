import type {Metadata} from 'next';
import './globals.css';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import AiChatbot from '@/components/AiChatbot';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import MetricoolTracker from '@/components/MetricoolTracker';

export const metadata: Metadata = {
  title: 'LTS BAGS PRIVATE LIMITED - Custom B2B Bag Manufacturer & Wholesale Supplier',
  description: 'Premier custom B2B bag manufacturer & wholesale supplier for corporate backpacks, laptop briefcases, travel duffels, and eco totes.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
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



