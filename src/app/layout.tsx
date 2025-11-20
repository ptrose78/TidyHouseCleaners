
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MobileNav from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tidy House Cleaners | Milwaukee’s Trusted Cleaning Pros",
  description:
    "Premium house cleaning in Milwaukee, Oak Creek, Franklin, and surrounding areas. Standard clean, deep clean, move-in/move-out. Book your professional cleaning today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-white text-gray-900")}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          Tidy House Cleaners
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-lg">
          <Link href="/services" className="hover:text-primary">Services</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/booking" className="px-5 py-2 bg-primary text-white rounded-xl hover:bg-primary/90">
            Book Now
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}

<MobileNav />

function Footer() {
  return (
    <footer className="mt-20 border-t bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-bold text-xl mb-4">Tidy House Cleaners</h3>
          <p className="text-gray-600">
            Milwaukee’s trusted home cleaning professionals.
            Serving Oak Creek, Franklin, Milwaukee, and nearby cities.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-700">
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/booking">Book a Cleaning</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <p className="text-gray-700">Email: info@tidyhousecleaners.com</p>
          <p className="text-gray-700">Phone: (414) 555-1234</p>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-10 text-sm">
        © {new Date().getFullYear()} Tidy House Cleaners — All rights reserved.
      </p>
    </footer>
  );
}
