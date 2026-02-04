'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Users, Building2, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import SummaryCard from '../../components/SummaryCard';
import AdminShell from '../../components/AdminShell';
import Card from '../../components/ui/Card';
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
    <AdminShell
      title="Admin Dashboard"
      subtitle="Manage departments, courses, grading scale, templates, and students."
      actions={
        <>
          <Link href="/admin/departments" className="btn-outline px-3 py-2 text-xs">
            Departments
          </Link>
          <Link href="/admin/courses" className="btn-outline px-3 py-2 text-xs">
            Courses
          </Link>
        </>
      }
    >
      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-2 text-sm text-danger-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Departments"
          value={departments.length.toString()}
          icon={<Building2 className="h-5 w-5" />}
          tone="primary"
        />
        <SummaryCard
          title="Courses"
          value={courses.length.toString()}
          icon={<GraduationCap className="h-5 w-5" />}
          tone="accent"
        />
        <SummaryCard
          title="Students"
          value={students.length.toString()}
          icon={<Users className="h-5 w-5" />}
        />
        <SummaryCard
          title="Latest student"
          value={students[0]?.name || 'N/A'}
          sub={students[0]?.email}
          icon={<Sparkles className="h-5 w-5" />}
        />
      </div>
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Recent students</h2>
          <Link href="/admin/students" className="text-xs font-semibold text-primary-600">
            View all
          </Link>
        </div>
        <div className="mt-3 divide-y divide-slate-100">
          {students.slice(0, 5).map((s) => (
            <div key={s.id} className="py-3 text-sm">
              <p className="font-semibold text-slate-800">{s.name}</p>
              <p className="text-slate-600">{s.email}</p>
            </div>
          ))}
          {students.length === 0 && <p className="py-3 text-sm text-slate-600">No students loaded.</p>}
        </div>
      </Card>
    </AdminShell>
  );
}
