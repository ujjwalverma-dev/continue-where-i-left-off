import { AudioPlayback } from "@/components/audio-playback";
import { VoiceOrb } from "@/components/voice-orb";
import { Waveform } from "@/components/waveform";
import type { Task, VoiceState } from "@/types/task";

type VoiceWorkspaceProps = {
  task: Task;
  voiceState: VoiceState;
  transcript: string | null;
  feedback: string | null;
  score: number | null;
  interviewerResponse: string | null;
  responseAudio: Blob | null;
  voiceError: string | null;
  ttsError: string | null;
  autoplayBlocked: boolean;
  isStoppingRecording: boolean;
  isContinuing: boolean;
  onBack: () => void;
  onStartNew: () => void;
  onFinishSpeaking: () => void;
  onRestart: () => void;
  onRetryAudio: () => void;
  onAutoplayBlocked: () => void;
  onAudioEnded: () => void;
  onSaveAndExit: () => void;
};

export function VoiceWorkspace({ task, voiceState, transcript, feedback, score, interviewerResponse, responseAudio, voiceError, ttsError, autoplayBlocked, isStoppingRecording, isContinuing, onBack, onStartNew, onFinishSpeaking, onRestart, onRetryAudio, onAutoplayBlocked, onAudioEnded, onSaveAndExit }: VoiceWorkspaceProps) {
  return (
    <section className="voice-view" aria-labelledby="voice-title">
      <div className="voice-topline">
        <button className="back-button" onClick={onBack}>← Back to scenario</button>
        <p className="voice-task"><strong>{task.title}</strong> · {task.role}</p>
      </div>
      <div className="voice-stage" aria-live="polite">
        {voiceState === "idle" && (
          <VoiceStateContent state={voiceState} title="Your turn" subtitle="Speak when you are ready. Continuum will respond after you finish your answer." status="Ready" isContinuing={isContinuing} active={false}>
            {voiceError && <p className="recording-error" role="alert">{voiceError}</p>}
            <div className="voice-actions"><button className="button button-primary" onClick={onRestart}>Speak</button><button className="button button-secondary" onClick={onStartNew}>Start New Session</button></div>
          </VoiceStateContent>
        )}
        {voiceState === "listening" && (
          <VoiceStateContent state={voiceState} title="Listening..." subtitle="Speak naturally. Take your time, and press finished when done." status="Listening" isContinuing={isContinuing} active>
            <div className="voice-actions">
              <button className="button button-primary" onClick={onFinishSpeaking} disabled={isStoppingRecording}>{isStoppingRecording ? "Finishing recording..." : "I'm finished speaking"}</button>
              <button className="button button-secondary" onClick={onBack}>Cancel</button>
            </div>
          </VoiceStateContent>
        )}
        {voiceState === "processing" && (
          <VoiceStateContent state={voiceState} title="Reflecting..." subtitle="Understanding your thoughts and preparing response context." status="Processing" isContinuing={isContinuing} active>
            <div className="prototype-notice"><span aria-hidden="true">i</span><span>Continuum is preparing its response for this completed turn.</span></div>
          </VoiceStateContent>
        )}
        {(voiceState === "speaking" || voiceState === "review") && (
          <VoiceStateContent
            state={voiceState}
            title={voiceState === "review" ? "Ready for your next thought" : "Continuum is responding"}
            subtitle={voiceState === "review" ? "Review the response and guidance. Respond when you are ready." : "Listen to the response, then take your turn whenever ready."}
            status={voiceState === "review" ? "Your turn" : "Continuum speaking"}
            isContinuing={isContinuing}
            active={voiceState === "speaking"}
          >
            {interviewerResponse && <div className="spoken-response"><p className="response-label">Continuum says</p><p>“{interviewerResponse}”</p></div>}
            <div className="interview-details">
              {transcript && <article><p className="response-label">Your transcript</p><p>{transcript}</p></article>}
              {feedback && <article><p className="response-label">Reflection guidance{score ? ` · ${score}/10` : ""}</p><p>{feedback}</p></article>}
            </div>
            <AudioPlayback source={responseAudio} autoPlay onAutoplayBlocked={onAutoplayBlocked} onEnded={onAudioEnded} />
            {autoplayBlocked && <p className="recording-error">Autoplay was blocked. Use the player above to hear the response.</p>}
            {ttsError && <p className="recording-error">{ttsError}</p>}
            <div className="voice-actions">
              {ttsError && interviewerResponse && <button className="button button-secondary" onClick={onRetryAudio}>Retry audio</button>}
              <button className="button button-primary" onClick={onRestart}>Respond <span aria-hidden="true">→</span></button>
              {voiceState === "review" && <button className="button button-secondary" onClick={onSaveAndExit}>Save &amp; Exit</button>}
              <button className="button button-secondary" onClick={onStartNew}>Start New Session</button>
            </div>
          </VoiceStateContent>
        )}
        {voiceState === "error" && (
          <VoiceStateContent state={voiceState} title="Something needs another try" subtitle="Your conversation context is saved. Check your microphone and try again." status="Ready" isContinuing={isContinuing} active={false}>
            {voiceError && <p className="recording-error" role="alert">{voiceError}</p>}
            <div className="voice-actions"><button className="button button-primary" onClick={onRestart}>Retry</button><button className="button button-secondary" onClick={onStartNew}>Start New Session</button></div>
          </VoiceStateContent>
        )}
      </div>
    </section>
  );
}

function VoiceStateContent({ state, title, subtitle, status, isContinuing, active, children }: { state: VoiceState; title: string; subtitle: string; status: string; isContinuing: boolean; active: boolean; children: React.ReactNode }) {
  return (
    <>
      <div className="voice-stage-header">
        <span className={`status-badge ${active ? "active" : ""}`}>{status}</span>
        <span className="prototype-label">{isContinuing ? "Previous context restored" : "Fresh conversation"}</span>
      </div>
      <div className="my-4">
        <VoiceOrb state={state} size="md" />
      </div>
      <h1 id="voice-title">{title}</h1>
      <p className="voice-subtitle">{subtitle}</p>
      <Waveform active={active} />
      {children}
    </>
  );
}

