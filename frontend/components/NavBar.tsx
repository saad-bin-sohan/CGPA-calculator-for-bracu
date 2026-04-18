'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Route } from 'next';
import { ChevronDown, LogOut, Menu, User as UserIcon, X } from 'lucide-react';
import { api } from '../lib/api';
import { cn } from '../lib/cn';
import type { User } from '../types';

type NavLink = { href: Route; label: string };

const authedLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/dashboard', label: 'Dashboard' }
];

const guestLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/login', label: 'Log in' }
];

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const links = user ? authedLinks : guestLinks;

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center bg-primary-700 text-xs font-bold text-white">
            BU
          </span>
          <span className="text-sm font-semibold tracking-tight text-stone-900">BRACU CGPA</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors duration-150',
                pathname === link.href
                  ? 'font-semibold text-primary-700'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((state) => !state)}
                className="flex items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
              >
                <UserIcon className="h-4 w-4" />
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-stone-200 bg-white py-1 shadow-md">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    Profile
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Admin
                  </Link>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-stone-600 transition-colors hover:text-stone-900"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary px-4 py-1.5 text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="p-2 text-stone-500 hover:text-stone-900 lg:hidden"
          onClick={() => setMenuOpen((state) => !state)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-2 py-2 text-sm',
                  pathname === link.href ? 'font-semibold text-primary-700' : 'text-stone-600'
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" className="px-2 py-2 text-sm text-stone-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-2 py-2 text-left text-sm text-stone-600"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/signup" className="mt-2 inline-block btn-primary text-center">
                Sign up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
