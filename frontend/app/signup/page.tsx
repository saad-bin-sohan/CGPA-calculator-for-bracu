'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Department } from '../../types';
import { cn } from '../../lib/cn';

export default function SignupPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => {
    const value = form.password;
    if (!value) return { label: '', score: 0 };
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return { label: labels[Math.max(0, score - 1)] || 'Weak', score };
  }, [form.password]);

  const strengthColor = (score: number) => {
    if (score <= 1) return 'bg-danger';
    if (score === 2) return 'bg-warning';
    return 'bg-success';
  };

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
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-start justify-center py-16 sm:items-center sm:py-0">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-normal text-stone-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-stone-500">
          Save your semester plans, sync across devices, and track your CGPA over time.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="signup-name" className="label mb-2 block">
              Full name
            </label>
            <input
              id="signup-name"
              className="input"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="label mb-2 block">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="input"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@bracu.ac.bd"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="label mb-2 block">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="input"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {form.password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-0.5 flex-1 transition-colors duration-200',
                        i <= strength.score ? strengthColor(strength.score) : 'bg-stone-200'
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-500">
                  Strength:{' '}
                  <span
                    className={cn(
                      'font-semibold',
                      strength.score <= 1
                        ? 'text-danger-700'
                        : strength.score === 2
                          ? 'text-warning-700'
                          : 'text-success-700'
                    )}
                  >
                    {strength.label}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="signup-dept" className="label mb-2 block">
              Department <span className="font-normal normal-case text-stone-400">(optional)</span>
            </label>
            <select
              id="signup-dept"
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
          </div>

          {error && <p className="text-sm text-danger-700">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-8 border-t border-stone-200 pt-6 text-xs text-stone-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-stone-700 transition-colors hover:text-primary-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
