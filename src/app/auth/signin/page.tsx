'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid username or password');
      } else {
        router.push('/');
        router.refresh();
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
          <p className="text-sl-light text-sm sm:text-base lg:text-lg">Enter the System</p>
        </div>

        <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-5 sm:p-8 border-2 border-sl-purple/50">
          <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-4 sm:mb-6 text-center">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sl-light text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-sl-dark/50 text-white text-sm sm:text-base rounded-lg p-2.5 sm:p-3 border-2 border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sl-light text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sl-dark/50 text-white text-sm sm:text-base rounded-lg p-2.5 sm:p-3 border-2 border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
                required
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sl-light text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-sl-gold hover:text-yellow-300 font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
