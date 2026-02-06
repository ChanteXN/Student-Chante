#!/usr/bin/env tsx
import "dotenv/config";
import { prisma } from "../lib/prisma";

async function checkEmbeddings() {
  console.log("🔍 Checking embeddings in database...\n");

  const chunks = await prisma.documentChunk.findMany({
    take: 3,
    include: {
      document: true,
    },
  });

  console.log(`Found ${chunks.length} chunks\n`);

  for (const chunk of chunks) {
    console.log(`Chunk ${chunk.id}:`);
    console.log(`  Document: ${chunk.document.title}`);
    console.log(`  Content length: ${chunk.content.length} chars`);
    console.log(`  Has embedding: ${!!chunk.embedding}`);
    
    if (chunk.embedding) {
      try {
        const embedding = JSON.parse(chunk.embedding);
        console.log(`  Embedding length: ${embedding.length} dimensions`);
        console.log(`  First 5 values: [${embedding.slice(0, 5).join(", ")}]`);
        console.log(`  Is array of numbers: ${Array.isArray(embedding) && embedding.every((v: any) => typeof v === "number")}`);
      } catch (e) {
        console.log(`  ❌ Error parsing embedding:`, e);
      }
    }
    console.log("");
  }

  await prisma.$disconnect();
}

checkEmbeddings();
