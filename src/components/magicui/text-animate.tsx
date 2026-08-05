'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TextAnimateProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function TextAnimate({ children, className, delay = 0 }: TextAnimateProps) {
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  return (
    <motion.span
      aria-label={text || undefined}
      className={cn('inline-flex flex-wrap gap-x-[0.28em]', className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.045,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
