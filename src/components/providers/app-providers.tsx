'use client';

import { ThemeProvider, useTheme } from 'next-themes';

export type ThemeMode = 'light' | 'dark';

export const THEME_MODE_STORAGE_KEY = 'ludavia-theme-mode';

export function useThemeMode() {
  const { theme, setTheme } = useTheme();

  return {
    mode: (theme === 'light' ? 'light' : 'dark') as ThemeMode,
    setMode: setTheme,
  };
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey={THEME_MODE_STORAGE_KEY}>
      {children}
    </ThemeProvider>
  );
}
