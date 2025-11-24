'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { User } from '../../../types';

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.admin
      .students()
      .then((data) => setStudents(data.students || []))
      .catch((err) => setError(err.message || 'Unable to load students'));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-600">View registered students and navigate to profiles.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="card divide-y divide-slate-100">
        {students.map((s) => (
          <div key={s.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="font-semibold text-slate-800">{s.name}</p>
              <p className="text-slate-600">{s.email}</p>
            </div>
            <Link className="text-xs font-semibold text-primary" href={`/admin/students/${s.id}`}>
              View profile
            </Link>
          </div>
        ))}
        {students.length === 0 && <p className="py-3 text-sm text-slate-600">No students loaded.</p>}
      </div>
    </div>
  );
}
