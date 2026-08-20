import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get('active') === 'true';
    const items = db.getCertifications(onlyActive);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, issuingOrganization, certificateNumber, issueDate, expiryDate, imageUrl, pdfUrl, description, displayOrder, isActive } = body;

    if (!name || !issuingOrganization || !certificateNumber || !expiryDate) {
      return NextResponse.json(
        { error: 'Name, Issuing Organization, Certificate Number, and Expiry Date are required' },
        { status: 400 }
      );
    }

    const cert = db.saveCertification({
      name,
      issuingOrganization,
      certificateNumber,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      expiryDate,
      imageUrl: imageUrl || '',
      pdfUrl: pdfUrl || '',
      description: description || '',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      isActive: isActive !== undefined ? !!isActive : true,
    });

    return NextResponse.json(cert, { status: 201 });
  } catch (error) {
    console.error('Error adding certification:', error);
    return NextResponse.json({ error: 'Failed to add certification' }, { status: 500 });
  }
}
