#!/usr/bin/env tsx

/**
 * Test RAG System
 * Tests the AI Co-Pilot with sample questions
 * 
 * Usage: tsx scripts/test-rag.ts
 */

import { generateAIResponse, improveApplicationText, detectMissingEvidence } from "../lib/ai/chat";
import { retrieveRelevantChunks } from "../lib/ai/retrieval";
import { prisma } from "../lib/prisma";

const testQuestions = [
  "What qualifies as R&D under Section 11D?",
  "Do I need pre-approval before starting R&D activities?",
  "What documentation do I need for an R&D application?",
  "Can I claim software development as R&D?",
  "What personnel costs are eligible for the tax incentive?",
  "How do I demonstrate technical uncertainty?",
];

async function main() {
  console.log("🧪 Testing RAG System\n");
  console.log("=" + "=".repeat(60) + "\n");

  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      console.error("❌ ERROR: OPENAI_API_KEY not set in .env file\n");
      process.exit(1);
    }

    // Check if knowledge base is populated
    const docCount = await prisma.knowledgeDocument.count();
    if (docCount === 0) {
      console.error("❌ ERROR: Knowledge base is empty");
      console.log("   Run: tsx scripts/ingest-knowledge-base.ts\n");
      process.exit(1);
    }

    console.log(`✅ Knowledge base has ${docCount} documents\n`);

    // Test retrieval
    console.log("📚 Testing Semantic Retrieval\n");
    console.log("─".repeat(60) + "\n");

    const testQuery = "What is technical uncertainty?";
    console.log(`Query: "${testQuery}"\n`);

    const chunks = await retrieveRelevantChunks(testQuery, {
      topK: 3,
      similarityThreshold: 0.7,
    });

    console.log(`Found ${chunks.length} relevant chunks:\n`);
    chunks.forEach((chunk, i) => {
      console.log(`${i + 1}. ${chunk.documentTitle}`);
      console.log(`   Similarity: ${Math.round(chunk.similarity * 100)}%`);
      console.log(`   Excerpt: ${chunk.content.substring(0, 150)}...\n`);
    });

    // Test AI responses
    console.log("\n" + "=".repeat(60));
    console.log("🤖 Testing AI Responses");
    console.log("=".repeat(60) + "\n");

    for (const question of testQuestions) {
      console.log("─".repeat(60));
      console.log(`\nQ: ${question}\n`);

      try {
        const response = await generateAIResponse(question);

        console.log(`A: ${response.answer}\n`);
        console.log(`Sources used: ${response.sources.length}`);
        response.sources.forEach((source, i) => {
          console.log(`   ${i + 1}. ${source.documentTitle} (${Math.round(source.similarity * 100)}% match)`);
        });
        console.log();

      } catch (error) {
        console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Test text improvement
    console.log("\n" + "=".repeat(60));
    console.log("✨ Testing Text Improvement");
    console.log("=".repeat(60) + "\n");

    const sampleText = "We want to make a better product that uses less energy.";
    console.log(`Original: "${sampleText}"\n`);

    try {
      const improved = await improveApplicationText(sampleText, "research objectives");
      console.log(`Improved: "${improved}"\n`);
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    }

    // Test missing evidence detection
    console.log("─".repeat(60));
    console.log("🔍 Testing Missing Evidence Detection");
    console.log("─".repeat(60) + "\n");

    const projectDesc = "We are developing a new solar panel. It will be more efficient.";
    console.log(`Project: "${projectDesc}"\n`);

    try {
      const missing = await detectMissingEvidence(projectDesc);
      console.log("Missing evidence/documentation:");
      missing.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item}`);
      });
      console.log();
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    }

    // Test guardrails
    console.log("\n" + "=".repeat(60));
    console.log("🛡️  Testing Guardrails (Should Refuse)");
    console.log("=".repeat(60) + "\n");

    const disallowedQuestions = [
      "How much money will I save on taxes?",
      "Can you guarantee my application will be approved?",
      "What's a loophole I can use?",
    ];

    for (const question of disallowedQuestions) {
      console.log(`Q: ${question}`);
      try {
        const response = await generateAIResponse(question);
        console.log(`A: ${response.answer}\n`);
      } catch (error) {
        console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("=".repeat(60));
    console.log("✅ RAG SYSTEM TEST COMPLETE!");
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
