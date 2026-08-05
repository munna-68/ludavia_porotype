# LudaVia Design System

This document is the visual source of truth for the LudaVia investor prototype. Read it before changing any UI. Extend the existing language instead of inventing a new visual direction.

## Direction

LudaVia is a calm, dark-first product experience with an editorial, observatory-like feel. The interface should feel quiet, focused, and premium: near-black surfaces, warm white typography, restrained purple emphasis, soft atmospheric light, and one strong visual anchor.

The design is not a marketing dashboard. Avoid clutter, loud effects, dense navigation, decorative badges, and unnecessary cards.

## Color

### Dark mode

- Page background: `#080809`
- Primary frame: `#0a0a0d`
- Raised surface: `#15151b`
- Warm primary text: `#f3f1ed`
- Muted text: `#9898a3`
- Subtle text: `#686873`
- Brand purple: `#4e1d8e`
- Bright purple: `#a46dff`
- Soft purple: `rgba(164, 109, 255, 0.14)`
- Quiet border: `rgba(255, 255, 255, 0.12)`

### Light mode

Light mode is a designed alternate, not an inversion filter.

- Page background: `#f3f1ed`
- Primary frame: `#faf9fb`
- Primary text: `#16141a`
- Muted text: `#66636c`
- Brand purple remains the same family, with `#6d3bc3` as the bright light-mode value.

Use the existing CSS variables and theme system rather than introducing route-specific color values. Purple is a sparse accent for the logo treatment, key emphasis, active states, and primary actions. Do not introduce orange, blue, neon, or a second brand accent.

## Typography

- Body and display family: `Avenir Next`, falling back to `Helvetica Neue`, `Arial`, and sans-serif.
- Do not add a new font dependency or replace the current family with a novelty/display font.
- Large headings use tight negative tracking and a medium weight for the neutral line.
- The `journey.` line is slightly heavier than `Begin your` and uses the purple gradient.
- Supporting copy is warm gray, medium weight, and short in width.
- Keep descenders fully visible. Do not use compressed line boxes that clip `g`, `j`, or `y`.
- The hero heading uses two separate semantic span lines so line spacing and glyph height can be controlled independently.

### Hero heading treatment

- `Begin your`: warm white gradient from `#ffffff` at the top toward `rgba(255, 255, 255, 0.48)` at the bottom.
- `journey.`: gradient from bright purple toward brand purple.
- The two lines should sit close together, almost touching without overlapping.
- Keep the `journey.` line slightly bolder than the first line.
- Apply text gradients with `background-clip: text` and preserve the existing compact composition.

## Layout

- Dark mode is the presentation default.
- The splash frame is centered, near-black, and fills the viewport without forcing initial scroll.
- Header: `LUDAVIA` wordmark on the left and a small borderless theme control on the right.
- Do not add a menu, mega-navigation, account controls, or unavailable product links to the splash header.
- Keep the logo letter spacing restrained and tighter than a typical wide-tracked wordmark.
- Hero copy is centered with generous space above it.
- The dotted globe is the sole primary visual anchor and sits below the copy, partially extending below the first viewport.
- The CTA is a single wide, pill-shaped action that routes to `/form`.
- Form Continue actions use a quiet rounded rectangle with a thin border, left-aligned label, and a glowing purple circular arrow on the right. Do not use the splash shimmer treatment for form progression.
- Preserve comfortable mobile gutters and avoid horizontal overflow.

## Visual Texture

- Use the existing fine noise layer, sparse dot field, and soft radial light.
- Keep texture subtle. It should add atmosphere, not compete with the copy.
- The globe remains a white dotted Cobe/Magic UI visual with purple location markers and a soft white glow.
- Do not replace the globe with a flat illustration or recolor its markers to orange.

## Interaction And Motion

- Theme defaults to dark, persists with `ludavia-theme-mode`, and toggles between only light and dark.
- Use the existing animated theme toggler with the controlled `next-themes` integration.
- The theme control must remain borderless, keyboard accessible, and visibly focused.
- Keep hero text entrance motion subtle and respect `prefers-reduced-motion`.
- Preserve the globe's gentle autorotation and pointer interaction.
- Use transforms and opacity for motion; do not animate layout properties unnecessarily.

## Component Rules

- Prefer existing components and CSS variables before creating new primitives.
- Keep the header minimal and consistent across routes.
- Use semantic HTML and accessible names for icon-only controls.
- Preserve the established Astryx and local component conventions.
- Read the relevant component implementation before changing its API.

## Avoid

- Do not change the Avenir-based typography direction.
- Do not replace purple with orange or add a new accent palette.
- Do not add a menu to the home header.
- Do not add borders to the theme toggle.
- Do not tighten line-height enough to clip glyphs.
- Do not add gradients to large page surfaces or turn the page purple.
- Do not add generic dashboard patterns, card stacks, or decorative UI that is not part of the product flow.
