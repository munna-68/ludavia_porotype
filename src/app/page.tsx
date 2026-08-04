import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";

export default function Home() {
  return (
    <main>
      <VStack gap={4} padding={8} maxWidth={640} align="start">
        <Card padding={4} width="100%">
          <VStack gap={2} align="start">
            <Heading level={1}>LudaVia</Heading>
            <Text type="body">Prototype scaffold</Text>
            <Button label="Primary action" variant="primary" />
          </VStack>
        </Card>
      </VStack>
    </main>
  );
}
