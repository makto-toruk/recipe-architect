"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["600"],
});

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col justify-between w-6 h-5">
      <span
        className={`block h-0.5 bg-current transition-transform ${
          open ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span
        className={`block h-0.5 bg-current transition-opacity ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 bg-current transition-transform ${
          open ? "-translate-y-2 -rotate-45" : ""
        }`}
      />
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="w-full flex items-center px-4 py-3 relative
                 border-b-[0.05px] border-gray-200 dark:border-gray-400/40"
    >
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/images/cafe-tm-logo.png"
          width={64}
          height={64}
          alt="Cafe TM logo"
          priority
        />
        <span className={`${dancing.className} text-2xl leading-none`}>
          Cafe&nbsp;TM
        </span>
      </Link>

      {/* Hamburger */}
      <button
        aria-label="Toggle navigation"
        className="ml-auto p-2 text-gray-700 hover:text-gray-950 focus:outline-none"
        onClick={() => setOpen((p) => !p)}
      >
        <MenuIcon open={open} />
      </button>

      {/* Slide-down menu */}
      {open && (
        <nav className="absolute top-full right-4 mt-2 w-40 rounded-lg bg-white shadow-lg ring-1 ring-gray-200">
          <ul className="flex flex-col divide-y divide-gray-100">
            <li>
              <Link
                href="/recipes"
                className="block px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                All Recipes
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
