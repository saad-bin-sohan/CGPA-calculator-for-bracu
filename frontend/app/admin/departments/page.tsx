'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Department } from '../../../types';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({ name: '', code: '', totalCreditsRequired: 120 });
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const d = await api.getDepartments();
    setDepartments(d.departments || []);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.admin.departments.create(form);
    setForm({ name: '', code: '', totalCreditsRequired: 120 });
    setMessage('Department saved');
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
        <p className="text-slate-600">Add or edit departments and credit requirements.</p>
      </div>
      <form onSubmit={save} className="card grid gap-4 md:grid-cols-4">
        <input
          className="rounded border border-slate-200 px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="rounded border border-slate-200 px-3 py-2 uppercase"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          required
        />
        <input
          type="number"
          className="rounded border border-slate-200 px-3 py-2"
          placeholder="Total credits"
          value={form.totalCreditsRequired}
          onChange={(e) =>
            setForm({ ...form, totalCreditsRequired: Number(e.target.value) })
          }
          required
        />
        <button className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white" type="submit">
          Save department
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
      <div className="card divide-y divide-slate-100">
        {departments.map((d) => (
          <div key={d._id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="font-semibold text-slate-800">
                {d.name} ({d.code})
              </p>
              <p className="text-slate-600">Credits to graduate: {d.totalCreditsRequired}</p>
            </div>
            <button
              className="text-xs font-semibold text-red-600"
              onClick={async () => {
                await api.admin.departments.remove(d._id);
                load();
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
