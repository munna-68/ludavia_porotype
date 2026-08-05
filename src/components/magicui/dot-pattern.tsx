'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type DotPatternProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  glow?: boolean;
};

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width: measuredWidth, height: measuredHeight } = containerRef.current.getBoundingClientRect();
      setDimensions({ width: measuredWidth, height: measuredHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const columns = Math.ceil(dimensions.width / width);
  const dots = Array.from({ length: columns * Math.ceil(dimensions.height / height) }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);

    return {
      x: column * width + cx + x,
      y: row * height + cy + y,
      delay: ((index * 37) % 500) / 100,
      duration: 2 + ((index * 17) % 30) / 10,
    };
  });

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot) => (
        <motion.circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={glow ? `url(#${id}-gradient)` : 'currentColor'}
          initial={glow ? { opacity: 0.35, scale: 1 } : undefined}
          animate={glow ? { opacity: [0.35, 1, 0.35], scale: [1, 1.5, 1] } : undefined}
          transition={
            glow
              ? { duration: dot.duration, repeat: Infinity, repeatType: 'reverse', delay: dot.delay, ease: 'easeInOut' }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
