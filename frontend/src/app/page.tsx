"use client";

import { useEffect, useState } from "react";
import { TaskCard } from "@/components/task-card";
import { TaskContext } from "@/components/task-context";
import { VoiceWorkspace } from "@/components/voice-workspace";
import { mockTasks } from "@/data/mock-tasks";
import type { Task, VoiceState } from "@/types/task";

type View = "home" | "context" | "voice";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedTask, setSelectedTask] = useState<Task>(mockTasks[0]);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [resumeStep, setResumeStep] = useState(0);
  const [correctionApplied, setCorrectionApplied] = useState(false);

  useEffect(() => {
    if (voiceState === "processing") {
      const timeout = window.setTimeout(() => {
        setResumeStep(0);
        setVoiceState("resuming");
      }, 750);

      return () => window.clearTimeout(timeout);
    }

    if (voiceState === "resuming") {
      const timeout = window.setTimeout(() => {
        if (resumeStep === 3) {
          setVoiceState("speaking");
        } else {
          setResumeStep((current) => current + 1);
        }
      }, 620);

      return () => window.clearTimeout(timeout);
    }
  }, [resumeStep, voiceState]);

  const chooseTask = (task: Task) => {
    setSelectedTask(task);
    setCorrectionApplied(false);
    setVoiceState("idle");
    setView("context");
  };

  const startSpeaking = () => {
    setCorrectionApplied(false);
    setVoiceState("listening");
    setView("voice");
  };

  const beginResuming = () => setVoiceState("processing");

  const applyCorrection = () => {
    setCorrectionApplied(true);
    setVoiceState("speaking");
  };

  const returnHome = () => {
    setVoiceState("idle");
    setView("home");
  };

  return (
    <main className="app-shell">
      <header className="site-header">
        <button className="wordmark" onClick={returnHome} aria-label="Return to task list">
          <span className="wordmark-mark" aria-hidden="true" />
          Continue
        </button>
        <span className="prototype-label">Prototype</span>
      </header>

      {view === "home" && (
        <section className="home-view" aria-labelledby="home-title">
          <div className="home-intro">
            <p className="eyebrow">Task continuity, without the recap</p>
            <h1 id="home-title">Pick up useful work exactly where it paused.</h1>
            <p className="lead">
              Continue keeps the important decisions, progress, and open questions close at hand—so
              your next step is already clear.
            </p>
            <button className="button button-primary" onClick={startSpeaking}>
              <span className="button-icon" aria-hidden="true">⌁</span>
              Start speaking
            </button>
            <p className="helper-text">Simulated voice interaction for this prototype</p>
          </div>

          <div className="task-list-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your work</p>
                <h2>Unfinished tasks</h2>
              </div>
              <span className="count-chip">{mockTasks.length} active</span>
            </div>
            <div className="task-grid">
              {mockTasks.map((task) => (
                <TaskCard key={task.id} task={task} onSelect={() => chooseTask(task)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {view === "context" && (
        <TaskContext
          task={selectedTask}
          onBack={returnHome}
          onContinue={startSpeaking}
        />
      )}

      {view === "voice" && (
        <VoiceWorkspace
          task={selectedTask}
          voiceState={voiceState}
          resumeStep={resumeStep}
          correctionApplied={correctionApplied}
          onBack={() => setView("context")}
          onFinishSpeaking={beginResuming}
          onInterrupt={() => setVoiceState("interrupted")}
          onApplyCorrection={applyCorrection}
          onRestart={() => setVoiceState("listening")}
        />
      )}
    </main>
  );
}
