'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Check for updates periodically
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update prompt if desired
                  console.log('New content available, refresh to update.');
                }
              });
            }
          });
          
          // Check existing subscription
          registration.pushManager.getSubscription().then((sub) => {
            if (sub) {
              console.log('Already subscribed to push notifications.');
              setIsSubscribed(true);
              setSubscription(sub);
            } else {
              console.log('Not subscribed to push notifications.');
              setIsSubscribed(false);
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Check if VAPID key is configured
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey || vapidPublicKey === 'YOUR_VAPID_PUBLIC_KEY') {
        alert('Push notifications are not configured. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY in your environment variables.\n\nRun: npx web-push generate-vapid-keys');
        setIsLoading(false);
        return;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission denied');
        setIsLoading(false);
        return;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push notifications
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as BufferSource,
      });

      // Send subscription to backend
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'subscribe',
          subscription: newSubscription,
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setSubscription(newSubscription);
        console.log('Successfully subscribed to push notifications');
        alert('Successfully subscribed to push notifications! 🔔');
      } else {
        const data = await response.json();
        console.error('Failed to save subscription:', data);
        alert('Failed to save subscription to server');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to subscribe to push notifications: ${errorMessage}`);
    }
    setIsLoading(false);
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        setSubscription(null);
        console.log('Successfully unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
    setIsLoading(false);
  };

  const handleTestNotification = async () => {
    try {
      // Check if we have permission
      if (Notification.permission !== 'granted') {
        alert('Notification permission is required. Please enable notifications first.');
        return;
      }

      // Show a local notification using the service worker
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification('🎮 Solo Leveling Tracker', {
        body: 'Test notification from your personal training tracker!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'test-notification',
        requireInteraction: false,
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      });

      console.log('Test notification displayed');
    } catch (error) {
      console.error('Error showing test notification:', error);
      alert('Failed to show test notification. Check console for details.');
    }
  };

  // Don't render anything until mounted on client
  if (!isMounted) {
    return null;
  }

  // Don't render anything if service workers aren't supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {!isSubscribed ? (
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Loading...' : '🔔 Enable Notifications'}
        </button>
      ) : (
        <button
          onClick={handleUnsubscribe}
          disabled={isLoading}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Loading...' : '🔕 Disable Notifications'}
        </button>
      )}
    </div>
  );
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
