# LudaVia Design System

This document is the implementation contract for the LudaVia visual language. Read it before changing or adding UI. The form journey is the primary reference screen; the review/results screen is the same journey continued, not a separate product surface.

If a reference image conflicts with this document, use the image for composition and this document for typography, spacing, color, interaction, and responsive behavior. Do not invent a third visual direction.

## Design Direction

LudaVia is a calm, dark-first product experience with an editorial, observatory-like feel. It should feel quiet, focused, and premium:

- Near-black surfaces
- Warm white typography
- One restrained purple accent
- Fine atmospheric texture
- Generous but controlled vertical rhythm
- Clear, low-friction progression through a short journey

This is not a marketing dashboard. Avoid dense navigation, decorative badges, loud effects, generic cards, and unnecessary controls.

## Source Of Truth

Use these existing screens and classes as the visual reference instead of approximating them from memory:

- Splash: `SplashScreen`, `.splash-page`, `.splash-frame`, `.splash-heading`, `.splash-cta`
- Journey header: `.form-header`, `.form-back`, `.form-progress`, `.progress-segment`, `.form-step-count`
- Journey detail copy: `.onboarding-heading`, `.onboarding-eyebrow`, `.onboarding-hint`
- Journey action: `.onboarding-action`, `.onboarding-action__arrow`
- Review shell: `.snapshot-page`, `.snapshot-body`, `.snapshot-card`, `.snapshot-row`, `.snapshot-edit`

Prefer these existing classes and variables over creating route-specific equivalents. If a new route needs the same pattern, reuse the existing class or extract one shared primitive rather than copying and changing its values.

## Color

Use the existing CSS variables. Do not introduce route-specific color values or a second accent palette.

### Dark mode

- Page background: `var(--ink)` / `#080809`
- Primary frame: `var(--splash-frame-bg)` / `#0a0a0d`
- Raised surface: `var(--panel-raised)` / `#15151b`
- Primary text: `var(--warm)` / `#f3f1ed`
- Muted text: `var(--muted)` / `#9898a3`
- Subtle text: `var(--subtle)` / `#686873`
- Brand purple: `var(--violet)` / `#4e1d8e`
- Bright purple: `var(--violet-bright)` / `#a46dff`
- Soft purple: `var(--violet-soft)` / `rgba(164, 109, 255, 0.14)`
- Quiet border: `var(--line)` / `rgba(255, 255, 255, 0.12)`

### Light mode

Light mode is a designed alternate, not an inversion filter. Preserve the same hierarchy and contrast:

- Page background: `var(--ink)` / `#f3f1ed`
- Surface: `var(--panel)` / `#fbfaf8`
- Primary text: `var(--warm)` / `#16141a`
- Muted text: `var(--muted)` / `#66636c`
- Bright purple: `var(--violet-bright)` / `#6d3bc3`

Purple is reserved for progress, eyebrow text, selected states, accent words, icons, and focused/active controls. Do not add orange, blue, neon, or purple page surfaces.

## Typography

### Family

- Product body and headings use `var(--font-body)`: `Avenir Next`, then `Helvetica Neue`, Arial, sans-serif.
- Use the `font-sans` utility or `var(--font-body)` for form, review, and results content.
- Do not add a font dependency.
- Do not use `font-display`, Georgia, or a novelty serif for the product-flow headings. The review heading must look like the form heading.

### Journey heading scale

These values are canonical. Do not create a new clamp for a single route:

- First/hero form heading: `clamp(2.25rem, 7.5vw, 4.75rem)`, weight 600, line-height `0.98`, tracking `-0.045em`
- Detail and review heading: `clamp(2.75rem, 9vw, 4.75rem)`, weight 600, line-height `0.98`, tracking `-0.06em`
- Review `Check your` and `snapshot.` use the detail/review scale exactly.
- Accent words use `text-violet-gradient`; neutral words use `var(--form-text)`.
- Keep heading lines as separate semantic spans so wrapping and glyph height stay stable.
- Keep descenders fully visible. Never use a compressed line box that clips `g`, `j`, or `y`.

### Supporting type

- Eyebrow: `0.68rem`, weight 600, uppercase, letter-spacing `0.28em`, line-height `1`
- Supporting copy: `clamp(0.95rem, 1.25vw, 1.08rem)`, line-height `1.5`, max-width `38ch`, color `var(--form-muted)` / `var(--muted)`
- Field labels: small uppercase labels with positive tracking, visually secondary to values
- Values and controls: use the body family, normal/medium weight, never gradient-filled
- Edit labels: solid `var(--violet-bright)`. Never apply `text-violet-gradient` to `Edit`, row labels, or utility text.

## Shared Page Geometry

### App shell

- Journey and review pages use a full-width `min-height: 100dvh` near-black canvas.
- Use one centered shell with a maximum width around `72rem`.
- Do not add an extra rounded, bordered desktop frame around the form or review route.
- The splash is the only route with a distinct rounded frame and outer page gutter.
- Preserve `overflow-x: hidden` and verify there is no horizontal scroll at mobile widths.

### Content column

- Journey detail content is centered in a column no wider than `48rem`.
- Review content should use the same visual column as journey detail content, approximately `46-48rem`.
- Mobile horizontal content padding must never be less than `1.25rem`.
- When matching the form detail layout, use the established gutter: `clamp(1.25rem, 6vw, 4rem)`.
- Do not let cards or buttons touch the viewport edge unless the design explicitly calls for a full-bleed surface.

### Vertical rhythm

- Journey headers use `.form-header` and its existing `5rem` minimum height.
- Detail/review copy starts after the header with `clamp(2.75rem, 6vh, 4.5rem)` top padding.
- Eyebrow -> heading spacing comes from `.onboarding-eyebrow`.
- Heading -> supporting copy spacing comes from `.onboarding-hint`.
- Detail fields begin with approximately `1.8rem` spacing after the supporting copy.
- Review rows begin at the same vertical position as the form detail fields when the header and heading content are the same.
- Do not move a heading upward to make a later card fit; reduce unnecessary decoration or content before breaking the shared rhythm.

## Splash Screen

The splash is the one intentionally distinct composition:

- Use the centered `.splash-frame` with its outer gutter and rounded frame.
- Keep the `LUDAVIA` wordmark and borderless theme control in the splash `AppHeader`.
- Center the hero copy with generous space above it.
- Use the dotted globe as the single visual anchor below the copy.
- Use one wide `ShimmerButton` CTA to enter `/form`.
- Do not add product navigation, pricing, account controls, or extra marketing sections.

## Journey Header

The form and review header are one component pattern. Keep the geometry identical across every step:

- Back control on the left using `.form-back`, with an accessible label
- Five horizontal progress segments using `.progress-segment`
- Completed segments use `var(--violet-bright)` and the existing glow
- Current step count on the right using `.form-step-count`
- Review uses `Step 5 of 5`; do not invent a different header arrangement for the final screen
- Do not add the LUDAVIA wordmark, theme toggle, menu, or extra navigation to the journey header
- The wordmark and theme toggle belong to the splash `AppHeader` only unless the product owner explicitly changes the shared shell

## Review Screen

The review screen is a final step in the form journey. It must feel like the next form step, not a dashboard or a results redesign.

- Use `.snapshot-page` with the same dark canvas and subtle dot/noise texture as the form
- Use the shared journey header
- Use the detail/review heading scale exactly
- Use `.onboarding-hint` for the subheading so its color, size, and line-height match the form
- Keep one dense bordered surface containing the six profile rows
- Use direct purple line icons; do not add decorative icon circles inside the row surface
- Preserve the row dividers and quiet surface treatment
- Use a fixed-width end column for the edit action so `Edit` and the arrow never overlap or clip
- Keep `Edit` a solid purple label with a separate muted arrow
- The primary review CTA is `.onboarding-action`, not `ShimmerButton`
- The review CTA has a thin quiet border, dark fill, left-aligned label, and a simple right arrow
- Do not place a filled purple circle behind the review CTA arrow
- Keep the CTA width aligned with the review card and the same vertical dimensions as the form action

## Controls And Surfaces

### Journey action

Use `.onboarding-action` for Continue and See opportunities:

- Full-width rounded pill
- Thin `rgba(255, 255, 255, 0.35)` border in dark mode
- Dark translucent fill
- Left-aligned label
- Plain arrow inside `.onboarding-action__arrow` on the right
- Minimum height `4.25rem` for detail/review actions
- Hover changes border/background and nudges the arrow; pressed state moves down slightly

The splash CTA is the only existing exception. It may use `ShimmerButton` because it is the entrance moment, not a form progression control.

### Rows and fields

- Dense profile data uses rows, not nested cards.
- Review rows use quiet dividers, approximately `3.7rem` minimum height, and a single shared surface.
- Keep a stable column order: icon -> label -> value -> action.
- Values may truncate, but labels and actions must remain visible.
- Preserve the existing choice-card/select/input treatments from the form.
- Use border, surface, and text variables instead of new one-off colors.

### Shape

- Use one rounded container for a related group.
- Use tighter radii for fields and row surfaces, full pill radius only for primary actions, and avoid rounding every nested element.
- Do not wrap every row in a card or add generic shadows to flat data.

## Texture And Motion

- Use the existing noise layer and sparse dot pattern as atmosphere.
- Texture must remain subordinate to copy and controls.
- The globe is the primary visual anchor on the splash and first form step; do not add competing illustrations.
- Animate entrance with opacity and transform only.
- Keep motion subtle and preserve the existing easing vocabulary.
- Respect `prefers-reduced-motion`.
- Do not animate layout properties such as top, left, width, height, padding, or margin.

## Responsive Rules

- Design mobile first and test at `390px`, `443px`, `456px`, `768px`, and `1280px` widths.
- Keep the same heading scale relationship at every width; do not make review headings smaller just because the content below is dense.
- Keep the content gutter visible on both sides at mobile widths.
- Keep labels, values, and edit actions readable without horizontal scrolling.
- If a row becomes too narrow, truncate the value before shrinking the label or edit column.
- The first viewport should show the heading, supporting copy, and the beginning of the primary content without excessive empty space.

## Accessibility And Interaction

- Every icon-only button needs an accessible label.
- Preserve visible focus rings using the existing purple focus treatment.
- Buttons must have hover, active, disabled, and focus-visible states.
- Do not use dead `#` links or controls with no behavior.
- Keep edit actions keyboard reachable and give them field-specific accessible names.
- Use live regions only for content that changes after an interaction, such as the opportunity reveal.

## Agent Workflow

Before writing UI:

1. Read this file and the nearest existing screen/component.
2. Identify which shared primitive owns the behavior and visual treatment.
3. Reuse the primitive and its CSS before adding a new class.
4. If a new class is necessary, use existing variables and match the nearest computed values.

Before finishing:

1. Compare heading font family, font size, weight, line-height, color, and top position against the nearest form screen.
2. Compare supporting copy color, size, line-height, width, and top position.
3. Compare header back control, progress segments, and step count placement.
4. Compare card/button left and right edges and vertical dimensions.
5. Confirm every edit label is fully visible and not covered by its arrow.
6. Check dark and light mode if the route supports both.
7. Check mobile widths for horizontal overflow.
8. Run `npm run lint`, `npm run typecheck`, and `npm run build`.

## Avoid

- Do not create a second typography system for a new route.
- Do not use a serif or novelty font for form/review headings.
- Do not use a different header layout for the review screen.
- Do not use `ShimmerButton` for form or review progression.
- Do not put a purple gradient on utility labels such as `Edit`.
- Do not use a filled purple CTA arrow where the form uses a plain arrow.
- Do not make content edge-to-edge on mobile.
- Do not add a second accent color.
- Do not add gradients to large page surfaces or turn the page purple.
- Do not use generic dashboard layouts, card stacks, badges, or decorative controls.
- Do not “fix” vertical fit by shrinking a shared heading or clipping its line-height.
