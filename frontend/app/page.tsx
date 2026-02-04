import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  TrendingUp,
  GraduationCap,
  LayoutGrid
} from 'lucide-react';

const features = [
  {
    title: 'Retake-aware CGPA',
    description: 'Only the latest attempt per course counts, with W/I handling built in.',
    icon: TrendingUp
  },
  {
    title: 'Offline guest mode',
    description: 'Plan semesters instantly without signing in. Everything stays in your browser.',
    icon: ShieldCheck
  },
  {
    title: 'PDF exports',
    description: 'Create polished CGPA snapshots and shareable semester plans in seconds.',
    icon: FileText
  },
  {
    title: 'Admin-ready',
    description: 'Manage departments, courses, grading scales, templates, and student data.',
    icon: LayoutGrid
  }
];

const steps = [
  {
    title: 'Pick your department',
    description: 'Load the official credit requirements and templates instantly.'
  },
  {
    title: 'Plan semesters',
    description: 'Add courses, retakes, and inputs with smart grade controls.'
  },
  {
    title: 'Track progress',
    description: 'See live CGPA and graduation progress the moment you update anything.'
  }
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-5xl border border-white/60 bg-white/70 p-8 shadow-card backdrop-blur sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute left-10 top-1/2 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
              <Sparkles className="h-4 w-4" />
              BRAC University CGPA Suite
            </div>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              The CGPA calculator built for confident academic planning.
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              Plan semesters, handle retakes, and track graduation progress with a sleek, intelligent
              experience for BRACU students.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculator" className="btn-primary">
                Open guest calculator
              </Link>
              <Link href="/signup" className="btn-outline">
                Create student account
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="badge badge-primary">Designed for BRACU</span>
              <span className="badge">Retake aware</span>
              <span className="badge">Local-first guest mode</span>
              <span className="badge">Admin controls included</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Live CGPA snapshot</p>
                <span className="badge badge-primary">Spring</span>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Current CGPA</p>
                  <p className="mt-2 text-4xl font-bold text-slate-900 tabular-nums">3.78</p>
                  <p className="mt-1 text-xs text-slate-500">+0.12 vs last semester</p>
                </div>
                <div className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Credits completed</span>
                    <span>92 / 136</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200/60">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-100 p-4 text-xs text-slate-500">
                  Syncs with your student dashboard once you sign in.
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-3xl border border-white/60 bg-white/70 px-5 py-4 shadow-soft backdrop-blur lg:block">
              <p className="text-xs font-semibold uppercase text-slate-500">Built for</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <GraduationCap className="h-4 w-4 text-primary-600" />
                BRAC University students
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Why students love it</p>
          <h2 className="text-3xl font-semibold text-slate-900">Intelligent, fast, and delightful.</h2>
          <p className="text-sm text-slate-600">
            Every screen is optimized for speed, clarity, and confidence in your academic decisions.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="card-strong space-y-4">
          <h3 className="text-2xl font-semibold text-slate-900">How it works</h3>
          <p className="text-sm text-slate-600">
            A simple flow that keeps your plan tidy and your CGPA accurate.
          </p>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary-700">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-strong space-y-4">
          <h3 className="text-2xl font-semibold text-slate-900">Trusted by planners</h3>
          <p className="text-sm text-slate-600">
            Designed to feel like premium academic software, with the precision BRACU expects.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-600">
              “The cleanest CGPA tool I’ve used — feels like a real product.”
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-600">
              “Fast, intuitive, and actually enjoyable to plan semesters.”
            </div>
          </div>
        </div>
      </section>

      <section className="card-strong flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Ready to plan your best semester?</h3>
          <p className="text-sm text-slate-600">Start instantly as a guest or sync with your student account.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/calculator" className="btn-primary">
            Try guest mode
          </Link>
          <Link href="/signup" className="btn-outline">
            Sign up
          </Link>
        </div>
      </section>

      <footer className="flex flex-col items-start justify-between gap-4 border-t border-slate-200/60 pt-6 text-xs text-slate-500 sm:flex-row">
        <span>BRACU CGPA Planner • Designed for students</span>
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <Link href="/calculator">Calculator</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
      </footer>
    </div>
  );
}
