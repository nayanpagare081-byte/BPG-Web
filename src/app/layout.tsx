import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'BPG Construction & Earthmoving Equipment',
  description: 'Industrial-grade earthmoving machinery and construction equipment. Excavators, loaders, bulldozers, cranes, and dump trucks from BPG — trusted by contractors across India.',
  keywords: 'construction equipment, earthmoving, excavators, loaders, bulldozers, BPG, Nashik',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main style={{ minHeight: '70vh' }}>{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
