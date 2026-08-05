import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { GlobeVisual } from '@/components/motion/globe-visual';

export function SplashScreen() {
  return (
    <main className="splash">
      <GlobeVisual className="splash__globe" label="An orbiting globe representing a clearer view of what comes next" />
      <Text as="p" type="label" color="secondary" className="splash__orbit-copy" aria-hidden="true">
        focus / connect / grow /
      </Text>

      <section className="splash__hero" aria-labelledby="splash-title">
        <Heading level={1} id="splash-title" className="splash__title" textWrap="balance">
          Begin your <em>journey.</em>
        </Heading>
        <Text type="large" color="secondary" as="p" className="splash__description" textWrap="balance">
          A clear view of what comes next.
        </Text>
        <Button
          href="/form"
          label="Begin your journey"
          variant="primary"
          size="lg"
          className="splash__cta"
          endContent={
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          }
        />
      </section>
    </main>
  );
}
