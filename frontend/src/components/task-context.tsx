import type { Task } from "@/types/task";

type TaskContextProps = {
  task: Task;
  onBack: () => void;
  onContinue: () => void;
};

export function TaskContext({ task, onBack, onContinue }: TaskContextProps) {
  return (
    <section className="context-view" aria-labelledby="task-title">
      <button className="back-button" onClick={onBack}>← All unfinished tasks</button>
      <div className="context-header">
        <div>
          <p className="eyebrow">Task context</p>
          <h1 id="task-title">{task.title}</h1>
          <p className="context-meta">{task.lastSession} · Last focus: {task.lastWorkedOn}</p>
        </div>
        <span className="status-badge active">Ready to resume</span>
      </div>
      <div className="context-layout">
        <div>
          <article className="panel">
            <p className="panel-label">What matters from last time</p>
            <p className="context-summary">{task.summary}</p>
          </article>
          <article className="panel">
            <p className="panel-label">Progress</p>
            <div className="progress-label"><span>{task.progress}% complete</span><span>{task.completedSteps.length} steps done</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${task.progress}%` }} /></div>
          </article>
          <article className="panel">
            <p className="panel-label">Completed</p>
            <ul className="steps">
              {task.completedSteps.map((step) => <li className="step complete" key={step.id}><span className="step-marker">✓</span><span>{step.label}</span></li>)}
            </ul>
          </article>
        </div>
        <div>
          <article className="panel">
            <p className="panel-label">Still unresolved</p>
            <ul className="steps">
              {task.unresolvedSteps.map((step) => <li className="step unresolved" key={step.id}><span className="step-marker">!</span><span>{step.label}</span></li>)}
            </ul>
          </article>
          <article className="panel continue-card">
            <div>
              <p className="panel-label">Continue by voice</p>
              <p>Start naturally. The prototype will surface the previous context before the next decision.</p>
            </div>
            <button className="button button-primary" onClick={onContinue}>Continue task <span aria-hidden="true">→</span></button>
          </article>
        </div>
      </div>
    </section>
  );
}
