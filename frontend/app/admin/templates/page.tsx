'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import { Course, Department, SemesterTemplate } from '../../../types';

export default function AdminTemplates() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [templates, setTemplates] = useState<SemesterTemplate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<{ termName: string; courses: string[] }>({
    termName: '',
    courses: []
  });
  const [message, setMessage] = useState<string | null>(null);

  const loadTemplates = async (dept?: string) => {
    const data = await api.getTemplates(dept);
    setTemplates(data.templates || []);
  };

  useEffect(() => {
    api.getDepartments().then((d) => setDepartments(d.departments || []));
  }, []);

  useEffect(() => {
    if (selectedDept) {
      loadTemplates(selectedDept);
      api.listCourses(selectedDept).then((c) => setCourses(c.courses || []));
    } else {
      setTemplates([]);
      setCourses([]);
    }
    setForm({ termName: '', courses: [] });
  }, [selectedDept]);

  const toggleCourse = (id: string) => {
    setForm((prev) => {
      const set = new Set(prev.courses);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, courses: Array.from(set) };
    });
  };

  const saveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;
    await api.admin.templates.create({
      department: selectedDept,
      termName: form.termName,
      courses: form.courses
    });
    setForm({ termName: '', courses: [] });
    setMessage('Template saved');
    loadTemplates(selectedDept);
  };

  const selectedDeptName = useMemo(
    () => departments.find((d) => d._id === selectedDept)?.name || 'Department',
    [departments, selectedDept]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Semester Templates</h1>
        <p className="text-slate-600">
          Predefine semester course sets per department to auto-populate student/guest plans.
        </p>
      </div>
      <div className="card space-y-3">
        <label className="block text-sm font-medium text-slate-700">Department</label>
        <select
          className="w-full rounded border border-slate-200 px-3 py-2"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.code})
            </option>
          ))}
        </select>
      </div>
      {selectedDept && (
        <form onSubmit={saveTemplate} className="card space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Term name</label>
              <input
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
                value={form.termName}
                onChange={(e) => setForm({ ...form, termName: e.target.value })}
                placeholder="e.g., Spring 2025"
                required
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Courses ({selectedDeptName})</p>
              <div className="mt-2 max-h-40 overflow-y-auto rounded border border-slate-200 p-2">
                {courses.map((c) => (
                  <label key={c._id} className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.courses.includes(c._id)}
                      onChange={() => toggleCourse(c._id)}
                    />
                    {c.code} — {c.title}
                  </label>
                ))}
                {courses.length === 0 && (
                  <p className="text-xs text-slate-500">Add courses for this department first.</p>
                )}
              </div>
            </div>
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button
            type="submit"
            className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Save template
          </button>
        </form>
      )}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Templates</h2>
        <div className="divide-y divide-slate-100">
          {templates.map((t) => (
            <div key={t._id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{t.termName}</p>
                  <p className="text-xs text-slate-500">
                    {t.courses.length} course(s) • {t.department?.name}
                  </p>
                </div>
                <button
                  className="text-xs font-semibold text-red-600"
                  onClick={async () => {
                    await api.admin.templates.remove(t._id);
                    loadTemplates(selectedDept);
                  }}
                >
                  Delete
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                {t.courses.map((c) => (
                  <span key={c._id} className="rounded bg-slate-100 px-2 py-1">
                    {c.code}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {templates.length === 0 && <p className="py-2 text-sm text-slate-600">No templates yet.</p>}
        </div>
      </div>
    </div>
  );
}
