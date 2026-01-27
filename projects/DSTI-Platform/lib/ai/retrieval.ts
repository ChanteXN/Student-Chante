import { prisma } from "@/lib/prisma";
import { generateEmbedding, cosineSimilarity } from "./embeddings";

export interface RetrievedChunk {
  content: string;
  documentTitle: string;
  documentType: string;
  similarity: number;
  metadata?: Record<string, any>;
  chunkIndex: number;
}

export interface RetrievalOptions {
  topK?: number; // Number of chunks to retrieve
  similarityThreshold?: number; // Minimum similarity score (0-1)
  documentTypes?: string[]; // Filter by document type
}

const DEFAULT_OPTIONS: Required<RetrievalOptions> = {
  topK: 5,
  similarityThreshold: 0.7,
  documentTypes: [],
};

/**
 * Retrieve relevant chunks from the knowledge base using semantic search
 */
export async function retrieveRelevantChunks(
  query: string,
  options: RetrievalOptions = {}
): Promise<RetrievedChunk[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Generate embedding for the query
    console.log("Generating query embedding...");
    const queryEmbedding = await generateEmbedding(query);

    // Retrieve all chunks with embeddings
    console.log("Fetching document chunks...");
    const chunks = await (prisma as any).documentChunk.findMany({
      where: {
        embedding: {
          not: null,
        },
        document: opts.documentTypes.length > 0
          ? {
              isActive: true,
              type: {
                in: opts.documentTypes as any[],
              },
            }
          : {
              isActive: true,
            },
      },
      include: {
        document: {
          select: {
            title: true,
            type: true,
          },
        },
      },
      orderBy: {
        chunkIndex: "asc",
      },
    });

    console.log(`Processing ${chunks.length} chunks...`);

    // Calculate similarity scores
    const chunksWithScores = chunks
      .map((chunk: any) => {
        if (!chunk.embedding) return null;

        try {
          const chunkEmbedding = JSON.parse(chunk.embedding) as number[];
          const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);

          return {
            content: chunk.content,
            documentTitle: chunk.document.title,
            documentType: chunk.document.type,
            similarity,
            metadata: chunk.metadata as Record<string, any> | undefined,
            chunkIndex: chunk.chunkIndex,
          };
        } catch (error) {
          console.error(
            `Error processing chunk ${chunk.id}:`,
            error
          );
          return null;
        }
      })
      .filter((chunk: any): chunk is RetrievedChunk => chunk !== null);

    // Filter by similarity threshold and sort
    const relevantChunks = chunksWithScores
      .filter((chunk: any) => chunk && chunk.similarity >= opts.similarityThreshold)
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, opts.topK) as RetrievedChunk[];

    console.log(
      `Found ${relevantChunks.length} relevant chunks (threshold: ${opts.similarityThreshold})`
    );

    return relevantChunks;
  } catch (error) {
    console.error("Error retrieving chunks:", error);
    throw new Error("Failed to retrieve relevant content");
  }
}

/**
 * Format retrieved chunks into context for LLM
 */
export function formatContextForLLM(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return "No relevant information found in the knowledge base.";
  }

  let context = "Relevant information from the R&D Tax Incentive Guidelines:\n\n";

  chunks.forEach((chunk, index) => {
    context += `[Source ${index + 1}: ${chunk.documentTitle}]\n`;
    context += `${chunk.content}\n\n`;
    context += `---\n\n`;
  });

  return context;
}

/**
 * Search for specific keywords in the knowledge base
 */
export async function keywordSearch(
  keywords: string[],
  limit: number = 10
): Promise<RetrievedChunk[]> {
  try {
    // Build search query
    const searchConditions = keywords.map((keyword) => ({
      content: {
        contains: keyword,
        mode: "insensitive" as const,
      },
    }));

    const chunks = await (prisma as any).documentChunk.findMany({
      where: {
        OR: searchConditions,
        document: {
          isActive: true,
        },
      },
      include: {
        document: {
          select: {
            title: true,
            type: true,
          },
        },
      },
      take: limit,
      orderBy: {
        chunkIndex: "asc",
      },
    });

    return chunks.map((chunk: any) => ({
      content: chunk.content,
      documentTitle: chunk.document.title,
      documentType: chunk.document.type,
      similarity: 1, // Exact match
      metadata: chunk.metadata as Record<string, any> | undefined,
      chunkIndex: chunk.chunkIndex,
    }));
  } catch (error) {
    console.error("Error performing keyword search:", error);
    throw new Error("Failed to perform keyword search");
  }
}

/**
 * Hybrid search: Combine semantic and keyword search
 */
export async function hybridSearch(
  query: string,
  options: RetrievalOptions = {}
): Promise<RetrievedChunk[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Perform both searches
  const [semanticResults, keywordResults] = await Promise.all([
    retrieveRelevantChunks(query, opts),
    keywordSearch(query.split(" ").filter((word) => word.length > 3), 5),
  ]);

  // Merge and deduplicate results
  const seen = new Set<string>();
  const merged: RetrievedChunk[] = [];

  // Add semantic results first (higher quality)
  for (const chunk of semanticResults) {
    const key = `${chunk.documentTitle}-${chunk.chunkIndex}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(chunk);
    }
  }

  // Add keyword results if not already included
  for (const chunk of keywordResults) {
    const key = `${chunk.documentTitle}-${chunk.chunkIndex}`;
    if (!seen.has(key) && merged.length < opts.topK) {
      seen.add(key);
      merged.push(chunk);
    }
  }

  return merged.slice(0, opts.topK);
}
