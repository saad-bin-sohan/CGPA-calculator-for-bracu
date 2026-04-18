import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Retake-aware CGPA',
    description:
      'Only the latest attempt per course counts toward your CGPA. W and I grades are handled automatically.'
  },
  {
    title: 'Offline guest mode',
    description:
      'Plan full semesters without signing in. Everything is saved locally in your browser.'
  },
  {
    title: 'PDF export',
    description:
      'Generate a clean CGPA snapshot or semester plan as a downloadable PDF in one click.'
  },
  {
    title: 'Admin console',
    description:
      'Full control over departments, courses, grading scales, templates, and student records.'
  }
];

const steps = [
  {
    title: 'Pick your department',
    description:
      'Load official credit requirements and pre-built semester templates for your program instantly.'
  },
  {
    title: 'Plan your semesters',
    description:
      'Add courses, input grades by letter, points, or percentage. Mark retakes and special grades.'
  },
  {
    title: 'Track graduation progress',
    description:
      'Watch your live CGPA and credit count update as you plan. Export a polished PDF at any time.'
  }
];

export default function Home() {
  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Academic Planning Suite · BRAC University
          </p>
          <h1 className="font-display text-4xl font-normal leading-tight text-stone-900 lg:text-5xl">
            The CGPA calculator built for confident academic planning.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Plan semesters, handle retakes, and track your graduation progress with precision tools
            designed specifically for BRACU students.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/calculator" className="btn-primary">
              Open calculator
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 transition-colors hover:text-primary-700"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-stone-400">No sign-in required for guest mode.</p>
        </div>
      </section>
      <hr className="mt-16 border-stone-200" />

      <section className="py-16">
        <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-stone-500">
          What it does
        </p>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title}>
              <p className="mb-1.5 text-sm font-semibold text-stone-900">{feature.title}</p>
              <p className="text-sm leading-relaxed text-stone-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <hr className="mt-16 border-stone-200" />

      <section className="grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
            How it works
          </p>
          <h2 className="font-display text-3xl font-normal leading-snug text-stone-900">
            Three steps to a complete semester plan.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">
            A straightforward flow designed to keep your plan accurate and your CGPA calculation
            retake-aware from the first entry.
          </p>
        </div>
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex gap-5">
              <span className="w-5 shrink-0 select-none pt-1 font-mono text-xs font-bold text-stone-300">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <hr className="mt-16 border-stone-200" />

      <section className="py-16">
        <h2 className="mb-3 font-display text-3xl font-normal text-stone-900">
          Ready to plan your best semester?
        </h2>
        <p className="mb-8 text-sm text-stone-500">
          Start instantly as a guest. No account or sign-in required.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/calculator" className="btn-primary">
            Open calculator
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 transition-colors hover:text-primary-700"
          >
            Sign up for a student account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="mt-16 flex flex-col gap-4 border-t border-stone-200 py-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <span>BRACU CGPA Planner · For students, by design.</span>
        <div className="flex gap-6">
          <Link href="/calculator" className="text-stone-500 transition-colors hover:text-stone-900">
            Calculator
          </Link>
          <Link href="/dashboard" className="text-stone-500 transition-colors hover:text-stone-900">
            Dashboard
          </Link>
          <Link href="/admin/login" className="text-stone-500 transition-colors hover:text-stone-900">
            Admin
          </Link>
        </div>
      </footer>
    </>
  );
}
