'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
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
      setError(err.message || 'Login failed');
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
      google.accounts.id.renderButton(googleBtnRef.current, { theme: 'outline', size: 'large' });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [googleClientId, router]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase text-primary-700">
          <GraduationCap className="h-4 w-4" />
          Student access
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-600">
          Sign in to sync your semesters, export polished reports, and keep your CGPA progress safe.
        </p>
        <div className="card-subtle space-y-2 text-xs text-slate-600">
          <p>✔ Secure login with encrypted sessions</p>
          <p>✔ Cross-device semester sync</p>
          <p>✔ Instant CGPA recalculation</p>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md space-y-4">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Student Login</h2>
          <p className="text-sm text-slate-600">Use your BRACU email to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="label">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                className="input pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          <label className="block space-y-2">
            <span className="label">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                className="input pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link href="/signup" className="font-semibold text-primary-600">
              Create account
            </Link>
          </div>
          {error && <p className="text-sm text-danger-700">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
          {googleClientId && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-px flex-1 bg-slate-200" />
                <span>or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div ref={googleBtnRef} className="flex justify-center" />
              {googleError && <p className="text-sm text-danger-700">{googleError}</p>}
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
