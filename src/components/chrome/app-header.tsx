'use client';

import { BrandLogo } from '@/components/chrome/brand-logo';
import { ThemeToggle } from '@/components/chrome/theme-toggle';

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner mx-auto flex w-full max-w-[72rem] items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <BrandLogo />
        <div className="relative flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
