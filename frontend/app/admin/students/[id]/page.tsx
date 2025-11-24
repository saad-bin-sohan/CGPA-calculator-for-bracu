'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Semester, Summary, User } from '../../../../types';
import ProgressBar from '../../../../components/ProgressBar';

export default function AdminStudentProfile() {
  const params = useParams();
  const id = params?.id as string;
  const [student, setStudent] = useState<User | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.admin
      .studentProfile(id)
      .then((data) => {
        setStudent(data.student);
        setSemesters(data.semesters || []);
        setSummary(data.summary || null);
      })
      .catch((err) => setError(err.message || 'Failed to load'));
  }, [id]);

  if (!id) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
        {student && (
          <p className="text-slate-600">
            {student.name} — {student.email}
          </p>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {summary && (
        <div className="card grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-slate-500">CGPA</p>
            <p className="text-2xl font-bold text-slate-900">{summary.cgpa.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Credits</p>
            <p className="text-2xl font-bold text-slate-900">{summary.totalCredits}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Courses</p>
            <p className="text-2xl font-bold text-slate-900">{summary.totalCourses}</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {semesters.map((s) => (
          <div key={s._id} className="card space-y-2">
            <p className="text-sm font-semibold text-slate-800">{s.termName}</p>
            <div className="space-y-1 text-xs text-slate-600">
              {s.enrollments.map((e, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {e.courseCode} — {e.courseTitle}
                  </span>
                  <span>
                    {e.gradeLetter || ''} ({e.gradePoint})
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
