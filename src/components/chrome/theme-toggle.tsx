'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const nextMode = mounted && resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="icon-button inline-flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition hover:bg-white/[0.07] hover:text-white"
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
      onClick={() => setTheme(nextMode)}
    >
      <Sun className="h-6 w-6 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-6 w-6 dark:block" aria-hidden="true" />
    </button>
  );
}
