const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found in the database. Please sign up first.');
    return;
  }
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });
    console.log(`Upgraded user ${user.email} to ADMIN`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
