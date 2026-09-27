import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", weight: ["700", "900"] });
const body = Source_Serif_4({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "The Tribunal of Everyday Objects",
  description: "Where the Wi-Fi, the Left Sock and Monday finally answer for their crimes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <header className="border-b-4 border-double rule">
          <div className="mx-auto max-w-5xl px-5 py-6 flex flex-wrap items-end justify-between gap-4">
            <Link href="/" className="block">
              <div className="mono text-xs tracking-[.3em] muted">EST. 1887 · IN SESSION</div>
              <div className="display text-3xl sm:text-4xl font-black leading-none mt-1">The Tribunal of Everyday Objects</div>
            </Link>
            <nav className="mono text-sm flex gap-5">
              <Link className="link" href="/">Docket</Link>
              <Link className="link" href="/defendants/">Most Wanted</Link>
              <Link className="link" href="/statutes/">Statutes</Link>
              <Link className="link" href="/case-law/">Case Law</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
        <footer className="border-t rule">
          <div className="mx-auto max-w-5xl px-5 py-8 text-sm muted">
            All proceedings are entered in the court&apos;s record (a Sanity dataset). No objects were harmed. Some were sentenced.
          </div>
        </footer>
      </body>
    </html>
  );
}
