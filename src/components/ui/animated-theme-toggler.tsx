'use client';

import { useCallback, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TransitionVariant = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'rectangle' | 'star';

type Theme = 'light' | 'dark';

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike;
};

interface AnimatedThemeTogglerProps extends ComponentPropsWithoutRef<'button'> {
  duration?: number;
  variant?: TransitionVariant;
  fromCenter?: boolean;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

function collapsedPolygon(point: string, sides: number) {
  return `polygon(${Array.from({ length: sides }, () => point).join(', ')})`;
}

function getClipPaths(variant: TransitionVariant, x: number, y: number, radius: number, width: number, height: number) {
  const point = (pointX: number, pointY: number) => `${(pointX / width) * 100}% ${(pointY / height) * 100}%`;
  const circleRadius = `${(radius / (Math.hypot(width, height) / Math.SQRT2)) * 100}%`;

  if (variant === 'circle') {
    const center = point(x, y);
    return [`circle(0% at ${center})`, `circle(${circleRadius} at ${center})`];
  }

  if (variant === 'rectangle') {
    const halfWidth = Math.max(x, width - x);
    const halfHeight = Math.max(y, height - y);
    const corners = [
      point(x - halfWidth, y - halfHeight),
      point(x + halfWidth, y - halfHeight),
      point(x + halfWidth, y + halfHeight),
      point(x - halfWidth, y + halfHeight),
    ];
    return [collapsedPolygon(point(x, y), 4), `polygon(${corners.join(', ')})`];
  }

  if (variant === 'square') {
    const side = Math.max(x, width - x, y, height - y) * 1.05;
    const corners = [
      point(x - side, y - side),
      point(x + side, y - side),
      point(x + side, y + side),
      point(x - side, y + side),
    ];
    return [collapsedPolygon(point(x, y), 4), `polygon(${corners.join(', ')})`];
  }

  const sides = variant === 'triangle' ? 3 : variant === 'hexagon' ? 6 : 4;
  const outerRadius = radius * (variant === 'diamond' ? Math.SQRT2 : 2.2);
  const vertices = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / sides;
    return point(x + outerRadius * Math.cos(angle), y + outerRadius * Math.sin(angle));
  });

  if (variant === 'star') {
    const starVertices = Array.from({ length: 10 }, (_, index) => {
      const angle = -Math.PI / 2 + (index * Math.PI) / 5;
      const vertexRadius = index % 2 === 0 ? outerRadius : outerRadius * 0.42;
      return point(x + vertexRadius * Math.cos(angle), y + vertexRadius * Math.sin(angle));
    });
    return [collapsedPolygon(point(x, y), 10), `polygon(${starVertices.join(', ')})`];
  }

  return [collapsedPolygon(point(x, y), sides), `polygon(${vertices.join(', ')})`];
}

export function AnimatedThemeToggler({
  className,
  duration = 400,
  variant = 'circle',
  fromCenter = false,
  theme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) {
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(false);
  const isDark = isControlled ? theme === 'dark' : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => setInternalIsDark(document.documentElement.classList.contains('dark'));
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [isControlled]);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    const documentWithTransition = document as DocumentWithViewTransition;

    if (!button || isTransitioningRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const bounds = button.getBoundingClientRect();
    const x = fromCenter ? width / 2 : bounds.left + bounds.width / 2;
    const y = fromCenter ? height / 2 : bounds.top + bounds.height / 2;
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    const nextTheme = isDark ? 'light' : 'dark';

    const applyTheme = () => {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      document.documentElement.classList.toggle('light', nextTheme === 'light');

      if (isControlled) {
        onThemeChange?.(nextTheme);
      } else {
        setInternalIsDark(nextTheme === 'dark');
        localStorage.setItem('theme', nextTheme);
      }
    };

    if (typeof documentWithTransition.startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    const clipPaths = getClipPaths(variant, x, y, radius, width, height);
    const root = document.documentElement;
    root.dataset.magicuiThemeVt = 'active';
    root.style.setProperty('--magicui-theme-toggle-vt-duration', `${duration}ms`);
    root.style.setProperty('--magicui-theme-vt-clip-from', clipPaths[0]);
    isTransitioningRef.current = true;

    const cleanup = () => {
      isTransitioningRef.current = false;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty('--magicui-theme-toggle-vt-duration');
      root.style.removeProperty('--magicui-theme-vt-clip-from');
    };

    const transition = documentWithTransition.startViewTransition(() => {
      flushSync(applyTheme);
    });

    void transition.finished.then(cleanup, cleanup);
    void transition.ready
      .then(() => {
        root.animate({ clipPath: clipPaths }, {
          duration,
          easing: variant === 'star' ? 'linear' : 'ease-in-out',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        });
      })
      .catch(cleanup);
  }, [duration, fromCenter, isControlled, isDark, onThemeChange, variant]);

  return (
    <button
      {...props}
      ref={buttonRef}
      type="button"
      className={cn('theme-toggle', className)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
