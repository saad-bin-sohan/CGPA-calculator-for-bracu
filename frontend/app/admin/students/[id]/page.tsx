'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, Layers, Sigma } from 'lucide-react';
import { api } from '../../../../lib/api';
import { Semester, Summary, User } from '../../../../types';
import ProgressBar from '../../../../components/ProgressBar';
import SummaryCard from '../../../../components/SummaryCard';
import AdminShell from '../../../../components/AdminShell';
import Card from '../../../../components/ui/Card';

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
    <AdminShell
      title="Student Profile"
      subtitle={student ? `${student.name} • ${student.email}` : 'Loading student'}
    >
      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-2 text-sm text-danger-700">
          {error}
        </div>
      )}
      {summary && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              title="CGPA"
              value={summary.cgpa.toFixed(3)}
              icon={<Sigma className="h-5 w-5" />}
              tone="primary"
            />
            <SummaryCard
              title="Credits"
              value={`${summary.totalCredits}`}
              icon={<Layers className="h-5 w-5" />}
              tone="accent"
            />
            <SummaryCard
              title="Courses"
              value={`${summary.totalCourses}`}
              icon={<BookOpen className="h-5 w-5" />}
            />
          </div>
          {student?.department && (
            <Card>
              <ProgressBar
                completed={summary.totalCredits}
                total={(student.department as any).totalCreditsRequired || 0}
              />
            </Card>
          )}
        </>
      )}
      <div className="space-y-4">
        {semesters.map((s) => (
          <Card key={s._id} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">{s.termName}</p>
              {summary?.perSemester && (
                <span className="text-xs text-slate-600">
                  GPA:{' '}
                  {(() => {
                    const match = summary.perSemester.find((p) => p.termName === s.termName);
                    return match ? match.gpa.toFixed(3) : '—';
                  })()}
                </span>
              )}
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              {s.enrollments.map((e, idx) => (
                <div key={idx} className="flex flex-wrap justify-between gap-2">
                  <span>
                    {e.courseCode} — {e.courseTitle}
                  </span>
                  <span>
                    {e.gradeLetter || ''} ({e.gradePoint})
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
