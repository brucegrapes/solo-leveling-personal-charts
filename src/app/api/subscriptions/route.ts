

import { saveSubscription, sendNotification } from '@/services/webnotifcation';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, subscription, title, body: notificationBody, image, payload, delay, ttl } = body;

    if (action === 'subscribe') {
      const user = await getCurrentUser();
      await saveSubscription(subscription, user?.id);
      return NextResponse.json({ message: 'Subscription added successfully.' }, { status: 201 });
    }

    if (action === 'sendNotification') {
      await sendNotification(title || 'Test Notification', notificationBody || 'This is a test notification', image);
      return NextResponse.json({ message: 'Notification sent successfully.' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ message: 'Operation failed.', error: String(error) }, { status: 500 });
  }
}
