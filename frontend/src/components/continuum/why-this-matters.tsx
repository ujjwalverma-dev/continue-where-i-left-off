"use client";

import type { ParallaxOffset } from "@/lib/use-parallax";

type WhyThisMattersProps = {
  parallax: ParallaxOffset;
};

export function WhyThisMattersSection({ parallax }: WhyThisMattersProps) {
  return (
    <section className="relative max-w-4xl mx-auto py-24 px-6 text-center" aria-labelledby="why-title">
      <div
        className="will-change-transform transition-transform duration-300"
        style={{
          transform: parallax.isReducedMotion
            ? "none"
            : `translate3d(${parallax.mouseX * 6}px, ${parallax.mouseY * -6}px, 0)`,
        }}
      >
        <p className="eyebrow">The Premise</p>
        <h2 id="why-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight leading-tight max-w-3xl mx-auto">
          Mental health conversations aren&apos;t always about finding an answer.
        </h2>
      </div>

      <div
        className="mt-8 max-w-2xl mx-auto will-change-transform transition-transform duration-300"
        style={{
          transform: parallax.isReducedMotion
            ? "none"
            : `translate3d(${parallax.mouseX * -6}px, ${parallax.mouseY * 6}px, 0)`,
        }}
      >
        <p className="text-lg sm:text-xl text-[#70746E] leading-relaxed">
          Sometimes people need a place to explain what they&apos;re feeling without being rushed toward an immediate solution.
        </p>
      </div>
    </section>
  );
}
