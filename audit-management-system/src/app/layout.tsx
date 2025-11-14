import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CleanAudits | Digital Pharma Audit Management",
  description:
    "CleanAudits helps pharma and biotech organizations streamline GMP audits, CAPA tracking, and compliance analytics with one unified digital platform.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
