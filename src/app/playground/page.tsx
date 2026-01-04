'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function PlaygroundPage() {
  const router = useRouter();
  const [notificationTitle, setNotificationTitle] = useState('🎮 Solo Leveling Tracker');
  const [notificationBody, setNotificationBody] = useState('Test notification from your personal training tracker!');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setIsLoadingUsers(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        alert('Role updated successfully!');
        loadUsers(); // Reload users
      } else {
        const data = await response.json();
        alert(`Failed to update role: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

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
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">👥 User Role Management</h2>
          
          {isLoadingUsers ? (
            <div className="text-center text-gray-400 py-8">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-purple-400 font-semibold">Username</th>
                    <th className="pb-3 text-purple-400 font-semibold">Email</th>
                    <th className="pb-3 text-purple-400 font-semibold">Current Role</th>
                    <th className="pb-3 text-purple-400 font-semibold">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-700/50">
                      <td className="py-3 text-white">{user.username}</td>
                      <td className="py-3 text-gray-400">{user.email || '-'}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          user.role === 'System Designer' 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-purple-500"
                        >
                          <option value="Player">Player</option>
                          <option value="System Designer">System Designer</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Placeholder for Future Features */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">🚀 Coming Soon</h2>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">○</span>
              <span>Database Monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">○</span>
              <span>Feature Flags</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">○</span>
              <span>Analytics Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">○</span>
              <span>System Logs Viewer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
