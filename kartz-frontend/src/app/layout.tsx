import "./globals.css";
import Link from "next/link";
import Providers from "@/components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <header className="bg-black shadow p-4 flex justify-between">
            <h1 className="font-bold text-xl">KartZ</h1>
            <nav className="space-x-4">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </nav>
          </header>
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}