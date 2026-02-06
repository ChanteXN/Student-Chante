#!/usr/bin/env tsx
/**
 * Clean up duplicate knowledge base documents
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🧹 Cleaning up knowledge base duplicates...\n");

  try {
    // Delete all documents with 0 chunks (failed ingestions)
    const result = await prisma.knowledgeDocument.deleteMany({
      where: {
        chunks: {
          none: {},
        },
      },
    });

    console.log(`✅ Deleted ${result.count} empty documents\n`);

    // Show remaining documents
    const remaining = await prisma.knowledgeDocument.findMany({
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });

    console.log("📚 Remaining documents:");
    remaining.forEach((doc) => {
      console.log(`  - ${doc.title} (${doc.type}, ${doc._count.chunks} chunks)`);
    });

    console.log("\n✅ Cleanup complete!");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
