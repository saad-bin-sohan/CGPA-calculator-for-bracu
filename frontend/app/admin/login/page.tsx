'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.adminLogin({ email, password });
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-start justify-center py-16 sm:items-center sm:py-0">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Restricted access · Admin only
        </div>

        <h1 className="font-display text-3xl font-normal text-stone-900">Administrator sign in</h1>
        <p className="mt-1.5 text-sm text-stone-500">
          Use your authorized admin credentials to access the management console.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="label mb-2 block">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="input"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="label mb-2 block">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="input"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-danger-700">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Sign in as administrator
          </Button>
        </form>

        <p className="mt-8 border-t border-stone-200 pt-6 text-xs text-stone-500">
          Not an admin?{' '}
          <Link
            href="/login"
            className="font-semibold text-stone-700 transition-colors hover:text-primary-700"
          >
            Student sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
