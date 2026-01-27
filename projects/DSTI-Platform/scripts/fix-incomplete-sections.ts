/**
 * Script to fix incomplete sections that have data
 * This updates all project sections where:
 * - isComplete = false
 * - sectionData has at least one non-empty value
 * 
 * Run with: npx tsx scripts/fix-incomplete-sections.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixIncompleteSections() {
  console.log("🔍 Finding sections with data but marked as incomplete...\n");

  try {
    // Get all sections that are marked incomplete
    const incompleteSections = await prisma.projectSection.findMany({
      where: {
        isComplete: false,
      },
    });

    console.log(`Found ${incompleteSections.length} incomplete sections\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const section of incompleteSections) {
      // Check if section has any non-empty data
      const sectionData = section.sectionData as Record<string, any>;
      const hasData = Object.values(sectionData).some(
        (value) => value && String(value).trim() !== ""
      );

      if (hasData) {
        // Update to mark as complete
        await prisma.projectSection.update({
          where: { id: section.id },
          data: { isComplete: true },
        });

        updatedCount++;
        console.log(
          `✅ Updated section: ${section.sectionKey} (Project: ${section.projectId})`
        );
      } else {
        skippedCount++;
        console.log(
          `⏭️  Skipped section: ${section.sectionKey} (No meaningful data)`
        );
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   Updated: ${updatedCount} sections`);
    console.log(`   Skipped: ${skippedCount} sections (truly empty)`);
    console.log(`   Total processed: ${incompleteSections.length}`);
    console.log("\n✅ Migration complete!");
  } catch (error) {
    console.error("\n❌ Error during migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
fixIncompleteSections()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
