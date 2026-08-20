import { getBaseUrl, isIndexingEnabled } from '@/lib/seo';

export async function GET() {
  const baseUrl = getBaseUrl();
  const indexing = isIndexingEnabled();

  const robotsTxt = indexing
    ? `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`
    : `User-agent: *
Disallow: /
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
