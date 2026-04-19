import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="h-px bg-primary-700" />

      <div className="container">
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center bg-primary-700 text-xs font-bold text-white">
                BU
              </span>
              <span className="text-sm font-semibold tracking-tight text-stone-100">BRACU CGPA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
              A CGPA calculator and graduation progress tracker built for BRAC University students.
              Plan your academic path, semester by semester.
            </p>
            <p className="mt-6 text-xs font-mono tracking-wide text-stone-600">
              For BRACians · By a BRACian
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Navigate
            </p>
            <ul className="list-none space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-stone-400 transition-colors duration-150 hover:text-primary-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="text-sm text-stone-400 transition-colors duration-150 hover:text-primary-300"
                >
                  Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-stone-400 transition-colors duration-150 hover:text-primary-300"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-stone-400 transition-colors duration-150 hover:text-primary-300"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-stone-400 transition-colors duration-150 hover:text-primary-300"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Creator
            </p>
            <p className="text-sm font-semibold text-stone-100">Saad Bin Sohan</p>
            <p className="mt-1 text-xs font-mono text-stone-500">BSc in CSE · BRAC University</p>
            <a
              href="https://github.com/saad-bin-sohan"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-4 py-2 text-sm text-stone-300 transition-all duration-200 hover:border-primary-600 hover:bg-stone-700 hover:text-primary-300"
            >
              <Github className="h-4 w-4" />
              saad-bin-sohan
            </a>
            <p className="mt-3 text-xs text-stone-600">Open source · Built with Next.js</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-3 border-t border-stone-800 pt-6 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-stone-600">© 2025 BRACU CGPA Planner. All rights reserved.</span>
          <span className="text-xs font-display italic text-stone-600">
            Made with dedication for every BRACian chasing graduation.
          </span>
        </div>
      </div>
    </footer>
  );
}
