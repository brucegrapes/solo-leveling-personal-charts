import webPush from 'web-push';
import { Subscription } from '@/models';

// Configure VAPID keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!
};

webPush.setVapidDetails(
  'mailto:govardanan.boys9@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const saveSubscription = async (subscription: any, userId?: string): Promise<void> => {
  await Subscription.create({
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userId: userId
  });
};

export const sendNotification = async (title: string, body: string, image: string): Promise<void> => {
  const subscriptions = await Subscription.find({});
  subscriptions.forEach((subscription) => {
    const sub = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };
    const payload = JSON.stringify({
      notification: {
        title,
        body,
        image,
      },
    });
    webPush.sendNotification(sub, payload)
      .catch(error => console.error('Error sending notification:', error));
  });
};

export const sendNotificationToSubscription = async (
  subscriptionDoc: any,
  title: string,
  body: string,
  image?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
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
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
};
