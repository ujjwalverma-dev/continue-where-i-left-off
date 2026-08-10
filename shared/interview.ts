/**
 * Cross-boundary contracts for the interview voice flow.
 * These types contain data only and are safe to import from either app.
 */

export type RetrievedContext = {
  id: string;
  content: string;
  score: number;
  source?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type InterviewRequest = {
  transcript: string;
  role?: string;
  interviewType?: string;
  previousContext?: PrototypeContinuityContext;
};

export type PrototypeContinuityContext = {
  role: string;
  interviewType: string;
  lastTranscript: string;
  lastFeedback: string;
  lastInterviewerResponse: string;
  lastTopic: string;
};

export type InterviewRetrievedContext = {
  title: string;
  category: string;
  score: number;
};

export type InterviewResponse = {
  interviewerResponse: string;
  feedback: string;
  score: number | null;
  retrievedContext: InterviewRetrievedContext[];
};

export type VoiceResponse = {
  audioContentType: string;
  audioBase64?: string;
  transcript?: string;
  responseText?: string;
};

export type InterviewSearchRequest = {
  query: string;
  limit?: number;
};

export type InterviewSearchResponse = {
  results: RetrievedContext[];
};

export type SpeechToTextResponse = {
  transcript: string;
};
