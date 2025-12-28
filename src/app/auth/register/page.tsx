'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/auth/signin?registered=true');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sl-dark via-sl-blue to-sl-purple flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sl-gold glow mb-2">Solo Leveling</h1>
          <p className="text-sl-light text-sm sm:text-base lg:text-lg">Awaken as a Hunter</p>
        </div>

        <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-5 sm:p-8 border-2 border-sl-purple/50">
          <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-4 sm:mb-6 text-center">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sl-light text-sm font-semibold mb-2">
                Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-sl-dark/50 text-white rounded-lg p-3 border-2 border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-sl-light text-sm font-semibold mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-sl-dark/50 text-white rounded-lg p-3 border-2 border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sl-light text-sm font-semibold mb-2">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sl-dark/50 text-white rounded-lg p-3 border-2 border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sl-light text-sm font-semibold mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-sl-dark/50 text-white rounded-lg p-3 border-2 border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sl-purple hover:bg-purple-700 disabled:bg-sl-gray text-white font-bold py-3 px-6 rounded-lg glow-purple transition-all"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sl-light text-sm">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-sl-gold hover:text-yellow-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
