import { ArrowRight } from 'lucide-react';
import { AppHeader } from '@/components/chrome/app-header';
import { Globe } from '@/components/magicui/globe';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { TextAnimate } from '@/components/magicui/text-animate';

export function SplashScreen() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink px-4 py-4 text-warm sm:px-8 sm:py-7">
      <div className="noise-layer" />
      <div className="dot-layer" />

      <section className="relative isolate mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-[72rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0a0a0d]/70 sm:min-h-[calc(100dvh-3.5rem)] sm:rounded-[2rem]">
        <AppHeader />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.08),transparent_62%)]" />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 pb-44 pt-36 text-center sm:px-10 sm:pb-48 sm:pt-44">
          <p className="mb-6 text-[0.65rem] font-medium uppercase tracking-[0.34em] text-white/35 sm:text-xs">A clearer view of what comes next</p>
          <h1 className="max-w-3xl font-sans text-[clamp(3.9rem,10.5vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.085em] text-white">
            <TextAnimate>Begin your</TextAnimate>
            <span className="mt-2 block bg-gradient-to-br from-[#ffb15d] via-[#f08226] to-[#b8510d] bg-clip-text text-transparent sm:mt-3">journey.</span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-white/60 sm:text-xl sm:leading-8">A focused snapshot for the next meaningful move.</p>
        </div>

        <Globe className="pointer-events-none absolute -bottom-[31%] left-1/2 z-0 w-[128%] max-w-[66rem] -translate-x-1/2 text-white sm:-bottom-[42%] sm:w-[92%]" label="A dotted globe with illuminated connection points" />

        <div className="absolute inset-x-6 bottom-7 z-20 sm:inset-x-1/2 sm:w-[min(80%,42rem)] sm:-translate-x-1/2">
          <ShimmerButton href="/form" className="w-full border-white/35 bg-black/30 px-7 py-3 text-lg shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_18px_70px_rgba(240,130,38,0.2)] hover:border-white/60 hover:bg-black/55 sm:text-xl">
            <span>Begin your journey</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1 sm:h-10 sm:w-10">
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </ShimmerButton>
        </div>
      </section>
    </main>
  );
}
