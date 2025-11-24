import Link from 'next/link';

export default function Home() {
  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">
          CGPA Calculator & Graduation Progress for BRACU
        </h1>
        <p className="text-slate-600">
          Plan semesters, track retakes, and keep your graduation credits in sight. Works for guests
          and logged-in students, with admin controls for departments, courses, and grading scales.
        </p>
        <div className="flex gap-3">
          <Link
            href="/calculator"
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow"
          >
            Open Guest Calculator
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800"
          >
            Create student account
          </Link>
        </div>
      </div>
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Highlights</h2>
        <ul className="space-y-3 text-sm text-slate-700">
          <li>• BRACU grading scale with editable W/I handling and custom decimal precision.</li>
          <li>• Retake-aware CGPA; only the last attempt per course counts.</li>
          <li>• Guest mode stores everything locally; student dashboard persists to the backend.</li>
          <li>• Admin tools to manage departments, courses, grade scales, settings, and student list.</li>
          <li>• Export semester plans and CGPA snapshots as PDF.</li>
        </ul>
      </div>
    </section>
  );
}
