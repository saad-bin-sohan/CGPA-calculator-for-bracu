'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { api } from '../../../lib/api';
import AdminShell from '../../../components/AdminShell';
import { User } from '../../../types';

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.admin
      .students()
      .then((data) => setStudents(data.students || []))
      .catch((err) => setError(err.message || 'Unable to load students.'));
  }, []);

  const filtered = useMemo(() => {
    if (!query) return students;
    const q = query.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <AdminShell
      title="Students"
      subtitle="View registered student accounts and navigate to individual profiles."
    >
      {error && <p className="alert-danger">{error}</p>}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-stone-700">
            All students
            <span className="ml-2 font-normal text-stone-400">({filtered.length})</span>
          </h2>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              className="input pl-9 text-xs"
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-stone-100 border-y border-stone-200">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-semibold text-stone-800">{s.name}</p>
                <p className="text-xs text-stone-500">{s.email}</p>
              </div>
              <Link
                href={`/admin/students/${s.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-400 transition-colors hover:text-primary-700"
              >
                Profile
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-4 text-sm text-stone-400">
              {query ? 'No students match your search.' : 'No students registered yet.'}
            </p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
