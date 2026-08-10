export type InterviewKnowledgeDocument = {
  id: number;
  title: string;
  category: "software-engineering" | "behavioral" | "project-explanation" | "technical" | "star" | "weaknesses" | "follow-up";
  content: string;
};

export const interviewKnowledgeSeed: InterviewKnowledgeDocument[] = [
  {
    id: 1,
    title: "Explain a software project with a clear narrative",
    category: "project-explanation",
    content: "Explain a major software project in this order: the user or business problem, your specific role, the technical constraints, the key design decisions, the measurable outcome, and what you learned. Keep ownership precise by saying I for your work and we for team work. Prepare a two-minute version and a deeper version for follow-up questions.",
  },
  {
    id: 2,
    title: "Discuss architecture trade-offs",
    category: "software-engineering",
    content: "When explaining an architecture decision, state the alternatives you considered, the constraints that mattered, why the chosen option fit those constraints, and the downside you accepted. A strong answer includes reliability, latency, cost, maintainability, and delivery speed where relevant. Do not present a choice as universally correct.",
  },
  {
    id: 3,
    title: "Structure behavioral answers with STAR",
    category: "star",
    content: "Use STAR for behavioral questions: Situation gives only essential context, Task states your responsibility, Action explains the choices you personally made, and Result shows the outcome with a metric or concrete effect. Spend most of the answer on Action and Result. Finish with a lesson if the interviewer asks about growth.",
  },
  {
    id: 4,
    title: "Answer a conflict question",
    category: "behavioral",
    content: "For a disagreement with a teammate, describe the shared goal, how you listened to the opposing view, the evidence or experiment used to decide, and how you maintained the working relationship. Avoid blaming language. Show that you can disagree directly, make a decision, and commit after the decision is made.",
  },
  {
    id: 5,
    title: "Discuss a candidate weakness constructively",
    category: "weaknesses",
    content: "Choose a genuine but non-essential weakness that you are actively improving. Name the impact honestly, then explain the system you use to improve, such as design reviews, planning checkpoints, deliberate practice, or feedback loops. Do not disguise a strength as a weakness or claim the issue is already solved.",
  },
  {
    id: 6,
    title: "Approach a coding interview question",
    category: "technical",
    content: "In a coding interview, restate the problem, ask about inputs and constraints, propose a simple baseline, then improve it while explaining time and space complexity. Use a small example before coding. Narrate trade-offs and test edge cases such as empty input, duplicates, large input, and invalid assumptions.",
  },
  {
    id: 7,
    title: "Explain a production incident",
    category: "software-engineering",
    content: "When describing an incident, cover detection, immediate mitigation, root cause, the permanent fix, and the prevention mechanism. Be specific about your role and what changed afterward, such as observability, runbooks, tests, rollout controls, or ownership. Avoid claiming zero incidents; emphasize learning and safer systems.",
  },
  {
    id: 8,
    title: "Answer why this role",
    category: "behavioral",
    content: "Connect why this role to evidence from the company, the team problem, and your relevant strengths. Be concrete about the type of product, engineering challenge, or users you want to serve. Avoid generic statements about passion, culture, or learning that could apply to any company.",
  },
  {
    id: 9,
    title: "Describe a technical trade-off under pressure",
    category: "technical",
    content: "For a deadline trade-off, state the risk, what was intentionally reduced in scope, the guardrails that kept the release safe, and the follow-up plan. Good examples distinguish a reversible shortcut from debt that would damage users or reliability. Explain how you communicated the decision to stakeholders.",
  },
  {
    id: 10,
    title: "Useful questions to ask an interviewer",
    category: "follow-up",
    content: "Ask questions that reveal how the team works: What would success look like after six months? Which technical decision is most important this quarter? How are design reviews and ownership handled? What distinguishes engineers who grow quickly on this team? Adapt the question to details already discussed instead of asking questions answered on the company website.",
  },
  {
    id: 11,
    title: "Explain collaboration on a cross-functional project",
    category: "project-explanation",
    content: "For a cross-functional project, identify the stakeholders, their competing needs, how requirements were made concrete, and how decisions were documented. Highlight a moment when you clarified ambiguity or changed the plan based on feedback. End with the delivered impact, not only the implementation details.",
  },
  {
    id: 12,
    title: "Prepare follow-up detail for a project story",
    category: "follow-up",
    content: "After a project overview, expect follow-ups about scale, architecture, failure modes, testing, metrics, ownership, and what you would change. Prepare one concise example for each. If you do not know a detail, say what you would inspect or measure rather than inventing an answer.",
  },
];
