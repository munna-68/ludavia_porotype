'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const currentMode = mounted && resolvedTheme === 'light' ? 'light' : 'dark';

  return <AnimatedThemeToggler theme={currentMode} onThemeChange={setTheme} />;
}
