import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homeschool Tools",
  description: "Free, printable, no-fuss tools for homeschool families.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <header className="no-print border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              Homeschool Tools
            </Link>
            <nav className="text-sm text-slate-600 flex gap-4">
              <Link href="/" className="hover:text-slate-900">Home</Link>
              <Link href="/tools/multiplication" className="hover:text-slate-900">Tools</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="no-print border-t border-slate-200 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500 flex justify-between">
            <span>Made for homeschoolers.</span>
            <span>Free &amp; open source.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
