"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TaskCard } from "@/components/task-card";
import { TaskContext } from "@/components/task-context";
import { VoiceWorkspace } from "@/components/voice-workspace";
import { mockTasks } from "@/data/mock-tasks";
import { sendVoiceToBackend } from "@/lib/voice-client";
import type { Task, VoiceState } from "@/types/task";

type View = "home" | "context" | "voice";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedTask, setSelectedTask] = useState<Task>(mockTasks[0]);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [resumeStep, setResumeStep] = useState(0);
  const [correctionApplied, setCorrectionApplied] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const [isStoppingRecording, setIsStoppingRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const discardRecordingRef = useRef(false);
  const isStartingRecordingRef = useRef(false);

  const releaseMicrophone = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => releaseMicrophone, [releaseMicrophone]);

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

  const startSpeaking = async () => {
    if (isStartingRecordingRef.current || recorderRef.current?.state === "recording") {
      return;
    }

    setCorrectionApplied(false);
    setRecordingError(null);
    isStartingRecordingRef.current = true;
    setIsStartingRecording(true);

    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      setRecordingError("Microphone recording is not supported by this browser. Try a current desktop browser.");
      setVoiceState("idle");
      setView("voice");
      isStartingRecordingRef.current = false;
      setIsStartingRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      discardRecordingRef.current = false;

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const shouldDiscard = discardRecordingRef.current;

        chunksRef.current = [];
        recorderRef.current = null;
        discardRecordingRef.current = false;
        releaseMicrophone();
        setIsStoppingRecording(false);

        if (shouldDiscard) {
          return;
        }

        if (audioBlob.size === 0) {
          setRecordingError("No audio was captured. Check your microphone and try again.");
          setVoiceState("idle");
          return;
        }

        setRecordedAudio(audioBlob);
        setVoiceState("processing");
        void sendVoiceToBackend(audioBlob);
      };

      recorder.start();
      setVoiceState("listening");
      setView("voice");
    } catch {
      releaseMicrophone();
      setRecordingError("Microphone access was not granted. Allow access and try again.");
      setVoiceState("idle");
      setView("voice");
    } finally {
      isStartingRecordingRef.current = false;
      setIsStartingRecording(false);
    }
  };

  const finishSpeaking = () => {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      return;
    }

    setIsStoppingRecording(true);
    recorder.stop();
  };

  const cancelRecording = () => {
    const recorder = recorderRef.current;

    if (recorder) {
      discardRecordingRef.current = true;
      if (recorder.state !== "inactive") {
        recorder.stop();
      } else {
        releaseMicrophone();
      }
    } else {
      releaseMicrophone();
    }

    setVoiceState("idle");
  };

  const applyCorrection = () => {
    setCorrectionApplied(true);
    setVoiceState("speaking");
  };

  const returnHome = () => {
    cancelRecording();
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
            <button className="button button-primary" onClick={startSpeaking} disabled={isStartingRecording}>
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
          recordedAudio={recordedAudio}
          recordingError={recordingError}
          isStoppingRecording={isStoppingRecording}
          onBack={() => {
            cancelRecording();
            setView("context");
          }}
          onFinishSpeaking={finishSpeaking}
          onInterrupt={() => setVoiceState("interrupted")}
          onApplyCorrection={applyCorrection}
          onRestart={() => void startSpeaking()}
        />
      )}
    </main>
  );
}
