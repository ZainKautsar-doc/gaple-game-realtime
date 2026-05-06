import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Gaple Realtime Arena',
  description: 'Main gaple multiplayer realtime langsung dari browser.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-[var(--font-body)]`}
      >
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-mint/10 blur-3xl animate-drift" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-aqua/10 blur-3xl animate-drift" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-ember/10 blur-3xl animate-drift" />
        </div>
        <div className="relative min-h-screen">{children}</div>
      </body>
    </html>
  );
}

