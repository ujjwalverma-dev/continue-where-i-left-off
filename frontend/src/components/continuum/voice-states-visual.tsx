"use client";

import { VoiceOrb } from "@/components/voice-orb";
import type { VoiceState } from "@/types/task";

type VisualStateCard = {
  title: string;
  orbState: VoiceState;
  colorTag: string;
  copy: string;
};

const VISUAL_STATES: VisualStateCard[] = [
  {
    title: "Listening",
    orbState: "listening",
    colorTag: "Sage · Grounding",
    copy: "“I'm listening.” The orb breathes steadily as you share your thoughts.",
  },
  {
    title: "Pause",
    orbState: "idle",
    colorTag: "Sage · Space",
    copy: "“Take your time.” Holds space without rushing to respond.",
  },
  {
    title: "Processing",
    orbState: "processing",
    colorTag: "Lavender · Reflection",
    copy: "“I'm thinking about what you shared...” Synthesizes intent and memory.",
  },
  {
    title: "Speaking",
    orbState: "speaking",
    colorTag: "Lavender · Guidance",
    copy: "“Here's what I'm hearing...” Speaks with calm, clear cadence.",
  },
  {
    title: "Interrupted",
    orbState: "error",
    colorTag: "Navy · Responsive",
    copy: "Orb settles instantly when you start speaking again. Interruption is supported.",
  },
];

export function VoiceStatesVisualSection() {
  return (
    <section className="relative max-w-6xl mx-auto py-24 px-6" aria-labelledby="states-title">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="eyebrow">Visual Language</p>
        <h2 id="states-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight">
          Designed to be clear, quiet, and responsive.
        </h2>
        <p className="mt-4 text-lg text-[#70746E]">
          Sage represents human grounding. Lavender represents AI reflection. Deep Navy represents structure and trust.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {VISUAL_STATES.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-[#DFDFD8] bg-white/80 backdrop-blur-md shadow-xs flex flex-col items-center text-center justify-between"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#557C72] mb-4">
              {item.colorTag}
            </span>
            <div className="my-4">
              <VoiceOrb state={item.orbState} size="sm" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#263746] mb-2">{item.title}</h3>
              <p className="text-sm text-[#70746E] leading-relaxed">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
