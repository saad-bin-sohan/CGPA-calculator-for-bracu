'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { api } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const google = (window as any).google;
      if (!google || !googleBtnRef.current) return;
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (resp: any) => {
          try {
            setLoading(true);
            await api.googleLogin({ idToken: resp.credential });
            router.push('/dashboard');
          } catch (err: any) {
            setGoogleError(err.message || 'Google login failed');
          } finally {
            setLoading(false);
          }
        }
      });
      google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%'
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [googleClientId, router]);

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-start justify-center py-16 sm:items-center sm:py-0">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-normal text-stone-900">Sign in</h1>
        <p className="mt-1.5 text-sm text-stone-500">
          Use your BRACU email to access your student dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-email" className="label mb-2 block">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bracu.ac.bd"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="label mb-2 block">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-500">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 rounded-none accent-primary-700"
              />
              Remember me
            </label>
            <Link
              href="/signup"
              className="text-xs font-semibold text-stone-600 transition-colors hover:text-primary-700"
            >
              Create account
            </Link>
          </div>

          {error && <p className="text-sm text-danger-700">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>

          {googleClientId && (
            <div className="pt-2">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-stone-200" />
                <span className="text-xs text-stone-400">or continue with</span>
                <span className="h-px flex-1 bg-stone-200" />
              </div>
              <div ref={googleBtnRef} />
              {googleError && <p className="mt-2 text-sm text-danger-700">{googleError}</p>}
            </div>
          )}
        </form>

        <p className="mt-8 border-t border-stone-200 pt-6 text-xs text-stone-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-stone-700 transition-colors hover:text-primary-700"
          >
            Sign up — it&apos;s free.
          </Link>
        </p>
      </div>
    </div>
  );
}
