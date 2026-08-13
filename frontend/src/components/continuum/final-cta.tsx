"use client";

import { TaskCard } from "@/components/task-card";
import { VoiceOrb } from "@/components/voice-orb";
import { mockTasks } from "@/data/mock-tasks";
import type { Task } from "@/types/task";

type FinalCTAProps = {
  onStartTalking: () => void;
  onSelectTask: (task: Task) => void;
  continuityActive: boolean;
};

export function FinalCTASection({ onStartTalking, onSelectTask, continuityActive }: FinalCTAProps) {
  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6 text-center" aria-labelledby="cta-title">
      {/* Quiet Closing Header */}
      <div className="space-y-4 max-w-3xl mx-auto mb-12">
        <p className="text-xl sm:text-2xl font-medium text-[#263746]/80">
          You don&apos;t always need to start from zero.
        </p>
        <h2 id="cta-title" className="text-3xl sm:text-5xl font-bold text-[#557C72] tracking-tight">
          Sometimes, you just need someone to listen.
        </h2>
      </div>

      <div className="my-8 flex justify-center">
        <VoiceOrb state="idle" size="md" interactive onClick={onStartTalking} />
      </div>

      <div className="max-w-xl mx-auto space-y-3 mb-16">
        <h3 className="text-3xl font-extrabold tracking-tight text-[#263746]">CONTINUUM</h3>
        <p className="text-base text-[#70746E]">
          A voice-first AI companion that listens before it responds.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button className="button button-primary text-base px-8 py-3.5" onClick={onStartTalking}>
            {continuityActive ? "Continue Where I Left Off →" : "Start talking →"}
          </button>
        </div>
      </div>

      {/* Scenario Selector Launcher */}
      <div className="mt-16 text-left">
        <div className="section-heading mb-6">
          <div>
            <p className="eyebrow">Try Continuum Prototype</p>
            <h3 className="text-2xl font-bold text-[#263746]">Choose a reflection scenario to start</h3>
          </div>
        </div>
        <div className="task-grid">
          {mockTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={() => onSelectTask(task)} />
          ))}
        </div>
      </div>
    </section>
  );
}
