"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 border rounded-lg"
      >
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4 p-4 border rounded-lg bg-white shadow-lg">
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/services" onClick={() => setOpen(false)}>
            Services
          </Link>
          <Link href="/booking" onClick={() => setOpen(false)}>
            Book a Cleaning
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}
