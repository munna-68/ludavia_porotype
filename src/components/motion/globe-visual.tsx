type GlobeVisualProps = {
  className?: string;
  label?: string;
};

const DOTS = [
  [400, 162],
  [347, 170],
  [454, 173],
  [302, 190],
  [504, 194],
  [264, 222],
  [544, 228],
  [235, 260],
  [573, 270],
  [215, 307],
  [594, 317],
  [205, 356],
  [605, 365],
  [204, 406],
  [606, 408],
  [213, 456],
  [596, 457],
  [229, 505],
  [582, 501],
  [252, 549],
  [557, 545],
  [284, 586],
  [523, 582],
  [323, 615],
  [483, 609],
  [365, 630],
  [442, 626],
  [348, 247],
  [405, 225],
  [462, 247],
  [324, 294],
  [398, 276],
  [478, 299],
  [298, 355],
  [381, 340],
  [476, 359],
  [306, 423],
  [397, 404],
  [492, 429],
  [333, 486],
  [417, 469],
  [515, 488],
  [367, 545],
  [443, 532],
  [492, 549],
] as const;

export function GlobeVisual({ className, label }: GlobeVisualProps) {
  const classes = ['globe-visual', className].filter(Boolean).join(' ');

  return (
    <figure className={classes} aria-label={label} aria-hidden={label ? undefined : true} role={label ? 'img' : undefined}>
      <svg viewBox="0 0 800 800" focusable="false">
        <g className="globe-visual__orbit-lines" fill="none" stroke="currentColor">
          <ellipse cx="400" cy="400" rx="360" ry="146" />
          <ellipse cx="400" cy="400" rx="360" ry="235" />
          <ellipse cx="400" cy="400" rx="146" ry="360" />
          <ellipse cx="400" cy="400" rx="235" ry="360" />
        </g>

        <g className="globe-visual__sphere">
          <circle className="globe-visual__core" cx="400" cy="400" r="254" />
          <circle className="globe-visual__shell" cx="400" cy="400" r="254" fill="none" stroke="currentColor" />
          <ellipse className="globe-visual__latitude" cx="400" cy="400" rx="254" ry="92" fill="none" stroke="currentColor" />
          <ellipse className="globe-visual__latitude" cx="400" cy="400" rx="254" ry="168" fill="none" stroke="currentColor" />
          <ellipse className="globe-visual__longitude" cx="400" cy="400" rx="92" ry="254" fill="none" stroke="currentColor" />
          <ellipse className="globe-visual__longitude" cx="400" cy="400" rx="168" ry="254" fill="none" stroke="currentColor" />

          <g className="globe-visual__dots">
            {DOTS.map(([cx, cy], index) => (
              <circle
                className={index % 11 === 0 ? 'globe-visual__dot globe-visual__dot--accent' : 'globe-visual__dot'}
                cx={cx}
                cy={cy}
                key={`${cx}-${cy}`}
                r={index % 5 === 0 ? 4 : 2.5}
              />
            ))}
          </g>

          <circle className="globe-visual__signal" cx="258" cy="325" r="7" />
          <circle className="globe-visual__signal globe-visual__signal--second" cx="536" cy="451" r="6" />
        </g>
      </svg>
    </figure>
  );
}
