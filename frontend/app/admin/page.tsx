'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Users, Building2, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import SummaryCard from '../../components/SummaryCard';
import AdminShell from '../../components/AdminShell';
import { Department, Course, User } from '../../types';

export default function AdminDashboard() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [d, c, s] = await Promise.all([
          api.getDepartments(),
          api.getCourses(''),
          api.admin.students(),
        ]);
        setDepartments(d.departments || []);
        setCourses(c.courses || []);
        setStudents(s.students || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load overview data.');
      }
    };
    load();
  }, []);

  return (
    <AdminShell title="Overview" subtitle="System-wide summary of departments, courses, and students.">
      {error && <p className="alert-danger">{error}</p>}

      <div className="grid grid-cols-2 border-l border-t border-stone-200 bg-white lg:grid-cols-4">
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="Departments"
            value={departments.length.toString()}
            sub="Active departments"
            icon={<Building2 className="h-4 w-4" />}
          />
        </div>
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="Courses"
            value={courses.length.toString()}
            sub="In catalog"
            icon={<GraduationCap className="h-4 w-4" />}
          />
        </div>
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="Students"
            value={students.length.toString()}
            sub="Registered accounts"
            icon={<Users className="h-4 w-4" />}
          />
        </div>
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="Latest student"
            value={students[0]?.name?.split(' ')[0] || '—'}
            sub={students[0]?.email || 'No students yet'}
          />
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">Recent students</h2>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 transition-colors hover:text-primary-700"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-stone-100 border-y border-stone-200">
          {students.slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-semibold text-stone-800">{s.name}</p>
                <p className="text-xs text-stone-500">{s.email}</p>
              </div>
              <Link
                href={`/admin/students/${s.id}`}
                className="text-xs font-semibold text-stone-400 transition-colors hover:text-primary-700"
              >
                Profile →
              </Link>
            </div>
          ))}
          {students.length === 0 && (
            <p className="py-4 text-sm text-stone-400">No students registered yet.</p>
          )}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
          Quick actions
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/departments" className="btn-outline px-3 py-1.5 text-xs">
            Manage departments
          </Link>
          <Link href="/admin/courses" className="btn-outline px-3 py-1.5 text-xs">
            Manage courses
          </Link>
          <Link href="/admin/grade-scale" className="btn-outline px-3 py-1.5 text-xs">
            Grade scale
          </Link>
          <Link href="/admin/templates" className="btn-outline px-3 py-1.5 text-xs">
            Templates
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
