import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'mhlongochante@gmail.com' },
      update: {
        role: 'ADMIN',
      },
      create: {
        email: 'mhlongochante@gmail.com',
        name: 'Chante Magagula',
        role: 'ADMIN',
      },
    });

    console.log('✅ User updated/created:', user);
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
