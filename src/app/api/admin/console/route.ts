import { NextRequest, NextResponse } from 'next/server';
import { requireSystemDesigner } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Player from '@/models/Player';
import Settings from '@/models/Settings';
import Subscription from '@/models/Subscription';

export const dynamic = 'force-dynamic';

// This is a dangerous endpoint - only for System Designer
export async function POST(request: NextRequest) {
  try {
    await requireSystemDesigner();
    await connectDB();

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // Create a safe execution context with webPush helper
    const webPush = require('web-push');
    
    // Configure VAPID
    webPush.setVapidDetails(
      'mailto:govardanan.boys9@gmail.com',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
    
    // Helper function to send notification
    const sendPushNotification = async (subscriptionDoc: any, title: string, body: string, image?: string) => {
      const sub = {
        endpoint: subscriptionDoc.endpoint,
        keys: {
          p256dh: subscriptionDoc.p256dh,
          auth: subscriptionDoc.auth
        }
      };
      const payload = JSON.stringify({
        notification: {
          title,
          body,
          image: image || '/icons/icon-192x192.png',
        },
      });
      await webPush.sendNotification(sub, payload);
      return { success: true };
    };

    const context = {
      User,
      Player,
      Settings,
      Subscription,
      sendPushNotification,
      console: {
        log: (...args: any[]) => args,
        error: (...args: any[]) => args,
        warn: (...args: any[]) => args,
      },
    };

    // Execute the code in a controlled manner
    try {
      // Use async function to support await
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const func = new AsyncFunction(
        'User',
        'Player',
        'Settings',
        'Subscription',
        'sendPushNotification',
        'console',
        code
      );

      const result = await func(
        context.User,
        context.Player,
        context.Settings,
        context.Subscription,
        context.sendPushNotification,
        context.console
      );

      return NextResponse.json({
        success: true,
        result: result,
        type: typeof result,
      });
    } catch (execError: any) {
      return NextResponse.json({
        success: false,
        error: execError.message,
        stack: execError.stack,
      });
    }
  } catch (error) {
    console.error('Console error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute code' },
      { status: 403 }
    );
  }
}
