'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
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
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-danger/20 bg-danger/10 px-4 py-1 text-xs font-semibold uppercase text-danger-700">
            <ShieldCheck className="h-4 w-4" />
            Admin console
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Administrator Login</h1>
          <p className="text-sm text-slate-600">
            Manage departments, course catalog, grading scales, templates, and student profiles.
          </p>
          <div className="card-subtle text-xs text-slate-600">
            This area is restricted. Please use authorized admin credentials.
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2">
            <span className="label">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className="input pl-11"
                required
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
                className="input pl-11"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>
          {error && <p className="text-sm text-danger-700">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Login as admin
          </Button>
        </form>
      </Card>
    </div>
  );
}
