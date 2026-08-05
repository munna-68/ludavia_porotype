'use client';

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ShimmerButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

const baseClassName =
  'group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-full border border-violet-400/70 bg-[#17131f] px-6 text-left font-sans text-base font-semibold text-white shadow-[0_0_0_1px_rgba(157,104,255,0.08),0_14px_45px_rgba(82,35,139,0.2)] transition duration-300 hover:border-violet-300 hover:bg-[#211932] hover:shadow-[0_0_0_1px_rgba(157,104,255,0.2),0_16px_55px_rgba(82,35,139,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080809] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60';

function ButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative z-10 flex w-full items-center justify-between gap-5">{children}</span>
    </>
  );
}

export function ShimmerButton({ children, className, href, onClick, disabled, type = 'button' }: ShimmerButtonProps) {
  const classes = cn(baseClassName, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        <ButtonContent>{children}</ButtonContent>
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      <ButtonContent>{children}</ButtonContent>
    </button>
  );
}
