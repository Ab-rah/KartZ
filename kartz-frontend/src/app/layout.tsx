import "./globals.css";
import Link from "next/link";
import Providers from "@/components/Providers";
import { NavbarClient } from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body className="bg-gray-50 text-gray-900">
          <NavbarClient />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </body>
      </Providers>
    </html>
  );
}
