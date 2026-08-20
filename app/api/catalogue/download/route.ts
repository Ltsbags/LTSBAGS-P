import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const settings = db.getSettings();
  const catalogueUrl = settings.homepage?.cataloguePdfUrl;

  if (catalogueUrl) {
    return NextResponse.redirect(catalogueUrl);
  }

  // If no external PDF url configured, generate a comprehensive text/html response or PDF payload
  const categories = db.getCategories();
  const products = db.getProducts();

  const catalogueData = {
    company: 'LTS BAGS PRIVATE LIMITED',
    tagline: 'Custom Bag Manufacturer in Mumbai, India',
    contact: {
      phone: settings.contactInfo?.phone1 || '+91 9833598338',
      email: settings.contactInfo?.email1 || 'info@ltsbags.com',
      website: 'https://mumbaibags.com',
      address: settings.contactInfo?.factoryAddress || 'Mumbai, Maharashtra, India',
    },
    categoriesCount: categories.length,
    productsCount: products.length,
    categories: categories.map(c => ({ name: c.name, slug: c.slug, description: c.description })),
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(catalogueData, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="LTS-BAGS-Product-Catalogue.json"',
    },
  });
}
