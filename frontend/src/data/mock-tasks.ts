import type { Task } from "@/types/task";

export const mockTasks: Task[] = [
  {
    id: "system-design",
    title: "System design preparation",
    description: "Shape a clear approach to a high-volume service scenario.",
    lastSession: "Last worked on yesterday afternoon",
    lastWorkedOn: "Storage-layer trade-offs",
    progress: 62,
    summary: "You mapped the main request flow and compared storage options. PostgreSQL was the preferred starting point, but the scaling approach still needed a decision.",
    completedSteps: [
      { id: "flow", label: "Outlined the service and request flow" },
      { id: "storage", label: "Compared primary storage options" },
      { id: "postgres", label: "Selected PostgreSQL as the starting point" },
    ],
    unresolvedSteps: [
      { id: "scale", label: "Decide the scaling strategy" },
      { id: "trade-offs", label: "Record the key trade-offs" },
    ],
    voiceResponse: "We were deciding how to handle the storage layer. You had already chosen PostgreSQL, but the scaling strategy was still unresolved. Do you want to continue from there?",
    correction: "Stop. I already decided on PostgreSQL.",
    correctedNextStep: "Document the scaling strategy and its trade-offs.",
  },
  {
    id: "vector-research",
    title: "Research: vector databases",
    description: "Compare retrieval approaches for a future product decision.",
    lastSession: "Last worked on two days ago",
    lastWorkedOn: "Evaluation criteria",
    progress: 45,
    summary: "You collected the core evaluation criteria and narrowed the field to two approaches. The remaining work is to test which retrieval behavior matters most for the intended workflow.",
    completedSteps: [
      { id: "criteria", label: "Listed evaluation criteria" },
      { id: "options", label: "Narrowed the options to two approaches" },
    ],
    unresolvedSteps: [
      { id: "test", label: "Choose the first retrieval scenario to test" },
      { id: "notes", label: "Capture the decision rationale" },
    ],
    voiceResponse: "You had narrowed the research to two retrieval approaches. The next open question was which real workflow should guide the first comparison. Would you like to pick that up?",
    correction: "Stop. The evaluation criteria are already settled.",
    correctedNextStep: "Choose the first retrieval scenario to test.",
  },
  {
    id: "project-plan",
    title: "Project planning",
    description: "Turn the next delivery milestone into a focused plan.",
    lastSession: "Last worked on Friday morning",
    lastWorkedOn: "Scope for the first milestone",
    progress: 38,
    summary: "You agreed on the outcome for the next milestone and identified the most important work streams. Dependencies between the first two work items are still unresolved.",
    completedSteps: [
      { id: "outcome", label: "Defined the next milestone outcome" },
      { id: "workstreams", label: "Identified the key work streams" },
    ],
    unresolvedSteps: [
      { id: "dependencies", label: "Clarify the first dependencies" },
      { id: "sequence", label: "Sequence the initial work" },
    ],
    voiceResponse: "The next milestone is defined and the key work streams are visible. You paused before clarifying the dependencies between the first items. Do you want to continue there?",
    correction: "Stop. The milestone outcome is already confirmed.",
    correctedNextStep: "Clarify the dependencies between the first work items.",
  },
];
