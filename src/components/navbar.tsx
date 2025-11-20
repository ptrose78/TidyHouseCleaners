"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <Link href="/" className="font-bold text-xl">
          Tidy House Cleaners
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          <Link href="/services">Services</Link>
          <Link href="/booking">Book</Link>
          <Link href="/contact">Contact</Link>
        </div>

      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden flex flex-col p-4 border-t">
          <Link href="/services" className="py-2">Services</Link>
          <Link href="/booking" className="py-2">Book</Link>
          <Link href="/contact" className="py-2">Contact</Link>
        </div>
      )}
    </nav>
  );
}
