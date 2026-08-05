'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Grid2X2, RotateCcw, X } from 'lucide-react';
import { BrandLogo } from '@/components/chrome/brand-logo';
import { ThemeToggle } from '@/components/chrome/theme-toggle';

export function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header__inner mx-auto flex w-full max-w-[72rem] items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <BrandLogo />
        <div className="relative flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="menu-trigger inline-flex h-12 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.025] px-4 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.07]"
            aria-expanded={open}
            aria-controls="ludavia-menu"
            onClick={() => setOpen((current) => !current)}
          >
            <span className="hidden sm:inline">Menu</span>
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Grid2X2 className="h-5 w-5" aria-hidden="true" />}
          </button>
          {open ? (
            <nav id="ludavia-menu" className="menu-popover absolute right-0 top-[calc(100%+0.75rem)] z-30 w-52 rounded-2xl border border-white/15 bg-[#131318]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl" aria-label="Menu">
              <Link href="/" className="flex items-center rounded-xl px-3 py-3 text-sm text-white/75 transition hover:bg-white/[0.07] hover:text-white" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/form" className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-white/75 transition hover:bg-white/[0.07] hover:text-white" onClick={() => setOpen(false)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Start again
              </Link>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
