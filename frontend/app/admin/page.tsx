'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import SummaryCard from '../../components/SummaryCard';
import Link from 'next/link';
import { Department, Course, User } from '../../types';

export default function AdminDashboard() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await api.getDepartments();
        setDepartments(d.departments || []);
        const c = await api.getCourses('');
        setCourses(c.courses || []);
        const s = await api.admin.students();
        setStudents(s.students || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load');
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Manage departments, courses, grading scale, and students.</p>
        </div>
        <div className="flex gap-2 text-sm font-semibold text-primary">
          <Link href="/admin/departments">Departments</Link>
          <Link href="/admin/courses">Courses</Link>
          <Link href="/admin/grade-scale">Grade scale</Link>
          <Link href="/admin/students">Students</Link>
          <Link href="/admin/settings">Settings</Link>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Departments" value={departments.length.toString()} />
        <SummaryCard title="Courses" value={courses.length.toString()} />
        <SummaryCard title="Students" value={students.length.toString()} />
        <SummaryCard title="Latest student" value={students[0]?.name || 'N/A'} sub={students[0]?.email} />
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800">Recent students</h2>
        <div className="mt-3 divide-y divide-slate-100">
          {students.slice(0, 5).map((s) => (
            <div key={s.id} className="py-2 text-sm">
              <p className="font-semibold text-slate-800">{s.name}</p>
              <p className="text-slate-600">{s.email}</p>
            </div>
          ))}
          {students.length === 0 && <p className="py-2 text-sm text-slate-600">No students loaded.</p>}
        </div>
      </div>
    </div>
  );
}
