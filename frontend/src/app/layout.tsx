import type { Metadata } from 'next';
import { Anton, Space_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import './globals.css';
import '@/styles/game.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gaple Arena - Classic Domino',
  description: 'Premium multiplayer domino experience.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${anton.variable} ${spaceMono.variable} font-sans antialiased bg-nb-surface text-nb-on-surface`}
      >
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
