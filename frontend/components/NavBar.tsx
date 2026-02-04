'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Route } from 'next';
import { Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { api } from '../lib/api';
import { User } from '../types';
import { cn } from '../lib/cn';

type NavLink = {
  href: Route;
  label: string;
};

const authedLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Admin' },
];

const guestLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/login', label: 'Login' },
  { href: '/signup', label: 'Sign up' },
  { href: '/admin/login', label: 'Admin' },
];

const NavBar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    api
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  const links = user ? authedLinks : guestLinks;

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-400 text-sm font-semibold text-white shadow-glow">
            BU
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">BRACU CGPA</p>
            <p className="text-xs text-slate-500">Academic Planner</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-2xl px-3 py-2 text-sm font-semibold transition',
                pathname === link.href
                  ? 'bg-primary/10 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                <UserIcon className="h-4 w-4 text-slate-500" />
                {user.name.split(' ')[0] || 'Account'}
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signup" className="btn-primary">
              Get started
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden"
          onClick={() => setMenuOpen((s) => !s)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200/60 bg-white/90 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-2xl px-4 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
