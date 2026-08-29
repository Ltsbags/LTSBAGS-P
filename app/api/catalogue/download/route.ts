import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, phone, company } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Catalogue ID is required' }, { status: 400 });
    }

    db.trackCatalogueDownload(id);

    // If user provided contact info before downloading, create an enquiry lead
    if (name && (email || phone)) {
      const catalogue = db.getCatalogueById(id);
      db.createEnquiry({
        name,
        company: company || 'Direct Download Lead',
        email: email || '',
        mobile: phone || '',
        productRequirement: `Downloaded PDF Catalogue: ${catalogue?.title || id}`,
        quantity: 100,
        message: `Catalogue download lead captured via brochure download form. Catalogue: ${catalogue?.title || id}`,
        source: 'CATALOGUE_DOWNLOAD',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to track download' }, { status: 500 });
  }
}
