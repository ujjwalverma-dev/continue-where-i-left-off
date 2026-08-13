"use client";

import { useState } from "react";
import { VoiceOrb } from "@/components/voice-orb";
import type { VoiceState } from "@/types/task";

type DemoStep = {
  stepIndex: number;
  label: string;
  orbState: VoiceState;
  speaker: "user" | "continuum";
  text: string;
  subtext: string;
  statusBadge: string;
};

const DEMO_STEPS: DemoStep[] = [
  {
    stepIndex: 1,
    label: "State 1 · User speaks",
    orbState: "listening",
    speaker: "user",
    text: "“I've been having a really difficult time lately and I don't know...”",
    subtext: "Continuum stays in listening mode without cutting in prematurely.",
    statusBadge: "Listening",
  },
  {
    stepIndex: 2,
    label: "State 2 · User pauses",
    orbState: "idle",
    speaker: "continuum",
    text: "“Take your time. Please continue whenever you're ready.”",
    subtext: "Instead of generating an unprompted solution, Continuum holds space.",
    statusBadge: "Take your time",
  },
  {
    stepIndex: 3,
    label: "State 3 · User continues",
    orbState: "listening",
    speaker: "user",
    text: "“...and then yesterday, everything felt overwhelming when work piled up.”",
    subtext: "User completes their sentence without being interrupted.",
    statusBadge: "Listening",
  },
  {
    stepIndex: 4,
    label: "State 4 · User completes turn",
    orbState: "speaking",
    speaker: "continuum",
    text: "“I understand. Thank you for sharing that. Here's what I'm hearing...”",
    subtext: "Acknowledging shared experience before offering practical reflections.",
    statusBadge: "Continuum speaking",
  },
];

export function MentalHealthModeDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const current = DEMO_STEPS[activeStep];

  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6" aria-labelledby="mh-mode-title">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="eyebrow">Interactive Demonstration</p>
        <h2 id="mh-mode-title" className="text-3xl sm:text-5xl font-bold text-[#263746] tracking-tight leading-tight">
          What if the AI didn&apos;t decide when you were finished?
        </h2>
        <p className="mt-4 text-lg text-[#70746E]">
          Experience how Continuum&apos;s Mental Health Mode handles pauses and turn completion.
        </p>
      </div>

      {/* Step Selector Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {DEMO_STEPS.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase transition-all duration-200 cursor-pointer ${
              activeStep === idx
                ? "bg-[#557C72] text-white shadow-md"
                : "bg-white/80 border border-[#DFDFD8] text-[#70746E] hover:bg-[#F1F0EB]"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Interactive Stage Box */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[#DFDFD8] bg-white/90 backdrop-blur-md shadow-lg flex flex-col items-center text-center max-w-3xl mx-auto min-h-[420px] justify-between">
        <div className="w-full flex items-center justify-between">
          <span className="status-badge active">{current.statusBadge}</span>
          <span className="text-xs font-bold text-[#70746E] uppercase">Step {current.stepIndex} of 4</span>
        </div>

        <div className="my-6">
          <VoiceOrb state={current.orbState} size="md" />
        </div>

        <div className="space-y-3 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#557C72]">
            {current.speaker === "user" ? "User speaking" : "Continuum response"}
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-[#263746] leading-relaxed">
            {current.text}
          </p>
          <p className="text-sm text-[#70746E]">{current.subtext}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="button button-secondary text-sm"
            onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : DEMO_STEPS.length - 1))}
          >
            ← Previous
          </button>
          <button
            className="button button-primary text-sm"
            onClick={() => setActiveStep((prev) => (prev < DEMO_STEPS.length - 1 ? prev + 1 : 0))}
          >
            Next Step →
          </button>
        </div>
      </div>
    </section>
  );
}
