import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clean Audits | Digital Pharma Audit Management",
  description:
    "Clean Audits helps pharma and biotech organizations streamline GMP audits, CAPA tracking, and compliance analytics with one unified digital platform.",
  icons: {
    icon: "/icon.png",            // default favicon
    // shortcut: "/logo.png",        // for Safari pinned tabs
    // apple: "/apple-icon.png",     // if you add one
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* Optional global header (keeps buttons consistent across pages) */}
          <header className="absolute top-6 right-8 z-50 flex gap-4">
            <SignedOut>
              <SignInButton>
                <button className="bg-transparent border-2 border-white text-white font-semibold px-6 py-2 rounded hover:border-white hover:border-4 transition">
                  Login
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-teal text-white font-semibold px-6 py-2 rounded hover:border-white hover:border-4 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
