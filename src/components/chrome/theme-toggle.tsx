'use client';

import { useThemeMode } from '@/components/providers/app-providers';

export function ThemeToggle() {
  const { mode, setMode } = useThemeMode();
  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      data-mode={mode}
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
      onClick={() => setMode(nextMode)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle className="theme-toggle__sun" cx="12" cy="12" r="3.5" />
        <path className="theme-toggle__rays" d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2M5.47 5.47l1.42 1.42M17.11 17.11l1.42 1.42M18.53 5.47l-1.42 1.42M6.89 17.11l-1.42 1.42" />
        <path className="theme-toggle__moon" d="M19.2 15.25A7.5 7.5 0 0 1 8.75 4.8a7.5 7.5 0 1 0 10.45 10.45Z" />
      </svg>
    </button>
  );
}
