"use client";

import { VoiceOrb } from "@/components/voice-orb";
import type { ParallaxOffset } from "@/lib/use-parallax";

type HeroProps = {
  parallax: ParallaxOffset;
  onStartTalking: () => void;
  onExplore: () => void;
  savedResumePoint?: boolean;
};

export function HeroSection({ parallax, onStartTalking, onExplore, savedResumePoint }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 py-16 overflow-hidden" aria-labelledby="hero-title">
      {/* Parallax Layer 4: Floating ambient text fragments */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span
          className="absolute top-[18%] left-[8%] text-xs md:text-sm font-semibold tracking-widest uppercase text-[#557C72]/30 blur-[0.6px] will-change-transform"
          style={{
            transform: parallax.isReducedMotion
              ? "none"
              : `translate3d(${parallax.mouseX * -20}px, ${parallax.mouseY * -15}px, 0)`,
          }}
        >
          take your time
        </span>
        <span
          className="absolute top-[65%] right-[10%] text-xs md:text-sm font-semibold tracking-widest uppercase text-[#A79BC8]/40 blur-[0.6px] will-change-transform"
          style={{
            transform: parallax.isReducedMotion
              ? "none"
              : `translate3d(${parallax.mouseX * 25}px, ${parallax.mouseY * 18}px, 0)`,
          }}
        >
          I&apos;m listening
        </span>
        <span
          className="absolute bottom-[15%] left-[15%] text-xs md:text-sm font-semibold tracking-widest uppercase text-[#557C72]/25 blur-[0.8px] will-change-transform"
          style={{
            transform: parallax.isReducedMotion
              ? "none"
              : `translate3d(${parallax.mouseX * 15}px, ${parallax.mouseY * 12}px, 0)`,
          }}
        >
          continue
        </span>
      </div>

      {/* Hero Content Block */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DFDFD8] bg-white/70 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#557C72] animate-pulse" aria-hidden="true" />
          <span className="text-xs font-bold tracking-widest uppercase text-[#557C72]">
            {savedResumePoint ? "Resume Point Saved & Restored" : "Voice-First Context & Continuity"}
          </span>
        </div>

        <h1 id="hero-title" className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#263746] leading-[1.08] max-w-3xl">
          Sometimes,<br />
          <span className="text-[#557C72]">you don&apos;t need an answer.</span>
        </h1>

        <p className="text-xl sm:text-2xl font-medium text-[#263746]/80 max-w-2xl leading-relaxed">
          You need the space to finish what you&apos;re trying to say.
        </p>

        <p className="text-base sm:text-lg text-[#70746E] max-w-xl">
          A voice-first AI companion designed to listen before it responds.
        </p>

        {/* Central Voice Orb (Parallax Layer 6) */}
        <div className="my-6">
          <VoiceOrb
            state="idle"
            size="lg"
            offsetY={parallax.isReducedMotion ? 0 : parallax.mouseY * 12}
            offsetX={parallax.isReducedMotion ? 0 : parallax.mouseX * 15}
            interactive
            onClick={onStartTalking}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <button className="button button-primary text-base px-8 py-3.5" onClick={onStartTalking}>
            Start talking <span aria-hidden="true">→</span>
          </button>
          <button className="button button-secondary text-base px-7 py-3.5" onClick={onExplore}>
            Explore how it works
          </button>
        </div>
      </div>
    </section>
  );
}
