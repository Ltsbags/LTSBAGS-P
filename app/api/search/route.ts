import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const query = q.toLowerCase().trim();
  const allProducts = db.getProducts();
  const allCategories = db.getCategories();

  const matchedProducts = allProducts.filter((p) => 
    p.name.toLowerCase().includes(query) ||
    (p.shortDesc && p.shortDesc.toLowerCase().includes(query)) ||
    (p.fullDesc && p.fullDesc.toLowerCase().includes(query)) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(query)) ||
    (p.materials && p.materials.toLowerCase().includes(query))
  ).slice(0, 8);

  const matchedCategories = allCategories.filter((c) =>
    c.name.toLowerCase().includes(query) ||
    c.description.toLowerCase().includes(query)
  ).slice(0, 4);

  return NextResponse.json({
    products: matchedProducts,
    categories: matchedCategories,
  });
}
