'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlaygroundPage() {
  const router = useRouter();
  const [notificationTitle, setNotificationTitle] = useState('🎮 Solo Leveling Tracker');
  const [notificationBody, setNotificationBody] = useState('Test notification from your personal training tracker!');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      // Check if we have permission
      if (Notification.permission !== 'granted') {
        alert('Notification permission is required. Please enable notifications first.');
        setIsLoading(false);
        return;
      }

      // Show a local notification using the service worker
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(notificationTitle, {
        body: notificationBody,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'test-notification',
        requireInteraction: false,
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      } as NotificationOptions);

      console.log('Test notification displayed');
      alert('Notification sent! Check your system notifications.');
    } catch (error) {
      console.error('Error showing test notification:', error);
      alert('Failed to show test notification. Check console for details.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              🛠️ System Designer Playground
            </h1>
            <p className="text-gray-400">Testing ground for new features and functionality</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Notification Testing Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📨 Push Notifications</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notification Title
              </label>
              <input
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter notification title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notification Body
              </label>
              <textarea
                value={notificationBody}
                onChange={(e) => setNotificationBody(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter notification message"
              />
            </div>

            <button
              onClick={handleTestNotification}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? '⏳ Sending...' : '📤 Send Test Notification'}
            </button>
          </div>
        </div>

        {/* Placeholder for Future Features */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">🚀 Feature Testing Area</h2>
          <div className="space-y-3 text-gray-400">
            <p className="mb-4">This is a testing ground for new features before they go live.</p>
            <div className="flex items-center gap-3">
              <span className="text-purple-600">✓</span>
              <span>Push Notifications - Ready for testing</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">○</span>
              <span>Experimental Features - Coming Soon</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">○</span>
              <span>Beta Testing Tools - In Development</span>
            </div>
            <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
              <p className="text-purple-400 font-semibold mb-2">💡 System Designer?</p>
              <p className="text-sm">
                If you're a System Designer, check out the{' '}
                <button
                  onClick={() => router.push('/admin')}
                  className="text-purple-400 hover:text-purple-300 underline font-semibold"
                >
                  Admin Panel
                </button>
                {' '}for full system control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
