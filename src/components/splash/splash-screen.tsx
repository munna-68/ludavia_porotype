import { ArrowRight } from 'lucide-react';
import { AppHeader } from '@/components/chrome/app-header';
import { Globe } from '@/components/ui/globe';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { TextAnimate } from '@/components/magicui/text-animate';

export function SplashScreen() {
  return (
    <main className="splash-page relative min-h-screen overflow-hidden bg-ink px-4 py-4 text-warm sm:px-8 sm:py-7">
      <div className="noise-layer" />
      <div className="dot-layer" />

      <section className="splash-frame relative isolate mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-[72rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0a0a0d]/70 sm:min-h-[calc(100dvh-3.5rem)] sm:rounded-[2rem]">
        <AppHeader minimal />

        <div className="splash-light pointer-events-none absolute inset-x-0 top-0 h-80" />
        <div className="splash-content relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center sm:px-10">
          <h1 className="splash-heading max-w-3xl font-sans font-medium text-white">
            <TextAnimate delay={0.15}>Begin your</TextAnimate>
            <span className="splash-heading__accent block">journey.</span>
          </h1>
          <p className="splash-subtitle max-w-md text-white/65">A clear view of what comes next.</p>
        </div>

        <Globe className="splash-globe pointer-events-auto left-1/2 z-0 -translate-x-1/2" />

        <div className="splash-cta-wrap absolute inset-x-6 z-20 sm:inset-x-1/2 sm:w-[min(74%,40rem)] sm:-translate-x-1/2">
          <ShimmerButton href="/form" className="splash-cta w-full border-white/35 bg-black/45 px-6 text-lg shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_80px_rgba(240,130,38,0.18)] hover:border-white/65 hover:bg-black/65 sm:px-9 sm:text-xl">
            <span>Begin your journey</span>
            <span className="inline-flex items-center text-white transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.5} aria-hidden="true" />
            </span>
          </ShimmerButton>
        </div>
      </section>
    </main>
  );
}
