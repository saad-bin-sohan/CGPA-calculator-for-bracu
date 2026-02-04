'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
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

  const getTemplateDepartmentName = (template: SemesterTemplate): string => {
    if (!template.department) return 'Department';

    // department can be a string ID or a populated Department object
    if (typeof template.department === 'string') {
      return (
        departments.find((d) => d._id === template.department)?.name || 'Department'
      );
    }

    return template.department.name || 'Department';
  };

  return (
    <AdminShell
      title="Semester Templates"
      subtitle="Predefine semester course sets per department to auto-populate student and guest plans."
    >
      <Card className="space-y-3">
        <label className="label">Department</label>
        <select
          className="select"
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
      </Card>
      {selectedDept && (
        <Card className="space-y-4">
          <form onSubmit={saveTemplate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Term name</label>
                <input
                  className="input mt-2"
                  value={form.termName}
                  onChange={(e) => setForm({ ...form, termName: e.target.value })}
                  placeholder="e.g., Spring 2025"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="label">Courses ({selectedDeptName})</p>
                  <div className="relative w-40">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                    <input
                      className="input pl-8 text-xs"
                      placeholder="Filter"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2 max-h-44 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 p-3">
                  {courses
                    .filter(
                      (c) =>
                        !query ||
                        c.code.toLowerCase().includes(query.toLowerCase()) ||
                        c.title.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((c) => (
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
            {message && (
              <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-xs font-semibold text-success-700">
                {message}
              </div>
            )}
            <Button type="submit">Save template</Button>
          </form>
        </Card>
      )}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Templates</h2>
          <Badge variant="primary">{templates.length} total</Badge>
        </div>
        <div className="divide-y divide-slate-100">
          {templates.map((t) => (
            <div key={t._id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{t.termName}</p>
                  <p className="text-xs text-slate-500">
                    {t.courses.length} course(s) • {getTemplateDepartmentName(t)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    await api.admin.templates.remove(t._id);
                    loadTemplates(selectedDept);
                  }}
                >
                  Delete
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                {t.courses.map((c) => (
                  <Badge key={c._id}>{c.code}</Badge>
                ))}
              </div>
            </div>
          ))}
          {templates.length === 0 && <p className="py-2 text-sm text-slate-600">No templates yet.</p>}
        </div>
      </Card>
    </AdminShell>
  );
}
