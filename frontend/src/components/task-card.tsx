import type { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
  onSelect: () => void;
};

export function TaskCard({ task, onSelect }: TaskCardProps) {
  return (
    <button className="task-card" onClick={onSelect} aria-label={`Open ${task.title}`}>
      <span className="task-card-top">
        <span className="task-card-icon" aria-hidden="true">✦</span>
        <span className="status-badge active">Scenario ready</span>
      </span>
      <span>
        <h3>{task.title}</h3>
        <span className="task-description">{task.description}</span>
      </span>
      <span className="task-card-footer task-card-action">Begin reflection scenario <span aria-hidden="true">→</span></span>
    </button>
  );
}

