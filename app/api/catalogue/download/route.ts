import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    let catalogue = id ? db.getCatalogueById(id) : undefined;
    if (!catalogue) {
      const activeList = db.getCatalogues(true);
      catalogue = activeList[0];
    }

    if (catalogue) {
      db.incrementCatalogueDownload(catalogue.id);
      return NextResponse.redirect(new URL(catalogue.fileUrl, req.url));
    }

    return NextResponse.redirect(new URL('/uploads/catalogues/LTS-Corporate-Backpacks-2026.pdf', req.url));
  } catch (error) {
    console.error('Error serving catalogue download:', error);
    return NextResponse.redirect(new URL('/products', req.url));
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, phone, company } = await req.json();
    
    // Find catalogue to increment counter
    let catalogueTitle = 'B2B Bag Master Catalogue';
    if (id) {
      const cat = db.getCatalogueById(id);
      if (cat) {
        catalogueTitle = cat.title;
        db.incrementCatalogueDownload(cat.id);
      }
    } else {
      const firstActive = db.getCatalogues(true)[0];
      if (firstActive) {
        catalogueTitle = firstActive.title;
        db.incrementCatalogueDownload(firstActive.id);
      }
    }

    // If user provided contact info before downloading, create an enquiry lead
    if (name && (email || phone)) {
      db.createEnquiry({
        name,
        company: company || 'Direct Download Lead',
        email: email || '',
        mobile: phone || '',
        productRequirement: `Downloaded PDF Catalogue: ${catalogueTitle}`,
        quantity: 100,
        message: `Catalogue download lead captured via brochure download form. Catalogue: ${catalogueTitle}`,
        source: 'CATALOGUE_DOWNLOAD',
      });
    }

    return NextResponse.json({ success: true, catalogueTitle });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to track download' }, { status: 500 });
  }
}
