'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, UserCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { api } from '../../lib/api';
import { Department } from '../../types';

export default function SignupPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const strength = useMemo(() => {
    const value = form.password;
    if (!value) return { label: 'Add a password', score: 0 };
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return { label: labels[Math.max(0, score - 1)] || 'Weak', score };
  }, [form.password]);

  useEffect(() => {
    api.getDepartments().then((data) => setDepartments(data.departments || []));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department || undefined
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase text-primary-700">
          <UserPlus className="h-4 w-4" />
          Student onboarding
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">Create your BRACU CGPA profile</h1>
        <p className="text-sm text-slate-600">
          Save semesters, sync across devices, and unlock advanced planning insights.
        </p>
        <div className="card-subtle space-y-2 text-xs text-slate-600">
          <p>✔ Personalized dashboard and CGPA trend tracking</p>
          <p>✔ Department templates and course matching</p>
          <p>✔ Secure data storage and export options</p>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md space-y-4">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Create student account</h2>
          <p className="text-sm text-slate-600">Join now and keep your plan in sync.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2">
            <span className="label">Name</span>
            <div className="relative">
              <UserCircle className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </label>
          <label className="block space-y-2">
            <span className="label">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className="input pl-11"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400 transition-all"
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">Strength: {strength.label}</p>
            </div>
          </label>
          <label className="block space-y-2">
            <span className="label">Department (optional)</span>
            <select
              className="select"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </label>
          {error && <p className="text-sm text-danger-700">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary-600">
              Log in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
