import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Package Group LLC', template: '%s | Package Group LLC' },
  description: 'B2B packaging solutions for skincare and beauty brands.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isPreview } = await draftMode();

  return (
    <html lang="en" className={geist.className}>
      <body className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
        {isPreview && (
          <div className="bg-yellow-400 text-yellow-900 text-sm px-6 py-2 flex items-center justify-between">
            <span className="font-medium">⚠ Preview Mode — viewing unpublished content</span>
            <a href="/api/disable-preview" className="underline font-semibold hover:text-yellow-700">
              Exit Preview
            </a>
          </div>
        )}

        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
              PACKAGE GROUP <span className="text-brand">LLC</span>
            </Link>
            <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-brand transition-colors">
                Products
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-screen-xl mx-auto px-6 py-8 text-sm text-gray-500">
            © {new Date().getFullYear()} Package Group LLC. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
