import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { User } from '../types';

const NavBar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
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

  const links = user
    ? [
        { href: '/', label: 'Home' },
        { href: '/calculator', label: 'Calculator' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/profile', label: 'Profile' },
        { href: '/admin', label: 'Admin' }
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/calculator', label: 'Calculator' },
        { href: '/login', label: 'Login' },
        { href: '/signup', label: 'Sign up' },
        { href: '/admin/login', label: 'Admin' }
      ];
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-primary">
          BRACU CGPA
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 transition hover:bg-slate-100 ${
                pathname === link.href ? 'bg-slate-100 text-primary' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="rounded px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
'use client';
