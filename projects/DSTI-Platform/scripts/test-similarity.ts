#!/usr/bin/env tsx
import "dotenv/config";
import { prisma } from "../lib/prisma";
import { generateEmbedding, cosineSimilarity } from "../lib/ai/embeddings";

async function testSimilarity() {
  console.log("🧪 Testing similarity calculation\n");

  const query = "What evidence do I need for my application?";
  
  console.log(`Query: "${query}"\n`);
  console.log("Generating query embedding...");
  const queryEmbedding = await generateEmbedding(query);
  console.log(`✅ Query embedding: ${queryEmbedding.length} dimensions\n`);

  const chunks = await prisma.documentChunk.findMany({
    take: 5,
    where: {
      embedding: { not: null }
    },
    include: { document: true },
  });

  console.log(`Testing against ${chunks.length} chunks:\n`);

  for (const chunk of chunks) {
    const chunkEmbedding = JSON.parse(chunk.embedding!);
    const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
    
    console.log(`Chunk: "${chunk.content.substring(0, 60)}..."`);
    console.log(`  Document: ${chunk.document.title}`);
    console.log(`  Similarity: ${(similarity * 100).toFixed(2)}%`);
    console.log(`  Passes 0.5 threshold: ${similarity >= 0.5 ? "YES ✅" : "NO ❌"}`);
    console.log("");
  }

  await prisma.$disconnect();
}

testSimilarity();
