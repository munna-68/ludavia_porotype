'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { LinkProvider } from '@astryxdesign/core/Link';
import { Theme } from '@astryxdesign/core/theme';
import { ludaviaTheme } from '@/lib/ludavia';

export type ThemeMode = 'light' | 'dark';

export const THEME_MODE_STORAGE_KEY = 'ludavia-theme-mode';

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'dark',
  setMode: () => undefined,
});

const listeners = new Set<() => void>();

function readStoredMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // Ignore storage failures and keep the dark presentation default.
  }
  return 'dark';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, readStoredMode, () => 'dark' as ThemeMode);

  const setMode = (next: ThemeMode) => {
    try {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures and keep the current in-memory mode.
    }
    listeners.forEach((listener) => listener());
  };

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <LinkProvider component={Link}>
        <Theme theme={ludaviaTheme} mode={mode}>
          {children}
        </Theme>
      </LinkProvider>
    </ThemeModeContext.Provider>
  );
}
