'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import Card from '../../../components/ui/Card';
import { User } from '../../../types';

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.admin
      .students()
      .then((data) => setStudents(data.students || []))
      .catch((err) => setError(err.message || 'Unable to load students'));
  }, []);

  const filtered = useMemo(() => {
    if (!query) return students;
    const q = query.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }, [students, query]);

  return (
    <AdminShell title="Students" subtitle="View registered students and navigate to profiles.">
      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-2 text-sm text-danger-700">
          {error}
        </div>
      )}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Student list</h2>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search students"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-semibold text-slate-800">{s.name}</p>
                <p className="text-slate-600">{s.email}</p>
              </div>
              <Link
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600"
                href={`/admin/students/${s.id}`}
              >
                View profile
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
          {filtered.length === 0 && <p className="py-3 text-sm text-slate-600">No students loaded.</p>}
        </div>
      </Card>
    </AdminShell>
  );
}
