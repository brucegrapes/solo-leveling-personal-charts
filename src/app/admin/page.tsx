'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    systemDesigners: number;
    players: number;
    totalPlayers: number;
    recentUsers: number;
    activePlayers: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
  };
  playerStats: {
    avgLevel: number;
    maxLevel: number;
    totalExperience: number;
    totalTasks: number;
  };
  levelDistribution: Array<{ _id: number; count: number }>;
  userGrowth: Array<{ _id: string; count: number }>;
  activityData: Array<{ _id: string; totalTasks: number }>;
  topPlayers: Array<{
    userId: string;
    username: string;
    email: string;
    level: number;
    experience: number;
    totalTasks: number;
    currentStreak: number;
    title: string;
  }>;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'console' | 'database' | 'adminjs'>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [collections, setCollections] = useState<Array<{ name: string; count: number }>>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [collectionTotal, setCollectionTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [consoleCode, setConsoleCode] = useState('// Example: Get all users\nconst users = await User.find().limit(5);\nreturn users;');
  const [consoleOutput, setConsoleOutput] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    loadAnalytics();
    loadUsers();
    loadCollections();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        const error = await response.json();
        alert(`Failed to load analytics: ${error.error}`);
        if (response.status === 403) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      alert('Failed to load analytics');
    }
    setIsLoading(false);
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await fetch('/api/admin/database');
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const loadCollectionData = async (collectionName: string) => {
    setSelectedCollection(collectionName);
    try {
      const response = await fetch(`/api/admin/database?collection=${collectionName}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setCollectionData(data.documents);
        setCollectionTotal(data.total);
      }
    } catch (error) {
      console.error('Error loading collection data:', error);
    }
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
        loadUsers();
      } else {
        const data = await response.json();
        alert(`Failed to update role: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setConsoleOutput(null);
    try {
      const response = await fetch('/api/admin/console', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: consoleCode }),
      });

      const data = await response.json();
      setConsoleOutput(data);
    } catch (error) {
      console.error('Error executing code:', error);
      setConsoleOutput({ success: false, error: 'Failed to execute code' });
    }
    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              ⚡ System Designer Admin Panel
            </h1>
            <p className="text-gray-400">Complete control over the Solo Leveling system</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📊 Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            👥 User Management
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'database'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🗄️ Database Browser
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'console'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            💻 Code Console
          </button>
          <button
            onClick={() => setActiveTab('adminjs')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'adminjs'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🔧 AdminJS Info
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-xl">
                <div className="text-purple-200 text-sm mb-1">Total Users</div>
                <div className="text-4xl font-bold text-white">{analytics.overview.totalUsers}</div>
                <div className="text-purple-200 text-xs mt-2">
                  +{analytics.overview.recentUsers} this week
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg p-6 shadow-xl">
                <div className="text-pink-200 text-sm mb-1">Active Players</div>
                <div className="text-4xl font-bold text-white">{analytics.overview.activePlayers}</div>
                <div className="text-pink-200 text-xs mt-2">
                  of {analytics.overview.totalPlayers} total
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-xl">
                <div className="text-blue-200 text-sm mb-1">Avg Level</div>
                <div className="text-4xl font-bold text-white">
                  {analytics.playerStats.avgLevel.toFixed(1)}
                </div>
                <div className="text-blue-200 text-xs mt-2">
                  Max: {analytics.playerStats.maxLevel}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-xl">
                <div className="text-green-200 text-sm mb-1">Total Tasks</div>
                <div className="text-4xl font-bold text-white">
                  {analytics.playerStats.totalTasks}
                </div>
                <div className="text-green-200 text-xs mt-2">
                  {analytics.overview.activeSubscriptions} subscriptions
                </div>
              </div>
            </div>

            {/* Level Distribution */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">📈 Level Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {analytics.levelDistribution.map((item) => (
                  <div key={item._id} className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">Level {item._id}</div>
                    <div className="text-purple-400 text-lg">{item.count} players</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Players */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">🏆 Top Players</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-purple-400 font-semibold">Rank</th>
                      <th className="pb-3 text-purple-400 font-semibold">Username</th>
                      <th className="pb-3 text-purple-400 font-semibold">Title</th>
                      <th className="pb-3 text-purple-400 font-semibold">Level</th>
                      <th className="pb-3 text-purple-400 font-semibold">Experience</th>
                      <th className="pb-3 text-purple-400 font-semibold">Tasks</th>
                      <th className="pb-3 text-purple-400 font-semibold">Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topPlayers.map((player, index) => (
                      <tr key={player.userId} className="border-b border-gray-700/50">
                        <td className="py-3">
                          <span className="text-2xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>
                        <td className="py-3 text-white font-semibold">{player.username}</td>
                        <td className="py-3 text-gray-400">{player.title}</td>
                        <td className="py-3 text-purple-400 font-bold">{player.level}</td>
                        <td className="py-3 text-gray-300">{player.experience}</td>
                        <td className="py-3 text-gray-300">{player.totalTasks}</td>
                        <td className="py-3 text-orange-400">{player.currentStreak} 🔥</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">📅 User Growth (Last 30 Days)</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {analytics.userGrowth.map((item) => (
                  <div key={item._id} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all hover:from-purple-500 hover:to-pink-500"
                      style={{
                        height: `${Math.max((item.count / Math.max(...analytics.userGrowth.map(g => g.count))) * 200, 20)}px`,
                      }}
                      title={`${item._id}: ${item.count} new users`}
                    />
                    <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-top-left">
                      {item._id.slice(5)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Collections List */}
            <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">🗄️ Collections</h2>
              <div className="space-y-2">
                {collections.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => loadCollectionData(col.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedCollection === col.name
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-semibold">{col.name}</div>
                    <div className="text-sm opacity-70">{col.count} documents</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Data */}
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
              {selectedCollection ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-purple-400">
                      {selectedCollection}
                    </h2>
                    <span className="text-gray-400">
                      Showing {collectionData.length} of {collectionTotal} documents
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-[600px]">
                      {JSON.stringify(collectionData, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📂</div>
                  <p className="text-gray-400">Select a collection to view its data</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">👥 User Role Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-purple-400 font-semibold">Username</th>
                    <th className="pb-3 text-purple-400 font-semibold">Email</th>
                    <th className="pb-3 text-purple-400 font-semibold">Current Role</th>
                    <th className="pb-3 text-purple-400 font-semibold">Created</th>
                    <th className="pb-3 text-purple-400 font-semibold">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-700/50">
                      <td className="py-3 text-white font-semibold">{user.username}</td>
                      <td className="py-3 text-gray-400">{user.email || '-'}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.role === 'System Designer'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
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
          </div>
        )}

        {activeTab === 'console' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">💻 Code Console</h2>
            <p className="text-gray-400 mb-4">
              Execute code with access to: User, Player, Settings, Subscription models
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code to Execute (async function)
                </label>
                <textarea
                  value={consoleCode}
                  onChange={(e) => setConsoleCode(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  placeholder="// Write your code here..."
                />
              </div>
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isExecuting ? '⏳ Executing...' : '▶️ Execute Code'}
              </button>

              {consoleOutput && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Output:</label>
                  <div
                    className={`p-4 rounded-lg font-mono text-sm ${
                      consoleOutput.success
                        ? 'bg-green-900/20 border border-green-500/50 text-green-300'
                        : 'bg-red-900/20 border border-red-500/50 text-red-300'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap overflow-x-auto">
                      {consoleOutput.success
                        ? JSON.stringify(consoleOutput.result, null, 2)
                        : `Error: ${consoleOutput.error}\n${consoleOutput.stack || ''}`}
                    </pre>
                  </div>
                </div>
              )}

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Examples:</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>
                    <button
                      onClick={() =>
                        setConsoleCode('// Get all users\nconst users = await User.find().limit(10);\nreturn users;')
                      }
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Get all users
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        setConsoleCode(
                          '// Get player stats\nconst stats = await Player.aggregate([\n  { $group: { _id: null, avgLevel: { $avg: "$userStats.level" } } }\n]);\nreturn stats;'
                        )
                      }
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Calculate average player level
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        setConsoleCode(
                          '// Count users by role\nconst players = await User.countDocuments({ role: "Player" });\nconst designers = await User.countDocuments({ role: "System Designer" });\nreturn { players, designers };'
                        )
                      }
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Count users by role
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adminjs' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 shadow-xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">🔧 Direct Database Access</h2>
            <p className="text-gray-400 mb-6">
              AdminJS provides powerful database management capabilities. All models are accessible through the API.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-semibold text-purple-400 mb-3">📚 Available Models</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">▸</span> User - User accounts and roles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">▸</span> Player - Player stats and progress
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">▸</span> Settings - User configurations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">▸</span> Subscription - Push notifications
                  </li>
                </ul>
              </div>

              <div className="bg-pink-900/20 rounded-lg p-6 border border-pink-500/30">
                <h3 className="text-xl font-semibold text-pink-400 mb-3">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-left"
                  >
                    → Manage User Roles
                  </button>
                  <button
                    onClick={() => setActiveTab('console')}
                    className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-left"
                  >
                    → Execute Database Queries
                  </button>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-left"
                  >
                    → View Analytics
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">📝 Database Operations</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Use the Code Console to perform direct database operations with full Mongoose support:
              </p>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <div className="mb-2 text-green-400">// Example: Find all users</div>
                <div>const users = await User.find();</div>
                <div className="mb-4">return users;</div>
                
                <div className="mb-2 text-green-400">// Example: Update user role</div>
                <div>await User.findByIdAndUpdate(userId, {'{'} role: 'System Designer' {'}'});</div>
                <div className="mb-4">return {'{'} success: true {'}'};</div>
                
                <div className="mb-2 text-green-400">// Example: Get player statistics</div>
                <div>const stats = await Player.aggregate([</div>
                <div>  {'{'} $group: {'{'} _id: null, avgLevel: {'{'} $avg: '$userStats.level' {'}'} {'}'} {'}'},</div>
                <div>]);</div>
                <div>return stats;</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
