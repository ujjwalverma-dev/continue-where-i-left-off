export type TaskStep = {
  id: string;
  label: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  lastSession: string;
  lastWorkedOn: string;
  progress: number;
  summary: string;
  completedSteps: TaskStep[];
  unresolvedSteps: TaskStep[];
  voiceResponse: string;
  correction: string;
  correctedNextStep: string;
};

export type VoiceState = "idle" | "listening" | "processing" | "resuming" | "speaking" | "interrupted";
