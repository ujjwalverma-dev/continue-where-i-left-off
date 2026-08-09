export type MockVoiceBackendResult = {
  status: "mock";
};

/**
 * Frontend boundary for the future voice-continuation service.
 *
 * This deliberately does not upload the recording or make a network request.
 */
export async function sendVoiceToBackend(_audioBlob: Blob): Promise<MockVoiceBackendResult> {
  void _audioBlob;
  return { status: "mock" };
}
