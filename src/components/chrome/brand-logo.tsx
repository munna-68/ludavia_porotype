'use client';

import Image from 'next/image';
import { useThemeMode } from '@/components/providers/app-providers';

export function BrandLogo() {
  const { mode } = useThemeMode();

  return (
    <Image
      src="/LudaVia_Purple_Logo_Vector%20(1).svg"
      alt="LudaVia"
      width={1024}
      height={625}
      priority
      className={`brand-logo${mode === 'dark' ? ' brand-logo--dark' : ''}`}
    />
  );
}
