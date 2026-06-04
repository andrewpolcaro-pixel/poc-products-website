import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Catalog',
  description: 'B2B product catalog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <a href="/" className="font-bold text-xl tracking-tight text-gray-900">
              ProductCatalog
            </a>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">{children}</main>
      </body>
    </html>
  );
}
