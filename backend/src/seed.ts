import { seedInterviewKnowledge } from "./interview-knowledge.js";

async function main(): Promise<void> {
  const result = await seedInterviewKnowledge();
  console.info(
    `Interview knowledge seeded: ${result.pointsUpserted} points (${result.collectionCreated ? "collection created" : "existing collection"}).`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed error";
  console.error(`Unable to seed interview knowledge: ${message}`);
  process.exitCode = 1;
});
