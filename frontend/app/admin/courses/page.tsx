'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/ui/Button';
import Switch from '../../../components/ui/Switch';
import { Course, Department } from '../../../types';
import { cn } from '../../../lib/cn';

export default function AdminCourses() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Partial<Course>>({
    code: '',
    title: '',
    credits: 3,
    category: 'Core',
    departments: [],
    countsTowardsCGPA: true,
    countsTowardsCredits: true,
    active: true,
  });
  const [editing, setEditing] = useState<Partial<Course> | null>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    const [d, c] = await Promise.all([api.getDepartments(), api.getCourses('')]);
    setDepartments(d.departments || []);
    setCourses(c.courses || []);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.admin.courses.create(form);
    setForm({
      code: '',
      title: '',
      credits: 3,
      category: 'Core',
      departments: [],
      countsTowardsCGPA: true,
      countsTowardsCredits: true,
      active: true,
    });
    await load();
  };

  const filtered = useMemo(() => {
    if (!query) return courses;
    const q = query.toLowerCase();
    return courses.filter(
      (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
  }, [courses, query]);

  const toggleDepartment = (id: string) => {
    setForm((prev) => {
      const set = new Set(prev.departments as string[]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, departments: Array.from(set) };
    });
  };

  const toggleDepartmentForEditing = (id: string) => {
    if (!editing) return;
    const set = new Set((editing.departments as string[]) || []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setEditing({ ...editing, departments: Array.from(set) });
  };

  const DeptPill = ({
    deptId,
    code,
    selected,
    onToggle,
  }: {
    deptId: string;
    code: string;
    selected: boolean;
    onToggle: (id: string) => void;
  }) => (
    <button
      key={deptId}
      type="button"
      onClick={() => onToggle(deptId)}
      className={cn(
        'px-2 py-1 font-mono text-xs font-semibold transition-colors',
        selected
          ? 'bg-stone-900 text-white'
          : 'border border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-800'
      )}
    >
      {code}
    </button>
  );

  return (
    <AdminShell title="Courses" subtitle="Create and manage the course catalog.">
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Add course</h2>
        <form onSubmit={save} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-6">
            <input
              className="input font-mono uppercase sm:col-span-1"
              placeholder="Code"
              value={form.code || ''}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              required
            />
            <input
              className="input sm:col-span-3"
              placeholder="Title"
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="number"
              className="input font-mono sm:col-span-1"
              placeholder="Credits"
              value={form.credits || 3}
              onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
              required
            />
            <select
              className="select sm:col-span-1"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
            >
              <option>Core</option>
              <option>Elective</option>
              <option>Major</option>
              <option>Minor</option>
              <option>Lab</option>
              <option>GED</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="label">Departments:</span>
            {departments.map((d) => (
              <DeptPill
                key={d._id}
                deptId={d._id}
                code={d.code}
                selected={!!(form.departments as string[])?.includes(d._id)}
                onToggle={toggleDepartment}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Switch
              checked={!!form.countsTowardsCGPA}
              onChange={(next) => setForm({ ...form, countsTowardsCGPA: next })}
              label="Counts CGPA"
            />
            <Switch
              checked={!!form.countsTowardsCredits}
              onChange={(next) => setForm({ ...form, countsTowardsCredits: next })}
              label="Counts credits"
            />
            <Switch
              checked={form.active !== false}
              onChange={(next) => setForm({ ...form, active: next })}
              label="Active"
            />
          </div>

          <Button type="submit" size="sm">
            Save course
          </Button>
        </form>
      </div>

      <hr className="border-stone-200" />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-stone-700">
            All courses
            <span className="ml-2 font-normal text-stone-400">({filtered.length})</span>
          </h2>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              className="input pl-9 text-xs"
              placeholder="Search courses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-stone-100 border-y border-stone-200">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm"
            >
              <div className="min-w-0 space-y-2">
                {editing?._id === c._id ? (
                  <div className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-4">
                      <input
                        className="input font-mono uppercase"
                        value={editing.code || ''}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                      />
                      <input
                        className="input sm:col-span-2"
                        value={editing.title || ''}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      />
                      <input
                        type="number"
                        className="input font-mono"
                        value={editing.credits || 0}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            credits: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <select
                      className="select w-32"
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                    >
                      <option>Core</option>
                      <option>Elective</option>
                      <option>Major</option>
                      <option>Minor</option>
                      <option>Lab</option>
                      <option>GED</option>
                    </select>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((d) => (
                        <DeptPill
                          key={d._id}
                          deptId={d._id}
                          code={d.code}
                          selected={!!(editing.departments as string[])?.includes(d._id)}
                          onToggle={toggleDepartmentForEditing}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Switch
                        checked={!!editing.countsTowardsCGPA}
                        onChange={(next) =>
                          setEditing({ ...editing, countsTowardsCGPA: next })
                        }
                        label="Counts CGPA"
                      />
                      <Switch
                        checked={!!editing.countsTowardsCredits}
                        onChange={(next) =>
                          setEditing({ ...editing, countsTowardsCredits: next })
                        }
                        label="Counts credits"
                      />
                      <Switch
                        checked={editing.active !== false}
                        onChange={(next) => setEditing({ ...editing, active: next })}
                        label="Active"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-stone-800">
                      <span className="font-mono">{c.code}</span>
                      <span className="mx-2 text-stone-300">—</span>
                      {c.title}
                    </p>
                    <p className="text-xs text-stone-500">
                      {c.credits} cr · {c.category} · {c.departments.length} dept
                      {c.departments.length !== 1 ? 's' : ''} ·{' '}
                      {c.active ? (
                        <span className="text-success-700">Active</span>
                      ) : (
                        <span className="text-stone-400">Inactive</span>
                      )}
                    </p>
                  </>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                {editing?._id === c._id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!editing) return;
                        await api.admin.courses.update(c._id, editing);
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
                    <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        await api.admin.courses.remove(c._id);
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
              {query ? 'No courses match your search.' : 'No courses yet.'}
            </p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
