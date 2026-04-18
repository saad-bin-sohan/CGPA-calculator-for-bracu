'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/ui/Button';
import { Department } from '../../../types';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({
    name: '',
    code: '',
    totalCreditsRequired: 120,
  });
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
    setMessage('Department saved.');
    await load();
  };

  const filtered = useMemo(() => {
    if (!query) return departments;
    const q = query.toLowerCase();
    return departments.filter(
      (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
    );
  }, [departments, query]);

  return (
    <AdminShell
      title="Departments"
      subtitle="Add or edit departments and their graduation credit requirements."
    >
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Add department</h2>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-4">
          <input
            className="input"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input font-mono uppercase"
            placeholder="Code (e.g. CSE)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
          />
          <input
            type="number"
            className="input font-mono"
            placeholder="Total credits"
            value={form.totalCreditsRequired}
            onChange={(e) =>
              setForm({
                ...form,
                totalCreditsRequired: Number(e.target.value),
              })
            }
            required
          />
          <Button type="submit" size="sm">
            Save department
          </Button>
        </form>
        {message && <p className="text-sm font-semibold text-success-700">{message}</p>}
      </div>

      <hr className="border-stone-200" />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-stone-700">
            All departments
            <span className="ml-2 font-normal text-stone-400">({filtered.length})</span>
          </h2>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              className="input pl-9 text-xs"
              placeholder="Search departments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-stone-100 border-y border-stone-200">
          {filtered.map((d) => (
            <div
              key={d._id}
              className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm"
            >
              <div className="min-w-0 space-y-1.5">
                {editing?._id === d._id ? (
                  <div className="space-y-2">
                    <input
                      className="input"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <input
                        className="input w-24 font-mono uppercase"
                        value={editing.code}
                        onChange={(e) =>
                          setEditing({ ...editing, code: e.target.value.toUpperCase() })
                        }
                      />
                      <input
                        type="number"
                        className="input w-28 font-mono"
                        value={editing.totalCreditsRequired}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            totalCreditsRequired: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-stone-800">
                      {d.name}{' '}
                      <span className="font-mono font-normal text-stone-400">{d.code}</span>
                    </p>
                    <p className="text-xs text-stone-500">
                      {d.totalCreditsRequired} credits to graduate
                    </p>
                  </>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                {editing?._id === d._id ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={async () => {
                        if (!editing) return;
                        await api.admin.departments.update(d._id, editing);
                        setEditing(null);
                        await load();
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
                        await load();
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
            <p className="py-4 text-sm text-stone-400">
              {query ? 'No departments match your search.' : 'No departments yet.'}
            </p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
