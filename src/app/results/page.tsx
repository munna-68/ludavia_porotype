import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';

export default function ResultsPlaceholderPage() {
  return (
    <main className="results-placeholder">
      <section className="results-placeholder__content">
        <Heading level={1} className="results-placeholder__title">
          Your snapshot is on the way.
        </Heading>
        <Text as="p" type="large" color="secondary" textWrap="balance">
          The results view is being built next — your details are saved in this tab.
        </Text>
      </section>
    </main>
  );
}
