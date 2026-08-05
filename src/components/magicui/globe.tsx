'use client';

import { motion } from 'framer-motion';

type GlobeProps = {
  className?: string;
  label?: string;
};

const DOTS = [
  [400, 166], [360, 172], [442, 174], [320, 186], [482, 190], [286, 207], [518, 214],
  [262, 238], [548, 247], [242, 270], [566, 282], [228, 307], [579, 318], [222, 350],
  [588, 361], [220, 396], [590, 405], [226, 442], [584, 451], [242, 486], [568, 492],
  [264, 528], [544, 532], [292, 565], [516, 567], [324, 596], [482, 595], [360, 616],
  [446, 615], [338, 238], [374, 220], [414, 220], [454, 238], [306, 272], [352, 260],
  [400, 248], [450, 262], [500, 278], [278, 319], [330, 307], [386, 292], [444, 304],
  [504, 322], [268, 364], [318, 352], [370, 340], [430, 348], [486, 362], [540, 374],
  [270, 414], [322, 402], [378, 390], [438, 402], [494, 418], [544, 430], [284, 460],
  [338, 450], [396, 438], [454, 452], [510, 466], [306, 504], [360, 492], [416, 482],
  [470, 496], [518, 510], [342, 540], [394, 528], [446, 538], [486, 548],
] as const;

const SIGNALS = [
  { cx: 292, cy: 286, r: 7 },
  { cx: 474, cy: 334, r: 6 },
  { cx: 386, cy: 438, r: 8 },
  { cx: 548, cy: 462, r: 5 },
  { cx: 300, cy: 524, r: 6 },
];

export function Globe({ className, label }: GlobeProps) {
  return (
    <motion.figure
      className={className}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 800 800" className="h-full w-full overflow-visible" focusable="false">
        <defs>
          <radialGradient id="globe-core" cx="38%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#414149" stopOpacity="0.42" />
            <stop offset="48%" stopColor="#17171c" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#070708" stopOpacity="0.98" />
          </radialGradient>
          <filter id="globe-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
        </defs>
        <circle cx="400" cy="400" r="264" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="16" filter="url(#globe-glow)" />
        <circle cx="400" cy="400" r="254" fill="url(#globe-core)" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
        <g fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5">
          <ellipse cx="400" cy="400" rx="254" ry="92" />
          <ellipse cx="400" cy="400" rx="254" ry="166" />
          <ellipse cx="400" cy="400" rx="92" ry="254" />
          <ellipse cx="400" cy="400" rx="166" ry="254" />
        </g>
        <g fill="currentColor" opacity="0.72">
          {DOTS.map(([cx, cy], index) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 7 === 0 ? 4 : 2.5} />
          ))}
        </g>
        <g>
          {SIGNALS.map((signal, index) => (
            <g key={`${signal.cx}-${signal.cy}`}>
              <circle cx={signal.cx} cy={signal.cy} r={signal.r * 3.2} fill="#a66cff" opacity="0.18" />
              <circle cx={signal.cx} cy={signal.cy} r={signal.r} fill="#b27cff" opacity="0.95">
                <animate attributeName="r" values={`${signal.r};${signal.r * 1.35};${signal.r}`} dur={`${2.5 + index * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.55;1;0.55" dur={`${2.5 + index * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </g>
      </svg>
    </motion.figure>
  );
}
