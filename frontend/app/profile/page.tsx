'use client';

import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Department, User } from '../../types';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // Previously api.getDepartments() had no .catch(), so if it rejected
      // for any reason it took the whole Promise.all down with it - even
      // though api.me() had already succeeded - and a genuinely logged-in
      // user would see "please sign in" with no explanation. allSettled
      // means one failing call can no longer hide the other's result.
      const [meResult, deptResult] = await Promise.allSettled([
        api.me(),
        api.getDepartments()
      ]);
      if (cancelled) return;

      if (meResult.status === 'fulfilled' && meResult.value) {
        setUser(meResult.value);
      } else if (meResult.status === 'rejected') {
        console.error('Failed to load current user', meResult.reason);
      }

      if (deptResult.status === 'fulfilled') {
        setDepartments(deptResult.value.departments || []);
      } else {
        console.error('Failed to load departments', deptResult.reason);
        setLoadError(
          "Couldn't load the department list from the server. You can still update your name below; refresh to try loading departments again."
        );
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const updated = await api.updateProfile({
        name: user.name,
        department: (user.department as any)?._id || undefined
      });
      setUser(updated.user);
      setMessage('Profile updated successfully.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-stone-500">
        Please{' '}
        <a href="/login" className="font-semibold text-primary-700 hover:underline">
          sign in
        </a>{' '}
        to view your profile.
      </p>
    );
  }

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h1 className="font-display text-3xl font-normal text-stone-900">Profile</h1>
        <p className="mt-1.5 text-sm text-stone-500">Manage your name and department settings.</p>
      </div>

      {loadError && <p className="alert-danger">{loadError}</p>}

      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary-700 font-mono text-sm font-bold text-white">
          {getInitials(user.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">{user.name}</p>
          <p className="text-xs text-stone-500">{user.email}</p>
        </div>
      </div>

      <hr className="border-stone-200" />

      <form onSubmit={save} className="space-y-6">
        <div>
          <label htmlFor="profile-name" className="label mb-2 block">
            Name
          </label>
          <input
            id="profile-name"
            className="input"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="profile-dept" className="label mb-2 block">
            Department
          </label>
          <select
            id="profile-dept"
            className="select"
            value={(user.department as any)?._id || ''}
            onChange={(e) =>
              setUser({
                ...user,
                department: departments.find((d) => d._id === e.target.value) as any
              })
            }
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {message && <p className="text-sm font-semibold text-success-700">{message}</p>}

        <Button type="submit" loading={loading}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
