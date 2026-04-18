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
  Settings,
  LogOut,
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
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const satisfies readonly NavItem[];

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminShell({ title, subtitle, actions, children }: Props) {
  const pathname = usePathname();
  const isActive = (href: Route) =>
    href === '/admin'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="grid lg:grid-cols-[200px_1fr]">
      <aside className="hidden border-r border-stone-200 bg-white lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto">
        <div className="flex h-full flex-col">
          <nav className="flex-1 px-2 py-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
              Admin
            </p>
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm transition-colors duration-150',
                      active
                        ? 'border-primary-700 bg-stone-50 font-semibold text-stone-900'
                        : 'border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-stone-200 px-2 py-3">
            <button
              type="button"
              onClick={() => api.logout().catch(() => undefined)}
              className="flex w-full items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-sm text-stone-400 transition-colors duration-150 hover:border-danger hover:bg-danger/5 hover:text-danger-700"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-base font-semibold text-stone-900">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>

        <div className="border-b border-stone-200 bg-white px-4 py-2 lg:hidden">
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'shrink-0 px-3 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'text-stone-900 underline decoration-primary-700 decoration-2 underline-offset-4'
                      : 'text-stone-500 hover:text-stone-900'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => api.logout().catch(() => undefined)}
              className="ml-auto shrink-0 px-3 py-1.5 text-xs text-stone-400 hover:text-danger-700"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="space-y-8 p-6">{children}</div>
      </div>
    </div>
  );
}
