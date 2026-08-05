import { HStack } from '@astryxdesign/core/HStack';
import { BrandLogo } from '@/components/chrome/brand-logo';
import { ThemeToggle } from '@/components/chrome/theme-toggle';

export function AppHeader() {
  return (
    <header className="app-header">
      <HStack
        className="app-header__inner"
        hAlign="between"
        vAlign="center"
        paddingInline={4}
        paddingBlock={3}
      >
        <BrandLogo />
        <ThemeToggle />
      </HStack>
    </header>
  );
}
