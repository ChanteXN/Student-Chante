#!/usr/bin/env tsx

/**
 * Knowledge Base Ingestion Script
 * Run this script to populate the knowledge base with R&D Tax Incentive guidelines
 * 
 * Usage: tsx scripts/ingest-knowledge-base.ts
 */

import "dotenv/config";
import { ingestText, ingestPDF, listDocuments } from "../lib/ai/ingestion";
import { sampleKnowledgeBase } from "../lib/ai/knowledge-base-content";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🚀 Starting Knowledge Base Ingestion\n");
  console.log("=" + "=".repeat(60) + "\n");

  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      console.error("❌ ERROR: OPENAI_API_KEY not set in .env file");
      console.log("\nPlease add your OpenAI API key to the .env file:");
      console.log("OPENAI_API_KEY=your-actual-api-key\n");
      process.exit(1);
    }

    console.log("✅ OpenAI API key configured\n");

    // Check existing documents
    console.log("📚 Checking existing knowledge base...\n");
    const existingDocs = await listDocuments();

    if (existingDocs.length > 0) {
      console.log(`Found ${existingDocs.length} existing documents:\n`);
      existingDocs.forEach((doc: any) => {
        console.log(`  - ${doc.title} (${doc.type}, ${doc.chunkCount} chunks)`);
      });

      console.log("\n⚠️  Warning: Documents already exist in the knowledge base.");
      console.log("   To avoid duplicates, clear the existing documents first.\n");

      // Ask for confirmation
      console.log("   Run the following to clear existing documents:");
      console.log("   npx prisma studio -> Delete from knowledge_documents table\n");
    }

    // Ingest sample knowledge base content
    console.log("📥 Ingesting sample knowledge base content...\n");

    const results = [];

    for (const item of sampleKnowledgeBase) {
      console.log(`\n${"─".repeat(60)}`);
      console.log(`Processing: ${item.title}`);
      console.log("─".repeat(60) + "\n");

      const result = await ingestText(item.title, item.content, item.type);
      results.push(result);

      if (result.success) {
        console.log(`✅ Success! Created ${result.chunkCount} chunks\n`);
      } else {
        console.log(`❌ Failed: ${result.error}\n`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 INGESTION SUMMARY");
    console.log("=".repeat(60) + "\n");

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`📦 Total chunks: ${successful.reduce((sum, r) => sum + r.chunkCount, 0)}\n`);

    if (failed.length > 0) {
      console.log("Failed documents:");
      failed.forEach((r) => {
        console.log(`  - ${r.title}: ${r.error}`);
      });
      console.log();
    }

    // Next steps
    console.log("=".repeat(60));
    console.log("🎉 KNOWLEDGE BASE READY!");
    console.log("=".repeat(60) + "\n");
    console.log("Next steps:");
    console.log("1. Test the RAG system: npm run test:rag");
    console.log("2. Start the development server: npm run dev");
    console.log("3. Visit the AI Co-Pilot in the application\n");

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
