"use client";

import type { ParallaxOffset } from "@/lib/use-parallax";

type ProductLoopProps = {
  parallax: ParallaxOffset;
};

const VOICE_MOMENTS = [
  "They pause.",
  "They hesitate.",
  "They change their words.",
  "They remember something.",
  "They continue.",
  "They stop.",
];

export function ProductLoopSection({ parallax }: ProductLoopProps) {
  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6 text-center" aria-labelledby="loop-title">
      {/* Product Loop Motif */}
      <div className="mb-24">
        <p className="eyebrow">The Continuum Loop</p>
        <h2 id="loop-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight mb-12">
          An ongoing cycle of quiet reflection.
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {["SPEAK", "LISTEN", "UNDERSTAND", "REMEMBER", "RESPOND"].map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="px-5 py-3 rounded-2xl border border-[#DFDFD8] bg-white font-extrabold text-sm text-[#263746] shadow-xs">
                {step}
              </span>
              <span className="text-[#557C72] font-black text-sm">↓</span>
            </div>
          ))}
          <span className="px-6 py-3.5 rounded-2xl border-2 border-[#557C72] bg-[#E5EDEA] font-black text-base text-[#557C72] shadow-md animate-pulse">
            CONTINUE ↺
          </span>
        </div>
      </div>

      {/* Why Voice Section */}
      <div
        className="p-8 sm:p-14 rounded-3xl border border-[#DFDFD8] bg-white/90 backdrop-blur-md max-w-3xl mx-auto text-left shadow-lg will-change-transform"
        style={{
          transform: parallax.isReducedMotion
            ? "none"
            : `translate3d(${parallax.mouseX * 8}px, ${parallax.mouseY * 6}px, 0)`,
        }}
      >
        <p className="eyebrow">Dedicated Voice Experience</p>
        <h3 className="text-3xl sm:text-4xl font-bold text-[#263746] mb-6">
          Why voice?
        </h3>
        <p className="text-xl font-semibold text-[#557C72] mb-8">
          Because people don&apos;t speak the way they type.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {VOICE_MOMENTS.map((moment, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-[#DFDFD8] bg-[#FAF9F5] text-sm font-semibold text-[#263746]">
              {moment}
            </div>
          ))}
        </div>

        <p className="text-lg font-bold text-[#263746] border-t border-[#DFDFD8] pt-6">
          Voice gives those moments space to exist.
        </p>
      </div>
    </section>
  );
}
