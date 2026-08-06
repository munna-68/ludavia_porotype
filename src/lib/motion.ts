import type { Transition, Variants } from 'framer-motion';

export const LUDAVIA_MOTION_EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUpTransition: Transition = {
  duration: 0.52,
  ease: LUDAVIA_MOTION_EASE,
};

export const reducedMotionTransition: Transition = {
  duration: 0,
};

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const fadeUpContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.045,
    },
  },
};
