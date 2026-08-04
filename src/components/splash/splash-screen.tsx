import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import Link from 'next/link';

export function SplashScreen() {
  return (
    <main className="splash">
      <section className="splash__hero" aria-labelledby="splash-title">
        <Heading level={1} id="splash-title" className="splash__title" textWrap="balance">
          Begin your <em>journey.</em>
        </Heading>
        <Text type="large" color="secondary" as="p" className="splash__description" textWrap="balance">
          A clear view of what comes next.
        </Text>
        <Link href="/form" className="splash__cta">
          Begin your journey
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m5.5 8 4 4-4 4M13 8l4 4-4 4" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
