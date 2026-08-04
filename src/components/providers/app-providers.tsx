'use client';

import { Theme } from '@astryxdesign/core/theme';
import { ludaviaTheme } from '@/lib/ludavia';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={ludaviaTheme} mode="dark">
      {children}
    </Theme>
  );
}
