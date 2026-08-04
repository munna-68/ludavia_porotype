'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
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
    // ignore storage failures
  }
  return 'dark';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
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
      // ignore storage failures
    }
    listeners.forEach((listener) => listener());
  };

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <Theme theme={ludaviaTheme} mode={mode}>
        {children}
      </Theme>
    </ThemeModeContext.Provider>
  );
}
