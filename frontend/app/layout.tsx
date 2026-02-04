import type { Metadata } from 'next';
import './globals.css';
import NavBar from '../components/NavBar';

export const metadata: Metadata = {
  title: 'BRACU CGPA & Graduation Tracker',
  description: 'CGPA calculator and graduation progress planner for BRAC University'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NavBar />
        <main className="container py-8 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
