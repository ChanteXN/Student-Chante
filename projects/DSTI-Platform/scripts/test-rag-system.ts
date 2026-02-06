#!/usr/bin/env tsx
import "dotenv/config";
import { retrieveRelevantChunks } from "../lib/ai/retrieval";
import { generateAIResponse } from "../lib/ai/chat";

async function testRAG() {
  console.log("🧪 Testing RAG System\n");

  const testQueries = [
    "What evidence do I need for my application?",
    "Does software development qualify as R&D?",
    "What is technological uncertainty?",
  ];

  for (const query of testQueries) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Query: ${query}`);
    console.log("=".repeat(60));

    try {
      // Test retrieval
      const chunks = await retrieveRelevantChunks(query, {
        topK: 3,
        similarityThreshold: 0.5,
      });

      console.log(`\n✅ Found ${chunks.length} relevant chunks:`);
      chunks.forEach((chunk, i) => {
        console.log(`\n${i + 1}. ${chunk.documentTitle} (similarity: ${(chunk.similarity * 100).toFixed(1)}%)`);
        console.log(`   ${chunk.content.substring(0, 150)}...`);
      });

      // Test AI response
      console.log("\n🤖 AI Response:");
      const response = await generateAIResponse(query);
      console.log(response.answer.substring(0, 300) + "...");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  }
}

testRAG();
