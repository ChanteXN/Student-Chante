import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Defines enums locally until Prisma Client is generated
enum UserRole {
  APPLICANT = 'APPLICANT',
  CONSULTANT = 'CONSULTANT',
  REVIEWER = 'REVIEWER',
  ADMIN = 'ADMIN',
}

enum ProjectStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING_INFO = 'PENDING_INFO',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  WITHDRAWN = 'WITHDRAWN',
}

async function main() {
  console.log('🌱 Starting seed...');

  // Create Organisation
  console.log('Creating demo organisation...');
  const organisation = await prisma.organisation.upsert({
    where: { id: 'demo-org-1' },
    update: {},
    create: {
      id: 'demo-org-1',
      name: 'TechInnovate Solutions (Pty) Ltd',
      registrationNo: '2020/123456/07',
      sector: 'Software Development',
      address: '123 Innovation Drive, Sandton, Johannesburg, 2196',
    },
  });
  console.log(` Created organisation: ${organisation.name}`);

  // Creates Users
  console.log('Creating demo users...');
  
  const applicant = await prisma.user.upsert({
    where: { email: 'applicant@techinnovate.co.za' },
    update: {},
    create: {
      email: 'applicant@techinnovate.co.za',
      name: 'Sarah Applicant',
      role: UserRole.APPLICANT,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dsti.gov.za' },
    update: {},
    create: {
      email: 'admin@dsti.gov.za',
      name: 'John Admin',
      role: UserRole.ADMIN,
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@dsti.gov.za' },
    update: {},
    create: {
      email: 'reviewer@dsti.gov.za',
      name: 'Dr. Mary Reviewer',
      role: UserRole.REVIEWER,
    },
  });

  const consultant = await prisma.user.upsert({
    where: { email: 'consultant@techinnovate.co.za' },
    update: {},
    create: {
      email: 'consultant@techinnovate.co.za',
      name: 'Mike Consultant',
      role: UserRole.CONSULTANT,
    },
  });

  console.log(` Created 4 users`);

  // Create Memberships
  console.log('Creating memberships...');
  const membership1 = await prisma.membership.upsert({
    where: {
      userId_organisationId: {
        userId: applicant.id,
        organisationId: organisation.id,
      },
    },
    update: {},
    create: {
      userId: applicant.id,
      organisationId: organisation.id,
      role: 'admin',
      isActive: true,
    },
  });

  const membership2 = await prisma.membership.upsert({
    where: {
      userId_organisationId: {
        userId: consultant.id,
        organisationId: organisation.id,
      },
    },
    update: {},
    create: {
      userId: consultant.id,
      organisationId: organisation.id,
      role: 'member',
      isActive: true,
    },
  });

  console.log(` Created 2 memberships`);

  // Creates Sample Project
  console.log('Creating sample project...');
  const project = await prisma.project.create({
    data: {
      organisationId: organisation.id,
      title: 'AI-Powered Customer Service Platform',
      sector: 'Artificial Intelligence',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-03-31'),
      location: 'Johannesburg, Gauteng',
      status: ProjectStatus.DRAFT,
      readinessScore: 45,
      sections: {
        create: [
          {
            sectionKey: 'basics',
            sectionData: {
              title: 'AI-Powered Customer Service Platform',
              description: 'Developing an advanced AI chatbot with natural language understanding',
            },
            isComplete: true,
          },
          {
            sectionKey: 'uncertainty',
            sectionData: {
              uncertainty: 'How to achieve context-aware responses across multiple languages',
              objectives: ['Multilingual NLP', 'Context retention', 'Sentiment analysis'],
            },
            isComplete: false,
          },
        ],
      },
      statusHistory: {
        create: {
          status: ProjectStatus.DRAFT,
          notes: 'Project created',
        },
      },
    },
  });

  console.log(` Created project: ${project.title}`);

  // Create Audit Event
  await prisma.auditEvent.create({
    data: {
      userId: applicant.id,
      action: 'PROJECT_CREATED',
      entityType: 'project',
      entityId: project.id,
      metadata: {
        projectTitle: project.title,
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0',
    },
  });

  console.log(' Created audit event');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Organisation: ${organisation.name}`);
  console.log(`   - Applicant: ${applicant.email}`);
  console.log(`   - Admin: ${admin.email}`);
  console.log(`   - Reviewer: ${reviewer.email}`);
  console.log(`   - Consultant: ${consultant.email}`);
  console.log(`   - Project: ${project.title}`);
}

main()
  .catch((e) => {
    console.error(' Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
