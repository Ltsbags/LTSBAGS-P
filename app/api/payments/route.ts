import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const payments = db.getPayments();
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.clientName || body.amount === undefined) {
      return NextResponse.json({ error: 'Client name and amount are required' }, { status: 400 });
    }
    const saved = db.savePayment(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Failed to save payment:', error);
    return NextResponse.json({ error: 'Failed to save payment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
    }
    const success = db.deletePayment(id);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to delete payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
