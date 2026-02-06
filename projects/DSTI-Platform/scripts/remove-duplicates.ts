#!/usr/bin/env tsx
import "dotenv/config";
import { prisma } from "../lib/prisma";

async function removeDuplicates() {
  console.log("🧹 Removing duplicate documents...\n");

  try {
    // Get all documents grouped by title and type
    const allDocs = await prisma.knowledgeDocument.findMany({
      include: {
        _count: {
          select: { chunks: true },
        },
      },
      orderBy: {
        createdAt: 'asc', // Keep oldest
      },
    });

    // Group by title + type
    const grouped = new Map<string, typeof allDocs>();
    
    for (const doc of allDocs) {
      const key = `${doc.title}|${doc.type}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(doc);
    }

    // Delete duplicates (keep first one)
    let deletedCount = 0;
    for (const [key, docs] of grouped) {
      if (docs.length > 1) {
        console.log(`Found ${docs.length} duplicates of: ${docs[0].title}`);
        // Delete all but the first one
        for (let i = 1; i < docs.length; i++) {
          await prisma.knowledgeDocument.delete({
            where: { id: docs[i].id },
          });
          deletedCount++;
          console.log(`  ✅ Deleted duplicate (${docs[i]._count.chunks} chunks)`);
        }
      }
    }

    console.log(`\n✅ Removed ${deletedCount} duplicate documents\n`);

    // Show final state
    const remaining = await prisma.knowledgeDocument.findMany({
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });

    console.log("📚 Final knowledge base:");
    remaining.forEach((doc) => {
      console.log(`  - ${doc.title} (${doc.type}, ${doc._count.chunks} chunks)`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicates();
