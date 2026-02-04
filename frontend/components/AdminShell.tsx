'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  LayoutGrid,
  Building2,
  GraduationCap,
  Scale,
  Users,
  FileStack,
  Settings
} from 'lucide-react';
import { api } from '../lib/api';
import { cn } from '../lib/cn';

interface NavItem {
  href: Route;
  label: string;
  icon: typeof LayoutGrid;
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutGrid },
  { href: '/admin/departments', label: 'Departments', icon: Building2 },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/grade-scale', label: 'Grade scale', icon: Scale },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/templates', label: 'Templates', icon: FileStack },
  { href: '/admin/settings', label: 'Settings', icon: Settings }
] as const satisfies readonly NavItem[];

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminShell({ title, subtitle, actions, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="hidden h-fit rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-soft backdrop-blur lg:sticky lg:top-24 lg:block">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Admin</p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition',
                  active
                    ? 'bg-primary/10 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => api.logout().catch(() => undefined)}
            className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
        <div className="lg:hidden">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-2xl px-4 py-2 text-xs font-semibold',
                    active ? 'bg-primary/10 text-primary-700' : 'bg-white text-slate-600'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => api.logout().catch(() => undefined)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Logout
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
