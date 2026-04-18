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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [me, dept] = await Promise.all([api.me().catch(() => null), api.getDepartments()]);
      if (me) setUser(me);
      setDepartments(dept.departments || []);
    };
    load();
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
