import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const quotations = db.getQuotations();
    return NextResponse.json(quotations);
  } catch (error) {
    console.error('Failed to fetch quotations:', error);
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.clientName || body.totalAmount === undefined) {
      return NextResponse.json({ error: 'Client name and total amount are required' }, { status: 400 });
    }
    const saved = db.saveQuotation(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Failed to save quotation:', error);
    return NextResponse.json({ error: 'Failed to save quotation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Quotation ID required' }, { status: 400 });
    }
    const success = db.deleteQuotation(id);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to delete quotation:', error);
    return NextResponse.json({ error: 'Failed to delete quotation' }, { status: 500 });
  }
}
