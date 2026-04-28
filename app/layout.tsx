import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Affiliate Click Dashboard',
  description: 'Meta ads affiliate click dashboard and redirect tracker',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
