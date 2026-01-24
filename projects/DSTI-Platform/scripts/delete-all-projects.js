require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllProjects() {
  try {
    // Delete all project sections first (though cascade should handle this)
    const deletedSections = await prisma.projectSection.deleteMany({});
    console.log(`✅ Deleted ${deletedSections.count} project sections`);

    // Delete all projects
    const deletedProjects = await prisma.project.deleteMany({});
    console.log(`✅ Deleted ${deletedProjects.count} projects`);

    console.log('\n🎉 All projects and sections have been deleted!');
  } catch (error) {
    console.error('❌ Error deleting projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllProjects();
