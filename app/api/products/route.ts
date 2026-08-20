import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');

    let products = db.getProducts();

    if (categoryId) {
      products = products.filter((p) => p.categoryId === categoryId);
    }
    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.categoryId) {
      return NextResponse.json({ error: 'Product name and category are required' }, { status: 400 });
    }
    const saved = db.saveProduct(body);
    revalidatePath('/', 'layout');
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
