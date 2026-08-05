'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const nextMode = mounted && resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="icon-button inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] text-white transition hover:border-white/35 hover:bg-white/[0.08]"
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
      onClick={() => setTheme(nextMode)}
    >
      <Sun className="h-4 w-4 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-4 w-4 dark:block" aria-hidden="true" />
    </button>
  );
}
