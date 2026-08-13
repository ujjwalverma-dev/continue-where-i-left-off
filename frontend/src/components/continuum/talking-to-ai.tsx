"use client";

import type { ParallaxOffset } from "@/lib/use-parallax";

type TalkingToAIProps = {
  parallax: ParallaxOffset;
};

const EMOTIONAL_TOPICS = [
  { topic: "Stress", delay: 0.02, color: "border-[#557C72]/30 bg-[#E5EDEA]/60" },
  { topic: "Relationships", delay: -0.03, color: "border-[#A79BC8]/30 bg-[#F0EDFA]/60" },
  { topic: "Loneliness", delay: 0.04, color: "border-[#DCE8E8]/50 bg-[#F2F7F7]/70" },
  { topic: "Uncertainty", delay: -0.02, color: "border-[#D6A86A]/30 bg-[#F8EDE1]/60" },
  { topic: "Difficult emotions", delay: 0.03, color: "border-[#C87870]/30 bg-[#FBF0EF]/60" },
];

export function TalkingToAISection({ parallax }: TalkingToAIProps) {
  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6 text-center" aria-labelledby="talking-ai-title">
      <p className="eyebrow">A Changing Landscape</p>
      <h2 id="talking-ai-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight max-w-3xl mx-auto leading-tight">
        When people need to talk, AI is increasingly becoming part of the conversation.
      </h2>

      <div className="flex flex-wrap justify-center gap-4 my-12 max-w-3xl mx-auto">
        {EMOTIONAL_TOPICS.map((item, index) => (
          <div
            key={index}
            className={`px-6 py-3.5 rounded-2xl border ${item.color} backdrop-blur-md shadow-sm text-base sm:text-lg font-semibold text-[#263746] will-change-transform transition-all duration-300`}
            style={{
              transform: parallax.isReducedMotion
                ? "none"
                : `translate3d(${parallax.mouseX * (index % 2 === 0 ? 10 : -10)}px, ${parallax.mouseY * (index % 2 === 0 ? 6 : -6)}px, 0)`,
            }}
          >
            {item.topic}
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-xl sm:text-2xl font-medium text-[#263746]/90">
          People don&apos;t always arrive looking for an answer.
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-[#557C72]">
          Sometimes, they just want to explain.
        </p>
      </div>
    </section>
  );
}
