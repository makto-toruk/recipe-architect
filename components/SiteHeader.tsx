"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import Logo from "@/components/Logo";

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

interface SiteHeaderProps {
  onFocusModeToggle?: (enabled: boolean) => void;
  focusModeEnabled?: boolean;
}

export default function SiteHeader({
  onFocusModeToggle,
  focusModeEnabled = false,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [themeHovered, setThemeHovered] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Check if we're on a recipe page (not homepage or recipes list)
  const isRecipePage =
    pathname?.startsWith("/recipes/") && pathname !== "/recipes";

  const handleFocusModeToggle = () => {
    const newState = !focusModeEnabled;
    onFocusModeToggle?.(newState);
  };

  return (
    <header
      className="w-full flex items-center px-4 py-3 relative transition-colors border-b"
      style={{
        backgroundColor: focusModeEnabled
          ? 'var(--color-cream-light)'
          : 'var(--color-cream-lightest)',
        borderColor: focusModeEnabled
          ? 'var(--color-burnt-orange)'
          : 'var(--color-border-subtle)',
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <Logo width={64} height={64} />
        <span className={`${dancing.className} text-2xl leading-none`}>
          Cafe&nbsp;TM
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          aria-pressed={theme === "dark"}
          className="p-2 rounded-md transition-colors focus:outline-none"
          style={{
            backgroundColor: themeHovered ? 'var(--color-cream-light)' : 'transparent',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={() => setThemeHovered(true)}
          onMouseLeave={() => setThemeHovered(false)}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Focus Mode Button - only on recipe pages */}
        {isRecipePage && (
          <button
            onClick={handleFocusModeToggle}
            className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            aria-pressed={focusModeEnabled}
            style={{
              backgroundColor: focusModeEnabled
                ? 'var(--color-burnt-orange)'
                : 'var(--color-cream)',
              color: focusModeEnabled ? 'white' : 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (focusModeEnabled) {
                e.currentTarget.style.backgroundColor = 'var(--color-burnt-orange-dark)';
              } else {
                e.currentTarget.style.backgroundColor = 'var(--color-cream-light)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = focusModeEnabled
                ? 'var(--color-burnt-orange)'
                : 'var(--color-cream)';
            }}
          >
            {focusModeEnabled ? "Exit Focus" : "Focus Mode"}
          </button>
        )}

        {/* Hamburger */}
        <button
          aria-label="Toggle navigation"
          className="p-2 focus:outline-none"
          style={{ color: 'var(--color-text-secondary)' }}
          onClick={() => setOpen((p) => !p)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Slide-down menu */}
      {open && (
        <nav
          className="absolute top-full right-4 mt-2 w-40 rounded-lg shadow-lg ring-1"
          style={{
            backgroundColor: 'var(--color-cream-lightest)',
            borderColor: 'var(--color-border-subtle)',
          }}
        >
          <ul className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <li>
              <Link
                href="/recipes"
                className="block px-4 py-2 text-sm transition-colors rounded-t-lg"
                style={{ color: 'var(--color-text-primary)' }}
                onClick={() => setOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-cream-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                All Recipes
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block px-4 py-2 text-sm transition-colors rounded-b-lg"
                style={{ color: 'var(--color-text-primary)' }}
                onClick={() => setOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-cream-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
