import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact LTS BAGS Mumbai | Wholesale & Factory Inquiry',
  description: 'Contact LTS BAGS PRIVATE LIMITED in Dharavi, Mumbai for custom wholesale bag orders, digital mockups, factory visits, and manufacturing inquiries.',
  keywords: 'contact LTS bags, bag manufacturer contact Mumbai, Dharavi bag factory, wholesale bag inquiry, request bag quote',
  path: '/contact',
});

export default function ContactLayout({
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
            '@type': 'ContactPage',
            name: 'Contact LTS BAGS PRIVATE LIMITED',
            url: 'https://ltsbags.com/contact',
            description: 'Get in touch with LTS BAGS PRIVATE LIMITED for wholesale custom manufacturing quotes and inquiries.',
            mainEntity: {
              '@type': 'Organization',
              name: 'LTS BAGS PRIVATE LIMITED',
              url: 'https://ltsbags.com',
              telephone: '+91 91374 88358',
              email: 'info@ltsbags.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Floor-G, A341/2/3, Ganesh Sai Kripa CHS, Sant Rohidas Marg, Mukund Nagar, Dharavi',
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
