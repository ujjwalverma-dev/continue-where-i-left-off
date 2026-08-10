export type Task = {
  id: string;
  title: string;
  role: string;
  interviewType: string;
  description: string;
  summary: string;
};

export type VoiceState = "idle" | "listening" | "processing" | "speaking" | "review" | "error";
