import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const notifs = db.getNotifications(50);
    return NextResponse.json(notifs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    if (body.action === 'markAllRead') {
      db.markAllNotificationsAsRead();
      return NextResponse.json({ success: true });
    } else if (body.action === 'markRead' && body.id) {
      db.markNotificationAsRead(body.id);
      return NextResponse.json({ success: true });
    } else if (body.type && body.title && body.message) {
      const created = db.createNotification({
        type: body.type,
        title: body.title,
        message: body.message,
        link: body.link,
        isRead: false,
        priority: body.priority || 'INFO',
      });
      return NextResponse.json(created);
    }

    return NextResponse.json({ error: 'Invalid notification action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
