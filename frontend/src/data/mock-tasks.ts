import type { Task } from "@/types/task";

export const mockTasks: Task[] = [
  {
    id: "project-story",
    title: "Project story practice",
    role: "Software Engineering Intern",
    interviewType: "technical",
    description: "Explain a software project with ownership, trade-offs, and impact.",
    summary: "Use a project you know well and talk through the problem, your decisions, and the outcome in your own words.",
  },
  {
    id: "technical-reasoning",
    title: "Technical reasoning",
    role: "Software Engineering Intern",
    interviewType: "technical",
    description: "Practice explaining a coding or systems approach out loud.",
    summary: "Choose a technical problem and explain how you would reason through it, including the choices that matter to you.",
  },
  {
    id: "behavioral-story",
    title: "Behavioral story",
    role: "Software Engineering Intern",
    interviewType: "behavioral",
    description: "Practice discussing a real experience involving collaboration or growth.",
    summary: "Choose an experience that matters to you and speak naturally about what happened, what you did, and what you learned.",
  },
];
