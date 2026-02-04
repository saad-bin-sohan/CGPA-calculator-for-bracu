'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Department } from '../../../types';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({ name: '', code: '', totalCreditsRequired: 120 });
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Department | null>(null);
  const [query, setQuery] = useState('');

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

  const filtered = useMemo(() => {
    if (!query) return departments;
    const q = query.toLowerCase();
    return departments.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
  }, [departments, query]);

  return (
    <AdminShell title="Departments" subtitle="Add or edit departments and credit requirements.">
      <Card className="space-y-4">
        <form onSubmit={save} className="grid gap-4 md:grid-cols-4">
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input uppercase"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
          />
          <input
            type="number"
            className="input"
            placeholder="Total credits"
            value={form.totalCreditsRequired}
            onChange={(e) => setForm({ ...form, totalCreditsRequired: Number(e.target.value) })}
            required
          />
          <Button type="submit">Save department</Button>
        </form>
        {message && (
          <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-xs font-semibold text-success-700">
            {message}
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Department list</h2>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search departments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((d) => (
            <div key={d._id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div className="space-y-1">
                {editing?._id === d._id ? (
                  <>
                    <input
                      className="input"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <input
                        className="input w-24 uppercase"
                        value={editing.code}
                        onChange={(e) =>
                          setEditing({ ...editing, code: e.target.value.toUpperCase() })
                        }
                      />
                      <input
                        type="number"
                        className="input w-28"
                        value={editing.totalCreditsRequired}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            totalCreditsRequired: Number(e.target.value)
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-slate-800">
                      {d.name} ({d.code})
                    </p>
                    <p className="text-slate-600">Credits to graduate: {d.totalCreditsRequired}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {editing?._id === d._id ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={async () => {
                        if (!editing) return;
                        await api.admin.departments.update(d._id, editing);
                        setEditing(null);
                        load();
                      }}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setEditing(d)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        await api.admin.departments.remove(d._id);
                        load();
                      }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-3 text-sm text-slate-600">No departments yet.</p>
          )}
        </div>
      </Card>
    </AdminShell>
  );
}
