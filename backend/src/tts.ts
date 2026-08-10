import { createProviderClients } from "./providers.js";

const RIME_TTS_URL = "https://users.rime.ai/v1/rime-tts";
const RIME_SPEAKER = "astra";
const RIME_MODEL_ID = "arcana";
const MAX_TTS_TEXT_LENGTH = 1_200;

export class TextToSpeechError extends Error {
  public constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "TextToSpeechError";
  }
}

function parseText(input: unknown): string {
  if (!input || typeof input !== "object") {
    throw new TextToSpeechError("Request body must be a JSON object.", 400);
  }

  const text = (input as Record<string, unknown>).text;

  if (typeof text !== "string" || !text.trim()) {
    throw new TextToSpeechError("text is required and must not be empty.", 400);
  }

  const normalized = text.trim();

  if (normalized.length > MAX_TTS_TEXT_LENGTH) {
    throw new TextToSpeechError(`text must be ${MAX_TTS_TEXT_LENGTH} characters or fewer.`, 400);
  }

  return normalized;
}

export async function synthesizeSpeech(input: unknown): Promise<{ audio: ArrayBuffer; contentType: string }> {
  const text = parseText(input);
  const rime = createProviderClients().rime;

  if (!rime) {
    throw new TextToSpeechError("Text-to-speech is not configured. Set RIME_API_KEY.", 503);
  }

  try {
    const response = await fetch(RIME_TTS_URL, {
      method: "POST",
      headers: {
        ...rime.buildAuthorizationHeaders(),
        Accept: "audio/wav",
      },
      body: JSON.stringify({
        text,
        speaker: RIME_SPEAKER,
        modelId: RIME_MODEL_ID,
        lang: "eng",
      }),
    });

    if (!response.ok) {
      throw new TextToSpeechError("Rime could not generate the spoken response.", 502);
    }

    const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "";

    if (!contentType.startsWith("audio/")) {
      throw new TextToSpeechError("Rime returned an invalid audio response.", 502);
    }

    const audio = await response.arrayBuffer();

    if (audio.byteLength === 0) {
      throw new TextToSpeechError("Rime returned empty audio.", 502);
    }

    return { audio, contentType };
  } catch (error) {
    if (error instanceof TextToSpeechError) {
      throw error;
    }

    throw new TextToSpeechError("Text-to-speech provider request failed.", 502);
  }
}
