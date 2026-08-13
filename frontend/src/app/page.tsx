"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArchitectureDiagramSection } from "@/components/continuum/architecture-diagram";
import { BrainNeuralBackground } from "@/components/brain-neural-background";
import { ContinuityStorySection } from "@/components/continuum/continuity-story";
import { FinalCTASection } from "@/components/continuum/final-cta";
import { HeroSection } from "@/components/continuum/hero";
import { HypothesisSection } from "@/components/continuum/hypothesis-section";
import { MentalHealthModeDemo } from "@/components/continuum/mental-health-mode-demo";
import { ProblemChecklistSection } from "@/components/continuum/problem-checklist";
import { ProblemInterruptionSection } from "@/components/continuum/problem-interruption";
import { ProductLoopSection } from "@/components/continuum/product-loop";
import { TalkingToAISection } from "@/components/continuum/talking-to-ai";
import { VoiceStatesVisualSection } from "@/components/continuum/voice-states-visual";
import { WhyThisMattersSection } from "@/components/continuum/why-this-matters";
import { TaskContext } from "@/components/task-context";
import { VoiceWorkspace } from "@/components/voice-workspace";
import { mockTasks } from "@/data/mock-tasks";
import { useParallax } from "@/lib/use-parallax";
import type { Task, VoiceState } from "@/types/task";

type View = "home" | "context" | "voice";

type PrototypeContinuityContext = {
  role: string;
  interviewType: string;
  lastTranscript: string;
  lastFeedback: string;
  lastInterviewerResponse: string;
  lastTopic: string;
};

type InterviewResult = {
  interviewerResponse: string;
  feedback: string;
  score: number | null;
  retrievedContext: Array<{ title: string; category: string; score: number }>;
};

const CONTINUITY_STORAGE_KEY = "continuum.prototype-continuity.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function readContinuity(value: unknown): PrototypeContinuityContext | null {
  if (!isRecord(value)) {
    return null;
  }

  const fields = ["role", "interviewType", "lastTranscript", "lastFeedback", "lastInterviewerResponse", "lastTopic"] as const;

  if (fields.some((field) => typeof value[field] !== "string" || !value[field])) {
    return null;
  }

  return {
    role: value.role as string,
    interviewType: value.interviewType as string,
    lastTranscript: value.lastTranscript as string,
    lastFeedback: value.lastFeedback as string,
    lastInterviewerResponse: value.lastInterviewerResponse as string,
    lastTopic: value.lastTopic as string,
  };
}

function getStoredContinuitySnapshot(): string | null {
  try {
    return window.localStorage.getItem(CONTINUITY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerContinuitySnapshot(): null {
  return null;
}

function subscribeToContinuityStorage(onStoreChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONTINUITY_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function parseStoredContinuity(value: string | null): PrototypeContinuityContext | null {
  if (!value) {
    return null;
  }

  try {
    return readContinuity(JSON.parse(value));
  } catch {
    return null;
  }
}

function parseInterviewResult(value: unknown): InterviewResult {
  if (!isRecord(value) || typeof value.interviewerResponse !== "string" || typeof value.feedback !== "string") {
    throw new Error("The interview coach returned an unexpected response.");
  }

  const score = value.score;
  const retrievedContext = Array.isArray(value.retrievedContext)
    ? value.retrievedContext.filter((item): item is { title: string; category: string; score: number } => (
      isRecord(item) && typeof item.title === "string" && typeof item.category === "string" && typeof item.score === "number"
    ))
    : [];

  if (score !== null && typeof score !== "number") {
    throw new Error("The interview coach returned an invalid score.");
  }

  return {
    interviewerResponse: value.interviewerResponse,
    feedback: value.feedback,
    score,
    retrievedContext,
  };
}

async function responseError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (isRecord(body) && typeof body.error === "string") {
      return body.error;
    }
  } catch {
    // A provider error can be non-JSON; use a safe status-based fallback.
  }

  return `Request failed (${response.status}).`;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedTask, setSelectedTask] = useState<Task>(mockTasks[0]);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [interviewerResponse, setInterviewerResponse] = useState<string | null>(null);
  const [responseAudio, setResponseAudio] = useState<Blob | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [savedResumePoint, setSavedResumePoint] = useState(false);
  const [sessionContinuity, setSessionContinuity] = useState<PrototypeContinuityContext | null | undefined>(undefined);
  const storedContinuity = useSyncExternalStore(
    subscribeToContinuityStorage,
    getStoredContinuitySnapshot,
    getServerContinuitySnapshot,
  );
  const continuity = sessionContinuity === undefined ? parseStoredContinuity(storedContinuity) : sessionContinuity;
  const [isStoppingRecording, setIsStoppingRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const discardRecordingRef = useRef(false);
  const isStartingRecordingRef = useRef(false);
  const interactionVersionRef = useRef(0);

  const releaseMicrophone = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const markAutoplayBlocked = useCallback(() => {
    setAutoplayBlocked(true);
  }, []);

  useEffect(() => releaseMicrophone, [releaseMicrophone]);

  const synthesizeResponse = useCallback(async (text: string): Promise<Blob> => {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(await responseError(response));
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("audio/")) {
      throw new Error("The voice provider returned an invalid audio response.");
    }

    const audio = await response.blob();
    if (audio.size === 0) {
      throw new Error("The voice provider returned empty audio.");
    }

    return audio;
  }, []);

  const processRecording = useCallback(async (audio: Blob, interactionVersion: number) => {
    if (interactionVersion !== interactionVersionRef.current) {
      return;
    }

    setVoiceState("processing");
    setVoiceError(null);
    setTtsError(null);
    setAutoplayBlocked(false);
    setResponseAudio(null);

    try {
      const formData = new FormData();
      formData.append("audio", audio, "interview-answer.webm");
      const sttResponse = await fetch("/api/stt", { method: "POST", body: formData });

      if (!sttResponse.ok) {
        throw new Error(await responseError(sttResponse));
      }

      const sttBody: unknown = await sttResponse.json();
      if (!isRecord(sttBody) || typeof sttBody.transcript !== "string" || !sttBody.transcript.trim()) {
        throw new Error("Speech-to-text returned an invalid transcript.");
      }

      const capturedTranscript = sttBody.transcript.trim();
      if (interactionVersion !== interactionVersionRef.current) {
        return;
      }
      setTranscript(capturedTranscript);

      const interviewResponse = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: capturedTranscript,
          role: selectedTask.role,
          interviewType: selectedTask.interviewType,
          previousContext: continuity ?? undefined,
        }),
      });

      if (!interviewResponse.ok) {
        throw new Error(await responseError(interviewResponse));
      }

      const interview = parseInterviewResult(await interviewResponse.json());
      if (interactionVersion !== interactionVersionRef.current) {
        return;
      }
      setInterviewerResponse(interview.interviewerResponse);
      setFeedback(interview.feedback);
      setScore(interview.score);

      const nextContinuity: PrototypeContinuityContext = {
        role: selectedTask.role,
        interviewType: selectedTask.interviewType,
        lastTranscript: capturedTranscript,
        lastFeedback: interview.feedback,
        lastInterviewerResponse: interview.interviewerResponse,
        lastTopic: interview.retrievedContext[0]?.title ?? `${selectedTask.interviewType} interview practice`,
      };
      window.localStorage.setItem(CONTINUITY_STORAGE_KEY, JSON.stringify(nextContinuity));
      setSessionContinuity(nextContinuity);

      try {
        const ttsAudio = await synthesizeResponse(interview.interviewerResponse);
        if (interactionVersion !== interactionVersionRef.current) {
          return;
        }
        setResponseAudio(ttsAudio);
      } catch (error) {
        if (interactionVersion !== interactionVersionRef.current) {
          return;
        }
        setTtsError(error instanceof Error ? error.message : "The spoken response could not be generated.");
      }

      if (interactionVersion !== interactionVersionRef.current) {
        return;
      }
      setVoiceState("speaking");
    } catch (error) {
      if (interactionVersion !== interactionVersionRef.current) {
        return;
      }
      setVoiceError(error instanceof Error ? error.message : "The interview response could not be completed.");
      setVoiceState("error");
    }
  }, [continuity, selectedTask.interviewType, selectedTask.role, synthesizeResponse]);

  const startSpeaking = async () => {
    if (isStartingRecordingRef.current || recorderRef.current?.state === "recording") {
      return;
    }

    const interactionVersion = interactionVersionRef.current;
    setView("voice");
    setVoiceError(null);
    setTtsError(null);
    setAutoplayBlocked(false);
    isStartingRecordingRef.current = true;

    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      setVoiceError("Microphone recording is not supported by this browser. Try a current desktop browser.");
      setVoiceState("error");
      isStartingRecordingRef.current = false;
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (interactionVersion !== interactionVersionRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

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
        const recording = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const shouldDiscard = discardRecordingRef.current;

        chunksRef.current = [];
        recorderRef.current = null;
        discardRecordingRef.current = false;
        releaseMicrophone();
        setIsStoppingRecording(false);

        if (shouldDiscard || interactionVersion !== interactionVersionRef.current) {
          return;
        }

        if (recording.size === 0) {
          setVoiceError("No audio was captured. Check your microphone and try again.");
          setVoiceState("error");
          return;
        }

        void processRecording(recording, interactionVersion);
      };

      recorder.start();
      setVoiceState("listening");
    } catch {
      if (interactionVersion !== interactionVersionRef.current) {
        return;
      }

      releaseMicrophone();
      setVoiceError("Microphone access was not granted. Allow access and try again.");
      setVoiceState("error");
    } finally {
      isStartingRecordingRef.current = false;
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
    interactionVersionRef.current += 1;
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
    setIsStoppingRecording(false);
  };

  const resetInterviewState = () => {
    setVoiceState("idle");
    setTranscript(null);
    setFeedback(null);
    setScore(null);
    setInterviewerResponse(null);
    setResponseAudio(null);
    setVoiceError(null);
    setTtsError(null);
    setAutoplayBlocked(false);
  };

  const startNewInterview = (task: Task = mockTasks[0]) => {
    cancelRecording();
    window.localStorage.removeItem(CONTINUITY_STORAGE_KEY);
    setSessionContinuity(null);
    setSavedResumePoint(false);
    setSelectedTask(task);
    resetInterviewState();
    setView("context");
  };

  const continuePreviousInterview = () => {
    const matchingTask = continuity
      ? mockTasks.find((task) => task.role === continuity.role && task.interviewType === continuity.interviewType)
      : undefined;

    cancelRecording();
    setSavedResumePoint(false);
    setSelectedTask(matchingTask ?? mockTasks[0]);
    resetInterviewState();
    setView("context");
  };

  const retryAudio = async () => {
    if (!interviewerResponse) {
      return;
    }

    const interactionVersion = interactionVersionRef.current;
    setTtsError(null);
    setAutoplayBlocked(false);

    try {
      const audio = await synthesizeResponse(interviewerResponse);
      if (interactionVersion !== interactionVersionRef.current) {
        return;
      }
      setResponseAudio(audio);
    } catch (error) {
      if (interactionVersion !== interactionVersionRef.current) {
        return;
      }
      setTtsError(error instanceof Error ? error.message : "The spoken response could not be generated.");
    }
  };

  const chooseTask = (task: Task) => {
    startNewInterview(task);
  };

  const returnHome = () => {
    cancelRecording();
    setSavedResumePoint(false);
    setView("home");
  };

  const saveAndExit = () => {
    cancelRecording();
    setSavedResumePoint(true);
    setView("home");
  };

  const handleAudioEnded = useCallback(() => {
    setAutoplayBlocked(false);
    setVoiceState((currentState) => currentState === "speaking" ? "review" : currentState);
  }, []);

  const parallax = useParallax(view === "home");
  const scrollToExplore = () => {
    window.scrollTo({ top: window.innerHeight * 0.75, behavior: "smooth" });
  };

  return (
    <>
      {/* Background Ambient Brain Neural Parallax Canvas */}
      <BrainNeuralBackground parallax={parallax} />

      <main className="app-shell">
        <header className="site-header">
          <button className="wordmark" onClick={returnHome} aria-label="Return to landing page">
            <span className="wordmark-mark" aria-hidden="true" />
            <span>CONTINUUM<small>Never Start From Zero</small></span>
          </button>
          <span className="prototype-label">Voice-first prototype</span>
        </header>

        {view === "home" && (
          <div className="narrative-flow">
            {/* SECTION 1 — Hero */}
            <HeroSection
              parallax={parallax}
              onStartTalking={continuity ? continuePreviousInterview : () => startNewInterview()}
              onExplore={scrollToExplore}
              savedResumePoint={savedResumePoint}
            />

            {/* SECTION 2 — Why This Matters */}
            <WhyThisMattersSection parallax={parallax} />

            {/* SECTION 3 — People Are Already Talking to AI */}
            <TalkingToAISection parallax={parallax} />

            {/* SECTION 4 — Problem 1: AI Responds Too Soon */}
            <ProblemInterruptionSection parallax={parallax} />

            {/* SECTION 5 — Problem 2: Solutions Before Understanding */}
            <ProblemChecklistSection parallax={parallax} />

            {/* SECTION 6 — Core Feature: Mental Health Mode Interactive Demo */}
            <MentalHealthModeDemo />

            {/* SECTION 7 — Voice Orb Visual Language */}
            <VoiceStatesVisualSection />

            {/* SECTION 8 — Continuity & Memory */}
            <ContinuityStorySection parallax={parallax} />

            {/* SECTION 9 — System Architecture */}
            <ArchitectureDiagramSection parallax={parallax} />

            {/* SECTION 10 — Product Loop & Why Voice */}
            <ProductLoopSection parallax={parallax} />

            {/* SECTION 11 — Product Hypothesis */}
            <HypothesisSection />

            {/* SECTION 12 — Final CTA & Reflection Scenario Launcher */}
            <FinalCTASection
              onStartTalking={continuity ? continuePreviousInterview : () => startNewInterview()}
              onSelectTask={chooseTask}
              continuityActive={Boolean(continuity)}
            />
          </div>
        )}

        {view === "context" && (
          <TaskContext
            task={selectedTask}
            isContinuing={Boolean(continuity)}
            onBack={returnHome}
            onContinue={() => void startSpeaking()}
            onStartNew={startNewInterview}
          />
        )}

        {view === "voice" && (
          <VoiceWorkspace
            task={selectedTask}
            voiceState={voiceState}
            transcript={transcript}
            feedback={feedback}
            score={score}
            interviewerResponse={interviewerResponse}
            responseAudio={responseAudio}
            voiceError={voiceError}
            ttsError={ttsError}
            autoplayBlocked={autoplayBlocked}
            isStoppingRecording={isStoppingRecording}
            isContinuing={Boolean(continuity)}
            onBack={() => {
              cancelRecording();
              setView("context");
            }}
            onStartNew={startNewInterview}
            onFinishSpeaking={finishSpeaking}
            onRestart={() => void startSpeaking()}
            onRetryAudio={() => void retryAudio()}
            onAutoplayBlocked={markAutoplayBlocked}
            onAudioEnded={handleAudioEnded}
            onSaveAndExit={saveAndExit}
          />
        )}
      </main>
    </>
  );
}
