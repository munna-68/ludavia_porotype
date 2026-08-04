'use client';

import { Switch } from '@astryxdesign/core/Switch';
import { useThemeMode } from '@/components/providers/app-providers';

export function ThemeToggle() {
  const { mode, setMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Switch
      label="Dark mode"
      value={isDark}
      size="md"
      onChange={(checked) => setMode(checked ? 'dark' : 'light')}
    />
  );
}
