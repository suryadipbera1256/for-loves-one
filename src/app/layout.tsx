import type { Metadata } from "next";
import { Caveat, Quicksand } from "next/font/google";
import "@/styles/globals.css";
import { SmartNav } from "@/components/navigation/SmartNav"; 

const fontCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const fontQuicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For Loves Ones | Spatial UI",
  description: "A chronological journey and gallery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${fontCaveat.variable} ${fontQuicksand.variable}`}>
      <body className="bg-black antialiased selection:bg-cyan-500/30 font-sans">
        
        {/* Injected Global Smart Navbar */}
        <SmartNav />

        {children}
      </body>
    </html>
  );
}