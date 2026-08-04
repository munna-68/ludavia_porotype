import { ThemeToggle } from '@/components/chrome/theme-toggle';

export function MenuButton() {
  return (
    <details className="app-menu">
      <summary aria-label="Open menu">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 8.5h14M5 15.5h14" />
        </svg>
      </summary>
      <aside className="app-menu__panel" aria-label="Appearance settings">
        <ThemeToggle />
      </aside>
    </details>
  );
}
