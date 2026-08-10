export type ProviderName = "rime" | "qdrant" | "llm" | "stt";

export type RuntimeConfig = {
  port: number;
  frontendOrigin: string;
  rimeApiKey?: string;
  qdrantUrl?: string;
  qdrantApiKey?: string;
  llmApiKey?: string;
  sttApiKey?: string;
};

const requiredVariables: Record<ProviderName, readonly string[]> = {
  rime: ["RIME_API_KEY"],
  qdrant: ["QDRANT_URL", "QDRANT_API_KEY"],
  llm: ["LLM_API_KEY"],
  stt: ["STT_API_KEY"],
};

function readOptional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function readPort(): number {
  const rawPort = readOptional("PORT");
  const port = rawPort ? Number(rawPort) : 4000;

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

export function getRuntimeConfig(): RuntimeConfig {
  return {
    port: readPort(),
    frontendOrigin: readOptional("FRONTEND_ORIGIN") ?? "http://localhost:3000",
    rimeApiKey: readOptional("RIME_API_KEY"),
    qdrantUrl: readOptional("QDRANT_URL"),
    qdrantApiKey: readOptional("QDRANT_API_KEY"),
    llmApiKey: readOptional("LLM_API_KEY"),
    sttApiKey: readOptional("STT_API_KEY"),
  };
}

export function getMissingProviderVariables(provider: ProviderName): string[] {
  return requiredVariables[provider].filter((name) => !readOptional(name));
}

export function isProviderConfigured(provider: ProviderName): boolean {
  return getMissingProviderVariables(provider).length === 0;
}

export function getConfigurationStatus(): Record<ProviderName, { configured: boolean; missing: string[] }> {
  return Object.fromEntries(
    (Object.keys(requiredVariables) as ProviderName[]).map((provider) => {
      const missing = getMissingProviderVariables(provider);
      return [provider, { configured: missing.length === 0, missing }];
    }),
  ) as Record<ProviderName, { configured: boolean; missing: string[] }>;
}
