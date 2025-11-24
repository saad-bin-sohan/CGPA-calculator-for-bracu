'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Department, User } from '../../types';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState<string | null>(null);

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
    const updated = await api.updateProfile({
      name: user.name,
      department: (user.department as any)?._id || undefined
    });
    setUser(updated.user);
    setMessage('Profile updated');
  };

  if (!user) return <p>Please login to edit profile.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600">Update your name and department.</p>
      </div>
      <form onSubmit={save} className="card space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Department</label>
          <select
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={(user.department as any)?._id || ''}
            onChange={(e) =>
              setUser({
                ...user,
                department: departments.find((d) => d._id === e.target.value) as any
              })
            }
          >
            <option value="">Select</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Save profile
        </button>
      </form>
    </div>
  );
}
