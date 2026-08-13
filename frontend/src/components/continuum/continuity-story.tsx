"use client";

import type { ParallaxOffset } from "@/lib/use-parallax";

type ContinuityStoryProps = {
  parallax: ParallaxOffset;
};

export function ContinuityStorySection({ parallax }: ContinuityStoryProps) {
  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6" aria-labelledby="continuity-title">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="eyebrow">The Second Major Idea</p>
        <h2 id="continuity-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight leading-tight">
          And the conversation doesn&apos;t have to start from zero.
        </h2>
        <p className="mt-4 text-xl font-medium text-[#557C72]">
          What if something important you shared before could help the next conversation?
        </p>
      </div>

      {/* Layered Parallax Timeline */}
      <div className="relative my-12 flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Layer 1 — Previous Conversation (Pushed back) */}
        <div
          className="p-6 sm:p-8 rounded-2xl border border-[#DFDFD8] bg-[#F0EDFA]/70 backdrop-blur-md opacity-80 shadow-xs will-change-transform"
          style={{
            transform: parallax.isReducedMotion
              ? "none"
              : `translate3d(${parallax.mouseX * -12}px, ${parallax.mouseY * -8}px, 0) scale(0.96)`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A79BC8]">Weeks Ago</span>
            <span className="text-xs font-semibold text-[#70746E]">Previous Session Memory</span>
          </div>
          <p className="text-lg font-medium text-[#263746] italic">
            &ldquo;My relationship has been making me feel really overwhelmed lately.&rdquo;
          </p>
        </div>

        {/* Layer 2 — Current Conversation (Brought forward) */}
        <div
          className="p-6 sm:p-8 rounded-2xl border border-[#557C72] bg-white backdrop-blur-md shadow-xl z-10 will-change-transform"
          style={{
            transform: parallax.isReducedMotion
              ? "none"
              : `translate3d(${parallax.mouseX * 10}px, ${parallax.mouseY * 6}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#557C72]">Today</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E5EDEA] text-[#557C72] text-xs font-extrabold">Relevant Context Restored</span>
          </div>
          <p className="text-xl font-semibold text-[#263746]">
            &ldquo;I want to talk about my relationship again.&rdquo;
          </p>
          <div className="mt-4 pt-4 border-t border-[#DFDFD8] flex flex-wrap items-center gap-2 text-xs font-bold text-[#557C72]">
            <span className="uppercase tracking-wider">Relevant Context Found:</span>
            <span className="px-2.5 py-1 rounded bg-[#E5EDEA]">Relationship</span>
            <span className="px-2.5 py-1 rounded bg-[#E5EDEA]">Emotional Context</span>
            <span className="px-2.5 py-1 rounded bg-[#E5EDEA]">Prior Concern</span>
          </div>
        </div>
      </div>

      {/* Memory Boundaries Breakdown */}
      <div className="mt-20 p-8 rounded-3xl border border-[#DFDFD8] bg-white/90 backdrop-blur-md max-w-4xl mx-auto shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#263746]">
            Not everything needs to be remembered.
          </h3>
          <p className="text-base text-[#70746E] mt-2">
            Only context that can help the conversation move forward is carried into future sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Relevant Context Retained
            </h4>
            <ul className="space-y-2 text-sm font-medium text-emerald-950">
              <li className="flex items-center gap-2">✓ Relationship &amp; career stress themes</li>
              <li className="flex items-center gap-2">✓ Previous emotional breakthroughs</li>
              <li className="flex items-center gap-2">✓ Explicit user reflection goals</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Not Carried Forward
            </h4>
            <ul className="space-y-2 text-sm font-medium text-slate-700">
              <li className="flex items-center gap-2">✕ Old unrelated small talk</li>
              <li className="flex items-center gap-2">✕ Disposable transcript noise</li>
              <li className="flex items-center gap-2">✕ Resolved transient details</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
