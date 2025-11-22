import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tidy House Cleaners | Milwaukee’s Trusted Cleaning Pros",
  description:
    "Premium house cleaning in Milwaukee, Oak Creek, Franklin, and surrounding areas. Standard clean, deep clean, move-in/move-out. Book your professional cleaning today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script 
          src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
          strategy="lazyOnload" 
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

/* ---------------------
      FOOTER
------------------------ */

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
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/booking">Book a Cleaning</a></li>
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
