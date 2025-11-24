'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Course, Department } from '../../../types';

export default function AdminCourses() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Partial<Course>>({
    code: '',
    title: '',
    credits: 3,
    category: 'Core',
    departments: []
  });

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
    setForm({ code: '', title: '', credits: 3, category: 'Core', departments: [] });
    load();
  };

  const toggleDepartment = (id: string) => {
    setForm((prev) => {
      const departmentsSet = new Set(prev.departments as string[]);
      if (departmentsSet.has(id)) departmentsSet.delete(id);
      else departmentsSet.add(id);
      return { ...prev, departments: Array.from(departmentsSet) };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
        <p className="text-slate-600">Create and manage course catalog.</p>
      </div>
      <form onSubmit={save} className="card grid gap-3 md:grid-cols-6">
        <input
          className="rounded border border-slate-200 px-3 py-2 uppercase"
          placeholder="Code"
          value={form.code || ''}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          required
        />
        <input
          className="rounded border border-slate-200 px-3 py-2 md:col-span-2"
          placeholder="Title"
          value={form.title || ''}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          className="rounded border border-slate-200 px-3 py-2"
          placeholder="Credits"
          value={form.credits || 3}
          onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
          required
        />
        <select
          className="rounded border border-slate-200 px-3 py-2"
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
            <button
              key={d._id}
              type="button"
              onClick={() => toggleDepartment(d._id)}
              className={`rounded border px-2 py-1 text-xs font-semibold ${
                form.departments?.includes(d._id)
                  ? 'border-primary text-primary'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              {d.code}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white md:col-span-6"
        >
          Save course
        </button>
      </form>
      <div className="card divide-y divide-slate-100">
        {courses.map((c) => (
          <div key={c._id} className="flex items-center justify-between py-2 text-sm">
            <div>
              <p className="font-semibold text-slate-800">
                {c.code} — {c.title}
              </p>
              <p className="text-slate-600">
                {c.credits} credits • {c.category} • Depts: {c.departments.length}
              </p>
            </div>
            <button
              className="text-xs font-semibold text-red-600"
              onClick={async () => {
                await api.admin.courses.remove(c._id);
                load();
              }}
            >
              Delete
            </button>
          </div>
        ))}
        {courses.length === 0 && <p className="py-2 text-sm text-slate-600">No courses yet.</p>}
      </div>
    </div>
  );
}
