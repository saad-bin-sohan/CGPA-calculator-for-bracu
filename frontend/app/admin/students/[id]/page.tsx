'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, Layers, Sigma } from 'lucide-react';
import { api } from '../../../../lib/api';
import { Semester, Summary, User } from '../../../../types';
import ProgressBar from '../../../../components/ProgressBar';
import SummaryCard from '../../../../components/SummaryCard';
import AdminShell from '../../../../components/AdminShell';

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
      .catch((err) => setError(err.message || 'Failed to load student profile.'));
  }, [id]);

  if (!id) return null;

  const requiredCredits = (student?.department as any)?.totalCreditsRequired || 0;

  return (
    <AdminShell
      title="Student profile"
      subtitle={student ? `${student.name} · ${student.email}` : 'Loading…'}
    >
      {error && <p className="alert-danger">{error}</p>}

      {summary && (
        <>
          <div className="grid grid-cols-3 border-l border-t border-stone-200 bg-white">
            <div className="border-b border-r border-stone-200">
              <SummaryCard
                title="CGPA"
                value={summary.cgpa.toFixed(3)}
                icon={<Sigma className="h-4 w-4" />}
              />
            </div>
            <div className="border-b border-r border-stone-200">
              <SummaryCard
                title="Credits"
                value={`${summary.totalCredits}`}
                sub={requiredCredits ? `of ${requiredCredits} required` : undefined}
                icon={<Layers className="h-4 w-4" />}
              />
            </div>
            <div className="border-b border-r border-stone-200">
              <SummaryCard
                title="Courses"
                value={`${summary.totalCourses}`}
                sub="Unique courses"
                icon={<BookOpen className="h-4 w-4" />}
              />
            </div>
          </div>

          {student?.department && requiredCredits > 0 && (
            <ProgressBar completed={summary.totalCredits} total={requiredCredits} />
          )}
        </>
      )}

      {semesters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-stone-700">Semester records</h2>
          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {semesters.map((s) => {
              const semSummary = summary?.perSemester?.find(
                (p) => p.termName === s.termName
              );
              return (
                <div key={s._id} className="py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-stone-800">{s.termName}</p>
                    {semSummary && (
                      <span className="font-mono text-xs text-stone-500">
                        GPA {semSummary.gpa.toFixed(3)} · {semSummary.credits} cr
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-stone-100 border-y border-stone-100">
                    {s.enrollments.map((e, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-stone-600"
                      >
                        <span>
                          <span className="font-mono font-semibold text-stone-700">
                            {e.courseCode}
                          </span>
                          {e.courseTitle && (
                            <span className="ml-2 text-stone-400">{e.courseTitle}</span>
                          )}
                        </span>
                        <span className="font-mono text-stone-500">
                          {e.gradeLetter || '—'}
                          <span className="ml-1 text-stone-300">({e.gradePoint})</span>
                        </span>
                      </div>
                    ))}
                    {s.enrollments.length === 0 && (
                      <p className="py-2 text-xs text-stone-400">
                        No courses in this semester.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {semesters.length === 0 && !error && (
        <p className="text-sm text-stone-400">This student has no saved semester records.</p>
      )}
    </AdminShell>
  );
}
