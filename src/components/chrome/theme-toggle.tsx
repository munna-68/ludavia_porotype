'use client';

import { useThemeMode } from '@/components/providers/app-providers';

export function ThemeToggle() {
  const { mode, setMode } = useThemeMode();
  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${nextMode} mode`}
      onClick={() => setMode(nextMode)}
    >
      {mode === 'dark' ? 'Light mode' : 'Dark mode'}
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {mode === 'dark' ? (
          <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.35 6.35l1.4 1.4M16.25 16.25l1.4 1.4M17.65 6.35l-1.4 1.4M7.75 16.25l-1.4 1.4M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
        ) : (
          <path d="M19 15.5A7.5 7.5 0 0 1 8.5 5 7.5 7.5 0 1 0 19 15.5Z" />
        )}
      </svg>
    </button>
  );
}
