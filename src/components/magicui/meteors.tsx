import type { CSSProperties } from 'react';

type MeteorsProps = {
  number?: number;
};

export function Meteors({ number = 18 }: MeteorsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: number }, (_, index) => {
        const left = 6 + ((index * 37) % 94);
        const delay = (index * 0.43) % 5;
        const duration = 3.6 + ((index * 17) % 24) / 10;

        return (
          <span
            className="meteor"
            key={index}
            style={
              {
                '--meteor-left': `${left}%`,
                '--meteor-delay': `${delay}s`,
                '--meteor-duration': `${duration}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
