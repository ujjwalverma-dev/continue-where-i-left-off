"use client";

import type { ParallaxOffset } from "@/lib/use-parallax";

type ProblemChecklistProps = {
  parallax: ParallaxOffset;
};

const GENERIC_CHECKLIST = [
  "1. Practice mindfulness",
  "2. Take a short break",
  "3. Talk to a friend or relative",
  "4. Get some outdoor exercise",
  "5. Focus on positive thoughts",
];

const CONTINUUM_ORDER = [
  { step: "LISTEN", label: "Allow uninterrupted speech" },
  { step: "UNDERSTAND", label: "Synthesize emotion & context" },
  { step: "ACKNOWLEDGE", label: "Validate what was shared" },
  { step: "RESPOND", label: "Reflect thoughtfully" },
  { step: "SUGGEST", label: "Gentle next steps when ready" },
];

export function ProblemChecklistSection({ parallax }: ProblemChecklistProps) {
  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6 text-center" aria-labelledby="problem-2-title">
      <p className="eyebrow">Problem 02</p>
      <h2 id="problem-2-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight max-w-3xl mx-auto leading-tight">
        AI is very good at giving answers. That isn&apos;t always what the moment needs.
      </h2>

      {/* Fading Generic Checklist Box */}
      <div className="relative my-12 max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border border-[#DFDFD8] bg-white/50 backdrop-blur-xs opacity-65 blur-[0.4px]">
        <p className="text-xs font-bold uppercase tracking-wider text-[#70746E] mb-4">Generic Automated Advice (Overwhelming)</p>
        <div className="space-y-2 text-left font-mono text-sm text-[#70746E]">
          {GENERIC_CHECKLIST.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded bg-[#F1F0EB] border border-[#DFDFD8]">{item}</div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 mb-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#263746]">
          A difficult emotion isn&apos;t always a checklist.
        </h3>
        <p className="text-lg text-[#70746E]">
          Continuum changes the order of interaction to prioritize human space.
        </p>
      </div>

      {/* Continuum Central Order Motif */}
      <div className="p-8 sm:p-10 rounded-3xl border border-[#557C72]/30 bg-white/90 backdrop-blur-md shadow-lg max-w-4xl mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#557C72] mb-8">The Continuum Conversation Order</p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
          {CONTINUUM_ORDER.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 rounded-xl border border-[#DFDFD8] bg-[#FAF9F5] hover:border-[#557C72] transition-all duration-300 will-change-transform"
              style={{
                transform: parallax.isReducedMotion
                  ? "none"
                  : `translate3d(${parallax.mouseX * (idx % 2 === 0 ? 4 : -4)}px, ${parallax.mouseY * 4}px, 0)`,
              }}
            >
              <span className="text-sm font-black text-[#557C72] tracking-wider mb-1">{item.step}</span>
              <span className="text-[11px] text-[#70746E] font-medium leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
