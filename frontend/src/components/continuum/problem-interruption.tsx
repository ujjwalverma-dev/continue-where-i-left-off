"use client";

import type { ParallaxOffset } from "@/lib/use-parallax";

type ProblemInterruptionProps = {
  parallax: ParallaxOffset;
};

const PAUSE_REASONS = [
  "\"I'm thinking.\"",
  "\"I'm trying to explain.\"",
  "\"I need a moment.\"",
  "\"I have more to say.\"",
];

export function ProblemInterruptionSection({ parallax }: ProblemInterruptionProps) {
  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6" aria-labelledby="problem-1-title">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Left Sticky Header */}
        <div className="md:col-span-4 md:sticky md:top-28">
          <p className="eyebrow">Problem 01</p>
          <h2 id="problem-1-title" className="text-3xl sm:text-4xl font-bold text-[#263746] tracking-tight">
            AI responds too soon.
          </h2>
          <p className="mt-4 text-[#70746E] text-base sm:text-lg">
            Traditional AI treats any silence as a signal to start generating text immediately.
          </p>
        </div>

        {/* Right Interactive Mock Experience */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* Simulated Interrupted Conversation Box */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#DFDFD8] bg-white/80 backdrop-blur-md shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <span className="px-3 py-1 rounded-full bg-[#E5EDEA] text-[#557C72] text-xs font-bold uppercase">User</span>
              <p className="text-lg font-medium text-[#263746] italic">
                &ldquo;I&apos;ve been feeling like...&rdquo;
              </p>
            </div>

            {/* Premature AI Interruption Box */}
            <div className="relative p-5 rounded-xl border border-red-200 bg-red-50/70 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-red-600">Standard AI (Interrupted)</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">Cut Off</span>
              </div>
              <p className="text-base text-red-900 line-through opacity-70">
                &ldquo;Here are 5 things you can do to manage your emotional health right now:&rdquo;
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-red-400/80 animate-pulse" aria-hidden="true" />
            </div>
          </div>

          {/* Core Philosophy Reveal */}
          <div className="p-8 rounded-2xl border border-[#557C72]/20 bg-[#E5EDEA]/40 backdrop-blur-md space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#263746]">
              But what if they weren&apos;t finished?
            </h3>
            <p className="text-lg text-[#263746]/80 font-medium">
              A pause doesn&apos;t always mean: <span className="font-bold text-red-600/80">&ldquo;I&apos;m done.&rdquo;</span>
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAUSE_REASONS.map((reason, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-[#DFDFD8] bg-white text-[#557C72] font-semibold text-base shadow-xs will-change-transform"
                  style={{
                    transform: parallax.isReducedMotion
                      ? "none"
                      : `translate3d(${parallax.mouseX * (index % 2 === 0 ? 5 : -5)}px, ${parallax.mouseY * (3 * (index + 1))}px, 0)`,
                  }}
                >
                  <span className="text-xs uppercase text-[#70746E] block mb-1">Sometimes it means</span>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
