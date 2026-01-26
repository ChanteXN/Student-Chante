import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 DATABASE CONTENTS:\n');

  const users = await prisma.user.findMany();
  console.log('👥 USERS:', users.length);
  users.forEach(u => console.log(`   - ${u.name} (${u.email}) - ${u.role}`));

  const orgs = await prisma.organisation.findMany();
  console.log('\n🏢 ORGANISATIONS:', orgs.length);
  orgs.forEach(o => console.log(`   - ${o.name} - ${o.sector}`));

  const projects = await prisma.project.findMany();
  console.log('\n📋 PROJECTS:', projects.length);
  projects.forEach(p => console.log(`   - ${p.title} - ${p.status}`));

  const evidenceFiles = await prisma.evidenceFile.findMany();
  console.log('\n📁 EVIDENCE FILES:', evidenceFiles.length);
  evidenceFiles.forEach(f => console.log(`   - ${f.fileName} - ${f.category}`));

  const sections = await prisma.projectSection.findMany();
  console.log('\n📝 PROJECT SECTIONS:', sections.length);
  sections.forEach(s => console.log(`   - ${s.sectionKey} (Complete: ${s.isComplete})`));

  console.log('\n✨ Day 2 Schema Working Perfectly!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
