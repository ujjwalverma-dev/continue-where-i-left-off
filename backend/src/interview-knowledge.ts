import { interviewKnowledgeSeed } from "./data/interview-knowledge.js";
import { createProviderClients } from "./providers.js";
import type { InterviewSearchRequest, InterviewSearchResponse, RetrievedContext } from "../../shared/interview.js";

export const INTERVIEW_KNOWLEDGE_COLLECTION = "interview_knowledge";
export const INTERVIEW_KNOWLEDGE_VECTOR = "content";
export const INTERVIEW_EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const INTERVIEW_EMBEDDING_DIMENSIONS = 384;
const MAX_SEARCH_LIMIT = 10;

export class KnowledgeRetrievalError extends Error {
  public constructor(message: string, public readonly statusCode: number = 502) {
    super(message);
    this.name = "KnowledgeRetrievalError";
  }
}

function getQdrantClient() {
  const client = createProviderClients().qdrant;

  if (!client) {
    throw new KnowledgeRetrievalError("Qdrant is not configured. Set QDRANT_URL and QDRANT_API_KEY.", 503);
  }

  return client;
}

function readPayloadString(payload: unknown, key: string): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

export async function ensureInterviewKnowledgeCollection(): Promise<{ created: boolean }> {
  const client = getQdrantClient();
  const collection = await client.collectionExists(INTERVIEW_KNOWLEDGE_COLLECTION);

  if (collection.exists) {
    return { created: false };
  }

  await client.createCollection(INTERVIEW_KNOWLEDGE_COLLECTION, {
    vectors: {
      [INTERVIEW_KNOWLEDGE_VECTOR]: {
        size: INTERVIEW_EMBEDDING_DIMENSIONS,
        distance: "Cosine",
      },
    },
  });

  return { created: true };
}

export async function seedInterviewKnowledge(): Promise<{ collectionCreated: boolean; pointsUpserted: number }> {
  const { created: collectionCreated } = await ensureInterviewKnowledgeCollection();
  const client = getQdrantClient();

  await client.upsert(INTERVIEW_KNOWLEDGE_COLLECTION, {
    wait: true,
    points: interviewKnowledgeSeed.map((document) => ({
      id: document.id,
      vector: {
        [INTERVIEW_KNOWLEDGE_VECTOR]: {
          text: document.content,
          model: INTERVIEW_EMBEDDING_MODEL,
        },
      },
      payload: {
        title: document.title,
        category: document.category,
        content: document.content,
        source: "synthetic-interview-prep-v1",
      },
    })),
  });

  return { collectionCreated, pointsUpserted: interviewKnowledgeSeed.length };
}

export async function searchInterviewKnowledge(request: InterviewSearchRequest): Promise<InterviewSearchResponse> {
  const query = request.query.trim();

  if (!query) {
    throw new KnowledgeRetrievalError("query must not be empty.", 400);
  }

  const requestedLimit = request.limit ?? 5;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_SEARCH_LIMIT);
  const client = getQdrantClient();

  try {
    const response = await client.query(INTERVIEW_KNOWLEDGE_COLLECTION, {
      query: {
        text: query,
        model: INTERVIEW_EMBEDDING_MODEL,
      },
      using: INTERVIEW_KNOWLEDGE_VECTOR,
      with_payload: true,
      limit,
    });

    const results: RetrievedContext[] = response.points.flatMap((point) => {
      const content = readPayloadString(point.payload, "content");

      if (!content) {
        return [];
      }

      return [{
        id: String(point.id),
        content,
        score: point.score,
        source: readPayloadString(point.payload, "source"),
        metadata: {
          title: readPayloadString(point.payload, "title") ?? "Untitled interview knowledge",
          category: readPayloadString(point.payload, "category") ?? "uncategorized",
        },
      }];
    });

    return { results };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Qdrant error";
    throw new KnowledgeRetrievalError(`Interview knowledge search failed: ${message}`);
  }
}
