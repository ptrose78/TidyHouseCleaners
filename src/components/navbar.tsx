"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        {/* LOGO + BRAND NAME */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"     // your saved logo
            alt="Tidy House Cleaners Logo"
            width={100}             // perfect size for nav
            height={100}
            className="object-contain"
            priority
          />
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>

       <nav className="hidden md:flex items-center gap-8 text-lg">
          <Link href="/services" className="hover:text-primary">Services</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/booking" className="px-5 py-2 bg-primary text-white rounded-xl hover:bg-primary/90">
            Book Now
          </Link>
        </nav>

      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden flex flex-col p-4 border-t">

          {/* Optional: show logo inside dropdown */}
          {/* <div className="flex items-center gap-3 mb-4">
            <Image
              src="/Logo-01.png"
              alt="Tidy House Cleaners Logo"
              width={38}
              height={38}
              className="object-contain"
            />
          </div> */}

          <Link href="/services" className="py-2">Services</Link>
          <Link href="/booking" className="py-2">Book</Link>
          <Link href="/contact" className="py-2">Contact</Link>
        </div>
      )}
    </nav>
  );
}
