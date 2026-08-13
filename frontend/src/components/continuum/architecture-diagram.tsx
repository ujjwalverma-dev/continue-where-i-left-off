"use client";

import type { ParallaxOffset } from "@/lib/use-parallax";

type ArchitectureDiagramProps = {
  parallax: ParallaxOffset;
};

const TECH_CARDS = [
  {
    name: "Whisper",
    role: "Speech → Text",
    desc: "Transcribes user speech into accurate, punctuated text.",
    badge: "Input Stage",
    color: "border-[#557C72]/30 bg-[#E5EDEA]/50",
  },
  {
    name: "Gemini",
    role: "Reasoning & Empathy",
    desc: "Understands emotional context and formulates thoughtful reflections.",
    badge: "Reasoning Engine",
    color: "border-[#A79BC8]/30 bg-[#F0EDFA]/50",
  },
  {
    name: "Qdrant",
    role: "Relevant Memory",
    desc: "Retrieves important prior session context that matters for today.",
    badge: "Continuity Store",
    color: "border-[#DCE8E8]/60 bg-[#F2F7F7]/60",
  },
  {
    name: "Rime",
    role: "Text → Speech",
    desc: "Synthesizes responses into warm, natural human-sounding speech.",
    badge: "Voice Synthesis",
    color: "border-[#D6A86A]/30 bg-[#F8EDE1]/50",
  },
];

export function ArchitectureDiagramSection({ parallax }: ArchitectureDiagramProps) {
  return (
    <section className="relative max-w-6xl mx-auto py-24 px-6" aria-labelledby="arch-title">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="eyebrow">The System Architecture</p>
        <h2 id="arch-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight">
          How the technology works together.
        </h2>
        <p className="mt-4 text-lg text-[#70746E]">
          A modular pipeline built for turn-based listening, reasoning, memory, and spoken output.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[#DFDFD8] bg-white/90 backdrop-blur-md shadow-md mb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 text-center">
          <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[#E5EDEA] border border-[#557C72]/30">
            <span className="text-xs font-bold uppercase text-[#557C72]">1. User Speaks</span>
          </div>
          <span className="text-[#557C72] font-black hidden sm:inline">→</span>

          <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-white border border-[#DFDFD8]">
            <span className="text-xs font-bold uppercase text-[#263746]">Whisper</span>
            <span className="block text-[10px] text-[#70746E]">Speech → Text</span>
          </div>
          <span className="text-[#557C72] font-black hidden sm:inline">→</span>

          <div className="flex-[2] min-w-[240px] p-4 rounded-2xl bg-[#FAF9F5] border border-[#A79BC8]/40 shadow-xs">
            <span className="text-xs font-extrabold uppercase text-[#A79BC8] block mb-2">Engine &amp; Memory</span>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-[#263746]">
              <span className="p-1.5 rounded bg-white border border-[#DFDFD8]">Qdrant</span>
              <span className="p-1.5 rounded bg-white border border-[#DFDFD8]">Gemini</span>
              <span className="p-1.5 rounded bg-white border border-[#DFDFD8]">Turn Logic</span>
            </div>
          </div>
          <span className="text-[#557C72] font-black hidden sm:inline">→</span>

          <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-white border border-[#DFDFD8]">
            <span className="text-xs font-bold uppercase text-[#263746]">Rime</span>
            <span className="block text-[10px] text-[#70746E]">Text → Speech</span>
          </div>
          <span className="text-[#557C72] font-black hidden sm:inline">→</span>

          <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[#F0EDFA] border border-[#A79BC8]/30">
            <span className="text-xs font-bold uppercase text-[#A79BC8]">User Listens</span>
          </div>
        </div>
      </div>

      {/* Technology Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TECH_CARDS.map((card, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border ${card.color} backdrop-blur-md flex flex-col justify-between shadow-xs will-change-transform`}
            style={{
              transform: parallax.isReducedMotion
                ? "none"
                : `translate3d(${parallax.mouseX * (idx % 2 === 0 ? 6 : -6)}px, ${parallax.mouseY * (idx % 2 === 0 ? 4 : -4)}px, 0)`,
            }}
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#70746E] block mb-2">
                {card.badge}
              </span>
              <h3 className="text-2xl font-bold text-[#263746] mb-1">{card.name}</h3>
              <span className="text-xs font-semibold text-[#557C72] block mb-4">{card.role}</span>
              <p className="text-sm text-[#70746E] leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
