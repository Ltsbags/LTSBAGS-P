import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'About LTS BAGS PRIVATE LIMITED | Bag Manufacturer Mumbai',
  description: 'Learn about LTS BAGS PRIVATE LIMITED, premier Mumbai custom bag manufacturer with 14+ years producing corporate, school, travel, and promotional bags.',
  keywords: 'about LTS bags, bag manufacturer Mumbai, bag factory Dharavi, custom luggage maker India, OEM bag manufacturing',
  path: '/about',
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About LTS BAGS PRIVATE LIMITED',
            url: 'https://ltsbags.com/about',
            description: 'Learn about LTS BAGS PRIVATE LIMITED, premier Mumbai custom bag manufacturer with 14+ years producing corporate, school, travel, and promotional bags.',
            mainEntity: {
              '@type': 'Organization',
              name: 'LTS BAGS PRIVATE LIMITED',
              url: 'https://ltsbags.com',
              logo: 'https://ltsbags.com/logo.png',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Mumbai',
                addressRegion: 'Maharashtra',
                postalCode: '400017',
                addressCountry: 'IN',
              },
            },
          }),
        }}
      />
      {children}
    </>
  );
}
