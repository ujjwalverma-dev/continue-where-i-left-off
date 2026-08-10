import { toFile } from "groq-sdk/uploads";
import { createProviderClients, GROQ_STT_MODEL } from "./providers.js";
import type { SpeechToTextResponse } from "../../shared/interview.js";

export const MAX_STT_UPLOAD_BYTES = 20 * 1024 * 1024;

const supportedAudioTypes: Record<string, { fileName: string; contentType: string }> = {
  "audio/flac": { fileName: "recording.flac", contentType: "audio/flac" },
  "audio/x-flac": { fileName: "recording.flac", contentType: "audio/flac" },
  "audio/mpeg": { fileName: "recording.mp3", contentType: "audio/mpeg" },
  "audio/mp3": { fileName: "recording.mp3", contentType: "audio/mpeg" },
  "audio/mp4": { fileName: "recording.m4a", contentType: "audio/mp4" },
  "audio/m4a": { fileName: "recording.m4a", contentType: "audio/mp4" },
  "audio/x-m4a": { fileName: "recording.m4a", contentType: "audio/mp4" },
  "audio/mpeg4": { fileName: "recording.m4a", contentType: "audio/mp4" },
  "audio/ogg": { fileName: "recording.ogg", contentType: "audio/ogg" },
  "application/ogg": { fileName: "recording.ogg", contentType: "audio/ogg" },
  "audio/wav": { fileName: "recording.wav", contentType: "audio/wav" },
  "audio/x-wav": { fileName: "recording.wav", contentType: "audio/wav" },
  "audio/webm": { fileName: "recording.webm", contentType: "audio/webm" },
  "video/webm": { fileName: "recording.webm", contentType: "video/webm" },
};

export class SpeechToTextError extends Error {
  public constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "SpeechToTextError";
  }
}

function getSupportedAudioType(mimetype: string): { fileName: string; contentType: string } | undefined {
  return supportedAudioTypes[mimetype.split(";", 1)[0].trim().toLowerCase()];
}

export async function transcribeAudio(file: Express.Multer.File | undefined): Promise<SpeechToTextResponse> {
  if (!file) {
    throw new SpeechToTextError('Missing audio upload. Send one multipart/form-data field named "audio".', 400);
  }

  if (file.size === 0 || file.buffer.length === 0) {
    throw new SpeechToTextError("The uploaded audio file is empty.", 400);
  }

  const audioType = getSupportedAudioType(file.mimetype);

  if (!audioType) {
    throw new SpeechToTextError("Unsupported audio type. Use flac, mp3, mp4, m4a, ogg, wav, or webm.", 415);
  }

  const groq = createProviderClients().stt;

  if (!groq) {
    throw new SpeechToTextError("Speech-to-text is not configured. Set STT_API_KEY.", 503);
  }

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: await toFile(new Uint8Array(file.buffer), audioType.fileName, { type: audioType.contentType }),
      model: GROQ_STT_MODEL,
      response_format: "json",
      temperature: 0,
    });
    const transcript = transcription.text.trim();

    if (!transcript) {
      throw new SpeechToTextError("The audio did not contain a usable transcription.", 422);
    }

    return { transcript };
  } catch (error) {
    if (error instanceof SpeechToTextError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown Groq transcription error";
    throw new SpeechToTextError(`Speech-to-text provider request failed: ${message}`, 502);
  }
}
