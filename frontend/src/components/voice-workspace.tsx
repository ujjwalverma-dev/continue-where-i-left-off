import { AudioPlayback } from "@/components/audio-playback";
import { Waveform } from "@/components/waveform";
import type { Task, VoiceState } from "@/types/task";

type VoiceWorkspaceProps = {
  task: Task;
  voiceState: VoiceState;
  resumeStep: number;
  correctionApplied: boolean;
  recordedAudio: Blob | null;
  recordingError: string | null;
  isStoppingRecording: boolean;
  onBack: () => void;
  onFinishSpeaking: () => void;
  onInterrupt: () => void;
  onApplyCorrection: () => void;
  onRestart: () => void;
};

const retrievalSteps = ["Task identified", "Previous progress found", "Relevant unresolved context found", "Continuation prepared"];

export function VoiceWorkspace({ task, voiceState, resumeStep, correctionApplied, recordedAudio, recordingError, isStoppingRecording, onBack, onFinishSpeaking, onInterrupt, onApplyCorrection, onRestart }: VoiceWorkspaceProps) {
  const speakingCopy = correctionApplied
    ? `Got it. PostgreSQL is confirmed. The next unresolved step is: ${task.correctedNextStep}`
    : task.voiceResponse;

  return (
    <section className="voice-view" aria-labelledby="voice-title">
      <div className="voice-topline">
        <button className="back-button" onClick={onBack}>← Task context</button>
        <p className="voice-task"><strong>{task.title}</strong> · {task.progress}% complete</p>
      </div>
      <div className="voice-stage" aria-live="polite">
        {voiceState === "idle" && (
          <VoiceStateContent title="Ready when you are" subtitle="Start speaking to resume this task from its last useful point." active={false}>
            {recordingError && <p className="recording-error" role="alert">{recordingError}</p>}
            <button className="button button-primary" onClick={onRestart}>{recordingError ? "Try microphone again" : "Start speaking"}</button>
          </VoiceStateContent>
        )}
        {voiceState === "listening" && (
          <VoiceStateContent title="Listening" subtitle="Tell Continue what you want to pick up, correct, or decide next." active>
            <div className="voice-actions"><button className="button button-primary" onClick={onFinishSpeaking} disabled={isStoppingRecording}>{isStoppingRecording ? "Finishing recording..." : "I'm finished speaking"}</button><button className="button button-secondary" onClick={onBack}>Cancel</button></div>
          </VoiceStateContent>
        )}
        {voiceState === "processing" && (
          <VoiceStateContent title="Preparing your continuation" subtitle="Matching your request with the unfinished task context." active>
            <div className="prototype-notice"><span aria-hidden="true">i</span><span>This is a local prototype transition. No voice, retrieval, or external service is connected.</span></div>
          </VoiceStateContent>
        )}
        {voiceState === "resuming" && (
          <VoiceStateContent title="Finding the right place to continue" subtitle="A short visual summary of the context being prepared." active={false}>
            <div className="resume-list" aria-label="Simulated context retrieval progress">
              {retrievalSteps.map((step, index) => <div className={`resume-item ${index <= resumeStep ? "done" : ""}`} key={step}><span>{index <= resumeStep ? "✓" : index + 1}</span>{step}</div>)}
            </div>
          </VoiceStateContent>
        )}
        {voiceState === "speaking" && (
          <VoiceStateContent title={correctionApplied ? "Updated continuation" : "Continuing from your last session"} subtitle={correctionApplied ? "Your local prototype state now reflects the correction." : "This response is presented as spoken context, not chat history."} active>
            <div className="spoken-response"><p className="response-label">Continue is speaking</p><p>“{speakingCopy}”</p></div>
            <AudioPlayback source={recordedAudio} />
            <div className="voice-actions"><button className="button button-primary" onClick={onInterrupt}>Interrupt and correct</button><button className="button button-secondary" onClick={onRestart}>Start over</button></div>
          </VoiceStateContent>
        )}
        {voiceState === "interrupted" && (
          <VoiceStateContent title="Correction received" subtitle="The user can change the course before the continuation proceeds." active={false}>
            <blockquote className="correction-quote"><strong>You said</strong>“{task.correction}”</blockquote>
            <div className="correction-flow" aria-label="Simulated correction flow"><div className="flow-item"><div className="flow-line"><span className="flow-dot" /></div><span>User correction received</span></div><div className="flow-item"><div className="flow-line"><span className="flow-dot" /></div><span>Task memory updated <span className="inline-status">(local prototype)</span></span></div><div className="flow-item"><div className="flow-line"><span className="flow-dot" /></div><span>Next unresolved step identified</span></div></div>
            <div className="voice-actions"><button className="button button-primary" onClick={onApplyCorrection}>Continue with correction</button><button className="button button-secondary" onClick={onRestart}>Keep listening</button></div>
          </VoiceStateContent>
        )}
      </div>
    </section>
  );
}

function VoiceStateContent({ title, subtitle, active, children }: { title: string; subtitle: string; active: boolean; children: React.ReactNode }) {
  return <><div className="voice-stage-header"><span className={`status-badge ${active ? "active" : ""}`}>{active ? "Voice active" : "Voice workspace"}</span><span className="prototype-label">Local simulation</span></div><h1 id="voice-title">{title}</h1><p className="voice-subtitle">{subtitle}</p><Waveform active={active} />{children}</>;
}
