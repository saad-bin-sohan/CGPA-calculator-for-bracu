'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Button from '../../../components/ui/Button';
import { Course, Department, SemesterTemplate } from '../../../types';

export default function AdminTemplates() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [templates, setTemplates] = useState<SemesterTemplate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<{ termName: string; courses: string[] }>({
    termName: '',
    courses: [],
  });
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState('');

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
    setQuery('');
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
      courses: form.courses,
    });
    setForm({ termName: '', courses: [] });
    setMessage('Template saved.');
    await loadTemplates(selectedDept);
  };

  const selectedDeptName = useMemo(
    () => departments.find((d) => d._id === selectedDept)?.name || 'Department',
    [departments, selectedDept]
  );

  const getTemplateDeptName = (template: SemesterTemplate): string => {
    if (!template.department) return '—';
    if (typeof template.department === 'string') {
      return departments.find((d) => d._id === template.department)?.name || '—';
    }
    return template.department.name || '—';
  };

  const filteredCourses = useMemo(() => {
    if (!query) return courses;
    const q = query.toLowerCase();
    return courses.filter(
      (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
  }, [courses, query]);

  return (
    <AdminShell
      title="Semester templates"
      subtitle="Predefine semester course sets per department to auto-populate student and guest plans."
    >
      <div className="space-y-2">
        <label className="label">Select department to manage templates</label>
        <select
          className="select max-w-xs"
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
        <>
          <hr className="border-stone-200" />
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-stone-700">
              Add template for {selectedDeptName}
            </h2>
            <form onSubmit={saveTemplate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label mb-2 block">Term name</label>
                  <input
                    className="input"
                    value={form.termName}
                    onChange={(e) => setForm({ ...form, termName: e.target.value })}
                    placeholder="e.g. Spring 2025"
                    required
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="label">
                      Courses ({form.courses.length} selected)
                    </label>
                    <div className="relative w-36">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-stone-400" />
                      <input
                        className="input pl-7 text-xs"
                        placeholder="Filter"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-44 overflow-y-auto rounded-md border border-stone-200 p-2">
                    <div className="space-y-1.5">
                      {filteredCourses.map((c) => (
                        <label
                          key={c._id}
                          className="flex cursor-pointer items-center gap-2 text-xs text-stone-700 hover:text-stone-900"
                        >
                          <input
                            type="checkbox"
                            className="accent-primary-700"
                            checked={form.courses.includes(c._id)}
                            onChange={() => toggleCourse(c._id)}
                          />
                          <span className="font-mono font-semibold">{c.code}</span>
                          <span className="truncate text-stone-500">{c.title}</span>
                        </label>
                      ))}
                      {filteredCourses.length === 0 && (
                        <p className="py-2 text-xs text-stone-400">
                          {courses.length === 0
                            ? 'Add courses for this department first.'
                            : 'No courses match filter.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {message && <p className="text-sm font-semibold text-success-700">{message}</p>}
              <Button type="submit" size="sm">
                Save template
              </Button>
            </form>
          </div>
        </>
      )}

      <hr className="border-stone-200" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">
            Templates
            <span className="ml-2 font-normal text-stone-400">({templates.length})</span>
          </h2>
        </div>
        <div className="divide-y divide-stone-100 border-y border-stone-200">
          {templates.map((t) => (
            <div key={t._id} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-800">{t.termName}</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {t.courses.length} course{t.courses.length !== 1 ? 's' : ''}
                    {' · '}
                    {getTemplateDeptName(t)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    await api.admin.templates.remove(t._id);
                    await loadTemplates(selectedDept);
                  }}
                >
                  Delete
                </Button>
              </div>
              {t.courses.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.courses.map((c) => (
                    <span key={c._id} className="font-mono text-xs text-stone-400">
                      {c.code}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {templates.length === 0 && (
            <p className="py-4 text-sm text-stone-400">
              {selectedDept
                ? 'No templates for this department yet.'
                : 'Select a department to view its templates.'}
            </p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
