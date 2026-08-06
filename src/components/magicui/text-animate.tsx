'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  fadeUpContainerVariants,
  fadeUpTransition,
  fadeUpVariants,
  reducedMotionTransition,
} from '@/lib/motion';

type TextAnimateProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function TextAnimate({ children, className, delay = 0 }: TextAnimateProps) {
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      aria-label={text || undefined}
      className={cn('inline-flex flex-wrap gap-x-[0.28em]', className)}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUpContainerVariants}
      transition={shouldReduceMotion ? reducedMotionTransition : { ...fadeUpTransition, delay }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          variants={fadeUpVariants}
          transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
