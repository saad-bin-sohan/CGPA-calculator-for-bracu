'use client';

import { useEffect, useState } from 'react';
import { Camera, UserCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
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
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">Update your personal details and department.</p>
      </div>

      <Card className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50/60 p-4 text-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary-700">
              <UserCircle className="h-12 w-12" />
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -right-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              aria-label="Upload avatar"
            >
              <Camera className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              className="input mt-2"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Department</label>
            <select
              className="select mt-2"
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
          {message && (
            <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-xs font-semibold text-success-700">
              {message}
            </div>
          )}
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
    </div>
  );
}
