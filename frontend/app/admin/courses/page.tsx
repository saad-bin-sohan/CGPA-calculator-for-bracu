'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Switch from '../../../components/ui/Switch';
import { Course, Department } from '../../../types';

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
    active: true
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
      active: true
    });
    load();
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
      const departmentsSet = new Set(prev.departments as string[]);
      if (departmentsSet.has(id)) departmentsSet.delete(id);
      else departmentsSet.add(id);
      return { ...prev, departments: Array.from(departmentsSet) };
    });
  };

  const toggleDepartmentForEditing = (id: string) => {
    if (!editing) return;
    const departmentsSet = new Set((editing.departments as string[]) || []);
    if (departmentsSet.has(id)) departmentsSet.delete(id);
    else departmentsSet.add(id);
    setEditing({ ...editing, departments: Array.from(departmentsSet) });
  };

  return (
    <AdminShell title="Courses" subtitle="Create and manage the course catalog.">
      <Card className="space-y-4">
        <form onSubmit={save} className="grid gap-3 md:grid-cols-6">
          <input
            className="input uppercase"
            placeholder="Code"
            value={form.code || ''}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
          />
          <input
            className="input md:col-span-2"
            placeholder="Title"
            value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            className="input"
            placeholder="Credits"
            value={form.credits || 3}
            onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
            required
          />
          <select
            className="select"
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
          <div className="flex flex-wrap gap-2 md:col-span-2">
            {departments.map((d) => (
              <Button
                key={d._id}
                type="button"
                size="sm"
                variant={form.departments?.includes(d._id) ? 'primary' : 'outline'}
                onClick={() => toggleDepartment(d._id)}
              >
                {d.code}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:col-span-4">
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
          <Button type="submit" className="md:col-span-6">
            Save course
          </Button>
        </form>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Course list</h2>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search courses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((c) => (
            <div key={c._id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div className="space-y-2">
                {editing?._id === c._id ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <input
                        className="input w-24 uppercase"
                        value={editing.code || ''}
                        onChange={(e) =>
                          setEditing({ ...editing, code: e.target.value.toUpperCase() })
                        }
                      />
                      <input
                        className="input"
                        value={editing.title || ''}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      />
                      <input
                        type="number"
                        className="input w-20"
                        value={editing.credits || 0}
                        onChange={(e) => setEditing({ ...editing, credits: Number(e.target.value) })}
                      />
                      <select
                        className="select w-28"
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
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((d) => (
                        <Button
                          key={d._id}
                          type="button"
                          size="sm"
                          variant={editing.departments?.includes(d._id) ? 'primary' : 'outline'}
                          onClick={() => toggleDepartmentForEditing(d._id)}
                        >
                          {d.code}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Switch
                        checked={!!editing.countsTowardsCGPA}
                        onChange={(next) => setEditing({ ...editing, countsTowardsCGPA: next })}
                        label="Counts CGPA"
                      />
                      <Switch
                        checked={!!editing.countsTowardsCredits}
                        onChange={(next) => setEditing({ ...editing, countsTowardsCredits: next })}
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
                    <p className="font-semibold text-slate-800">
                      {c.code} — {c.title}
                    </p>
                    <p className="text-slate-600">
                      {c.credits} credits • {c.category} • Depts: {c.departments.length} •{' '}
                      {c.active ? 'Active' : 'Inactive'}
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {editing?._id === c._id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!editing) return;
                        await api.admin.courses.update(c._id, editing);
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
                    <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        await api.admin.courses.remove(c._id);
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
          {filtered.length === 0 && <p className="py-3 text-sm text-slate-600">No courses yet.</p>}
        </div>
      </Card>
    </AdminShell>
  );
}
