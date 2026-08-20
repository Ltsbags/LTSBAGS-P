import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';
    const clients = db.getClients(activeOnly);
    return NextResponse.json(clients);
  } catch (err: unknown) {
    console.error('Error fetching clients:', err);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reorder') {
      if (!Array.isArray(body.orders)) {
        return NextResponse.json({ error: 'Orders array is required' }, { status: 400 });
      }
      const success = db.reorderClients(body.orders);
      return NextResponse.json({ success, message: 'Client order updated successfully' });
    }

    if (!body.name || !body.logoUrl) {
      return NextResponse.json(
        { error: 'Client Name and Logo Image are required.' },
        { status: 400 }
      );
    }

    const saved = db.saveClient({
      id: body.id,
      name: body.name.trim(),
      logoUrl: body.logoUrl,
      websiteUrl: body.websiteUrl ? body.websiteUrl.trim() : '',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
    });

    return NextResponse.json({ success: true, client: saved });
  } catch (err: unknown) {
    console.error('Error saving client:', err);
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // query param preferred
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const success = db.deleteClient(id);
    if (!success) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Client deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting client:', err);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
