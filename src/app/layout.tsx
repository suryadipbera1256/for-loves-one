import type { Metadata } from "next";
import { Caveat, Quicksand } from "next/font/google";
import "@/styles/globals.css";
import Link from "next/link";

// Primary romantic handwriting font for headings and special text
const fontCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

// Secondary soft rounded font for readability in body text
const fontQuicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For Loves Ones | Spatial UI",
  description: "A chronological journey and gallery.",
};

// Root layout providing global navigation and font context
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${fontCaveat.variable} ${fontQuicksand.variable}`}>
      <body className="bg-black antialiased selection:bg-cyan-500/30 font-sans">
        
        {/* Global floating navigation mesh */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 px-6 py-3 rounded-full flex gap-8">
          <Link href="/" className="text-sm font-medium text-neutral-300 hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <Link href="/roadmap" className="text-sm font-medium text-neutral-300 hover:text-cyan-400 transition-colors">
            Roadmap
          </Link>
          <Link href="/gallery" className="text-sm font-medium text-neutral-300 hover:text-cyan-400 transition-colors">
            Gallery
          </Link>
        </nav>

        {children}
      </body>
    </html>
  );
}