import type { Task } from "@/types/task";

type TaskContextProps = {
  task: Task;
  isContinuing: boolean;
  onBack: () => void;
  onContinue: () => void;
  onStartNew: () => void;
};

export function TaskContext({ task, isContinuing, onBack, onContinue, onStartNew }: TaskContextProps) {
  return (
    <section className="context-view" aria-labelledby="task-title">
      <button className="back-button" onClick={onBack}>← Interview practice</button>
      <div className="context-header">
        <div>
          <p className="eyebrow">Interview practice</p>
          <h1 id="task-title">{task.title}</h1>
          <p className="context-meta">{task.role} · {task.interviewType} interview</p>
        </div>
        <span className="status-badge active">{isContinuing ? "Previous context restored" : "Ready to practice"}</span>
      </div>
      <div className="context-layout">
        <div>
          <article className="panel">
            <p className="panel-label">This practice scenario</p>
            <p className="context-summary">{task.summary}</p>
          </article>
          <article className="panel">
            <p className="panel-label">How the demo works</p>
            <p className="context-summary">Speak your answer, then Continuum transcribes it, uses the interview context to prepare feedback and a follow-up, and speaks its response. Each exchange is turn-based.</p>
          </article>
        </div>
        <div>
          <article className="panel">
            <p className="panel-label">{isContinuing ? "Continue where you left off" : "Start fresh"}</p>
            <p className="context-summary">{isContinuing ? "Continuum will use your latest saved practice context when it is useful for your next answer. This is a resume point, not a full conversation history." : "Begin a new interview practice exchange with this scenario."}</p>
          </article>
          <article className="panel continue-card">
            <div>
              <p className="panel-label">Practice by voice</p>
              <p>When you are ready, speak your answer. Continuum will respond when your turn is complete.</p>
            </div>
            <div className="voice-actions">
              <button className="button button-primary" onClick={onContinue}>{isContinuing ? "Continue interview" : "Start speaking"} <span aria-hidden="true">→</span></button>
              {isContinuing && <button className="button button-secondary" onClick={onStartNew}>Start New Interview</button>}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
