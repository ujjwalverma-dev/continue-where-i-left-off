import { QdrantClient } from "@qdrant/js-client-rest";
import Groq from "groq-sdk";
import { getRuntimeConfig, type RuntimeConfig } from "./config.js";

export const GROQ_LLM_MODEL = "openai/gpt-oss-120b";
export const GROQ_STT_MODEL = "whisper-large-v3-turbo";

/**
 * Small server-only wrapper reserved for the future Rime REST request.
 * It deliberately exposes no synthesis method yet, so this prototype cannot
 * accidentally send audio or text to a provider before that flow is designed.
 */
export class RimeTtsClient {
  public readonly provider = "rime";

  public constructor(private readonly apiKey: string) {
    // The key is retained only within this server-side wrapper.
  }

  public buildAuthorizationHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }
}

export type ProviderClients = {
  qdrant: QdrantClient | null;
  llm: Groq | null;
  stt: Groq | null;
  rime: RimeTtsClient | null;
};

export function createProviderClients(config: RuntimeConfig = getRuntimeConfig()): ProviderClients {
  return {
    qdrant:
      config.qdrantUrl && config.qdrantApiKey
        ? new QdrantClient({ url: config.qdrantUrl, apiKey: config.qdrantApiKey })
        : null,
    llm: config.llmApiKey ? new Groq({ apiKey: config.llmApiKey }) : null,
    stt: config.sttApiKey ? new Groq({ apiKey: config.sttApiKey }) : null,
    rime: config.rimeApiKey ? new RimeTtsClient(config.rimeApiKey) : null,
  };
}
