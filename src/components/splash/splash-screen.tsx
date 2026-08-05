'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { AppHeader } from '@/components/chrome/app-header';
import { Globe } from '@/components/ui/globe';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TextAnimate } from '@/components/magicui/text-animate';

export function SplashScreen() {
  const router = useRouter();

  return (
    <main className="splash-page relative min-h-[100dvh] overflow-hidden text-warm">
      <div className="noise-layer" />
      <div className="dot-layer" />

      <section className="splash-frame relative isolate mx-auto flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/15 sm:rounded-[2rem]">
        <AppHeader />

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
          <ShimmerButton
            type="button"
            onClick={() => router.push('/form')}
            background="rgba(6, 6, 7, 0.9)"
            borderRadius="999px"
            shimmerColor="rgba(255, 255, 255, 0.7)"
            shimmerDuration="4s"
            shimmerSize="0.04em"
            className="splash-cta w-full border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_90px_rgba(240,130,38,0.2)] hover:border-white/65"
          >
            <span className="splash-cta__content">
              <span>Begin your journey</span>
              <ArrowRight className="splash-cta__arrow h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.5} aria-hidden="true" />
            </span>
          </ShimmerButton>
        </div>
      </section>
    </main>
  );
}
