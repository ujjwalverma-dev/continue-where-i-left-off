import express, { type ErrorRequestHandler, type Request, type Response } from "express";
import multer from "multer";
import {
  getConfigurationStatus,
  getMissingProviderVariables,
  type ProviderName,
} from "./config.js";
import { createProviderClients } from "./providers.js";
import { coachInterview, InterviewIntelligenceError } from "./interview.js";
import { KnowledgeRetrievalError, searchInterviewKnowledge } from "./interview-knowledge.js";
import { MAX_STT_UPLOAD_BYTES, SpeechToTextError, transcribeAudio } from "./stt.js";
import { synthesizeSpeech, TextToSpeechError } from "./tts.js";
import type { InterviewRequest, InterviewResponse, InterviewSearchRequest, InterviewSearchResponse, SpeechToTextResponse, VoiceResponse } from "../../shared/interview.js";

type EndpointName = "stt" | "interview" | "tts";

const endpointProviders: Record<EndpointName, ProviderName[]> = {
  stt: ["stt"],
  interview: ["qdrant", "llm"],
  tts: ["rime"],
};

const sttUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_STT_UPLOAD_BYTES,
    files: 1,
    fields: 2,
    parts: 3,
  },
});

function missingVariablesForEndpoint(endpoint: EndpointName): string[] {
  return endpointProviders[endpoint].flatMap((provider) => getMissingProviderVariables(provider));
}

function sendNotImplemented(endpoint: EndpointName, response: Response): void {
  const missing = missingVariablesForEndpoint(endpoint);

  if (missing.length > 0) {
    response.status(503).json({
      error: "provider_configuration_required",
      endpoint: `/api/${endpoint}`,
      missing,
    });
    return;
  }

  response.status(501).json({
    error: "not_implemented",
    endpoint: `/api/${endpoint}`,
    message: "The provider client is configured, but the interview flow has not been implemented yet.",
  });
}

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));

  // Instantiate only configured clients. This validates constructor configuration
  // without making provider network calls during startup or health checks.
  createProviderClients();

  app.get("/health", (_request: Request, response: Response) => {
    const providers = getConfigurationStatus();
    const configured = Object.values(providers).every((provider) => provider.configured);

    response.status(200).json({
      status: configured ? "ok" : "configuration-required",
      providers,
    });
  });

  app.post("/api/stt", sttUpload.single("audio"), async (request: Request, response: Response<SpeechToTextResponse>, next) => {
    try {
      const result = await transcribeAudio(request.file);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/interview", async (request: Request<unknown, unknown, InterviewRequest>, response: Response<InterviewResponse | { error: string }>) => {
    try {
      const result = await coachInterview(request.body);
      response.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof InterviewIntelligenceError || error instanceof KnowledgeRetrievalError
        ? error.statusCode
        : 500;
      const message = error instanceof Error ? error.message : "Unexpected interview intelligence error";
      response.status(statusCode).json({ error: message });
    }
  });

  app.post("/api/interview/search", async (request: Request<unknown, unknown, InterviewSearchRequest>, response: Response<InterviewSearchResponse | { error: string }>) => {
    try {
      const result = await searchInterviewKnowledge(request.body);
      response.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof KnowledgeRetrievalError ? error.statusCode : 500;
      const message = error instanceof Error ? error.message : "Unexpected interview knowledge error";
      response.status(statusCode).json({ error: message });
    }
  });

  app.post("/api/tts", async (request: Request, response: Response) => {
    try {
      const { audio, contentType } = await synthesizeSpeech(request.body);
      response.status(200).set({
        "Content-Type": contentType,
        "Content-Length": String(audio.byteLength),
        "Cache-Control": "no-store",
      }).send(Buffer.from(audio));
    } catch (error) {
      const statusCode = error instanceof TextToSpeechError ? error.statusCode : 500;
      const message = error instanceof Error ? error.message : "Unexpected text-to-speech error";
      response.status(statusCode).json({ error: message });
    }
  });

  const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
    if (error instanceof multer.MulterError) {
      const statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      const message = error.code === "LIMIT_FILE_SIZE"
        ? `Audio upload exceeds the ${MAX_STT_UPLOAD_BYTES / (1024 * 1024)} MB limit.`
        : "Invalid multipart audio upload. Send one field named \"audio\".";
      response.status(statusCode).json({ error: message });
      return;
    }

    if (error instanceof SpeechToTextError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    if (error instanceof TextToSpeechError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    response.status(500).json({ error: "Unexpected server error." });
  };

  app.use(errorHandler);

  return app;
}
